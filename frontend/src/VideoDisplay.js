// src/VideoDisplay.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function VideoDisplay() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fetchVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await axios.post('/submit', { text });
      setResponse(result.data.message);

      const videoResponse = await fetch('/get-video');
      if (!videoResponse.ok) throw new Error('Video load failed');
      const blobVideo = await videoResponse.blob();
      setVideo(URL.createObjectURL(blobVideo));

      setSubmitted(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GBranding</h1>
        {!submitted ? (
          <form onSubmit={fetchVideo}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter some text"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Video'}
            </button>
          </form>
        ) : (
          <>
            {response && <p>{response}</p>}
            {video && <video controls src={video} style={{ maxWidth: '100%', maxHeight: '100%' }} autoPlay />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}
      </header>
    </div>
  );
}

export default VideoDisplay;
