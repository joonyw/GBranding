import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function LoginRequired() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Login Required</h1>
        <p>You must be logged in to view this page.</p>
        <Link to="/login">Go to Login</Link>
      </header>
    </div>
  );
}

export default LoginRequired;
