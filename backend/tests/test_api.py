from fastapi.testclient import TestClient
from app.main import app
from app.config import Settings
from app.services.llm import get_llm_service, MockLLMService, GoogleGeminiService

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


def test_generate_endpoint_success():
    app.dependency_overrides[get_llm_service] = lambda: MockLLMService()
    transcript = (
        "Rahul and Priya discussed the sprint plan. "
        "The team agreed to release on Friday. "
        "Priya will test the build tomorrow."
    )
    res = client.post("/api/meetings/generate", json={"transcript": transcript})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "summary" in data["data"]
    assert "Priya" in data["data"]["participants"]
    assert len(data["data"]["decisions"]) > 0
    assert len(data["data"]["action_items"]) > 0


def test_generate_validation_too_short():
    res = client.post("/api/meetings/generate", json={"transcript": "Short"})
    assert res.status_code == 422


def test_generate_validation_too_long():
    res = client.post("/api/meetings/generate", json={"transcript": "A" * 50001})
    assert res.status_code == 422


def test_generate_missing_gemini_key_returns_500():
    # Override with a Gemini service that has no API key
    app.dependency_overrides[get_llm_service] = lambda: GoogleGeminiService(
        Settings(gemini_api_key="")
    )
    res = client.post(
        "/api/meetings/generate",
        json={"transcript": "A valid transcript with enough characters for testing."},
    )
    assert res.status_code == 500
    assert "Gemini API key is not configured" in res.json()["detail"]
    app.dependency_overrides.clear()

