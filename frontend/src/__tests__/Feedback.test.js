import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import user, { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';

import axios from 'axios'
jest.mock('axios');

window.alert = jest.fn();

//-----------------------------------------------------------------------------
// Task 25
//-----------------------------------------------------------------------------

// Test 1
it('Verify that all dashboard elements render correctly after update', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.', 'resume_text': 'This is the resume text'}, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 0,
                'skills': ['A'],
                'keywords': ['A'],
                'feedback': {
                    'skills': ['A'],
                    'experience': ['A'],
                    'formatting': ['A'] 
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getAllByRole('skillsItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('keywordsItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('skillSuggestionsListItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('experienceSuggestionsListItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('formattingSuggestionsListItem')[0]).toBeInTheDocument();
    });

    // Titles and labels
    expect(screen.getByRole('title')).toBeInTheDocument();

    // Job description form
    expect(screen.getByRole('descriptionForm')).toBeInTheDocument();
    expect(screen.getByRole('descriptionLabel')).toBeInTheDocument();
    expect(screen.getByRole('descriptionInput')).toBeInTheDocument();
    expect(screen.getByRole('descriptionCharacterLength')).toBeInTheDocument();
    expect(screen.getByRole('descriptionButton')).toBeInTheDocument();

    // Resume file form
    expect(screen.getByRole('fileForm')).toBeInTheDocument();
    expect(screen.getByRole('fileLabel')).toBeInTheDocument();
    expect(screen.getByRole('fileInput')).toBeInTheDocument();
    expect(screen.getByRole('fileButton')).toBeInTheDocument();

    // Feedback request button
    expect(screen.getByRole('feedbackButton')).toBeInTheDocument();

    // Feedback response
    expect(screen.getByRole('results')).toBeInTheDocument();
    expect(screen.getByRole('resultsTitle')).toBeInTheDocument();
    expect(screen.getByRole('fitScoreLabel')).toBeInTheDocument();

    expect(screen.getByRole('progressBar')).toBeInTheDocument();
    expect(screen.getByRole('progressLabel')).toBeInTheDocument();

    expect(screen.getByRole('skillsTitle')).toBeInTheDocument();
    expect(screen.getByRole('skills')).toBeInTheDocument();

    expect(screen.getByRole('keywordsTitle')).toBeInTheDocument();
    expect(screen.getByRole('keywords')).toBeInTheDocument();

    expect(screen.getByRole('suggestionsTitle')).toBeInTheDocument();
    expect(screen.getByRole('suggestionsList')).toBeInTheDocument();

    // Checkbox interface for suggestion filtering
    expect(screen.getByRole('skillsBoxLabel')).toBeInTheDocument();
    expect(screen.getByRole('experienceBoxLabel')).toBeInTheDocument();
    expect(screen.getByRole('formattingBoxLabel')).toBeInTheDocument();
    expect(screen.getByRole('skillsBox')).toBeInTheDocument();
    expect(screen.getByRole('experienceBox')).toBeInTheDocument();
    expect(screen.getByRole('formattingBox')).toBeInTheDocument();

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    // Download button
    expect(screen.getByRole('downloadButton')).toBeInTheDocument();

    // Feedback specific
    await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument();
    });
});

// Test 2
it('Verify variable fit score and dashboard elements - poor fit', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': 'This is the resume text'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 15,
                'skills': ['Skill0'],
                'keywords': ['Keyword0'],
                'feedback': {
                    'skills': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'],
                    'experience': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'],
                    'formatting': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'] 
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Progress bar
    await waitFor(() => {
        expect(screen.getByText('15%')).toBeInTheDocument();
    });

    const progressBar = screen.getByRole('progressBar');
    expect(progressBar).toBeInTheDocument();
    const styles = getComputedStyle(progressBar);
    expect(styles.backgroundColor).toBe('rgb(179, 0, 0)');

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    // Skills and Keywords
    expect(screen.queryAllByRole('skillsItem').length).toBe(1)
    expect(screen.queryAllByRole('keywordsItem').length).toBe(1)

    // Feedback lists
    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(4)
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(3)
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(2)
});

