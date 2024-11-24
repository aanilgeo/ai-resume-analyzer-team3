import os
import pytest
import sys
from fastapi.testclient import TestClient
from fastapi import FastAPI
from backend.api.dashboard import router  # Import your FastAPI router


# Add the project root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from backend.utils.pdf_parser import extract_text_from_pdf

# Create a FastAPI app instance and include the router
app = FastAPI()
app.include_router(router)

client = TestClient(app)  # Initialize the TestClient

# Define the directory containing sample PDFs
@pytest.fixture
def sample_files():
    sample_dir = os.path.join(os.path.dirname(__file__), "samples")
    return {
        "simple_text": os.path.join(sample_dir, "simple_text.pdf"),
        "complex_layout": os.path.join(sample_dir, "complex_layout.pdf"),
        "image_based": os.path.join(sample_dir, "image_based.pdf"),
        "multi_page": os.path.join(sample_dir, "multi_page.pdf"),
        "corrupted": os.path.join(sample_dir, "corrupted.pdf"),
    }

# Define expected results for the sample PDFs
@pytest.fixture
def expected_text():
    return {
        "simple_text": "This is a simple text PDF for testing.",
        "complex_layout": "Complex layout text extracted properly.",
        "image_based": "",  # Assuming image-based PDFs return an empty string
        "multi_page": "Page 1 content. Page 2 content.",
    }

# --- Existing PDF Parser Tests ---
def test_simple_text_extraction(sample_files, expected_text):
    result = extract_text_from_pdf(sample_files["simple_text"])
    assert result.strip() == expected_text["simple_text"].strip()

def test_complex_layout_extraction(sample_files, expected_text):
    result = extract_text_from_pdf(sample_files["complex_layout"])
    assert result.strip() == expected_text["complex_layout"].strip()

def test_image_based_pdf(sample_files, expected_text):
    result = extract_text_from_pdf(sample_files["image_based"])
    assert result.strip() == expected_text["image_based"].strip()

def test_multi_page_extraction(sample_files, expected_text):
    result = extract_text_from_pdf(sample_files["multi_page"])
    assert result.strip() == expected_text["multi_page"].strip()

def test_page_range_extraction(sample_files):
    # Extract content only from the first page
    result = extract_text_from_pdf(sample_files["multi_page"], page_range=(0, 1))
    assert result.strip() == "Page 1 content."

def test_corrupted_pdf_handling(sample_files):
    with pytest.raises(ValueError, match="Error reading PDF file"):
        extract_text_from_pdf(sample_files["corrupted"])

# --- FastAPI Integration for PDF Uploads ---
@pytest.fixture
def create_sample_pdf(sample_files):
    """Fixture to dynamically create a sample PDF file from the sample directory."""
    return sample_files["simple_text"]

# 
    # # Optionally, validate the stored data if your endpoint uses a storage mechanism
    # from backend.utils.storage import get_data

    # extracted_text = get_data("temp_user", "resume_text")
    # assert extracted_text.strip() == "This is a simple text PDF for testing."
