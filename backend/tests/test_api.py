import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from backend.api.nlp import router

# Setup test client for FastAPI
client = TestClient(router)

# Mock inputs for testing
sample_job_description = (
    "Looking for a software engineer with expertise in Python, AWS, REST API development, and "
    "project leadership. Clear communication skills are a must."
)
sample_resume_text = (
    "Experienced software engineer proficient in Python, REST API development, and problem-solving. "
    "Led multiple team projects to completion. Skilled in communication."
)
sample_empty_resume = ""
sample_short_resume = "Python, AWS, REST APIs."

# Mocked algorithm results
mock_response_data = {
    "fit_score": 100,
    "skills": ["Python", "Java", "AWS", "REST APIs"],
    "keywords": ["software engineer", "experience", "working knowledge"],
    "feedback": {
        "skills": [
            "Great job listing all relevant skills.",
            "Consider adding more soft skills."
        ],
        "experience": [
            "Well done showcasing your experience.",
            "Consider adding specific examples or projects."
        ],
        "formatting": [
            "The formatting is well done.",
            "Try to use bullet points for skills and experience."
        ]
    },
    "missing_keywords": ["experience", "plus"],
    "error": None
}

# Unit test for valid payload
@patch("backend.api.nlp.analyze_with_openai", return_value=mock_response_data)
@patch("backend.api.nlp.calculate_fit_score", return_value=mock_response_data["fit_score"])
@patch("backend.api.nlp.generate_feedback", return_value={"missing_keywords": mock_response_data["missing_keywords"], "feedback": mock_response_data["feedback"]})
def test_fit_score_valid_payload(mock_generate_feedback, mock_calculate_fit_score, mock_analyze_with_openai):
    payload = {
        "resume_text": sample_resume_text,
        "job_description": sample_job_description
    }
    response = client.post("/fit-score", json=payload)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    response_data = response.json()
    assert "fit_score" in response_data, "Response missing 'fit_score'"
    assert response_data["fit_score"] == mock_response_data["fit_score"], "Fit score does not match"
    assert "skills" in response_data, "Response missing 'skills'"
    assert response_data["skills"] == mock_response_data["skills"], "Skills do not match"
    assert "feedback" in response_data, "Response missing 'feedback'"
    assert response_data["feedback"] == mock_response_data["feedback"], "Feedback does not match"

# Unit test for invalid payload (missing keys)
# Test for empty job description field validation
# Unit test for invalid payload (empty job description field)
# Test for empty job description field validation
@patch("backend.api.nlp.analyze_with_openai", return_value=mock_response_data)
@patch("backend.api.nlp.calculate_fit_score", return_value=mock_response_data["fit_score"])
@patch("backend.api.nlp.generate_feedback", return_value={"missing_keywords": mock_response_data["missing_keywords"], "feedback": mock_response_data["feedback"]})
def test_empty_job_description_field(mock_generate_feedback, mock_calculate_fit_score, mock_analyze_with_openai):
    payload = {"resume_text": "test", "job_description": ""}
    response = client.post("/api/fit-score", json=payload)
    
    # Expect a 422 validation error for an empty job_description
    assert response.status_code == 422, f"Expected 422, got {response.status_code}"
    
    # Check if the validation error details contain the correct field and message
    error_details = response.json()
    assert "detail" in error_details, "Validation error details missing"
    
    # Check if 'job_description' field has the validation error for being empty
    assert any(
        err["loc"] == ["body", "job_description"] and err["msg"] == "ensure this value has at least 1 character"
        for err in error_details["detail"]
    ), "Validation error does not include correct message for empty 'job_description'"

# Unit test for empty resume text
def test_fit_score_empty_resume():
    payload = {
        "resume_text": sample_empty_resume,
        "job_description": sample_job_description
    }
    response = client.post("/fit-score", json=payload)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    response_data = response.json()
    assert len(response_data["missing_keywords"]) > 0, "Empty resume should have all keywords missing"

# Unit test for oversized inputs
# def test_fit_score_oversized_inputs():
#     oversized_resume = "Python, AWS, REST APIs. " * 10000  # Exceeds typical size limits
#     payload = {
#         "resume_text": oversized_resume,
#         "job_description": sample_job_description
#     }
#     response = client.post("/fit-score", json=payload)

#     assert response.status_code == 400, f"Expected 400 Payload Too Large, got {response.status_code}"
#     assert "Each input field must not exceed" in response.json()["detail"], "Error message mismatch"

# Run all tests
if __name__ == "__main__":
    pytest.main()
