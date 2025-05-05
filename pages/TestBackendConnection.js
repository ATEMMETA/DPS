import { useState, useEffect } from 'react';

function TestBackendConnection() {
  const [backendMessage, setBackendMessage] = useState('');
  const [error, setError] = useState(null);
  const flaskBackendUrl = 'https://v0-new-project-pynnff3lkmc.vercel.app/api/hello'; // Your Flask backend URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(flaskBackendUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBackendMessage(data.message);
      } catch (e) {
        setError(e);
        console.error('Error fetching from backend:', e);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Test Backend Connection</h2>
      {backendMessage ? (
        <p>Message from backend: {backendMessage}</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <p>Loading message from backend...</p>
      )}
    </div>
  );
}

export default TestBackendConnection;
