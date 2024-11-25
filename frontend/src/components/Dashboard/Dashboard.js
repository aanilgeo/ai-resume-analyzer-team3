import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css'

const Dashboard = () => {
  const [jobDescription, setDescription] = useState('');
  const [resumeFile, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedDescription, setSubmittedDescription] = useState(false);
  const [submittedResume, setSubmittedResume] = useState(false);
  const [fitScore, setFitScore] = useState(0);
  const [skillsList, setSkillsList] = useState([]);
  const [keywordsList, setKeywordsList] = useState([]);
  const [improvementSuggestions, setImprovementSuggestions] = useState([]);

  var jobDescriptionLength = jobDescription.length

  // Handle job description uploads
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jobDescription === '') {
      alert('Please fill out the job description, job description cannot be empty');
    }
    else if (jobDescription.length > 5000) {
      alert('Job description cannot exceed 5000 characters');
    }
    else {
      setLoading(true)
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/job-description', {
          'job_description': jobDescription
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSubmittedDescription(true);
        setMessage(response.data.message); // Display success message
      } catch (error) {
        setMessage(error.response?.data?.detail || 'An error occurred'); // Display error message
        window.alert('There was a problem reaching the server, please try again later');
      }
    }
    setLoading(false);
  };

  // Handle resume uploads
  const handleUpload = async (e) => {
    e.preventDefault();
    if (resumeFile == null) {
      alert('Please upload a resume for review, resume field cannot be empty');
    }
    else if (
      resumeFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
      resumeFile.type !== 'application/pdf'
    ) {
      alert('Invalid file type. Only PDF and DOCX files are allowed');
    }
    else if (
      resumeFile.size > 2000000
    ) {
      alert('File size must be smaller than 2MB');
    }
    else {
      setLoading(true)
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/resume-upload', {
          'resume_file': resumeFile
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSubmittedResume(true);
        setMessage(await response.data.message); // Display success message
      } catch (error) {
        setMessage(await error.response?.data?.detail || 'An error occurred'); // Display error message
        window.alert('There was a problem reaching the server, please try again later');
      }
    }
    setLoading(false);
  };

  // For double-checking logic on description entry
  function changeDescription(e) {
    if (jobDescription.length > 5000) {
      alert('Job description cannot exceed 5000 characters');
    }
    else {
      setDescription(e)
    }
  };

  // For double-checking logic on file upload
  function changeFile(e) {
    if (e.target.files[0] === null) {
      alert('File is null');
    }
    else if (
      e.target.files[0].type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
      e.target.files[0].type !== 'application/pdf'
    ) {
      alert('Invalid file type. Only PDF and DOCX files are allowed');
      e.target = null;
    }
    else if (
      e.target.files[0].size > 2000000
    ) {
      alert('File size must be smaller than 2MB');
      e.target = null;
    }
    else {
      setFile(e.target.files[0])
    }
  };

  // Animation for fit score percentage bar
  function checkProgress(progress) {
    var i = 0;
    if (i === 0) {
      i = 1;
      var progressBar = document.getElementById('progressBar');
      var progressLabel = document.getElementById('progressLabel');
      var width = 0;
      var id = setInterval(frame, 0);
      function frame() {
        if (width >= progress) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          progressBar.style.width = width + '%';
          progressLabel.innerHTML = width + '%';
          if (width > 0) {
            progressBar.style.backgroundColor = '#b30000'
          }
          if (width > 50) {
            progressBar.style.backgroundColor = '#b3b300'
          }
          if (width > 80) {
            progressBar.style.backgroundColor = '#59b300'
          } 
        }
      }
    }
  }

  // Placeholder function to get feedback
  function getFeedback() {
    if (submittedDescription && submittedResume) {
      const mockdata = [
        {
          'fitScore': 15,
          'skillsList': ['Skill0'],
          'keywordsList': ['Keyword0'],
          'improvementSuggestions': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.']
        },
        {
          'fitScore': 65,
          'skillsList': ['Skill0', 'Skill1', 'Skill5'],
          'keywordsList': ['Keyword0', 'Keyword1', 'Keyword5', 'Keyword6'],
          'improvementSuggestions': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.']
        },
        {
          'fitScore': 85,
          'skillsList': ['Skill0', 'Skill1', 'Skill5', 'Skill6'],
          'keywordsList': ['Keyword0', 'Keyword1', 'Keyword5', 'Keyword6', 'Keyword9'],
          'improvementSuggestions': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.']
        }
      ]

      // Currently looks at the job description to determine what mock data to use
      var feedback = mockdata[2];
      if (jobDescription.includes("poor")) {
        feedback = mockdata[0];
      } else if (jobDescription.includes("average")) {
        feedback = mockdata[1];
      }

      setFitScore(feedback.fitScore);
      checkProgress(feedback.fitScore);
      setSkillsList(feedback.skillsList);
      setKeywordsList(feedback.keywordsList);
      setImprovementSuggestions(feedback.improvementSuggestions);

      // Unhide results area
      document.getElementById('feedback').classList.remove('hidden')
    } else {
      alert('Please submit job description and resume to get feedback')
    }
  };

  return (
    <>
      {
        loading &&
          <>
            <div role='loadingSpinnerBackdrop' className='fade'/>
            <div role='loadingSpinner' id='floatingCirclesG'>
              <div className='f_circleG' id='frotateG_01'></div>
              <div className='f_circleG' id='frotateG_02'></div>
              <div className='f_circleG' id='frotateG_03'></div>
              <div className='f_circleG' id='frotateG_04'></div>
              <div className='f_circleG' id='frotateG_05'></div>
              <div className='f_circleG' id='frotateG_06'></div>
              <div className='f_circleG' id='frotateG_07'></div>
              <div className='f_circleG' id='frotateG_08'></div>
            </div>
          </>
      }
      <div>
        <h2 role='title'>Dashboard</h2>
        <p role='titleMessage'>Welcome to the user dashboard.</p>
      </div>
      <div>
        <form role='descriptionForm' onSubmit={handleSubmit}>
          <h5 role='descriptionLabel'>Job Description: {submittedDescription && '✅'}</h5>
          <div>
            <textarea
              title='Job Description Submission'
              id='descriptionUpload'
              role='descriptionInput'
              placeholder='Input the details of the job here...'
              value={jobDescription}
              onClick={() => setSubmittedDescription(false)}
              onChange={(e) => changeDescription(e.target.value)}
              rows='6'
              maxLength={5000}
              required
            />
            <div role='descriptionCharacterLength'>
            {
              jobDescriptionLength > 4500 ? 
              <>
                {
                  jobDescriptionLength >= 5000 ?
                  <>
                    (5000 / 5000 max.) 🛑
                  </>
                  :
                  <>
                    ({jobDescriptionLength} / 5000 max.) ⚠
                  </>
                }
              </>
              :
              <>
                ({jobDescriptionLength} / 5000 max.)
              </>
            }
            </div>
          </div>
          <br/>
          <div>
            {
              submittedDescription ?
              <button role='descriptionButton' type='submit'>Resubmit Description</button>
              :
              <button role='descriptionButton' type='submit'>Submit Description</button>
            }
          </div>
        </form>
        <form role='fileForm' onSubmit={handleUpload}>
          <h5 role='fileLabel'>Resume Upload: {submittedResume && '✅'}</h5>
          <div>
            <input
              title='Resume File Upload'
              id='fileUpload'
              role='fileInput'
              type='file'
              placeholder='N/A'
              onClick={() => setSubmittedResume(false)}
              onChange={(e) => changeFile(e)}
              required
            />
          </div>
          <br/>
          <div>
            {
              submittedResume ?
              <button role='fileButton' type='submit'>Reupload Resume</button>
              :
              <button role='fileButton' type='submit'>Upload Resume</button>
            }
          </div>
        </form>
        <br/>
        {(submittedDescription && submittedResume) &&
        <button 
          type='submit'
          role='feedbackButton'
          onClick={getFeedback}
          >
            Get Feedback
        </button>
        }
      </div>
      <br/>
        <div role='results' id='feedback' className='hidden'>
          <h4 role='resultsTitle'>Results:</h4>
          <h5 role='fitScoreLabel'>Resume Fit Score:</h5>
          <div role='progressBar' id='progressBar'>
            <div role='progressLabel' id='progressLabel'>0%</div>
          </div>
          <h5 role='skillsTitle'>Matched Skills:</h5>
          <ul role='skillsList'>
            {skillsList.map((skill, index) => {
              return <li role='skillsListItem' key={index}>{skill}</li>
              }
            )}
          </ul>
          <h5 role='keywordsTitle'>Matched Keywords:</h5>
          <ul role='keywordsList'>
            {keywordsList.map((keyword, index) => {
              return <li role='keywordsListItem' key={index}>{keyword}</li>
              }
            )}
          </ul>
          <h5 role='suggestionsTitle'>Improvement Suggestions:</h5>
          <ul role='suggestionsList'>
            {improvementSuggestions.map((feedbackItem, index) => {
              return <li role='suggestionsListItem' key={index}>{feedbackItem}</li>
              }
            )}
          </ul>
        </div>
    </>
  );
};

export default Dashboard;
