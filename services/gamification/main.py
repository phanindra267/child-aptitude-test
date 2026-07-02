from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AptitudePro Gamification Service")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/gamification/game")
async def get_game(age: int, type: str):
    """
    Returns dynamic mini-game payload.
    5+ game types (memory match, pattern completion, number racer, etc.)
    """
    # TODO: Procedurally generate with Pillow + jinja2
    return {
        "game_type": type,
        "assets": ["/assets/game/bg.png", "/assets/game/sprite1.png"],
        "config": {
            "difficulty_level": 3,
            "target_score": 100
        }
    }
