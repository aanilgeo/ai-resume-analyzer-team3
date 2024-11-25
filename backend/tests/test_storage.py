import pytest
from backend.utils.storage import store_data, get_data, clear_data

# Test: Data insertion and Retrieval in memory (Task 12)
def test_data_insertion_and_retrieval():
    # Store data in memory using store_data() in storage.py
    store_data("session_id_123", "resume_text", "Extracted resume text here...")
    store_data("session_id_123", "job_description", "Submitted job description here...")

    # Retrieve data in memory using get_data() in storage.py
    resume_text_data = get_data("session_id_123","resume_text")
    job_description_data = get_data("session_id_123", "job_description")
    
    # Check to see if data is as expected
    assert resume_text_data == "Extracted resume text here..."
    assert job_description_data == "Submitted job description here..."

# Test: Data being removed correctly (Task 12)
def test_data_removed_after_processing():
    # Store data in memory using store_data() in storage.py
    store_data("session_id_123", "resume_text", "Test resume text to see if it clears")
    store_data("session_id_123", "job_description", "Test job description to see if it clears")

    # Clear data in memory
    clear_data("session_id_123", "resume_text")
    clear_data("session_id_123", "job_description")

    # Retrieve data in memory using get_data() in storage.py
    resume_text_data = get_data("session_id_123","resume_text")
    job_description_data = get_data("session_id_123", "job_description")

    # Check to see if data is as expected
    assert resume_text_data ==  None
    assert job_description_data == None