import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import user, { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';

import axios from 'axios'
jest.mock('axios');
axios.post.mockResolvedValue({'message': 'Successful response'});

window.alert = jest.fn();

//-----------------------------------------------------------------------------
// Task 9
//-----------------------------------------------------------------------------

// Test 1
it('File input validation - valid file, success', async () => {
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

    const input = screen.getByRole('fileInput');
    const form = screen.getByRole('fileForm');

    await user.upload(input, file);
    
    act(() => {
        fireEvent.submit(form);
    });

    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });
});

// Test 2
it('File input validation - valid file, failure', async () => {
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

    const input = screen.getByRole('fileInput');
    const form = screen.getByRole('fileForm');

    await user.upload(input, file);
    
    act(() => {
        fireEvent.submit(form);
    });
    
    axios.post.mockRejectedValueOnce();

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalled();
    });
});

// Test 3
it('File input validation - no file selected', async () => {
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
    
    const input = screen.getByRole('fileInput');
    const form = screen.getByRole('fileForm');

    //await user.upload(input, file);
    
    act(() => {
        fireEvent.submit(form);
    });

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });
});

// Test 4
it('File input validation - empty file', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var file = null;
    
    const input = screen.getByRole('fileInput');
    const form = screen.getByRole('fileForm');

    await user.upload(input, file);
    
    act(() => {
        fireEvent.submit(form);
    });

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });
});

// Test 5
it('File input validation - wrong file type', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/unknown' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;
    
    const input = screen.getByRole('fileInput');
    const form = screen.getByRole('fileForm');

    await user.upload(input, file);
    
    act(() => {
        fireEvent.submit(form);
    });

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });
});

// Test 6
it('File input validation - file too large', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var blob = new Blob([''], { type: 'application/unknown' });
    blob['lastModifiedDate'] = '11.26.2024';
    blob['name'] = 'resume.pdf';
    var file = blob;
    Object.defineProperty(file, 'size', { value: 20000001 })
    
    const input = screen.getByRole('fileInput');
    const form = screen.getByRole('fileForm');

    await user.upload(input, file);
    
    act(() => {
        fireEvent.submit(form);
    });

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });
});

// Test 7
it('Description input validation - under limit', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var description = 'This is a normal job description';

    const input = screen.getByRole('descriptionInput');
    const form = screen.getByRole('descriptionForm');
    
    act(() => {
        fireEvent.change(input, { target: { value: description } });
        fireEvent.submit(form);
    });

    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });
});

// Test 8
it('File input validation - valid file, failure', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a description to submit
    var description = 'This is a normal job description';

    const input = screen.getByRole('descriptionInput');
    const form = screen.getByRole('descriptionForm');
    
    act(() => {
        fireEvent.change(input, { target: { value: description } });
        fireEvent.submit(form);
    });
    
    axios.post.mockRejectedValueOnce();

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });
});

// Test 9
it('Description input validation - empty', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a description to submit
    var description = '';

    const input = screen.getByRole('descriptionInput');
    const form = screen.getByRole('descriptionForm');
    
    act(() => {
        fireEvent.change(input, { target: { value: description } });
        fireEvent.submit(form);
    });

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });
});

// Test 10
it('Description input validation - at limit', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a description to submit
    var description = new Array(5000 + 1).join('A');;

    const input = screen.getByRole('descriptionInput');
    const form = screen.getByRole('descriptionForm');
    
    act(() => {
        fireEvent.change(input, { target: { value: description } });
        fireEvent.submit(form);
    });

    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });
});

// Test 11
it('Description input validation - above limit', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    // Create a file to submit
    var description = new Array(10000 + 1).join('A');;

    const input = screen.getByRole('descriptionInput');
    const form = screen.getByRole('descriptionForm');
    
    act(() => {
        fireEvent.change(input, { target: { value: description } });
        fireEvent.submit(form);
    });

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });
});

//-----------------------------------------------------------------------------
// Task 13
//-----------------------------------------------------------------------------

// Test 1
it('Verify that all dashboard elements render correctly - baseline', async () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    await waitFor(() => {
        // Titles and labels
        expect(screen.getByRole('title')).toBeInTheDocument();
        expect(screen.getByRole('titleMessage')).toBeInTheDocument();

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
    });
});

