from fastapi import APIRouter, UploadFile, File, HTTPException
from schemas.resume import ResumeUploadResponse
from utils.storage import store_data
from io import BytesIO
from docx import Document  

router = APIRouter()

@router.post("/resume-upload", response_model=ResumeUploadResponse)
async def upload_resume(resume_file: UploadFile = File(...)):
    # Allow both PDF and DOCX file types
    allowed_content_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    
    if resume_file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX files are allowed.")
    
    # Read the file content
    content = await resume_file.read()
    
    # Process based on file type
    if resume_file.content_type == "application/pdf":
        # For PDFs, just store content directly (assuming PDF parsing occurs elsewhere if needed)
        text_content = content.decode('utf-8', errors="ignore")  # Handle binary content as needed for PDFs
    
    elif resume_file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        # For DOCX, use python-docx to read text
        doc = Document(BytesIO(content))
        text_content = "\n".join([para.text for para in doc.paragraphs])
    
    # Store the extracted text content in temporary storage
    store_data("resume", "temp_user", text_content)  # Replace "temp_user" with actual user identifier as needed

    return {"message": "Resume uploaded successfully", "filename": resume_file.filename}
