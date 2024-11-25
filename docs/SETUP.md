# Project Setup Guide

Follow these instructions to set up the project locally.

## Prerequisites

- **Python**: Ensure Python 3.8+ is installed.
- **Node.js**: Ensure Node.js and npm are installed for frontend setup.
- **Environment Variables**: Set up necessary API keys and configuration in a `.env` file.

## Backend Setup

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Server**:
   ```bash
   uvicorn main:app --reload
   ```

## Frontend Setup

1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm start
   ```

## Running Tests

- **Backend**: Use `pytest` to run backend tests:
  ```bash
  pytest
  ```

- **Frontend**: Use `npm test` to run frontend tests:
  ```bash
  npm test
  ```

Thank you for setting up the project! For any questions, please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) for guidance on collaborating.