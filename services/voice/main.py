from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import logging

app = FastAPI(title="AptitudePro Voice Service")
logger = logging.getLogger(__name__)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "voice"}

@app.post("/api/voice/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Offline speech-to-text using openai-whisper.
    """
    # TODO: Load whisper model and process audio
    return {"text": "This is a mock transcription of the student's answer."}

@app.get("/api/voice/narrate")
async def narrate_text(text: str):
    """
    Text-to-speech for question narration via pyttsx3.
    """
    # TODO: Generate TTS audio file with pyttsx3
    return {"status": "mock_audio_generated", "file_url": "/static/audio_mock.mp3"}
