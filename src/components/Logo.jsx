// Logo.jsx
import React from 'react';
import logo from '../assets/logo.png';

function Logo({ width = '100px' }) {
  return <img src={logo} alt="DevBlogs Logo" style={{ width, height: 'auto' }} />;
}

export default Logo;
