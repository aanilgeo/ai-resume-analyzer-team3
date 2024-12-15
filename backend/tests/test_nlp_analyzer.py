import pytest
from backend.utils.nlp_analyzer import calculate_fit_score


def test_inputs_varying_length_complexity():
    resume_text = "Experienced software engineer with Python and Java skills. Working knowledge of AWS and REST APIs."
    job_description = "Looking for a software engineer with experience in Python, AWS, and REST APIs. Java is a plus."

    #Fit score should be 100 since all keywords match
    #OpenAI Fit Score (Task 18-20)= 100
    fit_score = calculate_fit_score(resume_text, job_description)
    assert fit_score == 100

    resume_text = "Experienced software engineer with Python and Java skills."

    # Fit score should be 65
    #OpenAI Fit Score (Task 18-20)= 66
    """
    Case 4:
    Fit Score = (2/4) * 0.7 + (1/1) * 0.3 = 65
    """
    fit_score = calculate_fit_score(resume_text, job_description)
    assert fit_score == 65
    
def test_fit_score_decreases_with_less_matches():
    resume_text_high_fit_score = "Experienced software engineer with Python and Java skills. Working knowledge of AWS and REST APIs."
    resume_text_low_fit_score = "Experienced software engineer with Python and AWS skills."

    job_description = "Looking for a software engineer with experience in Python, AWS, and REST APIs. Java is a plus."
    high_fit_score = calculate_fit_score(resume_text_high_fit_score, job_description)
    low_fit_score = calculate_fit_score(resume_text_low_fit_score, job_description)
    
    assert low_fit_score < high_fit_score
    assert high_fit_score == 100
    
    # Fit score should be 52
    #OpenAI Fit Score (Task 18-20)= 75 (Doesn't take required vs preferred keyword weighting into consideration)
    """
    Case 4:
    Fit Score = (3/4) * 0.7 + (0/1) * 0.3 = 52
    """
    assert low_fit_score == 52

def test_empty_inputs():
    resume_text = "Experienced software engineer with Python skills. Working knowledge of AWS and REST APIs."
    job_description = "Looking for a software engineer with experience in Python, AWS, and REST APIs. Java is a plus."
    assert calculate_fit_score("", "") == 0
    assert calculate_fit_score(resume_text, "") == 0
    assert calculate_fit_score("", job_description) == 0

def test_non_string_inputs():
    job_description = "Looking for a software engineer with experience in Python, AWS, and REST APIs. Java is a plus."

    assert calculate_fit_score(1, job_description) == 0
    assert calculate_fit_score(["test"], job_description) == 0
    assert calculate_fit_score(None, job_description) == 0

def test_partial_and_full_matches():
    resume_text_full = "Experienced software engineer with Python and Java skills. Working knowledge of AWS and REST APIs."
    resume_text_partial = "Experienced software engineer with Python skills."
    job_description = "Looking for a software engineer with experience in Python, AWS, and REST APIs. Java is a plus."

    full_fit_score = calculate_fit_score(resume_text_full, job_description)
    partial_fit_score = calculate_fit_score(resume_text_partial, job_description)
    
    assert full_fit_score > partial_fit_score
    assert full_fit_score == 100
    # Fit score should be 35
    #OpenAI Fit Score (Task 18-20)= 50 (Doesn't take required vs preferred keyword weighting into consideration)
    """
    Case 4:
    Fit Score = (2/4) * 0.7 + (0/1) * 0.3 = 35
    """
    assert partial_fit_score == 35

    # Actual resume parsed text fit score test 
    resume_text = "Your Name First.lastname@selu.edu • 985-555-1234 • City, State Zip Code EDUCATION Southeastern Louisiana University, Hammond, LA Bachelor of Science,Biological Sciences, GPA: 3.1, May 2025 WORK EXPERIENCE Dining Room Attendant,August 2020–March 2021 SLU Food Services, Hammond, LA ● Maintained clean and safeenvironment for dining hall serving 1,000+ patrons daily ● Communicated with studentsand staff to resolve issues and ensure quality experience ● Completed the Student ManagerTraining Program within the first month of work Babysitter, August 2019–June 2020Self-Employed, Covington, LA ● Ensured the safety, health, and welfare of 2 children,ages 3 and 8, every day after school ● Organized safe, fun, and educational activitiessuch as visits to the park and crafts ● Supported learning by explaining homework andworking through problems together LEADERSHIP EXPERIENCE Student Athlete, Your Role/Position,August 2020–Present Volleyball Team, Southeastern Louisiana University ● Selected as 1of # team members after completing a 20-hour intensive training period ● Participatedin # philanthropy events yearly to represent the University ● Dedicated # hours per weekto training and competition while balancing # academic hours Volleyball Representative,August 2021–May 2022 Student-Athlete Advisory Committee, Southeastern Louisiana University● Attended weekly Committee meetings, representing the women's volleyball team fairly ●Advocated for concerns and interests of student-athletes at Southeastern ● Served as aleader to implement resolutions voted on by the board each year Parks and Recreation,Summer 2020–2022 Basketball Camp Coach/Coordinator, Hammond, LA ● Instructed 60-70 1st– 9th grade athletes on proper athletic SKILLS development ● Created interactive sessionsto engage youth and practice safe techniques and strategies ● Collaborated with 4 othercoaches in a team environment ● Monitored and evaluated drills and activities andimplemented proper safety measures ● Maintained positive communication with campers andparents CERTIFICATIONS & SKILLS ● CPR & First Aid Certified ● Proficient in Microsoft Word;basic knowledge of Microsoft PowerPoint and Excel"
    job_description = "Looking for software engineer that has Microsoft Word and Microsoft Powerpoint skills. Excel is a plus."
    # Fit score should be 77
    """
    Case 4:
    Fit Score = (2/3) * 0.7 + (1/1) * 0.3 = 76.67 = 77
    """
    fit_score = calculate_fit_score(resume_text, job_description)
    assert fit_score == 77

    job_description = "Looking for someone that has Microsoft Word and Microsoft Powerpoint skills. Excel is a plus."
    fit_score = calculate_fit_score(resume_text, job_description)    
    # Fit score should be 100 since all job description keywords (required vs preferred match) are in resume text.
    """
    Case 4:
    Fit Score = (3/3) * 0.7 + (1/1) * 0.3 = 100 = 100
    """
    fit_score = calculate_fit_score(resume_text, job_description)
    assert fit_score == 100   

def test_non_alphanumeric_inputs():
    resume_text = "$@"
    job_description = "Looking for a software engineer with experience in Python, AWS, and REST APIs. Java is a plus."
    
    fit_score = calculate_fit_score(resume_text, job_description)

    assert fit_score == 0

def test_case_2_fit_score():
    resume_text = "Experienced software engineer with REST APIs knowledge."
    job_description = "Looking for a software engineer with experience in Python, AWS, and REST APIs."
    
    fit_score = calculate_fit_score(resume_text, job_description)
    # Fit score should be 50
    """
    Case 2:
    Fit Score = (2/4) * 1
    """
    assert fit_score == 50

def test_case_3_fit_score():
    resume_text = "Experienced individual with REST APIs knowledge."
    job_description = "Looking for someone. Experience in Python, AWS, and REST APIs is a bonus."
    
    fit_score = calculate_fit_score(resume_text, job_description)
    # Fit score should be 33
    """
    Case 3:
    Fit Score = (1/3) * 1
    """
    assert fit_score == 33