// Test 3
it('Verify variable fit score and dashboard elements - average fit', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': 'This is the resume text'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 65,
                'skills': ['Skill0', 'Skill1', 'Skill2'],
                'keywords': ['Keyword0', 'Keyword1', 'Keyword3', 'Keyword4'],
                'feedback': {
                    'skills': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'],
                    'experience': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'],
                    'formatting': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'] 
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Progress bar
    await waitFor(() => {
        expect(screen.getByText('65%')).toBeInTheDocument();
    });

    const progressBar = screen.getByRole('progressBar');
    expect(progressBar).toBeInTheDocument();
    const styles = getComputedStyle(progressBar);
    expect(styles.backgroundColor).toBe('rgb(179, 179, 0)');

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    // Skills and Keywords
    expect(screen.queryAllByRole('skillsItem').length).toBe(3)
    expect(screen.queryAllByRole('keywordsItem').length).toBe(4)

    // Feedback lists
    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(3)
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(2)
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(1)
});

// Test 4
it('Verify variable fit score and dashboard elements - good fit', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': 'This is the resume text'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 85,
                'skills': ['Skill1', 'Skill2', 'Skill3', 'Skill4', 'Skill5', 'Skill6', 'Skill7', 'Skill8'],
                'keywords': ['Keyword1', 'Keyword2', 'Keyword3', 'Keyword4', 'Keyword5', 'Keyword6'],
                'feedback': {
                    'skills': [],
                    'experience': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'],
                    'formatting': [] 
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Progress bar
    await waitFor(() => {
        expect(screen.getByText('85%')).toBeInTheDocument();
    });

    const progressBar = screen.getByRole('progressBar');
    expect(progressBar).toBeInTheDocument();
    const styles = getComputedStyle(progressBar);
    expect(styles.backgroundColor).toBe('rgb(89, 179, 0)');

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    // Skills and Keywords
    expect(screen.queryAllByRole('skillsItem').length).toBe(8);
    expect(screen.queryAllByRole('keywordsItem').length).toBe(6);

    // Feedback lists
    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(1);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(0);
});

// Test 5
it('Verify variable fit score and dashboard elements - as empty/weird', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': 'This is the resume text'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 0,
                'skills': [],
                'keywords': [''],
                'feedback': {
                    'skills': [],
                    'experience': [''],
                    'formatting': [] 
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Progress bar
    await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    const progressBar = screen.getByRole('progressBar');
    expect(progressBar).toBeInTheDocument();
    const styles = getComputedStyle(progressBar);
    expect(styles.backgroundColor).toBe('');

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    // Skills and Keywords
    expect(screen.queryAllByRole('skillsItem').length).toBe(1);
    expect(screen.queryAllByRole('keywordsItem').length).toBe(1);

    expect(screen.getByText('No matched skills')).toBeInTheDocument();
    expect(screen.getByText('No matched keywords')).toBeInTheDocument();

    // Feedback lists
    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(0);
    
    expect(screen.getByText('No suggestion items found')).toBeInTheDocument();
});

// Test 6
it('Test no matching highlights in display resume', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': 'Skill1 Keyword1 Random1 Skill2 Keyword2 Random2 Skill3 Keyword3 Random3'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 0,
                'skills': [],
                'keywords': [],
                'feedback': {
                    'skills': [],
                    'experience': [],
                    'formatting': [] 
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Skills and Keywords
    expect(screen.queryAllByRole('skillsItem').length).toBe(1);
    expect(screen.queryAllByRole('keywordsItem').length).toBe(1);

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    expect(screen.queryAllByRole('highlightedKeyword').length).toBe(0);
    expect(screen.queryAllByRole('highlightedKeyword').length).toBe(0);
});

