import React, { useState } from 'react';
import axios from 'axios';

const JobDescriptionInput = () => {
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/job-description', {
        "job_desc": description
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessage(response.data.message); // Display success message
    } catch (error) {
      alert("Something happened");
      setMessage(error.response?.data?.detail || 'An error occurred'); // Display error message
    }
    console.log('Submitted job description:', message);
  };

  return (
    <div>
      <h2>Submit Job Description</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="6"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default JobDescriptionInput;