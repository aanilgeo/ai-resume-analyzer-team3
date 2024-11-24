from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from schemas.dashboard import ResumeUploadResponse

from utils.pdf_parser import extract_text_from_pdf  # Import PDF parsing utility
from utils.docx_parser import extract_text_from_docx  # Import DOCX parsing utility
from io import BytesIO
from docx import Document
import tempfile
import time
import os
from utils.storage import temp_storage, store_data



router = APIRouter()


@router.post("/resume-upload", response_model=ResumeUploadResponse)
async def upload_resume(resume_file: UploadFile = File(...)):
    # Allow both PDF and DOCX file types
    allowed_content_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
   
    if resume_file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX files are allowed.")
   
    # Read the file content
    content = await resume_file.read()
    #print(f"Received {resume_file.filename}, content size: {len(content)} bytes")  # Debug print to check content size

    text_content = None

    if resume_file.content_type == "application/pdf":
        try:
            # Create a temporary file to save the uploaded PDF content
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(content)
                temp_file_path = temp_file.name
            # Extract text from PDF using the utility function
            text_content = extract_text_from_pdf(temp_file_path)
            os.remove(temp_file_path)  # Clean up the temporary file after extracting text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
   
    # for docx file type
    elif resume_file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        try:
            text_content = extract_text_from_docx(content)
            #print(f"Extracted Text: {text_content}")  # Debugging

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing DOCX: {str(e)}")



    # Store the extracted text content in temporary storage
    store_data("temp_user", "resume_text", text_content) 
    print(f"temp_storage after storing:{temp_storage}")

    # To test loading
    #time.sleep(5)


    return {"message": "Resume uploaded successfully", "filename": resume_file.filename}


@router.post("/job-description")
async def handle_job_description(job_description: str = Form(...)):
    if len(job_description) > 5000:
        raise HTTPException(status_code=400, detail="Job description exceeds character limit.")
    store_data("job_description", "temp_user", job_description)  # Placeholder user ID for demo


    # To test loading
    #time.sleep(5)


    return {"message": "Job description received"}