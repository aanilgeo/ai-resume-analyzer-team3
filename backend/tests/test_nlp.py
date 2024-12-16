import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

#Added RequestValidationError in main.py to align with behavior of our API
# Test for resume text character limit > 10000
def test_resume_text_character_limit():
    payload = {"resume_text": "r" * 10001, "job_description": "test"}
    # Post request using Test Client from Fast API
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    assert response.json() == {"error": "Invalid input format or data."}

# Test for job description character limit > 10000
def test_job_descrip_character_limit():
    payload = {"resume_text": "test", "job_description": "r" * 10001}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    assert response.json() == {"error": "Invalid input format or data."}

# Test for validating request and defined structure
def test_validate_input():
    payload = {"resume_text": "Experienced software engineer with Python and Java skills.", 
               "job_description": "Looking for a software engineer with experience in Python, AWS, and REST APIs."}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    assert "fit_score" in response.json()
    assert "skills" in response.json()
    assert "keywords" in response.json()
    assert "feedback" in response.json()

# Test for empty resume field validation
def test_empty_resume_text_field():
    payload = {"resume_text": "", "job_description": "test"}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    assert response.json() == {"error": "Invalid input format or data."}
    
# Test for empty job description field validation
def test_empty_job_description_field():
    payload = {"resume_text": "test", "job_description": ""}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    assert response.json() == {"error": "Invalid input format or data."}
    
# Test for both fields empty validation 
def test_empty_fields():
    payload = {"resume_text": "", "job_description": ""}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    assert response.json() == {"error": "Invalid input format or data."}

# Test for int type in resume text field
def test_invalid_resume_text_data_type():
    payload = {"resume_text": 1, "job_description": "test"}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    assert response.json() == {"error": "Invalid input format or data."}

# Test for int type in job description field
def test_invalid_job_descrip_data_type():
    payload = {"resume_text": "test", "job_description": 1}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    assert response.json() == {"error": "Invalid input format or data."}

# Test for list type in resume text field and dict in job description field
def test_invalid_field_data_type():
    payload = {"resume_text": ["test"], "job_description": {"test": "dict"}}
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422
    assert response.json() == {"error": "Invalid input format or data."}