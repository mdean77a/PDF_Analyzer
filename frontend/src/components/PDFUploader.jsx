import { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please drop a valid PDF file');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const uploadFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending request to:', `${API_URL}/upload/`);
      const response = await axios.post(`${API_URL}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response received:', response.data);
      setFileInfo(response.data);
    } catch (err) {
      console.error('Upload error details:', err);
      setError('Error uploading file: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    if (!fileInfo) return;

    try {
      console.log(`Attempting to download file with ID: ${fileInfo.file_id}`);
      console.log(`Download URL: ${API_URL}/download/${fileInfo.file_id}`);
      
      const response = await axios.get(`${API_URL}/download/${fileInfo.file_id}`, {
        responseType: 'blob',
      });
      
      console.log('Download response received:', response);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error details:', err);
      setError('Error downloading file: ' + err.message);
    }
  };

  const downloadExtractedText = async () => {
    if (!fileInfo) return;

    try {
      console.log(`Attempting to download extracted text for file ID: ${fileInfo.file_id}`);
      console.log(`Download URL: ${API_URL}/download-text/${fileInfo.file_id}`);
      
      const response = await axios.get(`${API_URL}/download-text/${fileInfo.file_id}`, {
        responseType: 'blob',
      });
      
      console.log('Text download response received:', response);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'extracted.txt');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Text download error details:', err);
      setError('Error downloading extracted text: ' + err.message);
    }
  };

  return (
    <div className="pdf-uploader">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      
      <div 
        className="upload-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        {file ? (
          <p>Selected file: {file.name}</p>
        ) : (
          <p>Drag and drop a PDF file here, or click to select</p>
        )}
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button 
        onClick={uploadFile} 
        disabled={!file || loading}
        className="upload-button"
      >
        {loading ? 'Uploading...' : 'Upload and Analyze'}
      </button>
      
      {fileInfo && (
        <div className="file-info">
          <h3>File Information</h3>
          <p>Filename: {fileInfo.filename}</p>
          <p>Size: {fileInfo.size_formatted}</p>
          <div className="download-buttons">
            <button onClick={downloadFile}>
              <span>Download PDF</span>
            </button>
            <button onClick={downloadExtractedText}>
              <span>Download Extracted Text</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader; 