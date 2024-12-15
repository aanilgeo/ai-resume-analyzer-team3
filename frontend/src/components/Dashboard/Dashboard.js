import { useState } from 'react';
import axios from 'axios';
import '../../stylesheets/Navbar.css'
import '../../stylesheets/Dashboard.css'
import Navbar from '../Navbar';

// For advanced user interface enhancements
import { Markup } from 'interweave';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling

import jsPDF from 'jspdf';

const Dashboard = () => {
  const [jobDescription, setDescription] = useState('');
  const [resumeFile, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedDescription, setSubmittedDescription] = useState(false);
  const [submittedResume, setSubmittedResume] = useState(false);

  // Feedback state variables
  const [fitScore, setFitScore] = useState(0);
  const [skills, setSkills] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [skillsFeedback, setSkillsFeedback] = useState([]);
  const [experienceFeedback, setExperienceFeedback] = useState([]);
  const [formattingFeedback, setFormattingFeedback] = useState([]);
  const [resumeText, setResumeText] = useState('');

  // Feedback display variables
  const [displaySkills, setDisplaySkills] = useState(true);
  const [displayExperience, setDisplayExperience] = useState(true);
  const [displayFormatting, setDisplayFormatting] = useState(true);

  var jobDescriptionLength = jobDescription.length;

  // Handle job description uploads
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jobDescription === '') {
      alert('Please fill out the job description, job description cannot be empty');
    }
    else if (jobDescription.length > 10000) {
      alert('Job description cannot exceed 10000 characters');
    }
    else {
      setLoading(true);
      try {
        await axios.post('http://127.0.0.1:8000/api/job-description', {
          'job_description': jobDescription
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then( () => {
          setSubmittedDescription(true);
        });
      } catch (error) {
        alert(`There was a problem reaching the server, please try again later\nError Response: ${error?.response?.data?.detail || 'Unknown'}`);
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
      setLoading(true);
      try {
        await axios.post('http://127.0.0.1:8000/api/resume-upload', {
          'resume_file': resumeFile
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then( response => {
          setSubmittedResume(true);
          setResumeText(response.data.resume_text);
        });
      } catch (error) {
        alert(`There was a problem reaching the server, please try again later\nError Response: ${error?.response?.data?.detail || 'Unknown'}`);
      }
    }
    setLoading(false);
  };

  // For double-checking logic on description entry
  function changeDescription(e) {
    setSubmittedDescription(false)
    document.getElementById('feedback').classList.add('hidden');
    if (jobDescription.length > 10000) {
      alert('Job description cannot exceed 10000 characters');
    }
    else {
      setDescription(e)
    }
  };

  // For double-checking logic on file upload
  function changeFile(e) {
    setSubmittedResume(false)
    document.getElementById('feedback').classList.add('hidden');
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
  function setProgress(progress) {
    setFitScore(progress)
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

  function getHighlightedResume() {
    if (resumeText) {
      var highlightedResume = resumeText;
      skills.forEach( skill => {
        const pattern = skill;
        const re = new RegExp(pattern, 'gi');
        highlightedResume = highlightedResume.replace(re, (x) => `<b role='highlightedSkill' style='background-color:rgba(204, 153, 0, 0.33);'>${x}</b>`);
      })
      keywords.forEach( keyword => {
        const pattern = keyword;
        const re = new RegExp(pattern, 'gi');
        highlightedResume = highlightedResume.replace(re, (x) => `<b role='highlightedKeyword' style='background-color:rgba(51, 51, 255, 0.33);'>${x}</b>`);
      })
      highlightedResume.replace('\n', '<br/>')
      return <Markup role='highlightedResume' content={highlightedResume} allowAttributes='true'/>;
    }
  }

  // Gets feedback from backend analyzer
  async function getFeedback()  {
    if (submittedDescription && submittedResume && resumeText && jobDescription) {
      setLoading(true)
      var d = {
        'resume_text': resumeText,
        'job_description': jobDescription
      }
      try {
        await axios.post('http://127.0.0.1:8000/api/fit-score', d, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then( response => {
          // Set state variables assuming properly formed json response where possible

          if (response.data.feedback.fit_score) {
            setProgress(response.data.feedback.fit_score);
          } else {
            setProgress(0);
          }

          if (response.data.feedback.skills?.filter(Boolean).length) {
            setSkills(response.data.feedback.skills.filter(Boolean));
          } else {
            setSkills(['No matched skills']);
          }
          if (response.data.feedback.keywords?.filter(Boolean).length) {
            setKeywords(response.data.feedback.keywords.filter(Boolean));
          } else {
            setKeywords(['No matched keywords']);
          }

          if (response.data.feedback.feedback) {
            setSkillsFeedback(response.data.feedback.feedback.skills?.filter(Boolean) || []);
            setExperienceFeedback(response.data.feedback.feedback.experience?.filter(Boolean) || []);
            setFormattingFeedback(response.data.feedback.feedback.formatting?.filter(Boolean) || []);
          }
        });

        // Unhide results area
        document.getElementById('feedback').classList.remove('hidden');
      } catch (error) {
        alert(`There was a problem reaching the server, please try again later\nError Response: ${error?.response?.data?.detail || 'Uknown'}`);
      }
      setLoading(false)
    } else {
      alert('Please ensure job description and resume are submitted, otherwise, your job description or resume might be empty. Please try again.')
    }
  };

  // Helper function for downloadReport()
  const addTextWithOverflow = (doc, text, x, y, maxWidth, lineHeight, margin) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const lines = doc.splitTextToSize(text, maxWidth);

    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin; // Reset y to margin on new page
      }
      doc.text(line, x, y);
      y += lineHeight;
    });

    return y; // Return the updated y position
  };

  const downloadReport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const lineHeight = 10;
      const maxWidth = pageWidth - 2 * margin; // Maximum text width
      let y = margin;

      // Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(24);
      y = addTextWithOverflow(doc, 'Resume Analysis Report', margin, y, maxWidth, lineHeight, margin);

      // Fit Score
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(16);
      y = addTextWithOverflow(doc, `Fit Score: ${fitScore}`, margin, y, maxWidth, lineHeight, margin);

      // Keywords Section
      doc.setFont('Helvetica', 'bold');
      y = addTextWithOverflow(doc, 'Matched Keywords:', margin, y, maxWidth, lineHeight, margin);
      doc.setFont('Helvetica', 'normal');
      keywords.forEach((keyword) => {
        y = addTextWithOverflow(doc, `- ${keyword}`, margin + 10, y, maxWidth - 10, lineHeight, margin);
      });

      // Skills Feedback
      doc.setFont('Helvetica', 'bold');
      y = addTextWithOverflow(doc, 'Skills:', margin, y, maxWidth, lineHeight, margin);
      doc.setFont('Helvetica', 'normal');
      skillsFeedback.forEach((item) => {
        y = addTextWithOverflow(doc, `- ${item}`, margin + 10, y, maxWidth - 10, lineHeight, margin);
      });

      // Experience Feedback
      doc.setFont('Helvetica', 'bold');
      y = addTextWithOverflow(doc, 'Experience:', margin, y, maxWidth, lineHeight, margin);
      doc.setFont('Helvetica', 'normal');
      experienceFeedback.forEach((item) => {
        y = addTextWithOverflow(doc, `- ${item}`, margin + 10, y, maxWidth - 10, lineHeight, margin);
      });

      // Formatting Feedback
      doc.setFont('Helvetica', 'bold');
      y = addTextWithOverflow(doc, 'Formatting:', margin, y, maxWidth, lineHeight, margin);
      doc.setFont('Helvetica', 'normal');
      formattingFeedback.forEach((item) => {
        y = addTextWithOverflow(doc, `- ${item}`, margin + 10, y, maxWidth - 10, lineHeight, margin);
      });

      // Save PDF
      doc.save('Resume_Analysis_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Tippy for tooltips on suggestionlists
  new tippy('#skillSuggestionsListItem',{
    animation:'scale',
    arrow:'true'
  });
  new tippy('#experienceSuggestionListItem',{
    animation:'scale',
    arrow:'true'
  });
  new tippy('#formattingSuggestionListItem',{
    animation:'scale',
    arrow:'true'
  });

  return (
    <>
      <Navbar activeTab='dashboard'/>
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
      <div id='hp'>
        <h2 role='title'>Dashboard:</h2>
        <div className='dashboardForm'>
          <form role='descriptionForm' onSubmit={handleSubmit}>
            <h5 role='descriptionLabel'>Job Description: {submittedDescription && '✅'}</h5>
            <div>
              <textarea
                title='Job Description Submission'
                id='descriptionUpload'
                role='descriptionInput'
                placeholder='Input the details of the job here...'
                value={jobDescription}
                onChange={(e) => changeDescription(e.target.value)}
                rows='6'
                maxLength={10000}
                required
              />
              <div id='descriptionCharacterLength' role='descriptionCharacterLength'>
              {
                jobDescriptionLength > 7500 ? 
                <>
                  {
                    jobDescriptionLength >= 10000 ?
                    <>
                      (10000 / 10000 max.) 🛑
                    </>
                    :
                    <>
                      ({jobDescriptionLength} / 10000 max.) ⚠
                    </>
                  }
                </>
                :
                <>
                  ({jobDescriptionLength} / 10000 max.)
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
                onChange={(e) => changeFile(e)}
                required
              />
            </div>
            { resumeText && <>
            <br/>
            <div role='resumeTextAlert'>
              Resume Text Received
            </div>
            </>}
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
        </div>
        {(submittedDescription && submittedResume) &&
          <button 
            type='submit'
            role='feedbackButton'
            className='feedbackButton'
            onClick={getFeedback}
            >
            Get Feedback
          </button>
        }
        <br/>
          <div role='results' id='feedback' className='hidden'>
            <h4 role='resultsTitle'>Results:</h4>
            <h5 role='fitScoreLabel'>Fit Score:</h5>
            <div id='progressBackground'>
              <div role='progressBar' id='progressBar'>
                <div role='progressLabel' id='progressLabel'>0%</div>
              </div>
            </div>
            <div id='cols'>
              <div className='col'>
              <h5 role='skillsTitle'>Matched Skills:</h5>
              <ul role='skills'>
                {skills.map((item, index) => {
                  return <li role='skillsItem' key={index}>{item}</li>
                  }
                )}
              </ul>
              </div>
              <div className='col'>
              <h5 role='keywordsTitle'>Matched Keywords:</h5>
              <ul role='keywords'>
                {keywords.map((item, index) => {
                  return <li role='keywordsItem' key={index}>{item}</li>
                  }
                )}
              </ul>
              </div>
            </div>
            <h5 role='suggestionsTitle'>Improvement Suggestions:</h5>
            <form className='checkboxes'>
              <input role='skillsBox' id='skillsBox' type='checkBox' defaultChecked='true' onClick={_ => setDisplaySkills(!displaySkills)}></input>
              <label role='skillsBoxLabel'>Skills</label>
              <input role='experienceBox' id='experienceBox' type='checkBox' defaultChecked='true' onClick={_ => setDisplayExperience(!displayExperience)}></input>
              <label role='experienceBoxLabel'>Experience</label>
              <input role='formattingBox' id='formattingBox' type='checkBox' defaultChecked='true' onClick={_ => setDisplayFormatting(!displayFormatting)}></input>
              <label role='formattingBoxLabel'>Formatting</label>
            </form>
            {((displaySkills && skillsFeedback.length)
              || 
              (displayExperience && experienceFeedback.length)
              || 
              (displayFormatting && formattingFeedback.length)) ?
              <ul role='suggestionsList' className='suggestionsList tooltip'>
              { displaySkills && <>
                {skillsFeedback.map((item, index) => {
                  return <li role='skillSuggestionsListItem' id='skillSuggestionsListItem' title='This is a skill suggestion' key={index}>{item}</li>
                  }
                )}
              </> }
              { displayExperience && <>
                {experienceFeedback.map((item, index) => {
                  return <li role='experienceSuggestionsListItem' id='experienceSuggestionsListItem' title='This is an experience suggestion' key={index}>{item}</li>
                  }
                )}
              </> }
              { displayFormatting && <>
                {formattingFeedback.map((item, index) => {
                  return <li role='formattingSuggestionsListItem' id='formattingSuggestionsListItem' title='This is a formatting suggestion' key={index}>{item}</li>
                  }
                )}
              </> }
              </ul>
              :
              <ul role='suggestionsList' className='suggestionsList'>
                <li role='suggestionListEmpty'>
                  No suggestion items found
                </li>
              </ul>
            }
            <h5 role='highlightedResumeTitle'>Textual Resume With Matched {
              <b style={{backgroundColor: '#cc990055', role: 'skillMatch'}}>Skills</b>
              } and {
              <b style={{backgroundColor: '#3333ff55', role: 'keywordMatch'}}>Keywords</b>
              }:
            </h5>
            <p role='displayResume' id='displayResume'>
              {getHighlightedResume()}
            </p>
            <button className='downloadButton' role='downloadButton' onClick={() => downloadReport()}> Download Results as PDF </button>
          </div>
        </div>
    </>
  );
};

export default Dashboard;