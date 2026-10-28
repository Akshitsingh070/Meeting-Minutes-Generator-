"""
Pydantic models (schemas) for the Meeting Minutes Generator.

These define the exact shape of API requests and responses.
Nullable fields are a DELIBERATE design choice: they represent
"not mentioned" rather than forcing the AI to guess.
"""

from pydantic import BaseModel, Field


# ─── Request Models ───────────────────────────────────────────

class GenerateRequest(BaseModel):
    """Request body for POST /api/meetings/generate"""
    transcript: str = Field(
        ...,
        min_length=20,
        max_length=50000,
        description="The meeting transcript or notes to process",
        examples=[
            "Rahul said the website should launch by November 15. "
            "Priya will handle the frontend. "
            "The team agreed to use AWS for hosting."
        ],
    )


# ─── Response Models ─────────────────────────────────────────

class ActionItem(BaseModel):
    """
    A single action item extracted from the meeting.

    `responsible` and `deadline` are nullable — if the transcript
    doesn't explicitly assign someone or mention a date, these
    MUST be null. Never infer or guess.
    """
    task: str = Field(..., description="Description of the task")
    responsible: str | None = Field(
        default=None,
        description="Person explicitly assigned. null if not mentioned.",
    )
    deadline: str | None = Field(
        default=None,
        description="Deadline explicitly stated. null if not mentioned.",
    )


class MeetingMinutes(BaseModel):
    """
    The structured output of processed meeting minutes.
    This is the response schema for the generate endpoint.
    """
    summary: str = Field(
        ...,
        description="Concise summary of what was discussed",
    )
    participants: list[str] = Field(
        default_factory=list,
        description="Names explicitly mentioned in the transcript",
    )
    decisions: list[str] = Field(
        default_factory=list,
        description="Only confirmed, agreed-upon decisions",
    )
    action_items: list[ActionItem] = Field(
        default_factory=list,
        description="Tasks with optional assignee and deadline",
    )


class GenerateResponse(BaseModel):
    """Wrapper for the API response"""
    success: bool = True
    data: MeetingMinutes


class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = False
    error: str
    detail: str | None = None
