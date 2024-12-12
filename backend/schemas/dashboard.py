# Pydantic models for resume-related requests and responses.
from pydantic import BaseModel
from typing import Optional
from fastapi import File, Form

# Pydantic model for the response after successful resume upload
class ResumeUploadResponse(BaseModel):
    message: str
    resume_text: str
    status: str

# Pydantic model for the parsed resume content (placeholder for future parsing and analysis)
class ResumeContentResponse(BaseModel):
    text: str  # The extracted text from the resume
    skills: Optional[list[str]] = []  # List of identified skills
    experience: Optional[list[str]] = []  # List of experience sections in the resume
    education: Optional[list[str]] = []  # List of education sections in the resume
    
# Pydantic model for the job description input request
class JobDescriptionRequest(BaseModel):
    job_description: str = Form(...)  # Job description text

# Pydantic model for the response after analyzing the job description
class JobDescriptionAnalysisResponse(BaseModel):
    keywords: list[str]  # Extracted keywords from the job description
    required_skills: list[str]  # List of required skills from the job description

# Pydantic model for the fit score input request
class FitScoreRequest(BaseModel):
    resume_text: str # Resume text
    job_description: str # Job description text

# Pydantic model for the fit score input result
class Feedback(BaseModel):
    skills: list[str]
    experience: list[str]
    formatting: list[str]

class FitScoreModel(BaseModel):
    fit_score: int
    skills: list[str]
    keywords: list[str]
    feedback: Feedback

class FitScoreResponse(BaseModel):
    feedback: FitScoreModel
    status: str