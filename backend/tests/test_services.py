import asyncio
import json
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from google.genai import errors

from app.config import Settings
from app.models.schemas import MeetingMinutes
from app.services.llm import GoogleGeminiService, MockLLMService, clean_json_response


def test_clean_json_response():
    raw_markdown = "```json\n{\"summary\": \"Test\"}\n```"
    assert clean_json_response(raw_markdown) == '{"summary": "Test"}'


def test_mock_llm_service():
    service = MockLLMService()
    sample = (
        "Rahul and Priya discussed deployment. "
        "The team agreed to deploy to AWS. "
        "Priya will configure the database by Friday."
    )
    res = asyncio.run(service.generate_meeting_minutes(sample))
    assert "Rahul" in res.participants
    assert "Priya" in res.participants
    assert len(res.decisions) > 0
    assert len(res.action_items) > 0
    assert res.action_items[0].responsible == "Priya"


def test_gemini_service_success():
    settings = Settings(gemini_api_key="test_key")
    service = GoogleGeminiService(settings)

    mock_client = MagicMock()
    service._client = mock_client

    sample_json = {
        "summary": "Team alignment on the Q4 roadmap.",
        "participants": ["Alice", "Bob"],
        "decisions": ["Approved launch on Dec 1"],
        "action_items": [
            {
                "task": "Finalize test coverage",
                "responsible": "Bob",
                "deadline": "Nov 15",
            }
        ],
    }

    mock_resp = MagicMock()
    mock_resp.text = json.dumps(sample_json)
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_resp)

    res = asyncio.run(
        service.generate_meeting_minutes("Alice and Bob discussed Q4 roadmap.")
    )
    assert res.summary == "Team alignment on the Q4 roadmap."
    assert res.participants == ["Alice", "Bob"]
    assert res.action_items[0].responsible == "Bob"
    assert res.action_items[0].deadline == "Nov 15"


def test_gemini_service_retry_on_malformed_json():
    settings = Settings(gemini_api_key="test_key")
    service = GoogleGeminiService(settings)

    mock_client = MagicMock()
    service._client = mock_client

    sample_json = {
        "summary": "Retried successfully.",
        "participants": [],
        "decisions": [],
        "action_items": [],
    }

    mock_bad = MagicMock()
    mock_bad.text = "invalid json response"

    mock_good = MagicMock()
    mock_good.text = json.dumps(sample_json)

    mock_client.aio.models.generate_content = AsyncMock(
        side_effect=[mock_bad, mock_good]
    )

    res = asyncio.run(service.generate_meeting_minutes("Meeting transcript notes."))
    assert res.summary == "Retried successfully."


def test_gemini_service_rate_limit_error():
    settings = Settings(gemini_api_key="test_key")
    service = GoogleGeminiService(settings)

    mock_client = MagicMock()
    service._client = mock_client
    mock_client.aio.models.generate_content = AsyncMock(
        side_effect=errors.APIError(429, "Rate limit reached")
    )

    try:
        asyncio.run(service.generate_meeting_minutes("Meeting notes."))
        assert False, "Should have raised HTTPException"
    except HTTPException as exc:
        assert exc.status_code == 429


def test_gemini_service_unavailable_error():
    settings = Settings(gemini_api_key="test_key")
    service = GoogleGeminiService(settings)

    mock_client = MagicMock()
    service._client = mock_client
    mock_client.aio.models.generate_content = AsyncMock(
        side_effect=errors.APIError(503, "Service unavailable")
    )

    try:
        asyncio.run(service.generate_meeting_minutes("Meeting notes."))
        assert False, "Should have raised HTTPException"
    except HTTPException as exc:
        assert exc.status_code == 503

