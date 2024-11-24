
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import dashboard
from schemas.dashboard import ResumeUploadResponse
from utils.storage import store_data, get_data, clear_data
from utils.pdf_parser import extract_text_from_pdf
from dotenv import load_dotenv
from api.auth import get_router as auth_router_factory
import os


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


@app.middleware("http")
async def add_header(request, call_next):
    response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response




# Include routers for API endpoints
app.include_router(auth_router_factory(SECRET_KEY), prefix="/api", tags=["auth"])
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])


# Run app with: `uvicorn main:app --reload`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
