import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const registerUser = async (email, password, username) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, username });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume_file', file);
    const response = await axios.post(`${API_URL}/resume-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading resume:', error);
  }
};

export const submitJobDescription = async (jobDescription) => {
  try {
    const response = await axios.post(`${API_URL}/job-description`, { job_description: jobDescription });
    return response.data;
  } catch (error) {
    console.error('Error submitting job description:', error);
  }
};