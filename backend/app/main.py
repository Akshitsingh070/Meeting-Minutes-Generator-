"""
Meeting Minutes Generator — FastAPI Application Entry Point

This is the main application file that:
1. Creates the FastAPI app instance
2. Configures CORS middleware
3. Registers API routers
4. Provides a health-check endpoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import meetings

settings = get_settings()

# ── Create the FastAPI application ──────────────────────────
app = FastAPI(
    title=settings.app_name,
    description="Convert meeting transcripts into structured meeting minutes "
    "with decisions, action items, and participants.",
    version="0.1.0",
)

# ── CORS Middleware ─────────────────────────────────────────
# In development, this allows the Vite dev server (port 5173)
# to make requests to FastAPI (port 8000).
# In production, you'd restrict this to your actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ───────────────────────────────────────
app.include_router(meetings.router)


# ── Health Check ────────────────────────────────────────────
@app.get("/api/health", tags=["system"])
async def health_check():
    """
    Simple health check endpoint.
    Useful for deployment platforms to verify the service is running.
    """
    return {"status": "healthy", "service": settings.app_name}
