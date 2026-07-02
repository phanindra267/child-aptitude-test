from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AptitudePro NLG Service")

class PassageRequest(BaseModel):
    age_group: str
    topic: str

@app.post("/api/nlg/passage")
async def generate_passage(req: PassageRequest):
    """
    Generate reading passage + questions using local small language models.
    """
    # TODO: Implement inference with distilgpt2 or phi-1.5
    return {
        "passage": f"Once upon a time, a young explorer learned about {req.topic}...",
        "questions": [
            {"text": "What did the explorer learn about?", "answer": req.topic}
        ]
    }
