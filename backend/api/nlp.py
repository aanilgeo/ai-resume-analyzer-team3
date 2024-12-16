from fastapi import APIRouter, HTTPException, Body
from openai import OpenAI, APIError, APITimeoutError
from dotenv import load_dotenv
from backend.schemas.nlp import AIRequestSchema, AIResponseSchema
from backend.utils.nlp_analyzer import extract_missing_keywords, generate_feedback, SKILL_CATEGORIES, calculate_fit_score


import os
import json
import re

# Setup
load_dotenv()
router = APIRouter()

# OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY not found in environment variables")

client = OpenAI(api_key=api_key)

# Utility function to validate OpenAI key (optional, but useful for debugging)
def validate_openai_key():
    try:
        client.models.list()
    except Exception as e:
        raise RuntimeError(f"Failed to validate OpenAI API key: {str(e)}")

# Validate the API key on startup
validate_openai_key()

def analyze_with_openai(resume_text: str, job_description: str) -> dict:
    if not resume_text or not job_description:
        raise ValueError("Both resume_text and job_description must be provided") #changed this latest

    # Extract feedback locally for additional context
    local_feedback = extract_missing_keywords(job_description, resume_text, SKILL_CATEGORIES)

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": f"""Analyze this resume against this job description and provide a JSON response.
                
                Resume:
                {resume_text}

                Job Description:
                {job_description}

                Format your response as:
                {{
                    "fit_score": <score>,
                    "skills": ["<skill1>", "<skill2>", "<skill3>"],
                    "keywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
                    "feedback": {{
                        "skills": ["<feedback1>", "<feedback2>"],
                        "experience": ["<feedback1>", "<feedback2>"],
                        "formatting": ["<feedback1>", "<feedback2>"]
                    }},
                }}
                """
            }]
        )

        # Handle empty or malformed responses
        if not response.choices or not response.choices[0].message.content.strip():
            raise RuntimeError("OpenAI API returned an empty response.")

        # Extract and clean the API response
        raw_content = response.choices[0].message.content
        print(f"Raw OPENAI response: {raw_content}")

        # Replace single quotes with double quotes to make it valid JSON
        valid_json_content = re.sub(r"\'(.*?)\'", r'"\1"', raw_content)
        parsed_content = json.loads(valid_json_content)

        # Ensure local missing_keywords are included in the final response
        if "missing_keywords" not in parsed_content or not parsed_content["missing_keywords"]:
            parsed_content["missing_keywords"] = local_feedback["missing_keywords"]


        return parsed_content

    except APITimeoutError as error:
        raise RuntimeError(f"OpenAI API timeout: {error}")
    except APIError as error:
        raise RuntimeError(f"OpenAI API error: {error}")
    except Exception as error:
        raise RuntimeError(f"Unexpected error: {error}")

@router.post("/analyze", response_model=AIResponseSchema)
def analyze_text(payload: AIRequestSchema):
    """
    API endpoint to analyze resume text against a job description using OpenAI.

    Parameters:
        payload (AIRequestSchema): Input containing resume_text and job_description.

    Returns:
        dict: Analysis results including fit score, missing keywords, and suggestions.
    """
    try:
        result = analyze_with_openai(payload.resume_text, payload.job_description)

        # Generate local feedback
        feedback = generate_feedback(payload.resume_text, payload.job_description)

        # Include local feedback into the final result
        #result["feedback"] = feedback

        # Ensure missing_keywords is included
        result["missing_keywords"] = feedback.get("missing_keywords", [])

        # # Ensure missing_keywords is included
        # if "missing_keywords" not in result:
        #     result["missing_keywords"] = []
        
        return result
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# New endpoint to calculate the fit score and provide feedback
@router.post("/fit-score", response_model=AIResponseSchema)
def get_fit_score(payload: AIRequestSchema):
    """
    Endpoint to calculate the fit score and provide feedback.

    Parameters:
        payload (AIRequestSchema): Contains resume_text and job_description.

    Returns:
        AIResponseSchema: A structured response containing fit score, feedback, and AI analysis.
    """
    # Validate input lengths
    max_length = 10000
    if not payload.resume_text or not payload.job_description:
        raise HTTPException(status_code=400, detail="Both resume_text and job_description must be provided.")
    if len(payload.resume_text) > max_length or len(payload.job_description) > max_length:
        raise HTTPException(
            status_code=400, 
            detail=f"Each input field must not exceed {max_length} characters."
        )
    
    try:
        result = analyze_with_openai(payload.resume_text, payload.job_description)
        fit_score = calculate_fit_score(payload.resume_text, payload.job_description)
        key = "missing_keywords"
        feedback = generate_feedback(payload.resume_text,payload.job_description)
        feedback.pop(key)
        keywords = result.get("keywords", [])
        skills = result.get("skills", [])
        # Return final results

        return {
            "fit_score": fit_score,
            "keywords": keywords, 
            "skills": skills,
            "feedback": feedback
        }
    except Exception as e:
        keywords = []
        skills = []
        print(f"GPT-4 Error: {e}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    

    # try:
    #     result = analyze_with_openai(payload.resume_text, payload.job_description)
       
    #     # Calculate fit score locally
    #     fit_score_result = calculate_fit_score(payload.resume_text, payload.job_description)
    #     print("Fit score result:", fit_score_result)

    #     # Generate local feedback
    #     feedback_result = generate_feedback(payload.resume_text, payload.job_description)
    #     print("Feedback:", feedback_result)

    #     #result["fit_score"] = fit_score_result
    #     result["missing_keywords"] = feedback_result.get("missing_keywords", [])

    #     return result



        # Ensure the feedback contains the required data
        # skills = feedback_result.get("skills", [])
        # missing_keywords = feedback_result.get("missing_keywords", [])

        # if fit_score_result is None:
        #     raise HTTPException(status_code=500, detail="Fit score calculation failed.")

        # if feedback_result is None:
        #     raise HTTPException(status_code=500, detail="Feedback generation failed.")


        # # Combine results
        # return {
        #     "fit_score": fit_score_result,  # fit_score_result is already an integer
        #     "feedback": {
        #         "skills": skills,
        #         "experience": feedback_result.get("experience", []),
        #         "formatting": feedback_result.get("formatting", []),
        #         "missing_keywords": missing_keywords
        #     },
        #     "skills": skills,
        #     "keywords": missing_keywords
        # }