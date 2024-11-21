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
  const [fitScore, setFitScore] = useState(0);
  const [skillsList, setSkillsList] = useState([]);
  const [keywordsList, setKeywordsList] = useState([]);
  const [improvementSuggestions, setImprovementSuggestions] = useState('');

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
    console.log(message)
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (resume_file == null) {
      alert("Please upload a resume for review, resume field cannot be empty");
    }
    else if (
      resume_file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      resume_file.type !== "application/pdf"
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
      console.log(message)
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
      e.target.files[0].type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      e.target.files[0].type !== "application/pdf"
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

  function checkProgress(progress) {
    var i = 0;
    if (i === 0) {
      i = 1;
      var progressBar = document.getElementById("progressBar");
      var progressLabel = document.getElementById("progressLabel");
      var width = 0;
      var id = setInterval(frame, 0);
      function frame() {
        if (width >= progress) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          progressBar.style.width = width + "%";
          progressLabel.innerHTML = width + "%";
          if (width > 0) {
            progressBar.style.backgroundColor = "#b30000"
          }
          if (width > 50) {
            progressBar.style.backgroundColor = "#b3b300"
          }
          if (width > 80) {
            progressBar.style.backgroundColor = "#59b300"
          } 
        }
      }
    }
  }

  function getFeedback() {
    if (submittedDescription && submittedResume) {
      const mockdata = [
        {
          'fitScore': 15,
          'skillsList': ['Skill0'],
          'keywordsList': ['Keyword0'],
          'improvementSuggestions': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          'fitScore': 65,
          'skillsList': ['Skill0', 'Skill1', 'Skill5'],
          'keywordsList': ['Keyword0', 'Keyword1', 'Keyword5', 'Keyword6'],
          'improvementSuggestions': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        {
          'fitScore': 85,
          'skillsList': ['Skill0', 'Skill1', 'Skill5', 'Skill6'],
          'keywordsList': ['Keyword0', 'Keyword1', 'Keyword5', 'Keyword6', 'Keyword9'],
          'improvementSuggestions': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      ]

      var feedback = mockdata[Math.floor(Math.random() * mockdata.length)]

      setFitScore(feedback.fitScore);
      checkProgress(feedback.fitScore);
      console.log(fitScore)
      setSkillsList(feedback.skillsList);
      setKeywordsList(feedback.keywordsList);
      setImprovementSuggestions(feedback.improvementSuggestions);

      document.getElementById("feedback").classList.remove("hidden")
    } else {
      alert("Please submit job description and resume to get feedback")
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
              onClick={() => setSubmittedDescription(false)}
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
              onClick={() => setSubmittedResume(false)}
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
        <br/>
        {submittedDescription && submittedResume &&
        <button 
          type="submit"
          onClick={getFeedback}
          >
            Get Feedback
        </button>
        }
      </div>
      <br/>
        <div id='feedback' className='hidden'>
          <h4>Results:</h4>
          <h5>Resume Fit Score:</h5>
          <div id="progressBar">
            <div id="progressLabel">0%</div>
          </div>
          <h5>Matched Skills:</h5>
          <ul>
            {skillsList.map((skill, index) => {
              return <li key={index}>{skill}</li>
              }
            )}
          </ul>
          <h5>Matched Keywords:</h5>
          <ul>
            {keywordsList.map((keyword, index) => {
              return <li key={index}>{keyword}</li>
              }
            )}
          </ul>
          <h5>Improvement Suggestions:</h5>
          <div>
            {improvementSuggestions}
          </div>
        </div>
    </>
  );
};

export default JobDescriptionInput;
