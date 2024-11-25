import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../components/Auth/Register';
import axios from 'axios';

jest.mock('axios'); // Mock axios globally
const mockNavigate = jest.fn(); // Mock function 
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate, // Replace useNavigate with the mock function
}));

test('displays a success message and a "Go Home" button when a user registers successfully', async () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Register />
        </MemoryRouter>
    );
    axios.post.mockResolvedValue(); // Mock successful API response

    // input email, username, password, confirm password
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, { value: 'valid@email.com' });

    const usernameInput = screen.getByLabelText('Username:');
    fireEvent.change(usernameInput, { value: 'validUsername' });

    const passwordInput = screen.getByLabelText('Password:');
    fireEvent.change(passwordInput, { value: 'validPassword' });

    const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
    fireEvent.change(confirmPasswordInput, { value: 'validPassword' });

    const registerButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(registerButton); // Press Register button

    // Assert display of success message
    const successMessage = await screen.findByText(/Registration successful!/i);
    expect(successMessage).toBeInTheDocument();

    // Assert display of 'Go Home' button
    const goHomeButton = await screen.findByRole('button', { name: /Go Home/i });
    expect(goHomeButton).toBeInTheDocument();
});


test("display error message when user's passwords do not match", async () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Register />
        </MemoryRouter>
    );

    // input email, username, password, confirm password
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, {
        target: { value: 'valid@example.com' },
    });

    const usernameInput = screen.getByLabelText('Username:');
    fireEvent.change(usernameInput, {
        target: { value: 'validUsername' }
    });

    const passwordInput = screen.getByLabelText('Password:');
    fireEvent.change(passwordInput, {
        target: { value: 'password' }
    });

    const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
    fireEvent.change(confirmPasswordInput, {
        target: { value: 'diffPassword' }
    });

    const registerButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(registerButton); // Press Register button

    // Assert that error message is displayed
    const errorMessage = await screen.findByText(/Passwords do not match/i);
    expect(errorMessage).toBeInTheDocument();
});

test('displays error message on failed registration', async () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Register />
        </MemoryRouter>
    )

    axios.post.mockRejectedValue(new Error('Request failed'));

    // input email, username, password, confirm password
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, {
        target: { value: 'valid@example.com' },
    });

    const usernameInput = screen.getByLabelText('Username:');
    fireEvent.change(usernameInput, {
        target: { value: 'username' }
    });

    const passwordInput = screen.getByLabelText('Password:');
    fireEvent.change(passwordInput, {
        target: { value: 'password' }
    });

    const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
    fireEvent.change(confirmPasswordInput, {
        target: { value: 'password' }
    });

    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton); // Click Register button

    // Assert that error message is displayed
    const errorMessage = await screen.findByText('Failed to register. Please try again.');
    expect(errorMessage).toBeInTheDocument();
})

test('redirects to homepage when "Go Home" button is clicked after successful registration', async () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Register />
        </MemoryRouter>
    )

    axios.post.mockResolvedValue();

    // input email, username, password, confirm password
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, {
        target: { value: 'valid@example.com' },
    });

    const usernameInput = screen.getByLabelText('Username:');
    fireEvent.change(usernameInput, {
        target: { value: 'validUsername' }
    });

    const passwordInput = screen.getByLabelText('Password:');
    fireEvent.change(passwordInput, {
        target: { value: 'validPassword' }
    });

    const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
    fireEvent.change(confirmPasswordInput, {
        target: { value: 'validPassword' }
    });

    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton); // Click Register button

    const successMessage = await screen.findByText(/Registration successful!/i);
    expect(successMessage).toBeInTheDocument();

    const goHomeButton = await screen.findByRole('button', { name: 'Go Home' });
    fireEvent.click(goHomeButton); // Click 'Go Home' button

    // Assert that navigation was triggered
    expect(mockNavigate).toHaveBeenCalledWith('/');
})

test('displays specific error message when registering with duplicate email', async () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Register />
        </MemoryRouter>
    );

    // Mock the error response from the server for duplicate email
    axios.post.mockRejectedValue({
        response: {
            data: {
                detail: 'Email already registered'
            }
        }
    });

    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, { 
        target: { value: 'invalid@email.com' } 
    });

    const usernameInput = screen.getByLabelText('Username:');
    fireEvent.change(usernameInput, { 
        target: { value: 'username' } 
    });

    const passwordInput = screen.getByLabelText('Password:');
    fireEvent.change(passwordInput, { 
        target: { value: 'password' } 
    });

    const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
    fireEvent.change(confirmPasswordInput, { 
        target: { value: 'password' } 
    });

    // Submit the form
    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton);

    // Assert display of the error message for duplicate emails
    await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument();
    });
});