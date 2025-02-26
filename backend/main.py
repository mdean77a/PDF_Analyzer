from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import os
import uuid
import shutil
import PyPDF2  # Add this import for PDF text extraction

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    # Check if file is a PDF
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Generate a unique filename
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extract text from PDF and save to a text file
    text_filename = f"{file_id}.txt"
    text_path = os.path.join(UPLOAD_DIR, text_filename)
    
    try:
        extracted_text = extract_text_from_pdf(file_path)
        with open(text_path, "w", encoding="utf-8") as text_file:
            text_file.write(extracted_text)
    except Exception as e:
        print(f"Error extracting text: {e}")
        with open(text_path, "w", encoding="utf-8") as text_file:
            text_file.write("Error extracting text from PDF.")
    
    # Get file size in bytes
    file_size_bytes = os.path.getsize(file_path)
    
    # Convert to KB, MB as appropriate
    if file_size_bytes < 1024:
        file_size_str = f"{file_size_bytes} bytes"
    elif file_size_bytes < 1024 * 1024:
        file_size_str = f"{file_size_bytes / 1024:.2f} KB"
    else:
        file_size_str = f"{file_size_bytes / (1024 * 1024):.2f} MB"
    
    return {
        "filename": file.filename,
        "size_bytes": file_size_bytes,
        "size_formatted": file_size_str,
        "file_id": file_id
    }

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text() + "\n\n"
    return text

@app.get("/download/{file_id}")
async def download_pdf(file_id: str):
    # Find the file in the uploads directory
    for filename in os.listdir(UPLOAD_DIR):
        if filename.startswith(file_id) and filename.endswith('.pdf'):
            file_path = os.path.join(UPLOAD_DIR, filename)
            # Get the original filename from the database or use a default
            return FileResponse(
                path=file_path, 
                filename=f"downloaded_document.pdf",
                media_type="application/pdf"
            )
    
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/download-text/{file_id}")
async def download_text(file_id: str):
    # Find the text file in the uploads directory
    text_path = os.path.join(UPLOAD_DIR, f"{file_id}.txt")
    if os.path.exists(text_path):
        return FileResponse(
            path=text_path,
            filename="extracted.txt",
            media_type="text/plain"
        )
    
    raise HTTPException(status_code=404, detail="Text file not found")

@app.get("/test")
async def test_endpoint():
    return {"status": "ok", "message": "Backend is working!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080) 