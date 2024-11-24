import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Auth/Login';
import axios from 'axios';

jest.mock('axios'); // Mock axios globally
const mockNavigate = jest.fn(); // Mock function 
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate, // Replace useNavigate with the mock function
}));


describe('after a successful login', () => {
    it('redirects the user to the homepage and stores token in localStorage', async () => {
        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Login />
            </MemoryRouter>
        )
        const response = { data: { token: 'mockToken' } };
        axios.post.mockResolvedValue(response); // Mock a successful API response
        
        // Change the value of the email input
        const emailElement = screen.getByLabelText('Email:');
        fireEvent.change(emailElement, {
            value: 'valid@email.com',
        });
    
        // Change the value of the password input
        const passwordElement = screen.getByLabelText('Password:');
        fireEvent.change(passwordElement, {
            value: 'validPassword',
        })
        
        // Click login
        const loginButton = screen.getByRole('button', { name: /Login/i });
        fireEvent.click(loginButton);
    
        // Wait to be redirected to home
        await waitFor(() => {  
            expect(mockNavigate).toHaveBeenCalledWith('/');
        })
        
        // Check for the token in localStorage
        expect(localStorage.getItem('token')).toBe('mockToken');
    })
})

describe('after an unsuccessful login', () => {
    it('shows an "Invalid email or password" error', async () => {
        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Login />
            </MemoryRouter>
        )
        axios.post.mockRejectedValue(new Error('Invalid login')); // Mock a failed API response

        const emailInput = screen.getByLabelText('Email:');
        fireEvent.change(emailInput, { value: 'invalid@email.com' });

        const passwordInput = screen.getByLabelText('Password:');
        fireEvent.change(passwordInput, { value: "invalidPassword" });

        const loginButton = screen.getByRole('button', { name: /Login/i });
        fireEvent.click(loginButton);

        // Assert that the error message is displayed
        const error = await screen.findByText('Invalid email or password');
        expect(error).toBeInTheDocument();
    })
})