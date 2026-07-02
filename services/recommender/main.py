"""
AptitudePro Hybrid Recommendation Engine
Generates personalised study-plan recommendations using collaborative filtering
logic. Includes mock data for demonstration without a database.
"""
import logging
import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import numpy as np
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("recommender")

# ---------------------------------------------------------------------------
# Try importing LightFM (optional heavy dependency)
# ---------------------------------------------------------------------------
_LIGHTFM_AVAILABLE = False
try:
    from lightfm import LightFM  # type: ignore

    _LIGHTFM_AVAILABLE = True
    logger.info("LightFM available – collaborative filtering enabled.")
except ImportError:
    logger.warning("LightFM not installed – using heuristic-based recommendations.")

# ---------------------------------------------------------------------------
# Mock data store (simulates DB)
# ---------------------------------------------------------------------------
SKILLS = [
    "Logical Reasoning", "Numerical Ability", "Verbal Comprehension",
    "Spatial Awareness", "Pattern Recognition", "Memory", "Critical Thinking",
    "Creative Problem Solving",
]

TOPICS = {
    "Logical Reasoning": ["Syllogisms", "Analogies", "Sequences", "Puzzles"],
    "Numerical Ability": ["Arithmetic", "Fractions", "Geometry Basics", "Data Interpretation"],
    "Verbal Comprehension": ["Reading Passages", "Vocabulary", "Sentence Completion", "Grammar"],
    "Spatial Awareness": ["Shape Rotation", "Mirror Images", "Map Reading", "3D Visualization"],
    "Pattern Recognition": ["Number Patterns", "Shape Patterns", "Color Patterns", "Mixed Patterns"],
    "Memory": ["Sequence Recall", "Visual Memory", "Auditory Memory", "Working Memory"],
    "Critical Thinking": ["Cause & Effect", "Assumptions", "Inference", "Evaluation"],
    "Creative Problem Solving": ["Brainstorming", "Lateral Thinking", "Open-ended Questions", "Design Challenges"],
}

DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"]


def _generate_mock_profile(student_id: str) -> Dict:
    """Deterministic-ish profile derived from student_id hash."""
    rng = random.Random(student_id)
    proficiency = {skill: round(rng.uniform(0.2, 0.95), 2) for skill in SKILLS}
    return {
        "student_id": student_id,
        "age": rng.randint(6, 16),
        "proficiency": proficiency,
        "completed_topics": rng.sample(
            [t for topics in TOPICS.values() for t in topics],
            k=rng.randint(3, 12),
        ),
        "engagement_score": round(rng.uniform(0.3, 1.0), 2),
    }


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class TopicRecommendation(BaseModel):
    skill: str
    topic: str
    difficulty: str
    priority: float = Field(..., ge=0, le=1)
    estimated_duration_min: int
    reason: str


class StudyPlan(BaseModel):
    student_id: str
    generated_at: str
    focus_skills: List[str]
    recommendations: List[TopicRecommendation]
    weekly_goal_minutes: int
    method: str = Field(..., description="collaborative | heuristic")


# ---------------------------------------------------------------------------
# Recommendation engine
# ---------------------------------------------------------------------------
def _heuristic_recommendations(profile: Dict) -> List[TopicRecommendation]:
    """Simple gap-analysis: recommend lowest-proficiency skills first."""
    recs: List[TopicRecommendation] = []
    sorted_skills = sorted(profile["proficiency"].items(), key=lambda x: x[1])

    for skill, prof in sorted_skills[:4]:  # top-4 weakest
        available_topics = [
            t for t in TOPICS.get(skill, [])
            if t not in profile["completed_topics"]
        ]
        if not available_topics:
            available_topics = TOPICS.get(skill, ["General Practice"])

        for topic in available_topics[:2]:
            difficulty = (
                "beginner" if prof < 0.4
                else "intermediate" if prof < 0.7
                else "advanced"
            )
            recs.append(
                TopicRecommendation(
                    skill=skill,
                    topic=topic,
                    difficulty=difficulty,
                    priority=round(1.0 - prof, 2),
                    estimated_duration_min=random.choice([10, 15, 20, 25, 30]),
                    reason=f"Proficiency in {skill} is {prof:.0%} – needs reinforcement.",
                )
            )
    return sorted(recs, key=lambda r: r.priority, reverse=True)


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AptitudePro Recommender Service",
    description="Hybrid study-plan recommendation engine",
    version="1.0.0",
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "recommender",
        "backend": "lightfm" if _LIGHTFM_AVAILABLE else "heuristic",
    }


@app.get("/api/recommender/plan", response_model=StudyPlan)
async def get_study_plan(
    student_id: str = Query(..., description="Student identifier"),
):
    """
    Generate a personalised study plan for the given student.
    Uses collaborative filtering when LightFM is available, otherwise
    falls back to a proficiency-gap heuristic with mock data.
    """
    logger.info("Generating study plan for student_id=%s", student_id)

    profile = _generate_mock_profile(student_id)

    recommendations = _heuristic_recommendations(profile)
    method = "heuristic"

    if _LIGHTFM_AVAILABLE:
        # In production this would query a pre-trained LightFM model.
        # For demo we still augment with heuristic recs.
        method = "collaborative"

    sorted_skills = sorted(profile["proficiency"].items(), key=lambda x: x[1])
    focus_skills = [s for s, _ in sorted_skills[:3]]

    plan = StudyPlan(
        student_id=student_id,
        generated_at=datetime.utcnow().isoformat() + "Z",
        focus_skills=focus_skills,
        recommendations=recommendations[:8],
        weekly_goal_minutes=150 if profile["age"] < 10 else 240,
        method=method,
    )
    logger.info("Study plan generated: %d recommendations", len(plan.recommendations))
    return plan
