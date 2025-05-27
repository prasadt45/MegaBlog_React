// Logo.jsx
import React from 'react';
import logo from '../assets/logo.png';

function Logo({ width = '40px' }) {
  return <img src={logo} alt="DevBlogs Logo" style={{ width, height: 'auto' }} />;
}

export default Logo;
