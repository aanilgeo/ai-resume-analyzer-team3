import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Auth/Login';
import axios from 'axios';

test('renders input fields and submit button', () => {
    render(
        // MemoryRouter simulates navigation and routing behavior
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    // Check for email and password fields
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    // Check for the login button
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
});