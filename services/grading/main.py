"""
AptitudePro Open-Response Grading Service
Evaluates student answers against model answers using semantic similarity.
Falls back to difflib if sentence-transformers is unavailable.
"""
import logging
import difflib
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("grading")

# ---------------------------------------------------------------------------
# Sentence-transformer model (lazy-loaded)
# ---------------------------------------------------------------------------
_st_model = None
_ST_AVAILABLE = False

try:
    from sentence_transformers import SentenceTransformer, util as st_util  # type: ignore

    _ST_AVAILABLE = True
    logger.info("sentence-transformers library detected – will load model on first request.")
except ImportError:
    logger.warning(
        "sentence-transformers not installed. Falling back to difflib-based similarity."
    )


def _get_st_model():
    """Lazy-load the sentence-transformer model once."""
    global _st_model
    if _st_model is None:
        _st_model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Sentence-transformer model loaded.")
    return _st_model


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class GradingRequest(BaseModel):
    student_answer: str = Field(..., min_length=1, description="The student's open-ended response")
    model_answer: str = Field(..., min_length=1, description="The reference / model answer")
    question_id: str = Field(..., description="Unique question identifier")


class GradingResponse(BaseModel):
    question_id: str
    score: float = Field(..., ge=0.0, le=1.0, description="Similarity score 0-1")
    grade: str = Field(..., description="Letter grade A-F")
    feedback: str
    method: str = Field(..., description="Scoring method used (semantic | difflib)")


# ---------------------------------------------------------------------------
# Grading helpers
# ---------------------------------------------------------------------------
def _score_to_grade(score: float) -> str:
    if score >= 0.9:
        return "A"
    if score >= 0.8:
        return "B"
    if score >= 0.7:
        return "C"
    if score >= 0.6:
        return "D"
    if score >= 0.5:
        return "E"
    return "F"


def _generate_feedback(score: float, grade: str) -> str:
    feedback_map = {
        "A": "Excellent! Your answer closely matches the expected response.",
        "B": "Great job! Your answer covers most of the key points.",
        "C": "Good attempt. Consider adding more detail to strengthen your answer.",
        "D": "Fair effort. Review the key concepts and try to address the main points.",
        "E": "Your answer partially addresses the question. Study the topic further.",
        "F": "Your answer does not align with the expected response. Please review the material.",
    }
    return feedback_map.get(grade, "Unable to generate feedback.")


def _semantic_similarity(student: str, model: str) -> float:
    """Compute cosine similarity via sentence-transformers."""
    st_model = _get_st_model()
    embeddings = st_model.encode([student, model], convert_to_tensor=True)
    sim = float(st_util.cos_sim(embeddings[0], embeddings[1])[0][0])
    # Clamp to [0, 1]
    return max(0.0, min(1.0, sim))


def _difflib_similarity(student: str, model: str) -> float:
    """Fallback: token-level SequenceMatcher ratio."""
    return difflib.SequenceMatcher(
        None,
        student.lower().split(),
        model.lower().split(),
    ).ratio()


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AptitudePro Grading Service",
    description="Open-response grading with semantic similarity",
    version="1.0.0",
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "grading",
        "semantic_backend": "sentence-transformers" if _ST_AVAILABLE else "difflib",
    }


@app.post("/api/grading/evaluate", response_model=GradingResponse)
async def evaluate(request: GradingRequest):
    """
    Evaluate a student's open-ended answer against the model answer.
    Returns a normalised score (0-1), a letter grade (A-F), and feedback.
    """
    logger.info("Grading request for question_id=%s", request.question_id)

    try:
        if _ST_AVAILABLE:
            score = _semantic_similarity(request.student_answer, request.model_answer)
            method = "semantic"
        else:
            score = _difflib_similarity(request.student_answer, request.model_answer)
            method = "difflib"
    except Exception as exc:
        logger.error("Semantic scoring failed, falling back to difflib: %s", exc)
        score = _difflib_similarity(request.student_answer, request.model_answer)
        method = "difflib"

    score = round(score, 4)
    grade = _score_to_grade(score)
    feedback = _generate_feedback(score, grade)

    logger.info(
        "question_id=%s  score=%.4f  grade=%s  method=%s",
        request.question_id, score, grade, method,
    )

    return GradingResponse(
        question_id=request.question_id,
        score=score,
        grade=grade,
        feedback=feedback,
        method=method,
    )
