import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Use useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (response.status === 200) {
        navigate('/');  // Redirect to home page on successful login
        window.location.reload();  // Reload to update login state in Navigation
      }
    } catch (error) {
      setError('Login unsuccessful. Please check your credentials.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </header>
    </div>
  );
}

export default Login;
