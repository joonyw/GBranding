import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import VideoDisplay from './VideoDisplay';
import AdminPage from './AdminPage';
import UserScenarios from './UserScenarios';
import BrandingPage from './BrandingPage';
import LoginRequired from './LoginRequired';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/fetch-video" element={<VideoDisplay />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/scenarios" element={<UserScenarios />} />
        <Route path="/branding" element={<BrandingPage />} />
        <Route path="/login-required" element={<LoginRequired />} />
        <Route path="/dashboard" element={<Home />} /> {/* Placeholder for dashboard */}
        <Route path="*" element={<Home />} /> {/* Default to Home for any unknown route */}
      </Routes>
    </Router>
  );
}

export default App;
