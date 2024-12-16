import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';
import axios from 'axios';

jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

test('logs user out and redirects to homepage', async () => {

    localStorage.setItem('token', 'mockToken'); // Simulate addition of token

    // Check for the token in localStorage
    expect(localStorage.getItem('token')).toBe('mockToken');

    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Logout/i })); // click Logout button

    localStorage.removeItem('token', 'mockToken'); // Simulate removal of token

    // Assert redirection to homepage
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // Assert token is removed
    expect(localStorage.getItem('token')).toBeNull();
})