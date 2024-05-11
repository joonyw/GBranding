// src/ImageDisplay.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ImageDisplay() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fetchMedia = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await axios.post('/submit', { text });
      setResponse(result.data.message);

      const imageResponse = await fetch('/get-image');
      if (!imageResponse.ok) throw new Error('Image load failed');
      const blobImage = await imageResponse.blob();
      setImage(URL.createObjectURL(blobImage));

      const audioResponse = await fetch('/get-audio');
      if (!audioResponse.ok) throw new Error('Audio load failed');
      const blobAudio = await audioResponse.blob();
      setAudio(URL.createObjectURL(blobAudio));

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
          <form onSubmit={fetchMedia}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter some text"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Media'}
            </button>
          </form>
        ) : (
          <>
            {response && <p>{response}</p>}
            {image && <img src={image} alt="Server Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
            {audio && <audio controls src={audio} autoPlay />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}
      </header>
    </div>
  );
}

export default ImageDisplay;
