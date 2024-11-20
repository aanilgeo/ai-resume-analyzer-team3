import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css'

const JobDescriptionInput = () => {
  const [job_description, setDescription] = useState('');
  const [resume_file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedDescription, setSubmittedDescription] = useState(false);
  const [submittedResume, setSubmittedResume] = useState(false);
  var job_description_length = job_description.length

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (job_description === '') {
      alert("Please fill out the job description, job description cannot be empty");
    }
    else if (job_description.length > 5000) {
      alert("Job description cannot exceed 5000 characters");
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
        setSubmittedDescription(true);
      } catch (error) {
        setMessage(error.response?.data?.detail || 'An error occurred'); // Display error message
      }
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (resume_file == null) {
      alert("Please upload a resume for review, resume field cannot be empty");
    }
    else if (
      resume_file.type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      resume_file.type != "application/pdf"
    ) {
      alert("Invalid file type. Only PDF and DOCX files are allowed");
    }
    else if (
      resume_file.size > 2000000
    ) {
      alert("File size must be smaller than 2MB");
    }
    else {
      setLoading(true)
      try {
        console.log(resume_file)
        const response = await axios.post('http://127.0.0.1:8000/api/resume-upload', {
          resume_file
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage(response.data.message); // Display success message
        setSubmittedResume(true);
      } catch (error) {
        alert("There was a problem with the server, please try again later");
        setMessage(error.response?.data?.detail || 'An error occurred'); // Display error message
      }
      setLoading(false);
    }
  };

  function changeDescription(e) {
    if (job_description.length > 5000) {
      alert("Job description cannot exceed 5000 characters");
    }
    else {
      setDescription(e)
    }
  };

  function changeFile(e) {
    if (
      e.target.files[0].type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      e.target.files[0].type != "application/pdf"
    ) {
      alert("Invalid file type. Only PDF and DOCX files are allowed");
      e.target.value = null;
    }
    else if (
      e.target.files[0].size > 2000000
    ) {
      alert("File size must be smaller than 2MB");
      e.target.value = null;
    }
    else {
      setFile(e.target.files[0])
    }
  };

  return (
    <>
      {
        loading &&
          <>
            <div className='fade'/>
            <div id="floatingCirclesG">
              <div className="f_circleG" id="frotateG_01"></div>
              <div className="f_circleG" id="frotateG_02"></div>
              <div className="f_circleG" id="frotateG_03"></div>
              <div className="f_circleG" id="frotateG_04"></div>
              <div className="f_circleG" id="frotateG_05"></div>
              <div className="f_circleG" id="frotateG_06"></div>
              <div className="f_circleG" id="frotateG_07"></div>
              <div className="f_circleG" id="frotateG_08"></div>
            </div>
          </>
      }
      <div>
        <h2>Dashboard</h2>
        <p>Welcome to the user dashboard.</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <h5>Job Description: {submittedDescription && "✅"}</h5>
          <div>
            <textarea
              title='Job Description Submission'
              placeholder='Input the details of the job here...'
              value={job_description}
              onClick={(e) => setSubmittedDescription(false)}
              onChange={(e) => changeDescription(e.target.value)}
              rows="6"
              maxLength={5000}
              required
            />
            <div>
            {
              job_description_length > 4500 ? 
              <>
                {
                  job_description_length >= 5000 ?
                  <>
                    (5000 / 5000 max.) 🛑
                  </>
                  :
                  <>
                    ({job_description_length} / 5000 max.) ⚠
                  </>
                }
              </>
              :
              <>
                ({job_description_length} / 5000 max.)
              </>
            }
            </div>
          </div>
          <br/>
          <div>
            {
              submittedDescription ?
              <button type="submit">Resubmit Description</button>
              :
              <button type="submit">Submit Description</button>
            }
          </div>
        </form>
        <form onSubmit={handleUpload}>
          <h5>Resume Upload: {submittedResume && "✅"}</h5>
          <div>
            <input
              title='Resume File Upload'
              placeholder='N/A'
              type="file"
              onClick={(e) => setSubmittedResume(false)}
              onChange={(e) => changeFile(e)}
              required
            />
          </div>
          <br/>
          <div>
            {
              submittedResume ?
              <button type="submit">Reupload Resume</button>
              :
              <button type="submit">Upload Resume</button>
            }
          </div>
        </form>
      </div>
    </>
  );
};

export default JobDescriptionInput;