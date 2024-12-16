# Updated `nlp_analyzer.py`
import os
import string
from collections import defaultdict
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from dotenv import load_dotenv
import nltk
import re
import json
from openai import OpenAI, APIError, APITimeoutError

nltk.download('punkt')
nltk.download('stopwords')


# Load environment variables
load_dotenv()

# OpenAI setup
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY not found in environment variables")

client = OpenAI(api_key=api_key)


def preprocess_text(text):
    """
    Preprocess text by converting to lowercase, removing punctuation, and stopwords.
    """
    stop_words = set(stopwords.words('english'))

    # Add custom domain-specific stopwords
    custom_stopwords = {"looking", "must", "clear", "skills", "expertise","with"}
    stop_words.update(custom_stopwords)

    text = text.lower().translate(str.maketrans('', '', string.punctuation))
    tokens = word_tokenize(text)
    return [word for word in tokens if word not in stop_words]


def extract_missing_keywords(job_description, resume_text, skill_categories):
    """
    Extract missing keywords and categorize feedback based on the comparison.


    Parameters:
        job_description (str): Text from the job description.
        resume_text (str): Text from the parsed resume.
        skill_categories (dict): Dictionary of categorized skills.


    Returns:
        dict: Missing keywords and categorized feedback.
    """
    job_tokens = set(preprocess_text(job_description))
    resume_tokens = set(preprocess_text(resume_text))
    missing_keywords = job_tokens - resume_tokens

    print("Job Tokens: ", job_tokens)
    print("Resume Tokens: ", resume_tokens)

   
    
    categorized_feedback = defaultdict(list)


    for keyword in missing_keywords:
        found = False
        for category, skills in skill_categories.items():
            # Check for exact matches or partial matches in skills
            if any(skill in keyword for skill in skills):
                categorized_feedback[category].append(keyword)
                found = True
                break
        if not found:
            categorized_feedback["other_terms"].append(keyword)


    return {
        "missing_keywords": list(missing_keywords),
        "categorized_feedback": dict(categorized_feedback),
    }



# Sample skill categories
SKILL_CATEGORIES = {
    "technical_skills": ["python", "aws", "rest", "api", "java", "sql", "docker"],
    "soft_skills": ["leadership", "communication", "teamwork", "problem-solving"],
    "experience_keywords": ["project management", "team collaboration", "cross-functional teams", "project"],
}

def generate_feedback(resume_text: str, job_description: str) -> dict:
    """
    Generate feedback based on missing keywords, categorized into specific areas like skills,
    experience, and formatting.

    Parameters:
        resume_text (str): Text of the resume.
        job_description (str): Text of the job description.

    Returns:
        dict: Feedback categorized into 'skills', 'experience', and 'formatting'.
    """
    # Extract missing keywords and categorized feedback
    analysis_result = extract_missing_keywords(job_description, resume_text, SKILL_CATEGORIES)
    missing_keywords = analysis_result["missing_keywords"]
    categorized_feedback = analysis_result["categorized_feedback"]

    feedback = {
        "skills": [],
        "experience": [],
        "formatting": [],
        "missing_keywords": missing_keywords
    }

    # # Include missing keywords feedback
    # if missing_keywords:
    #     feedback["missing_keywords"].append(
    #         f"Consider adding these missing keywords to your resume: {', '.join(missing_keywords)}."
    #     )

    # Populate feedback for missing skills
    if "technical_skills" in categorized_feedback:
        feedback["skills"].append(
            f"Consider adding the following technical skills to your resume: {', '.join(categorized_feedback['technical_skills'])}."
        )
    if "soft_skills" in categorized_feedback:
        feedback["skills"].append(
            f"Highlight these soft skills more prominently: {', '.join(categorized_feedback['soft_skills'])}."
        )

    # Populate feedback for missing experience keywords
    if "experience_keywords" in categorized_feedback:
        feedback["experience"].append(
            f"Include examples demonstrating these experiences: {', '.join(categorized_feedback['experience_keywords'])}."
        )

    # General feedback for formatting or other terms
    if "other_terms" in categorized_feedback:
        feedback["formatting"].append(
            f"Consider emphasizing these relevant terms: {', '.join(categorized_feedback['other_terms'])}."
        )

    # # Now check for missing keywords that aren't already categorized
    # remaining_missing_keywords = [
    #     keyword for keyword in missing_keywords
    #     if not any(keyword in categorized_feedback[category] for category in categorized_feedback)
    # ]

    # # Include missing keywords feedback if necessary
    # if remaining_missing_keywords:
    #     feedback["missing_keywords"].append(
    #         f"Consider adding these missing keywords to your resume: {', '.join(remaining_missing_keywords)}."
    #     )

    # Fallback feedback for resumes with significant gaps
    if not missing_keywords:
        feedback["formatting"].append("Your resume aligns well with the job description, but consider fine-tuning for more impact.")

    return feedback


#added for task 24
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

    
    return (int(fit_score))