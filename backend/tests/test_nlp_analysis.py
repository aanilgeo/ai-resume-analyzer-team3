'''Tasks 23 (Generating missing keywords and feedback)'''
import pytest
from backend.utils.nlp_analyzer import extract_missing_keywords, SKILL_CATEGORIES
from fastapi.testclient import TestClient
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

# Expected outputs
expected_keywords = ["aws", "project", "leadership"]
expected_suggestions = [
    "Include expertise with aws.",
    "Add examples of project to your experience section.",
    "Highlight your leadership abilities in relevant experiences."

]

# Unit test for extract_missing_keywords
def test_extract_missing_keywords():
    """Test the function that extracts missing keywords from the resume."""
    result = extract_missing_keywords(sample_job_description, sample_resume_text, SKILL_CATEGORIES)
    assert set(result["missing_keywords"]) == set(expected_keywords), "Missing keywords do not match expected values."
    assert "technical_skills" in result["categorized_feedback"], "Categorization of feedback is incorrect."
    assert "experience_keywords" in result["categorized_feedback"], "Experience keywords categorization is missing."

# Unit test for feedback suggestions
def test_feedback_suggestions():
    """Test that feedback suggestions are generated correctly."""
    result = extract_missing_keywords(sample_job_description, sample_resume_text, SKILL_CATEGORIES)
    suggestions = []
    for category, items in result["categorized_feedback"].items():
        if category == "technical_skills":
            for skill in items:
                suggestions.append(f"Include expertise with {skill}.")
        elif category == "soft_skills":
            for skill in items:
                suggestions.append(f"Highlight your {skill} abilities in relevant experiences.")
        elif category == "experience_keywords":
            for skill in items:
                suggestions.append(f"Add examples of {skill} to your experience section.")

    expected_suggestions = [
        "Include expertise with aws.",
        "Highlight your leadership abilities in relevant experiences.",
        "Add examples of project to your experience section."
    ]            
    assert set(suggestions) == set(expected_suggestions), "Feedback suggestions do not match expected values."

# Unit test for varying resume lengths
def test_varying_lengths():
    """Test the function with resumes of different lengths."""
    # Empty resume
    result_empty = extract_missing_keywords(sample_job_description, sample_empty_resume, SKILL_CATEGORIES)
    assert len(result_empty["missing_keywords"]) > 0, "Empty resume should have all keywords as missing."

    # Short resume
    result_short = extract_missing_keywords(sample_job_description, sample_short_resume, SKILL_CATEGORIES)
    assert "project" in result_short["missing_keywords"], "Short resume misses 'project'."
    assert "leadership" in result_short["missing_keywords"], "Short resume misses 'leadership'."

# API integration test
def test_api_integration():
    """Test the API integration for the /analyze endpoint."""
    payload = {
        "resume_text": sample_resume_text,
        "job_description": sample_job_description
    }
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200, f"API failed with status code {response.status_code}"
    response_data = response.json()
    print("API Response:", response_data) #debugging line
    
    assert "missing_keywords" in response_data, "API response does not contain 'missing_keywords'"
    assert set(response_data["missing_keywords"]) == set(expected_keywords), "API missing keywords do not match expected values."
    #assert set(response_data["suggestions"]) == set(expected_suggestions), "API suggestions do not match expected values."

# Main execution for pytest
def main():
    """Run all tests."""
    pytest.main()

if __name__ == "__main__":
    main()
