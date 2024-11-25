# NLP-based resume analysis.
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# OpenAI API key for text analysis
openai.api_key = os.getenv("OPENAI_API_KEY")

# Function to analyze the resume content using GPT model
def analyze_resume_content(resume_text: str) -> dict:
    try:
        # Request to the OpenAI API to analyze the resume
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Analyze the following resume text and provide feedback on structure, keywords, and skill gaps:\n{resume_text}",
            max_tokens=500
        )
        return response.choices[0].text.strip()
    except Exception as e:
        raise ValueError(f"Error during resume analysis: {str(e)}")
