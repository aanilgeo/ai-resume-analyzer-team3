# Pydantic models for job description-related requests.
from pydantic import BaseModel

# Pydantic model for the job description input request
class JobDescriptionRequest(BaseModel):
    job_description: str  # Job description text

# Pydantic model for the response after analyzing the job description
class JobDescriptionAnalysisResponse(BaseModel):
    keywords: list[str]  # Extracted keywords from the job description
    required_skills: list[str]  # List of required skills from the job description