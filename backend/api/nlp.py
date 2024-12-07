from fastapi import APIRouter, HTTPException, Body
from openai import OpenAI, APIError, APITimeoutError
from dotenv import load_dotenv
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
                    "feedback": [
                        <feedback 1>,
                        <feedback 2>,
                        <feedback 3>
                    ]
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


@router.post("/analyze")
def analyze_text(resume_text: str = Body(...), job_description: str = Body(...)):
    try:
        result = analyze_with_openai(resume_text, job_description)
        return result
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
    
# Sample test case:
# Input Data:
# {
#     "resume_text": "Experienced software engineer proficient in Python, AWS, and REST API development. Led multiple team projects to completion. Skilled in problem-solving and communication.",
#     "job_description": "Looking for a software engineer with expertise in Python, AWS, REST API development, and project leadership. Clear communication skills are a must."
# }
#