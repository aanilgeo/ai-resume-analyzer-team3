"""
API endpoints to handle resume upload and job description along with validation
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.schemas.dashboard import ResumeUploadResponse
from backend.schemas.dashboard import JobDescriptionRequest
from backend.utils.storage import store_data, get_data, clear_data
from backend.utils.pdf_parser import extract_text_from_pdf  # Import PDF parsing utility
from backend.utils.docx_parser import extract_text_from_docx  # Import DOCX parsing utility
from io import BytesIO
from docx import Document
import tempfile
import os

router = APIRouter()

@router.post("/resume-upload", response_model=ResumeUploadResponse)
async def upload_resume(resume_file: UploadFile = File(...)):
    """
    Allows successful resume uploading with PDF or docx file type
    """
    # Allow both PDF and docx file types
    allowed_content_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    # Maximum file size = 2MB
    maximum_file_size_allowed = 1024 * 1024 * 2

    #Only PDF and docx file types allowed
    if resume_file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail={
            "error": "Invalid file type. Only PDF or docx files are allowed.", 
            "status": "error"
            }
        )
    #Validate the file size
    size_of_file = len(await resume_file.read())
    if maximum_file_size_allowed < size_of_file:
        raise HTTPException(status_code=400, detail={
            "error": "File cannot exceed 2MB. Check file size.", 
            "status": "error"
            }
        )
    #Need to restart the file pointer since we re-read the file
    await resume_file.seek(0)

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
    store_data("session_id_123", "resume_text", text_content)  # Replace "temp_user" with actual user identifier as needed
    #print(text_content)
    return {"message": "Resume uploaded successfully.", "status": "success"}


@router.post("/job-description")
async def handle_job_description(job_description: str = Form(...)):
    """
    Allows successful job description submission along with validation
    """
    #Description should not exceed 5000 characters
    if len(job_description) > 5000:
        raise HTTPException(status_code=400, detail={
            "error": "Job description exceeds character limit.", 
            "status": "error"
            }
        )
    
    #Clean the text by removing extraneous whitespace
    individual_words = job_description.split()
    clean_description = " ".join(individual_words)
    store_data("session_id_123", "job_description", clean_description)  # Placeholder user ID for demo

    return {"message": "Job description submitted successfully.", "status": "success"}