// Test 7
it('Test matching skills highlight in display resume', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': 'Skill1 Keyword1 Random1 Skill2 Keyword2 Random2 Skill3 Keyword3 Random3'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 0,
                'skills': ['Skill1', 'Skill3'],
                'keywords': [],
                'feedback': {
                    'skills': [],
                    'experience': [],
                    'formatting': [] 
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Skills and Keywords
    expect(screen.queryAllByRole('skillsItem').length).toBe(2);
    expect(screen.queryAllByRole('keywordsItem').length).toBe(1);

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    expect(screen.queryAllByRole('highlightedSkill').length).toBe(2);
    expect(screen.queryAllByRole('highlightedKeyword').length).toBe(0);

    const skill = screen.queryAllByRole('highlightedSkill')[0];
    const styles = getComputedStyle(skill);
    expect(styles.backgroundColor).toBe('rgba(204, 153, 0, 0.33)');
});

// Test 8
it('Test matching keywords highlight in display resume', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': 'Skill1 Keyword1 Random1 Skill2 Keyword2 Random2 Skill3 Keyword3 Random3'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 0,
                'skills': [],
                'keywords': ['Keyword1', 'Keyword2', 'Keyword3'],
                'feedback': {
                    'skills': [],
                    'experience': [],
                    'formatting': [] 
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Skills and Keywords
    expect(screen.queryAllByRole('skillsItem').length).toBe(1);
    expect(screen.queryAllByRole('keywordsItem').length).toBe(3);

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    expect(screen.queryAllByRole('highlightedSkill').length).toBe(0);
    expect(screen.queryAllByRole('highlightedKeyword').length).toBe(3);

    const keyword = screen.queryAllByRole('highlightedKeyword')[0];
    const styles = getComputedStyle(keyword);
    expect(styles.backgroundColor).toBe('rgba(51, 51, 255, 0.33)');
});

// Test 9
it('Test matching both skills and keywords highlight in display resume', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': 'Skill1 Keyword1 Random1 Skill2 Keyword2 Random2 Skill3 Keyword3 Random3'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 0,
                'skills': ['Skill1', 'Skill2'],
                'keywords': ['Keyword2', 'Keyword3'],
                'feedback': {
                    'skills': [],
                    'experience': [],
                    'formatting': [] 
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Skills and Keywords
    expect(screen.queryAllByRole('skillsItem').length).toBe(2);
    expect(screen.queryAllByRole('keywordsItem').length).toBe(2);

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    expect(screen.queryAllByRole('highlightedSkill').length).toBe(2);
    expect(screen.queryAllByRole('highlightedKeyword').length).toBe(2);

    const skill = screen.queryAllByRole('highlightedSkill')[0];
    const skillStyles = getComputedStyle(skill);
    expect(skillStyles.backgroundColor).toBe('rgba(204, 153, 0, 0.33)');

    const keyword = screen.queryAllByRole('highlightedKeyword')[0];
    const keywordStyles = getComputedStyle(keyword);
    expect(keywordStyles.backgroundColor).toBe('rgba(51, 51, 255, 0.33)');
});

//-----------------------------------------------------------------------------
// Task 27
//-----------------------------------------------------------------------------

// Test 1
it('Verify that checkboxes and list elements display', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.', 'resume_text': 'This is the resume text'}, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 0,
                'skills': [],
                'keywords': [],
                'feedback': {
                    'skills': ['Add x', 'Remove y'],
                    'experience': ['Add z', 'Remove a'],
                    'formatting': ['Add b', 'Remove c']
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Get checkboxes
    const skillsBox = screen.getByRole('skillsBox')
    expect(skillsBox).toBeInTheDocument();
    
    const experienceBox = screen.getByRole('experienceBox')
    expect(experienceBox).toBeInTheDocument();
    
    const formattingBox = screen.getByRole('formattingBox')
    expect(formattingBox).toBeInTheDocument();

    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(2);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(2);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(2);

    expect(
        screen.queryAllByRole('skillSuggestionsListItem').length +
        screen.queryAllByRole('experienceSuggestionsListItem').length +
        screen.queryAllByRole('formattingSuggestionsListItem').length
    ).toBe(6);
});

