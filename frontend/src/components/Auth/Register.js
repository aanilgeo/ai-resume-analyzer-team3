// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

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
      setError('Passwords do not match');
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
      setSuccess(false);
      error.response?.data?.detail 
        ? setError(error.response.data.detail) 
        : setError('Failed to register. Please try again.');
    }
  };

  return (
    <>
    <Navbar activeTab='register'/>
    <div id='hp'>
      <h2>Register:</h2>
      <form onSubmit={handleRegister}>
        <div className='formRow'>
          <label className='formLabel' htmlFor='email'>Email:</label>
          <input 
            placeholder='example@gmail.com'
            id='email'
            type='email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className='formRow'>
          <label className='formLabel' htmlFor='username'>Username:</label>
          <input 
            placeholder='example'
            id='username'
            type='text' 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className='formRow'>
          <label className='formLabel' htmlFor='password'>Password:</label>
          <input 
            placeholder='password'
            id='password'
            type='password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className='formRow'>
          <label className='formLabel' htmlFor='confirmPassword'>Confirm Password:</label>
          <input
            placeholder='password'
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Register</button>
      </form>
      {success && <p style={{ color: 'green' }}>Registration successful!</p>} {/* Display success message */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {success && <button data-testid='loginButton' onClick={() => navigate('/')}>Go Login</button>} {/* Display 'Go Home' button */}
    </div>
    </>
  );
};

export default Register;