from fastapi import APIRouter, HTTPException
from openai import OpenAI, APIError, APITimeoutError, RateLimitError
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

def analyze_with_openai(resume_text: str, job_description: str) -> dict:
    """Helper function to get formatted response from OpenAI"""
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

        try:
            result = json.loads(response.choices[0].message.content)
            
            # Validate required fields
            required_fields = ["fit_score", "skills", "keywords", "feedback"]
            if not all(field in result for field in required_fields):
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response structure: missing required fields"
                )

            # Validate feedback structure
            if not isinstance(result["feedback"], dict) or not all(
                key in result["feedback"] for key in ["skills", "experience", "formatting"]
            ):
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response structure: incorrect feedback format"
                )

            return result

        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="Failed to parse API response as JSON"
            )

    except APITimeoutError as e:
        raise HTTPException(status_code=500, detail=f"Request timed out: {str(e)}")
    except RateLimitError as e:
        raise HTTPException(status_code=500, detail=f"Rate limit exceeded: {str(e)}")
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"API error occurred: {str(e)}")
    except ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.post("/analyze", response_model=AIResponseSchema)
async def analyze_text(payload: AIRequestSchema):
    """Endpoint to analyze resume text against job description"""
    try:
        if not payload.resume_text or not payload.job_description:
            raise HTTPException(
                status_code=422,
                detail="Both resume text and job description are required"
            )

        result = analyze_with_openai(payload.resume_text, payload.job_description)
        return result

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))