// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ImageDisplay from './ImageDisplay';

function App() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImage = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('/submit', { text });
      setResponse(result.data.message); 
      const response = await fetch('/get-image');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const imageObjectURL = URL.createObjectURL(blob);
      setImage(imageObjectURL);
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
        {/* <form onSubmit={handleSubmit}> */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="주제"
          />
          {/* <button type="submit">Submit</button> */}

      <button onClick={fetchImage} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Image'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && <img src={image} alt="Server Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />}

        {/* </form> */}
        {/* <ImageDisplay /> */}
        {response && <p>{response}</p>}
      </header>
    </div>
  );
}

export default App;
