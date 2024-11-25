# test_samples.py (to create sample DOCX files for testing)
from docx import Document

def create_sample_docx(filename, text):
    doc = Document()
    doc.add_paragraph(text)
    doc.save(filename)

# Create sample DOCX files for testing
create_sample_docx("sample_1.docx", "This is a simple sample resume.")
create_sample_docx("sample_2.docx", "This is another sample resume with more text.")
create_sample_docx("sample_3.docx", "This resume has special characters! @#$%^&*()")
