from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI(title="AptitudePro Generator Service")

class GenerationRequest(BaseModel):
    age: int
    difficulty: float
    subject: str

@app.post("/api/generator/question")
async def generate_question(req: GenerationRequest):
    """
    Age-based, difficulty-calibrated questions generated on-the-fly.
    """
    # TODO: Implement generation with jinja2, Pillow, SQLite caching
    return {
        "question_text": f"What is a good mock question for age {req.age}?",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A"
    }

@app.post("/api/generator/paper")
async def generate_paper(req: GenerationRequest):
    """
    Generate a full paper.
    """
    return {"paper_id": "P-100", "questions": []}
