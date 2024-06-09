import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navigation.css';
import useAuth from './useAuth';

function Navigation() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.get('/logout', { withCredentials: true });
    window.location.reload();  // Reload to update login state
  };

  if (loading) {
    return null;  // Optionally render a loading indicator
  }

  return (
    <nav className="navigation">
      <ul>
        <li className="nav-left">
          <Link to="/">Home</Link>
          <Link to="/fetch-video">Fetch Video</Link>
          {isAuthenticated && <Link to="/scenarios">Scenarios</Link>}
          {/* {isAuthenticated && <Link to="/branding">Branding</Link>} */}
          {isAdmin && <Link to="/admin">Admin</Link>}
        </li>
        <li className="nav-right">
          {isAuthenticated ? (
            <a href="#" onClick={handleLogout}>Logout</a>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
