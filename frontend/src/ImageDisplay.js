// src/ImageDisplay.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ImageDisplay() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fetchImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Submit text and receive a message
      const result = await axios.post('/submit', { text });
      setResponse(result.data.message);

      // Fetch the image
      const response = await fetch('/get-image');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const imageObjectURL = URL.createObjectURL(blob);
      setImage(imageObjectURL);

      // Mark as submitted
      setSubmitted(true);
    } catch (error) {
      setError('Failed to load image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GBranding</h1>
        {!submitted ? (
          <form onSubmit={fetchImage}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter some text"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Image'}
            </button>
          </form>
        ) : (
          <>
            {response && <p>{response}</p>}
            {image && <img src={image} alt="Server Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}
      </header>
    </div>
  );
}

export default ImageDisplay;