// Test 2
it('Verify only checked checkboxes display list elements', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.', 'resume_text': 'This is the resume text'}, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 0,
                'skills': [],
                'keywords': [],
                'feedback': {
                    'skills': ['Add x'],
                    'experience': ['Add z', 'Remove a'],
                    'formatting': ['Add b', 'Remove c', 'Remove y']
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Get checkboxes
    const skillsBox = screen.getByRole('skillsBox')
    expect(skillsBox).toBeInTheDocument();
    
    const experienceBox = screen.getByRole('experienceBox')
    expect(experienceBox).toBeInTheDocument();
    
    const formattingBox = screen.getByRole('formattingBox')
    expect(formattingBox).toBeInTheDocument();

    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(1);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(2);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(3);

    expect(
        screen.queryAllByRole('skillSuggestionsListItem').length +
        screen.queryAllByRole('experienceSuggestionsListItem').length +
        screen.queryAllByRole('formattingSuggestionsListItem').length
    ).toBe(6);

    act( () => {
        fireEvent.click(skillsBox);
        fireEvent.click(experienceBox);
        fireEvent.click(formattingBox);
    });

    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(0);

    expect(
        screen.queryAllByRole('skillSuggestionsListItem').length +
        screen.queryAllByRole('experienceSuggestionsListItem').length +
        screen.queryAllByRole('formattingSuggestionsListItem').length
    ).toBe(0);
    
    expect(screen.getByText('No suggestion items found')).toBeInTheDocument();

    act( () => {
        fireEvent.click(skillsBox);
    });

    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(1);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(0);

    expect(
        screen.queryAllByRole('skillSuggestionsListItem').length +
        screen.queryAllByRole('experienceSuggestionsListItem').length +
        screen.queryAllByRole('formattingSuggestionsListItem').length
    ).toBe(1);

    act( () => {
        fireEvent.click(skillsBox);
        fireEvent.click(experienceBox);
    });

    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(2);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(0);

    expect(
        screen.queryAllByRole('skillSuggestionsListItem').length +
        screen.queryAllByRole('experienceSuggestionsListItem').length +
        screen.queryAllByRole('formattingSuggestionsListItem').length
    ).toBe(2);

    act( () => {
        fireEvent.click(experienceBox);
        fireEvent.click(formattingBox);
    });

    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(3);

    expect(
        screen.queryAllByRole('skillSuggestionsListItem').length +
        screen.queryAllByRole('experienceSuggestionsListItem').length +
        screen.queryAllByRole('formattingSuggestionsListItem').length
    ).toBe(3);
});

// Test 3
it('Verify checked checkboxes display list elements when possible, otherwise none', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.', 'resume_text': 'This is the resume text'}, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': 0,
                'skills': [],
                'keywords': [],
                'feedback': {
                    'skills': [],
                    'experience': [],
                    'formatting': ['Add x', 'Add z', 'Remove a', 'Add b', 'Remove c', 'Remove y']
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Get checkboxes
    const skillsBox = screen.getByRole('skillsBox')
    expect(skillsBox).toBeInTheDocument();
    
    const experienceBox = screen.getByRole('experienceBox')
    expect(experienceBox).toBeInTheDocument();
    
    const formattingBox = screen.getByRole('formattingBox')
    expect(formattingBox).toBeInTheDocument();

    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(6);

    expect(
        screen.queryAllByRole('skillSuggestionsListItem').length +
        screen.queryAllByRole('experienceSuggestionsListItem').length +
        screen.queryAllByRole('formattingSuggestionsListItem').length
    ).toBe(6);

    act( () => {
        fireEvent.click(skillsBox);
        fireEvent.click(experienceBox);
        fireEvent.click(formattingBox);
    });

    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(0);

    expect(
        screen.queryAllByRole('skillSuggestionsListItem').length +
        screen.queryAllByRole('experienceSuggestionsListItem').length +
        screen.queryAllByRole('formattingSuggestionsListItem').length
    ).toBe(0);
    
    expect(screen.getByText('No suggestion items found')).toBeInTheDocument();

    act( () => {
        fireEvent.click(skillsBox);
    });
    
    expect(screen.getByText('No suggestion items found')).toBeInTheDocument();

    act( () => {
        fireEvent.click(skillsBox);
        fireEvent.click(experienceBox);
    });
    
    expect(screen.getByText('No suggestion items found')).toBeInTheDocument();

    act( () => {
        fireEvent.click(skillsBox);
    });
    
    expect(screen.getByText('No suggestion items found')).toBeInTheDocument();

    act( () => {
        fireEvent.click(skillsBox);
        fireEvent.click(experienceBox);
        fireEvent.click(formattingBox);
    });

    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(6);

    expect(
        screen.queryAllByRole('skillSuggestionsListItem').length +
        screen.queryAllByRole('experienceSuggestionsListItem').length +
        screen.queryAllByRole('formattingSuggestionsListItem').length
    ).toBe(6);
});

