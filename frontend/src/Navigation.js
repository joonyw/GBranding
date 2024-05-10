// src/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="Navigation">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/fetch-image">Fetch Image</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
