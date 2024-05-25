import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from './useAuth';
import './VideoDisplay.css';  // Import the CSS file for styling

function VideoDisplay() {
  const [videoUrl, setVideoUrl] = useState('');
  const [text, setText] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);  // Loading state
  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchVideo = async () => {
    setLoading(true);  // Set loading to true when fetch starts
    try {
      // First, submit the text to the /submit endpoint
      const submitResponse = await axios.post('/submit', { text }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      // Store the response message
      setResponseMessage(submitResponse.data.message);

      // Then, fetch the video from the /get-video endpoint
      const videoResponse = await axios.get('/get-video', {
        responseType: 'blob',
        withCredentials: true
      });
      const videoObjectUrl = URL.createObjectURL(videoResponse.data);
      setVideoUrl(videoObjectUrl);
    } catch (error) {
      setError('Failed to load video');
    } finally {
      setLoading(false);  // Set loading to false when fetch completes
    }
  };

  const shareVideo = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this video',
        url: videoUrl,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(videoUrl).then(() => {
        alert('Video URL copied to clipboard');
      }, (error) => {
        console.error('Failed to copy URL', error);
      });
    }
  };

  const downloadVideo = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'video.mp4'; // You can set a default file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading) {
    return <div className="App"><header className="App-header"><p>Loading...</p></header></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login-required" />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fetch Video</h1>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
        />
        <button onClick={fetchVideo} disabled={loading}>Fetch Video</button>
        {loading && <p>Loading...</p>}
        <div className="content-container">
          <div className="response-container">
            <h2>Generated Scenario</h2>
            <p>{responseMessage || 'No scenario generated yet.'}</p>
          </div>
          <div className="video-container">
            <h2>Video</h2>
            {videoUrl ? (
              <video controls src={videoUrl} style={{ maxWidth: '100%', maxHeight: '100%' }} autoPlay />
            ) : (
              <p>No video loaded yet.</p>
            )}
            {videoUrl && (
              <>
                <button onClick={shareVideo}>Share Video</button>
                <button onClick={downloadVideo}>Download Video</button>
              </>
            )}
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
    </div>
  );
}

export default VideoDisplay;
