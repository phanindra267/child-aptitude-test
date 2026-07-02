"""
AptitudePro WebRTC Proctoring Service
Consent-based remote proctoring with face/gaze detection placeholders.
"""
import logging
import json
from datetime import datetime
from typing import Dict, List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(name)s | %(levelname)s | %(message)s")
logger = logging.getLogger("proctoring")

app = FastAPI(title="AptitudePro Proctoring Service", version="1.0.0")

# In-memory consent & session store (use DB in production)
consent_store: Dict[str, dict] = {}
active_sessions: Dict[str, WebSocket] = {}


class ConsentRequest(BaseModel):
    student_id: str
    session_id: str
    consent_given: bool


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "proctoring", "active_sessions": len(active_sessions)}


@app.post("/api/proctoring/consent")
async def manage_consent(req: ConsentRequest):
    consent_store[req.student_id] = {
        "session_id": req.session_id,
        "consent_given": req.consent_given,
        "timestamp": datetime.utcnow().isoformat(),
    }
    logger.info("Consent %s for student %s", "granted" if req.consent_given else "revoked", req.student_id)
    return {"success": True, "message": f"Consent {'granted' if req.consent_given else 'revoked'}"}


@app.websocket("/proctoring")
async def proctoring_websocket(websocket: WebSocket):
    await websocket.accept()
    session_id = None
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            if msg.get("type") == "join":
                session_id = msg.get("session_id", "unknown")
                active_sessions[session_id] = websocket
                logger.info("Proctoring session started: %s", session_id)
                await websocket.send_json({"type": "joined", "session_id": session_id})

            elif msg.get("type") == "frame":
                # Placeholder: In production, run OpenCV face/gaze detection here
                await websocket.send_json({"type": "analysis", "face_detected": True, "gaze_focused": True, "anomalies": []})

            elif msg.get("type") == "audio":
                # Placeholder: In production, run librosa audio analysis
                await websocket.send_json({"type": "audio_analysis", "background_noise_level": "low"})

    except WebSocketDisconnect:
        if session_id and session_id in active_sessions:
            del active_sessions[session_id]
        logger.info("Proctoring session ended: %s", session_id)
