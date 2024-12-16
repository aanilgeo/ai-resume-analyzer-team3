// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/Navbar.css';
import Navbar from './Navbar';

const Home = () => {
  return (
    <>
      <Navbar activeTab='home'/>
      <div id='hp'>
        <h1>Home Page</h1>
        <nav>
          Quick Links:
          <ul>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/register'>Register</Link></li>
            <li><Link to='/dashboard'>Dashboard</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Home;