// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate that password and confirmPassword match
    if (password !== confirmPassword) {
      setError('Passwords do no match');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/register', {
        email,
        username,
        password,
      });
      setSuccess(true);
      setError('')
    } catch (error) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor='username'>Username:</label>
          <input 
            id='username'
            type="text" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input 
            id='password'
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor='confirmPassword'>Confirm Password:</label>
          <input
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {success && <p style={{ color: 'green' }}>Registration successful!</p>} {/* Display success message */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {success && <button onClick={() => navigate('/')}>Go Home</button>} {/* Display 'Go Home' button */}
    </div>
  );
};

export default Register;