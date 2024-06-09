import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserScenarios.css';

function UserScenarios() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await axios.get('/user/scenarios', { withCredentials: true });
        setScenarios(response.data);
      } catch (error) {
        setError('Failed to fetch scenarios');
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const handleBranding = (scenario) => {
    navigate('/branding', { state: { subject: scenario.generated_scenario } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="scenarios-container">
      <h1>Your Scenarios</h1>
      {scenarios.length === 0 ? (
        <p>No scenarios found</p>
      ) : (
        scenarios.map(scenario => (
          <div key={scenario.id} className="scenario-card">
            <h2>Scenario</h2>
            <p><strong>Input:</strong> {scenario.user_input}</p>
            <p><strong>Generated Scenario:</strong> {scenario.generated_scenario}</p>
            <video controls src={`/videos/${scenario.video_filename}`} className="video-player" />
            <p><strong>Timestamp:</strong> {new Date(scenario.timestamp).toLocaleString()}</p>
            <button onClick={() => handleBranding(scenario)} className="brand-button">Brand</button>
          </div>
        ))
      )}
    </div>
  );
}

export default UserScenarios;
