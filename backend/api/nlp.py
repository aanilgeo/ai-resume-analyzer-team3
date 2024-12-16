from fastapi import APIRouter, HTTPException, Body
from openai import OpenAI, APIError, APITimeoutError
from dotenv import load_dotenv
from backend.schemas.nlp import AIRequestSchema, AIResponseSchema
import os
import json

# Setup
load_dotenv()
router = APIRouter()

# OpenAI setup
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY not found in environment variables")

client = OpenAI(api_key=api_key)

# Helper function to get base formatted response from OpenAI
def analyze_with_openai(resume_text: str, job_description: str) -> dict:
    if not resume_text or not job_description:
        raise ValueError("Both resume_text and job_description must be provided")
        
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": f"""Analyze this resume against this job description, and see how well it fits
                using a fit score between 0-100.

                Resume:
                {resume_text}

                Job Description:
                {job_description}

                Format your response (without ```json```) as:
                {{
                    "fit_score": <score>,
                    "skills": ["<skill1>", "<skill2>", "<skill3>"],
                    "keywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
                    "feedback": {{
                        "skills": ["<feedback1>", "<feedback2>"],
                        "experience": ["<feedback1>", "<feedback2>"],
                        "formatting": ["<feedback1>", "<feedback2>"]
                    }}
                }}
                """
            }]
        )
        return json.loads(response.choices[0].message.content)
        
        
    except APITimeoutError as error:
        raise RuntimeError(f"OpenAI API timeout: {error}")
    except APIError as error:
        raise RuntimeError(f"OpenAI API error: {error}")
    except json.JSONDecodeError as error:
        raise RuntimeError(f"Failed to parse OpenAI response as JSON: {error}")
    except Exception as error:
        raise RuntimeError(f"Unexpected error: {error}")

# Endpoint using helper function to get the response from OpenAI
@router.post("/analyze", response_model=AIResponseSchema)
def analyze_text(payload: AIRequestSchema):
    try:
        result = analyze_with_openai(payload.resume_text, payload.job_description)
        return result
    except ValueError as error:
        raise HTTPException(status_code=422, detail="Invalid input format or data.")
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


