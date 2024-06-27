import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './BrandingPage.css';

function BrandingPage() {
  const location = useLocation();
  const { scenarioId, subject } = location.state || { scenarioId: null, subject: '' };
  const [brandingElements, setBrandingElements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (scenarioId) {
      const fetchBranding = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.post('/branding', { scenario_id: scenarioId, subject }, { withCredentials: true });
          setBrandingElements(response.data.branding_elements);
        } catch (error) {
          setError('Failed to fetch branding elements');
        } finally {
          setLoading(false);
        }
      };
      fetchBranding();
    }
  }, [scenarioId, subject]);

  return (
    <div className="branding-container">
      <h1>Branding Strategies</h1>
      {loading && <p>Generating branding elements...</p>}
      {error && <p className="error">{error}</p>}
      {brandingElements && (
        <div className="branding-results">
          <h2>Branding for {subject}</h2>
          <img src={brandingElements.logo_url} alt={`${subject} logo`} className="brand-logo" />
          <h3>Color Palette</h3>
          <div className="color-palette">
            {brandingElements.color_palette.map((color, index) => (
              <div
                key={index}
                className="color-block"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>

          <h3>Values</h3>
          <ul>
            {brandingElements.values.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
          <h3>Vision</h3>
          <p>{brandingElements.vision}</p>
          <h3>Philosophy</h3>
          <p>{brandingElements.philosophy}</p>
          <h3>Marketing Strategy</h3>
          <ul>
            {brandingElements.marketing_strategy.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BrandingPage;
