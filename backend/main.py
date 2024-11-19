from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import job_description, resume, dashboard
from utils.storage import store_data, get_data, clear_data
import os
from dotenv import load_dotenv
from api.auth import get_router as auth_router_factory

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

# Allow CORS for frontend requests (usually on a different port, like 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include routers for API endpoints
app.include_router(auth_router_factory(SECRET_KEY), prefix="/api", tags=["auth"])
app.include_router(job_description.router, prefix="/api", tags=["job_description"])
app.include_router(resume.router, prefix="/api", tags=["resume"])
app.include_router(dashboard.router, prefix="/api", tags=["resume"])

# Run app with: `uvicorn main:app --reload`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)