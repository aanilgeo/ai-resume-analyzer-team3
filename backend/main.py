from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas.dashboard import ResumeUploadResponse
from api import dashboard
from utils.storage import store_data, get_data, clear_data
from api.auth import get_router as auth_router_factory
from utils.pdf_parser import extract_text_from_pdf
from dotenv import load_dotenv
from api.auth import get_router as auth_router_factory
import os
import sys

# Add the backend directory (or project root) to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

import secrets


# Path to the .env file where secret key will be stored
ENV_FILE_PATH = "./.env"

# Generate a secret key and store it in the .env folder 
def generate_and_store_secret_key():
    # Check if the .env file exists
    if not os.path.exists(ENV_FILE_PATH):
        print("No .env file found. Generating a new SECRET_KEY...")
        # Generate a random secret key
        secret_key = secrets.token_urlsafe(32)
        
        # Write the key to the .env file
        with open(ENV_FILE_PATH, "w") as env_file:
            env_file.write(f"SECRET_KEY={secret_key}\n")
            env_file.write("OPENAI_API_KEY=your-openai-key-here\n")
        
        print(f"Generated new SECRET_KEY and stored it in {ENV_FILE_PATH}")
        print("Please replace 'your-openai-key-here' with your actual OpenAI API key")
    else:
        print(".env file found. Loading SECRET_KEY...")


# Call the function to ensure .env file and SECRET_KEY exist
generate_and_store_secret_key()

# Load environment variables from the .env file
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY could not be loaded. Check .env file.")


app = FastAPI()


# Allow CORS for frontend requests (usually on a different port, like 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.middleware("http")
async def add_header(request, call_next):
    response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response




# Include routers for API endpoints
app.include_router(auth_router_factory(SECRET_KEY), prefix="/api", tags=["auth"])
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])
app.include_router(nlp.router, prefix="/api", tags=["nlp"])

# Run app with: `uvicorn main:app --reload`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
