import os
import pytest
import sys
from io import BytesIO
from docx import Document

# Add the project root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
print("\n".join(sys.path))

from backend.utils.docx_parser import extract_text_from_docx

# Utility to create DOCX content dynamically
def create_docx_with_text(texts):
    buffer = BytesIO()
    doc = Document()
    for text in texts:
        doc.add_paragraph(text)
    doc.save(buffer)
    buffer.seek(0)
    return buffer.getvalue()


# Sample DOCX content as byte data for testing
@pytest.fixture
def simple_docx():
    return create_docx_with_text(["This is a simple test DOCX."])

def test_extract_text_simple_docx(simple_docx):
    # Testing the extraction of text from a DOCX file
    extracted_text = extract_text_from_docx(simple_docx)
    assert extracted_text == "This is a simple test DOCX."

def test_extract_text_multiple_paragraphs():
    # Create a DOCX file with multiple paragraphs for testing
    content = create_docx_with_text(["First paragraph.", "Second paragraph with more content."])

    # Extract the text from the created DOCX file
    text = extract_text_from_docx(content)
    assert text == "First paragraph.\nSecond paragraph with more content."

def test_extract_special_characters():
    # Create a DOCX file with special characters for testing
    content = create_docx_with_text(["This is a test with special characters: !@#$%^&*()"])

    # Extract the text from the DOCX file
    text = extract_text_from_docx(content)
    assert text == "This is a test with special characters: !@#$%^&*()"