//-----------------------------------------------------------------------------
// Task 28
//-----------------------------------------------------------------------------

/*
Component Tests:
- Test the rendering of the fit score visualization:
  - Input: A range of scores (e.g., 0%, 50%, 100%). (Done in tasks 13, 25)
  - Expected Output: Correct visualization for each score. (Done in tasks 13, 25)
- Test the feedback list:
  - Input: Various feedback arrays. (Done in tasks 13, 25, 27, 28)
  - Expected Output: All feedback items are rendered correctly. (Done in tasks 13, 25, 27)
- API Integration Tests:
  - Mock API calls to ensure the dashboard components correctly handle and display data. (Done in tasks 13, 25, 27, 28)
Filter Tests:
- Test filtering functionality: (Done in Task 27)
  - Input: Feedback array with multiple categories. (Done in Task 27)
  - Expected Output: Only feedback matching the selected filter is displayed. (Done in Task 27)
*/

// Test 1
it('Edge case - null data', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': '_'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'feedback': {
                'fit_score': null,
                'skills': null,
                'keywords': null,
                'feedback': {
                    'skills': null,
                    'experience': null,
                    'formatting': null
                }
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    // Progress bar
    await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    const progressBar = screen.getByRole('progressBar');
    expect(progressBar).toBeInTheDocument();
    const styles = getComputedStyle(progressBar);
    expect(styles.backgroundColor).toBe('');

    // Display resume
    expect(screen.getByRole('displayResume')).toBeInTheDocument();

    // Skills and Keywords
    expect(screen.queryAllByRole('skillsItem').length).toBe(1);
    expect(screen.queryAllByRole('keywordsItem').length).toBe(1);

    expect(screen.getByText('No matched skills')).toBeInTheDocument();
    expect(screen.getByText('No matched keywords')).toBeInTheDocument();

    // Feedback lists
    expect(screen.queryAllByRole('skillSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('experienceSuggestionsListItem').length).toBe(0);
    expect(screen.queryAllByRole('formattingSuggestionsListItem').length).toBe(0);
    
    expect(screen.getByText('No suggestion items found')).toBeInTheDocument();
});

// Test 2
it('Edge case - malformed json responses - resume - null text', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.'//,
        //'resume_text': '_' Resume response missing resume_text field
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).toHaveBeenCalled();
});

// Test 3
it('Edge case - malformed json responses - resume - missing data', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    jest.resetAllMocks()
    
    axios.post.mockResolvedValue({'status': 'success'}); // Json missing data response

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).toHaveBeenCalled();
});

// Test 4
it('Edge case - malformed json responses - feedback', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/pdf' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;

    // Create a description to submit
    var description = "This is the job description";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Resume uploaded successfully.',
        'resume_text': '_'
    }, 'status': 'success'});

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
        expect(screen.getByText('Resume Text Received')).toBeInTheDocument();
    });

    jest.resetAllMocks()
    axios.post.mockResolvedValue({'data': {'message': 'Job description submitted successfully.'}, 'status': 'success'});

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).not.toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })
    
    jest.resetAllMocks()
    axios.post.mockResolvedValue({
        'data': {
            'ERROR': {
                'fit_score': null,
                'skills': null,
                'keywords': null
            }
        },
        'status': 'success'
    });

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(window.alert).toHaveBeenCalled();
});