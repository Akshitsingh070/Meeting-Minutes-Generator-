"""
Meetings Router — API endpoints for meeting minutes generation.
"""

from fastapi import APIRouter, Depends

from app.models.schemas import (
    GenerateRequest,
    GenerateResponse,
)
from app.services.llm import LLMService, get_llm_service

router = APIRouter(prefix="/api/meetings", tags=["meetings"])


@router.post(
    "/generate",
    response_model=GenerateResponse,
    summary="Generate structured meeting minutes",
    description="Accepts a meeting transcript and returns structured minutes "
    "with summary, decisions, action items, and participants.",
)
async def generate_minutes(
    request: GenerateRequest,
    llm_service: LLMService = Depends(get_llm_service),
):
    """
    Process a meeting transcript and return structured minutes using the configured LLM provider.
    """
    minutes = await llm_service.generate_meeting_minutes(request.transcript)
    return GenerateResponse(success=True, data=minutes)
