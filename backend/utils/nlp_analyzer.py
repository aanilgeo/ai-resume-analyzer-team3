import re
import os
import json
import nltk
from dotenv import load_dotenv
from nltk.corpus import stopwords
from openai import OpenAI, APIError, APITimeoutError
# Setup
load_dotenv()

# OpenAI setup
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY not found in environment variables")

client = OpenAI(api_key=api_key)
nltk.download("stopwords")

# Calculate fit score function (Tasks 21,22)
def calculate_fit_score(resume_text, job_description):
    # Tokenize and normalize text
    def tokenize(text):
        return re.findall(r'\b\w+\b', text.lower())
    
    # Remove fluff keywords to maintain fit score accuracy
    def removing_stop_words(keywords):
        # List of stopwords
        stop_words = stopwords.words("english")
        # Intialize a list
        finalized_keywords = []
        # Returns all important keywords
        for keyword in keywords:
            # Normalize keywords to not have matching errors
            keyword_normalized = keyword.lower().strip()
            if keyword_normalized not in stop_words:
                finalized_keywords.append(keyword_normalized)
        return finalized_keywords
    
    # Get required vs preferred keywords using OpenAI
    def get_keywords_using_openai(job_description) -> dict:
        try: 
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{
                    "role": "user",
                    "content": f"""Identify the 'required' and 'preferred' keywords in this job description.

                    Job Description:
                    {job_description}

                    Format your response (without ```json```) as:
                    {{
                                "required": ["<keyword1>", "<keyword2>"],
                                "preferred": ["<keyword3>", "<keyword4>"]
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
        

    # Return 0 given either is empty or non-string inputs 
    if not resume_text or not job_description:
        return 0
    if not isinstance(resume_text, str) or not isinstance(job_description, str):
        return 0

    resume_text_lower = resume_text.lower()   
    # Preprocess resume text and use a set to remove duplicates
    resume_tokens = set(tokenize(resume_text))

    # Get required and preferred keywords 
    keywords = get_keywords_using_openai(job_description)
    
    # Need to use a set instead of a list to handle keywords like REST APIs 
    keywords_required = set(removing_stop_words(keywords.get("required", [])))
    keywords_preferred = set(removing_stop_words(keywords.get("preferred", [])))

    # Get matched required and preferred keywords from resume text
    # Performn set interaction to get matched required/preferred keywords
    matched_keywords_required = set()
    matched_keywords_preferred = set()

    # Add single word matches to set
    matched_keywords_required = resume_tokens.intersection(keywords_required)
    matched_keywords_preferred = resume_tokens.intersection(keywords_preferred)

    # Add multi-word matches to set
    for keyword in keywords_required:
        if keyword in resume_text_lower:
            matched_keywords_required.add(keyword)
    for keyword in keywords_preferred:
        if keyword in resume_text_lower:
            matched_keywords_preferred.add(keyword)

    # Total required and preferred keywords
    keywords_required_num = len(keywords_required)
    keywords_preferred_num = len(keywords_preferred)

    # Improve accuracy in case OpenAI overestimates
    if len(matched_keywords_required) > len(keywords_required):
        matched_keywords_required = keywords_required
    if len(matched_keywords_preferred) > len(keywords_preferred):
        matched_keywords_preferred = keywords_preferred


    fit_score = 0.0
    # Case 1: No keywords in job description
    if keywords_required_num == 0 and keywords_preferred_num == 0:
        fit_score = 0.0
    #Case 2: If there are no preferred keywords
    elif keywords_preferred_num == 0 and keywords_required_num > 0:
        fit_score = round((len(matched_keywords_required) / keywords_required_num) * 100)
    #Case 3: If there are no required keywords
    elif keywords_required_num == 0 and keywords_preferred_num > 0:
        fit_score = round((len(matched_keywords_preferred) / keywords_preferred_num) * 100)
    #Case 4: If there are both required and preferred keywords
    else:
        # Weighting
        keywords_required_weight = 0.7
        keywords_preferred_weight = 0.3

        keywords_required_score = (len(matched_keywords_required) / keywords_required_num) * keywords_required_weight * 100

        keywords_preferred_score = (len(matched_keywords_preferred) / keywords_preferred_num) * keywords_preferred_weight * 100
    
        fit_score = round(keywords_required_score + keywords_preferred_score)

    
    return int(fit_score)
        
