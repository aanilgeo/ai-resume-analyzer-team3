# Project Setup and Testing Guide

## Steps to Set Up the Project Locally

1. **Initial Setup**:
   - Clone the repository
      ```bash
      git clone https://github.com/aanilgeo/ai-resume-analyzer-team3.git
      cd ai-resume-analyzer-team3/
      ```
   - Install dependencies:
     ```bash
     sudo apt install python3-pip
     pip install -r requirements.txt
     ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Set the `PYTHONPATH` environment variable (to ensure the `backend` module is accessible):
      - **Linux/Mac/WSL**:
          ```bash
          export PYTHONPATH="/absolute/path/to/ai-resume-analyzer-team3"
          ```
          Replace `/absolute/path/to/ai-resume-analyzer-team3` with the full path to your project directory (e.g., `/home/username/ai-resume-analyzer-team3`).
     
      - **Windows**:
        ```bash
        set PYTHONPATH=C:\absolute\path\to\ai-resume-analyzer-team3
        ```
        Replace `C:\absolute\path\to\ai-resume-analyzer-team3` with the full path to your project directory.
   - Start the FastAPI server:
     ```bash
     sudo apt install uvicorn
     uvicorn main:app --reload
     ```

3. **Frontend Setup**:
   - Open a new terminal and navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm start
     ```

4. **Running the Application**:
   - Access the app at `http://localhost:3000`.

## Running Tests

- **Backend**: Use `pytest` to run backend tests:
  ```bash
  pytest
  ```

  - To run the tests and generate a test coverage report:
    ```bash
    pip install pytest pytest-cov
    pytest --cov=backend --cov-report=term-missing
    ```

- **Frontend**: Use `npm test` to run frontend tests:
  ```bash
  cd frontend
  npm install
  npm test
  ```
  - To run the tests and generate a test coverage report:
    ```bash
    npm test -- --coverage
    ```
    - `Note`: During test coverage, there might be some red lines shown which are uncovered. Uncovered lines are double-checking on submit after it has been already checked once in on upload, and additional unrequired quality of life features.

Thank you for setting up the project! For any questions, please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) for guidance on collaborating.
