// src/App.js
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import VideoDisplay from './VideoDisplay';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        {/* <Route exact path="/" component={Home} /> */}
        {/* <Route path="/login" component={Login} /> */}
        {/* <Route path="/register" component={Register} /> */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="fetch-video" element={<VideoDisplay />} />
        {/* <Route path="/fetch-video" component={VideoDisplay} /> */}
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
// ;





// // src/ImageDisplay.js

// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';
// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Navigation from './Navigation';
// import Home from './Home';
// import Login from './Login';
// import Register from './Register';
// import VideoDisplay from './VideoDisplay';

// function ImageDisplay() {
//   const [text, setText] = useState('');
//   const [response, setResponse] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [video, setVideo] = useState(null);
//   const [error, setError] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   const fetchMedia = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await axios.post('/submit', { text });
//       setResponse(result.data.message);

//       const videoResponse = await fetch('/get-video');
//       if (!videoResponse.ok) throw new Error('Video load failed');
//       const blobVideo = await videoResponse.blob();
//       setVideo(URL.createObjectURL(blobVideo));
      
//       setSubmitted(true);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>GBranding</h1>
//         {!submitted ? (
//           <form onSubmit={fetchMedia}>
//             <input
//               type="text"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Enter some text"
//             />
//             <button type="submit" disabled={loading}>
//               {loading ? 'Loading...' : 'Fetch Media'}
//             </button>
//           </form>
//         ) : (
//           <>
//             {response && <p>{response}</p>}
//             {video && <video controls src={video} style={{ maxWidth: '100%', maxHeight: '100%' }} autoPlay />}
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//           </>
//         )}
//       </header>
//     </div>
//   );
// }

// export default ImageDisplay;
