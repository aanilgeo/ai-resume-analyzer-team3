from docx import Document
from io import BytesIO

def extract_text_from_docx(docx_content):
    try:
        doc = Document(BytesIO(docx_content))
        text = "\n".join([para.text for para in doc.paragraphs if para.text.strip() != ""])
        return text
    except Exception as e:
        raise ValueError(f"Error extracting text from DOCX: {str(e)}")
