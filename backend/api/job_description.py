from fastapi import APIRouter, HTTPException
from schemas.job_description import JobDescriptionRequest
from utils.storage import store_data 

router = APIRouter()

@router.post("/job-description")
async def handle_job_description(job_desc: JobDescriptionRequest):
    if len(job_desc.job_description) > 5000:
        raise HTTPException(status_code=400, detail="Job description exceeds character limit.")
    store_data("job_description", "temp_user", job_desc.job_description)  # Placeholder user ID for demo
    return {"message": "Job description received"}