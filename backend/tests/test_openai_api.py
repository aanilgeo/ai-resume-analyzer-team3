# Script for testing OpenAI API

import os
from dotenv import load_dotenv
import openai

# Load environment variables from the .env file
load_dotenv()

# Get the API key from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("API key not found. Ensure OPENAI_API_KEY is set in .env file.")

# Set the OpenAI API key
openai.api_key = OPENAI_API_KEY

# Test function to interact with OpenAI API
def test_openai_api():
    try:
        # Example prompt for testing
        prompt = "Provide three key skills for a software engineer resume."
        
        # Make a request to the OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Extract and print the response
        print("API Response:")
        print(response['choices'][0]['message']['content'].strip())
        
    except openai.error.OpenAIError as e:
        print(f"Error interacting with OpenAI API: {e}")

# Run the test
if __name__ == "__main__":
    test_openai_api()