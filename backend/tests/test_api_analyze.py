import pytest
from fastapi.testclient import TestClient
from backend.api.nlp import analyze_with_openai
from backend.main import app  
client = TestClient(app)

# Test case for a successful /api/analyze request
def test_api_analyze_success(mocker):
    # Mock OpenAI response
    mock_response = {
        "fit_score": 85,
        "feedback": ["Add skills related to project management."]
    }
    mocker.patch("backend.api.nlp.client.chat.completions.create", return_value=mock_response)

    payload = {
        "resume_text": "Sample resume content...",
        "job_description": "Sample job description content..."
    }
    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 200
    assert response.json() == mock_response

# Test case for missing fields in the request payload
def test_api_analyze_missing_fields():
    payload = {"resume_text": "Sample resume content..."}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422 #changed from 400 to 422
    assert response.json()["detail"] == [
        {"loc": ["body", "job_description"], "msg": "field required", "type": "value_error.missing"}
    ]

# Test case for exceeding character limits
def test_api_analyze_exceeds_character_limit():
    payload = {
        "resume_text": "a" * 10001,
        "job_description": "b" * 10001
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    assert response.json()["detail"] == [
        {"loc": ["body", "resume_text"], "msg": "ensure this value has at most 10000 characters", "type": "value_error.any_str.max_length"},
        {"loc": ["body", "job_description"], "msg": "ensure this value has at most 10000 characters", "type": "value_error.any_str.max_length"}
    ]

# Test case for handling external API errors
def test_api_analyze_api_failure():
    payload = {
        "resume_text": "Sample resume content...",
        "job_description": "Sample job description content..."
    }
    # Here, you might want to simulate or ensure the external API failure by disabling the network or using an invalid API key
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 500
    assert response.json()["detail"] == "Unable to process the request. Please try again later."
