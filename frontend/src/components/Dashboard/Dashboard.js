import React, { useState } from 'react';
import axios from 'axios';

const JobDescriptionInput = () => {
  const [job_description, setDescription] = useState('');
  const [resume_file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form...');
    if (job_description === '') {
      alert("Please fill out the job description, job description cannot be empty");
    }
    else {
      try {
        console.log(job_description)
        setLoading(true)
        const response = await axios.post('http://127.0.0.1:8000/api/job-description', {
          job_description
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage(response.data.message); // Display success message
      } catch (error) {
        setMessage(error.response?.data?.detail || 'An error occurred'); // Display error message
      }
    }
    setLoading(false)
    console.log('Response:', message);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (resume_file == null) {
      alert("Please upload a resume for review, resume field cannot be empty");
    }
    else {
      try {
        console.log(resume_file)
        setLoading(true)
        const response = await axios.post('http://127.0.0.1:8000/api/resume-upload', {
          resume_file
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage(response.data.message); // Display success message
      } catch (error) {
        setMessage(error.response?.data?.detail || 'An error occurred'); // Display error message
      }
    }
    setLoading(false)
    console.log('Response:', message);
  };

  return (
    <>
      <div>
        <h2>Dashboard</h2>
        <p>Welcome to the user dashboard.</p>
        <script>
          if (loading) {
            <p>
              LOADING...
            </p>
          }
        </script>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <h5>Job Description:</h5>
          <div>
            <textarea
              title='Job Description Submission'
              placeholder='Input the details of the job here...'
              value={job_description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
              required
            />
          </div>
          <br/>
          <div>
            <button type="submit">Submit Description</button>
          </div>
        </form>
        <form onSubmit={handleUpload}>
          <h5>Resume Upload:</h5>
          <div>
            <input
              title='Resume File Upload'
              placeholder='N/A'
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <br/>
          <div>
            <button type="submit">Upload Resume</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default JobDescriptionInput;