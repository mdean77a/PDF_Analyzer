# PDF Analyzer Application

This application allows users to upload PDF documents, analyze their size, extract text content, and download both the original PDF and the extracted text.

## Features

- Upload PDF files via drag-and-drop or file selection
- Analyze PDF file size
- Extract text content from PDF documents
- Download the original PDF file
- Download the extracted text as a separate file

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- uv (Python package manager) - Install with `pip install uv`
- npm (Node.js package manager)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/pdf-analyzer.git
cd pdf-analyzer
```

### 2. Initialize and set up the Python environment with uv

From the root directory of the project:

```bash
# Initialize uv environment
uv init

# Synchronize dependencies from pyproject.toml
uv sync
```

This will install all required Python dependencies for both frontend and backend.

### 3. Install frontend dependencies

```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Return to the root directory
cd ..
```

## Running the Application

You need to run both the frontend and backend servers in separate terminal windows.

### 1. Start the frontend development server

In the first terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Start the Vite development server
npm run dev
```

The frontend will be available at http://localhost:5173

### 2. Start the backend server

In a second terminal window:

```bash
# Navigate to the backend directory
cd backend

# Start the FastAPI server using uv
uv run uvicorn main:app --host 0.0.0.0 --port 8080
```

The backend server will start at http://localhost:8080

## How to Use

1. Open your browser and navigate to http://localhost:5173
2. Drag and drop a PDF file onto the upload area, or click to select a file
3. Click the "Upload and Analyze" button
4. Once the file is processed, you'll see information about the file size
5. Use the "Download PDF" button to download the original PDF file
6. Use the "Download Extracted Text" button to download the text content as a .txt file

## Troubleshooting

- If you encounter CORS errors, make sure both the frontend and backend servers are running
- Check the browser console and backend terminal for error messages
- Ensure you're using the correct ports (8080 for backend, 5173 for frontend)
- If the text extraction fails, the application will still provide a text file with an error message
- If you see "Module not found" errors, make sure you've run `uv sync` in the root directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.
