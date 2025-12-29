import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: GEMINI_API_KEY not found in environment variables")
else:
    genai.configure(api_key=api_key)

# Initialize the model
model = genai.GenerativeModel('gemini-3-flash-preview')

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ... (API routes above) ...

@app.post("/chat")
async def chat(request: ChatRequest):
    # ... (existing chat logic) ...
    if not api_key:
         raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    try:
        # Use generate_content for stateless interaction
        response = model.generate_content(request.message)
        if not response.text:
             raise ValueError("Empty response from Gemini")
        return {"response": response.text}
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error calling Gemini: {e}")
        status_code = 500
        detail = str(e)
        if "400" in str(e):
             detail = "Invalid API request (400). Check Key or Request."
        if "403" in str(e):
             detail = "Invalid API Key or Permission Denied (403)."
             
        raise HTTPException(status_code=status_code, detail=detail)

# Serve static files
app.mount("/static", StaticFiles(directory="."), name="static")

@app.get("/")
async def read_index():
    return FileResponse('index.html')

