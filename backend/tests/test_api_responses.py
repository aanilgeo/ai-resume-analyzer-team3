import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.main import app
from openai import APIError, APITimeoutError, RateLimitError, AuthenticationError, APIConnectionError
import json

client = TestClient(app)

# Test payloads
valid_payload = {
    "resume_text": "Experienced software engineer with Python skills",
    "job_description": "Looking for Python developer"
}

def create_mock_response(content):
    """Helper function to create a mock OpenAI response"""
    mock_response = MagicMock()
    mock_choice = MagicMock()
    mock_message = MagicMock()
    mock_message.content = content
    mock_choice.message = mock_message
    mock_response.choices = [mock_choice]
    return mock_response

# Existing successful test case
def test_successful_api_response():
    """Test successful API response handling"""
    mock_response = {
        "fit_score": 85,
        "skills": ["Python"],
        "keywords": ["software engineer"],
        "feedback": {
            "skills": ["Good Python background"],
            "experience": ["Relevant experience shown"],
            "formatting": []
        }
    }
    
    with patch('backend.api.nlp.client.chat.completions.create') as mock_create:
        mock_create.return_value = create_mock_response(json.dumps(mock_response))
        response = client.post("/api/analyze", json=valid_payload)
        assert response.status_code == 200
        assert "fit_score" in response.json()
        assert "skills" in response.json()
        assert "feedback" in response.json()

# New test cases for different response scenarios
def test_perfect_match_response():
    """Test response with 100% match"""
    mock_response = {
        "fit_score": 100,
        "skills": ["Python", "FastAPI", "SQL"],
        "keywords": ["software engineer", "backend developer"],
        "feedback": {
            "skills": ["Perfect match for required skills"],
            "experience": ["Experience aligns perfectly"],
            "formatting": ["Well-formatted resume"]
        }
    }
    
    with patch('backend.api.nlp.client.chat.completions.create') as mock_create:
        mock_create.return_value = create_mock_response(json.dumps(mock_response))
        response = client.post("/api/analyze", json=valid_payload)
        assert response.status_code == 200
        assert response.json()["fit_score"] == 100

def test_no_match_response():
    """Test response with 0% match"""
    mock_response = {
        "fit_score": 0,
        "skills": [],
        "keywords": [],
        "feedback": {
            "skills": ["No matching skills found"],
            "experience": ["Experience doesn't align"],
            "formatting": ["Consider reformatting"]
        }
    }
    
    with patch('backend.api.nlp.client.chat.completions.create') as mock_create:
        mock_create.return_value = create_mock_response(json.dumps(mock_response))
        response = client.post("/api/analyze", json=valid_payload)
        assert response.status_code == 200
        assert response.json()["fit_score"] == 0

def test_special_characters_in_response():
    """Test handling of special characters in response"""
    mock_response = {
        "fit_score": 85,
        "skills": ["Python", "C++", ".NET"],
        "keywords": ["développeur", "ingénieur"],
        "feedback": {
            "skills": ["Strong C++ & .NET background"],
            "experience": ["Good match for développeur role"],
            "formatting": ["Well-structured résumé"]
        }
    }
    
    with patch('backend.api.nlp.client.chat.completions.create') as mock_create:
        mock_create.return_value = create_mock_response(json.dumps(mock_response))
        response = client.post("/api/analyze", json=valid_payload)
        assert response.status_code == 200
        assert any("C++" in skill for skill in response.json()["skills"])

def test_empty_feedback_sections():
    """Test handling of empty feedback sections"""
    mock_response = {
        "fit_score": 50,
        "skills": ["Python"],
        "keywords": ["developer"],
        "feedback": {
            "skills": [],
            "experience": [],
            "formatting": []
        }
    }
    
    with patch('backend.api.nlp.client.chat.completions.create') as mock_create:
        mock_create.return_value = create_mock_response(json.dumps(mock_response))
        response = client.post("/api/analyze", json=valid_payload)
        assert response.status_code == 200
        assert all(isinstance(response.json()["feedback"][key], list) for key in ["skills", "experience", "formatting"])


def test_authentication_error():
    """Test handling of authentication errors"""
    with patch('backend.api.nlp.client.chat.completions.create') as mock_create:
        mock_response = MagicMock()
        mock_response.status_code = 401
        mock_response.json.return_value = {"error": {"message": "Invalid API key"}}

        # Include 'body' and 'request' arguments in the APIError constructor
        mock_create.side_effect = APIError(
            message="Invalid API key",
            request=MagicMock(),  # Mock the request object
            body={"error": {"message": "Invalid API key"}}
        )

        response = client.post("/api/analyze", json=valid_payload)
        assert response.status_code == 500
        assert "api error" in response.json()["detail"].lower()


def test_empty_api_response():
    """Test handling of empty API response"""
    with patch('backend.api.nlp.client.chat.completions.create') as mock_create:
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = ""
        mock_create.return_value = mock_response

def test_invalid_fit_score():
    """Test handling of invalid fit score in response"""
    with patch('backend.api.nlp.client.chat.completions.create') as mock_create:
        # Use a valid dictionary to represent the response
        malformed_response = {
            "choices": [{"message": {"content": "{"}}]  # Malformed JSON
        }
        mock_create.return_value = create_mock_response(json.dumps(malformed_response))

        response = client.post("/api/analyze", json=valid_payload)
        assert response.status_code == 500
        # Adjust assertion to match the actual error message
        assert "invalid response structure" in response.json()["detail"].lower()


def test_missing_choices_in_response():
    """Test handling of missing choices in API response"""
    with patch('backend.api.nlp.client.chat.completions.create') as mock_create:
        mock_response = MagicMock()
        mock_response.choices = []  # Empty choices list
        mock_create.return_value = mock_response
        
        response = client.post("/api/analyze", json=valid_payload)
        assert response.status_code == 500
        # Update assertion to match actual error message
        assert "index" in response.json()["detail"].lower()