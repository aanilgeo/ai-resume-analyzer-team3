import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Protected from '../components/Auth/Protected';
import axios from 'axios';

// Mock axios and navigate
jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

afterEach(() => {
    jest.clearAllMocks(); // clear mock state
    localStorage.clear(); // clear localStorage
});

test('redirects user to login if no token is found', async () => {
    render(
        <MemoryRouter initialEntries={['/dashboard']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path='/dashboard' element={<Protected><div>Protected Content</div></Protected>}></Route>
            </Routes>
        </MemoryRouter>
    )

    localStorage.removeItem('token'); // Simulate no token in localStorage

    // Assert that navigation was triggered to homepage
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login', expect.anything());
    });
});

test('renders child component if token is valid', async () => {
    localStorage.setItem('token', 'mockToken'); // Simulate a valid token in localStorage
    axios.get.mockResolvedValue({ data: { email: 'valid@email.com' } });

    render(
        <MemoryRouter initialEntries={['/dashboard']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path='/dashboard' element={<Protected><div>Protected Content</div></Protected>}></Route>
            </Routes>
        </MemoryRouter>
    )

    // Assert that user is redirected to protected page
    await waitFor(() => {
        expect(screen.getByText(/Protected content/i)).toBeInTheDocument();
    });
});

test('redirects to login page if token verification fails', async () => {

    localStorage.setItem('token', 'invalidToken'); // Simulate an invalid token in localStorage
    axios.get.mockRejectedValue(new Error('Invalid token')); // Mock failed API response for invalid token

    render(
        <MemoryRouter initialEntries={['/dashboard']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path='/dashboard' element={<Protected><div>Protected Content</div></Protected>}></Route>
            </Routes>
        </MemoryRouter>
    )

    // Assert that user is redirected to login page
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login', expect.anything());
    });
});