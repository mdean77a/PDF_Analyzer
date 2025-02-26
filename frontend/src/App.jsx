import { useEffect, useState } from 'react';
import PDFUploader from './components/PDFUploader';
import axios from 'axios';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    // Test backend connectivity
    axios.get('http://localhost:8080/test')
      .then(response => {
        setBackendStatus('Connected to backend successfully');
        console.log('Backend test response:', response.data);
      })
      .catch(error => {
        setBackendStatus(`Error connecting to backend: ${error.message}`);
        console.error('Backend test error:', error);
      });
  }, []);

  return (
    <div className="container">
      <h1>PDF Analyzer</h1>
      <p>Upload a PDF file to analyze its size and download it</p>
      <p style={{ color: backendStatus.includes('Error') ? 'red' : 'green' }}>
        {backendStatus}
      </p>
      <PDFUploader />
    </div>
  );
}

export default App; 