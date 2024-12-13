import pytest
from fastapi.testclient import TestClient
from docx import Document
from backend.main import app
from io import BytesIO

client = TestClient(app)

def test_valid_pdf_file_upload():
    file_name = "test.pdf"
    # Create valid PDF using reportlab
    from reportlab.pdfgen import canvas
    temp_pdf_file = BytesIO()
    c = canvas.Canvas(temp_pdf_file)
    c.drawString(100, 750, "This is a test PDF")
    c.save()
    temp_pdf_file.seek(0)

    response = client.post(
        "/api/resume-upload", 
        files={"resume_file": (file_name, temp_pdf_file, "application/pdf")}
    )
    print(response.json())  # Debugging
    assert response.status_code == 200
    assert response.json() == {"message": "Resume uploaded successfully.", "status": "success"}


# Test: Sucessful file upload (valid docx) (Task 8, 10)
def test_valid_docx_file_upload():
    file_name = "test.docx"
    # Create valid docx file using docx library and BytesIO to use in post request
    document = Document()
    document.add_paragraph("Temporary Word Document (with docx type)")
    temp_document = BytesIO()
    document.save(temp_document)
    temp_document.seek(0)

    response = client.post("/api/resume-upload", files={"resume_file": (file_name, temp_document, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")})
    # 200 OK: Request succeeded
    assert response.status_code == 200
    assert response.json() == {"message": "Resume uploaded successfully.", "status": "success"}

# Test: Invalid file type upload (.txt) (Task 8, 10)
def test_invalid_txt_file_upload():
    file_name = "test.txt"
    # Create valid txt file using BytesIO to use in post request
    temp_txt_file = BytesIO(b"This is an invalid file type.")
    response = client.post("/api/resume-upload", files={"resume_file": (file_name, temp_txt_file, "text/plain")})
    # 400 Bad Request: Request not processed
    assert response.status_code == 400
    assert response.json() == {"detail": {"error": "Invalid file type. Only PDF or docx files are allowed.", "status": "error"}}

# Test: Oversized file upload (Task 8, 10)
def test_oversized_file_upload():
    # Dummy name to send post request
    file_name = "test.pdf"
    # Exceeds maximum fize size (2MB)
    oversized_file_size = 1024 * 1024 * 2 + 1
    # Create a dummy string to be used as file object for Test Client and creating binary file
    temp_str = BytesIO(b"a" * oversized_file_size)
    response = client.post("/api/resume-upload", files={"resume_file": (file_name, temp_str, "application/pdf")})

    # 400 Bad Request: Request not processed
    assert response.status_code == 400
    assert response.json() == {"detail": {"error": "File cannot exceed 2MB. Check file size.", "status": "error"}}
    

# Test: Successful text input submission (Task 8, 10)
def test_successful_text_input_submission():
    job_description = "This is a test to see if test passes."
    # Need data parameter to send FORM data
    response = client.post("/api/job-description", data={"job_description": job_description})

    # 200 OK: Request succeeded
    assert response.status_code == 200
    assert response.json() == {"message": "Job description submitted successfully.", "status": "success"}

# Test: Failed text input submission (Task 8, 10)
def test_failed_text_input_submission():
    # Exceeds maximum character count (10000)
    invalid_character_count = 10000 + 1
    # Create a dummy string
    temp_str = "a" * invalid_character_count
    # Need data parameter to send FORM data
    response = client.post("/api/job-description", data={"job_description": temp_str})
 
    # 400 Bad Request: Request not processed
    assert response.status_code == 400
    assert response.json() == {"detail": {"error": "Job description exceeds character limit.", "status": "error"}}