// Test 2
it('Verify that all dashboard elements render correctly - post feedback - poor fit', async () => {
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
    var description = "This is the job description (expected poor fit)";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
    })

    jest.resetAllMocks()

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(screen.getAllByRole('skillsListItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('keywordsListItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('suggestionsListItem')[0]).toBeInTheDocument();
    });

    // Titles and labels
    expect(screen.getByRole('title')).toBeInTheDocument();
    expect(screen.getByRole('titleMessage')).toBeInTheDocument();

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
    expect(screen.getByRole('skillsList')).toBeInTheDocument();

    expect(screen.getByRole('keywordsTitle')).toBeInTheDocument();
    expect(screen.getByRole('keywordsList')).toBeInTheDocument();

    expect(screen.getByRole('suggestionsTitle')).toBeInTheDocument();
    expect(screen.getByRole('suggestionsList')).toBeInTheDocument();

    // Feedback specific
    await waitFor(() => {
        expect(screen.getByText('15%')).toBeInTheDocument();
    });
    expect(screen.getAllByRole('skillsListItem').length).toBe(1)
    expect(screen.getAllByRole('keywordsListItem').length).toBe(1)
    expect(screen.getAllByRole('suggestionsListItem').length).toBe(4)
});

// Test 3
it('Verify that all dashboard elements render correctly - post feedback - average fit', async () => {
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
    var description = "This is the job description (expected average fit)";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
    })

    jest.resetAllMocks()

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(screen.getAllByRole('skillsListItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('keywordsListItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('suggestionsListItem')[0]).toBeInTheDocument();
    });

    // Titles and labels
    expect(screen.getByRole('title')).toBeInTheDocument();
    expect(screen.getByRole('titleMessage')).toBeInTheDocument();

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
    expect(screen.getByRole('skillsList')).toBeInTheDocument();

    expect(screen.getByRole('keywordsTitle')).toBeInTheDocument();
    expect(screen.getByRole('keywordsList')).toBeInTheDocument();

    expect(screen.getByRole('suggestionsTitle')).toBeInTheDocument();
    expect(screen.getByRole('suggestionsList')).toBeInTheDocument();

    // Feedback specific
    await waitFor(() => {
        expect(screen.getByText('65%')).toBeInTheDocument();
    });
    expect(screen.getAllByRole('skillsListItem').length).toBe(3)
    expect(screen.getAllByRole('keywordsListItem').length).toBe(4)
    expect(screen.getAllByRole('suggestionsListItem').length).toBe(2)
});

// Test 4
it('Verify that all dashboard elements render correctly - post feedback - good fit', async () => {
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
    var description = "This is the job description (expected good fit)";

    const fileInput = screen.getByRole('fileInput');
    const fileForm = screen.getByRole('fileForm');

    const descriptionInput = screen.getByRole('descriptionInput');
    const descriptionForm = screen.getByRole('descriptionForm');

    await user.upload(fileInput, file);
    
    act(() => {
        fireEvent.submit(fileForm);
    });

    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(screen.getByText('Resume Upload: ✅')).toBeInTheDocument();
    })

    jest.resetAllMocks()

    act(() => {
        fireEvent.change(descriptionInput, { target: { value: description } });
        fireEvent.submit(descriptionForm);
    });

    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(screen.getByText('Job Description: ✅')).toBeInTheDocument();
    })

    act( () => {
        fireEvent.click(screen.getByRole('feedbackButton'));
    });

    await waitFor(() => {
        expect(screen.getAllByRole('skillsListItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('keywordsListItem')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('suggestionsListItem')[0]).toBeInTheDocument();
    });

    // Titles and labels
    expect(screen.getByRole('title')).toBeInTheDocument();
    expect(screen.getByRole('titleMessage')).toBeInTheDocument();

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
    expect(screen.getByRole('skillsList')).toBeInTheDocument();

    expect(screen.getByRole('keywordsTitle')).toBeInTheDocument();
    expect(screen.getByRole('keywordsList')).toBeInTheDocument();

    expect(screen.getByRole('suggestionsTitle')).toBeInTheDocument();
    expect(screen.getByRole('suggestionsList')).toBeInTheDocument();

    // Feedback specific
    await waitFor(() => {
        expect(screen.getByText('85%')).toBeInTheDocument();
    });
    expect(screen.getAllByRole('skillsListItem').length).toBe(4)
    expect(screen.getAllByRole('keywordsListItem').length).toBe(5)
    expect(screen.getAllByRole('suggestionsListItem').length).toBe(1)
});

//-----------------------------------------------------------------------------
// Task 15
//-----------------------------------------------------------------------------

// Test 1
it('Test that the loading spinner appears during API requests', async () => {
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

    const input = screen.getByRole('fileInput');
    const form = screen.getByRole('fileForm');

    await user.upload(input, file);

    act(() => {
        fireEvent.submit(form);
    });

    expect(screen.getByRole('loadingSpinner')).toBeInTheDocument();
  
    await waitFor(() => {
        expect(window.alert).not.toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    });

    expect(screen.queryByRole('loadingSpinner')).not.toBeInTheDocument();
});