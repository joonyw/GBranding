import React, { useState } from 'react';

function ImageDisplay() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImage = async () => {
    setLoading(true);
    setError(null);

    try {
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
    <div>
      <button onClick={fetchImage} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Image'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && <img src={image} alt="Server Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
    </div>
  );
}

export default ImageDisplay;
