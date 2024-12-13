from pydantic import BaseModel, field_validator

class AIRequestSchema(BaseModel):
    resume_text: str
    job_description: str

    @field_validator("resume_text", "job_description")
    def validate_input_text(cls, input_text: str):
        # Checks for the field validations
        if not isinstance(input_text, str) or not input_text.strip():
            raise ValueError("Invalid input format or data.")
        if len(input_text) > 10000:
            raise ValueError("Invalid input format or data.")
        return input_text
    
class AIResponseSchema(BaseModel):
    #AI output structure
    fit_score: int
    skills: list[str]
    keywords: list[str]
    feedback: dict[str, list[str]]
    error: str | None = None 
