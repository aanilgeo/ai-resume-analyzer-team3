import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // send login request to backend
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });

      // extract token from the response
      const { token } = response.data;

      // save the token in localStorage
      localStorage.setItem('token', token);

      // redirect to the originally requested route or a default route
      const from = location.state?.from?.pathname || '/';
      navigate(from)
    } catch(err) {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Navbar activeTab='login'/>
      <div id='hp'>
      <h2>Login:</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */} 
      <form onSubmit={handleLogin}>
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
        <button type='submit'>Login</button>
      </form>
    </div>
    </>
  );
};

export default Login;