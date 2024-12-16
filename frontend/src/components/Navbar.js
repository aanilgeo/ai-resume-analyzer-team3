// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({activeTab}) => {
  if (activeTab === 'home') var homeClass = 'active'; else homeClass = '';
  if (activeTab === 'login') var loginClass = 'active'; else loginClass = '';
  if (activeTab === 'register') var registerClass = 'active'; else registerClass = '';
  if (activeTab === 'dashboard') var dashboardClass = 'active'; else dashboardClass = '';

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/'); // Redirect to login
  }

  return (
    <div className='topnav'>
      <Link id='home' className={homeClass} to='/'>Home</Link>
      <Link id='login' className={loginClass} to='/login'>Login</Link>
      <Link id='register' className={registerClass} to='/register'>Register</Link>
      <Link id='dashboard' className={dashboardClass} to='/dashboard'>Dashboard</Link>
      {localStorage.getItem('token') && <Link role='button' className='logout' onClick={handleLogout}>Logout</Link>}
    </div>
  );
};

export default Navbar;