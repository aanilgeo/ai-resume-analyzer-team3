import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Protected = ({ children }) => {
  const navigate = useNavigate(); // use for navigation
  const location = useLocation(); // get the current location
  const token = localStorage.getItem('token'); // get the token from localStorage

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate('/login', { state: { from: location }, replace: true }); // redirect to login
        return;
      }

      try {
        // Verify the token with the backend
        await axios.get('http://127.0.0.1:8000/api/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`, // include the token in the Authorization header
          },
        });
      } catch (error) {
        localStorage.removeItem('token'); // remove invalid token
        navigate('/login', { state: { from: location }, replace: true }); // redirect to login
      }
    };

    verifyToken();
  }, [token, navigate, location]);

  // if no token exists, return null until redirection happens
  if (!token) {
    return null;
  }

  // render the protected content (children) if the token exists
  return children;
};

export default Protected;
