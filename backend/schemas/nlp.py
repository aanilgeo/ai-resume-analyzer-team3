from pydantic import BaseModel, field_validator

class AIRequestSchema(BaseModel):
    resume_text: str
    job_description: str

    @field_validator("resume_text", "job_description")
    def validate_input_text(cls, input_text: str):
        # Checks for the field validations
        if not isinstance(input_text, str) or not input_text.strip():
            raise ValueError("The input text in the field must be non-empty and a string.")
        if len(input_text) > 10000:
            raise ValueError("The input text in the field must be less than or equal to 10,000 characters.")
        return input_text

class AIResponseSchema(BaseModel):
    #AI output structure
    fit_score: int
    skills: list[str]
    keywords: list[str]
    feedback: dict[str, list[str]]
    missing_keywords: list[str] = []  # Add missing_keywords as a field
    error: str | None = None