"""
LLM Service Layer — Provider Abstraction and Implementation.

Supports:
- Swappable provider abstraction (LLMService base class)
- GoogleGeminiService (using official google-genai SDK with JSON schema enforcement)
- MockLLMService (for deterministic testing and local development)
"""

import json
import logging
import re
from abc import ABC, abstractmethod
from fastapi import Depends, HTTPException

from app.config import Settings, get_settings
from app.models.schemas import ActionItem, MeetingMinutes
from app.services.prompts import SYSTEM_INSTRUCTION, format_transcript_prompt

logger = logging.getLogger(__name__)


def clean_json_response(text: str) -> str:
    """Strip markdown code fence blocks if returned by the model."""
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()


class LLMService(ABC):
    """Abstract Base Class for LLM providers."""

    @abstractmethod
    async def generate_meeting_minutes(self, transcript: str) -> MeetingMinutes:
        """Process a meeting transcript and return structured minutes."""
        pass


class GoogleGeminiService(LLMService):
    """Google Gemini implementation using official google-genai SDK."""

    def __init__(self, settings: Settings | None = None):
        self.settings = settings or get_settings()
        self.api_key = self.settings.gemini_api_key
        self.model_name = self.settings.gemini_model or "gemini-3.5-flash"
        self._client = None

    def _get_client(self):
        if self._client is None:
            if not self.api_key or not self.api_key.strip():
                raise HTTPException(
                    status_code=500,
                    detail="Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env",
                )
            import google.genai as genai
            self._client = genai.Client(api_key=self.api_key.strip())
        return self._client

    async def generate_meeting_minutes(self, transcript: str) -> MeetingMinutes:
        client = self._get_client()
        from google.genai import errors, types

        prompt = format_transcript_prompt(transcript)
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=MeetingMinutes,
            temperature=0.1,
        )

        last_error = None
        # Allow 1 retry if the model returns invalid JSON
        for attempt in range(2):
            try:
                response = await client.aio.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=config,
                )

                if not response.text:
                    raise ValueError("Empty response received from Gemini.")

                cleaned_json = clean_json_response(response.text)
                return MeetingMinutes.model_validate_json(cleaned_json)

            except errors.APIError as e:
                logger.error(f"Gemini API error (attempt {attempt + 1}): {e}")
                if e.code == 429:
                    raise HTTPException(
                        status_code=429,
                        detail="AI service rate limit exceeded. Please wait a moment before trying again.",
                    )
                if e.code in (503, 502, 504):
                    raise HTTPException(
                        status_code=503,
                        detail="AI service is temporarily unavailable. Please try again shortly.",
                    )
                raise HTTPException(
                    status_code=500,
                    detail=f"AI service error: {e.message or str(e)}",
                )
            except HTTPException:
                raise
            except Exception as e:
                logger.warning(f"Error parsing Gemini response (attempt {attempt + 1}): {e}")
                last_error = e

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate structured minutes: {str(last_error)}",
        )


class MockLLMService(LLMService):
    """
    Mock implementation for testing and development without consuming API credits.
    Uses pattern matching and heuristics to simulate realistic extraction.
    """

    async def generate_meeting_minutes(self, transcript: str) -> MeetingMinutes:
        lower_text = transcript.lower()

        # Heuristic participant extraction
        known_names = ["Rahul", "Priya", "Aman", "Alex", "Jordan", "Sarah", "David", "John", "Emma"]
        participants = [name for name in known_names if name.lower() in lower_text]

        # Segment by lines or sentences
        segments = [s.strip() for s in re.split(r"[\n\.]+", transcript) if s.strip()]

        # Heuristic decisions
        decisions = []
        for segment in segments:
            if any(k in segment.lower() for k in ["agreed", "decided", "approved", "decision:"]):
                cleaned = segment.lstrip("-*•123456789. ")
                if cleaned and cleaned not in decisions:
                    decisions.append(cleaned)

        if not decisions and "hosting" in lower_text:
            decisions.append("The team agreed to proceed with the proposed infrastructure.")

        # Heuristic action items
        action_items = []
        for segment in segments:
            if any(k in segment.lower() for k in ["will handle", "will lead", "will configure", "will deliver", "task:", "action:"]):
                responsible = None
                for p in participants:
                    if p.lower() in segment.lower():
                        responsible = p
                        break
                deadline = None
                for d in ["friday", "monday", "november 15", "tomorrow", "next week", "eod"]:
                    if d in segment.lower():
                        deadline = d.capitalize()
                        break
                action_items.append(
                    ActionItem(
                        task=segment.lstrip("-*•123456789. "),
                        responsible=responsible,
                        deadline=deadline,
                    )
                )

        if not action_items and participants:
            action_items.append(
                ActionItem(
                    task="Review and finalize meeting action items",
                    responsible=participants[0],
                    deadline=None,
                )
            )

        summary = (
            f"The meeting covered discussions among "
            f"{', '.join(participants) if participants else 'participants'}. "
            f"Key items were identified regarding project execution."
        )

        return MeetingMinutes(
            summary=summary,
            participants=participants,
            decisions=decisions,
            action_items=action_items,
        )


def get_llm_service(settings: Settings = Depends(get_settings)) -> LLMService:
    """Factory to retrieve the configured LLM service provider."""
    provider = (settings.llm_provider or "gemini").lower().strip()

    if provider == "gemini":
        return GoogleGeminiService(settings)
    elif provider == "mock":
        return MockLLMService()
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")
