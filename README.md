# AI Resume Analyzer 

## Project Overview

The AI Resume Analyzer helps job seekers refine their resumes by analyzing content and providing valuable feedback on keywords, structure, and skill gaps. Using NLP and machine learning techniques, this platform offers targeted insights to optimize resumes for improved career opportunities.

---

## Technology Stack

- **Backend**: Python with FastAPI for efficient API handling and backend logic.
- **Frontend**: React.js for a user-friendly interface.
- **NLP Model**: OpenAI API for text analysis and processing.
- **Communication**: REST API for seamless frontend-backend integration.

---

## Team-3 Assignments

| Team Member                            | Assignment                      |
|----------------------------------------|---------------------------------|
| Andrew Anil George (Project Manager)   | Placeholder for assignment      |
| Sebastian Alcock                       | Placeholder for assignment      |
| Jhaylor Cudia                          | Placeholder for assignment      |
| Harshit Bansal                         | Placeholder for assignment      |
| Neel Patel                             | Placeholder for assignment      |

*(Assignments will be updated as tasks are delegated.)*

---

## Project Plan

Follow our project roadmap on [GitHub Project](https://github.com/users/aanilgeo/projects/2).

---

## Setup Instructions

### Steps to Set Up the Project Locally

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

5. **Testing**:
   - `pytest` is used for backend testing and `jest` is for frontend testing.
   - For more info on how to perform testing, go to [SETUP.md](./docs/SETUP.md).

---

## Documentation

For detailed contribution guidelines, coding standards, and setup instructions, please refer to the [docs](./docs/) folder:
- [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
- [STYLE_GUIDE.md](./docs/STYLE_GUIDE.md)
- [SETUP.md](./docs/SETUP.md)

---
