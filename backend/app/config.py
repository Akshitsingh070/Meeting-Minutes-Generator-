"""
Meeting Minutes Generator — Application Configuration

Uses pydantic-settings to load configuration from environment variables.
All secrets (API keys) come from .env file or system environment.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "Meeting Minutes Generator"
    debug: bool = False

    # CORS — allowed origins for the frontend
    cors_origins: list[str] = ["http://localhost:5173"]

    # AI / LLM Configuration
    llm_provider: str = "gemini"  # "gemini" | "mock" | "openai"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.5-flash"
    openai_api_key: str = ""
    request_timeout: int = 45  # seconds

    # Input constraints
    max_transcript_length: int = 50000  # characters
    min_transcript_length: int = 20  # characters

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings instance.
    lru_cache ensures we only read .env once, not on every request.
    """
    return Settings()
