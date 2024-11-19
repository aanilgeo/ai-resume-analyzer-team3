import React, { useState } from 'react';
import axios from 'axios';

const JobDescriptionInput = () => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form...');
    if (description === '') {
      alert("Please fill out the job description, job description cannot be empty");
    }
    else if (file == null) {
      alert("Please upload a resume for review, resume field cannot be empty");
    }
    else {
      try {
        console.log(file)
        const response = await axios.post('http://127.0.0.1:8000/api/dashboard', {
          description,
          file,
        });
        setMessage(response.data.message); // Display success message
      } catch (error) {
        alert("Something happened");
        setMessage(error.response?.data?.detail || 'An error occurred'); // Display error message
      }
    }
    console.log('Response:', message);
  };

  return (
    <>
      <div>
        <h2>Dashboard</h2>
        <p>Welcome to the user dashboard.</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <h5>Job Description:</h5>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
              required
            />
          </div>
          <h5>Resume Upload:</h5>
          <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
          </div>
          <br/>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default JobDescriptionInput;