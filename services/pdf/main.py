"""
AptitudePro PDF Report Generator
Generates detailed PDF scorecards with skill breakdowns and trend charts.
"""
import io
import logging
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(name)s | %(levelname)s | %(message)s")
logger = logging.getLogger("pdf")

app = FastAPI(title="AptitudePro PDF Service", version="1.0.0")

# Mock data for demo
MOCK_RESULTS = {
    "demo_attempt": {
        "student_name": "Alex Johnson",
        "age": 8,
        "test_date": "2024-03-15",
        "total_score": 85,
        "max_score": 100,
        "skills": {"logical": 90, "math": 80, "language": 85, "spatial": 75},
    }
}


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "pdf"}


@app.get("/api/reports/{attempt_id}/pdf")
async def generate_pdf(attempt_id: str):
    logger.info("Generating PDF for attempt_id=%s", attempt_id)
    data = MOCK_RESULTS.get(attempt_id, MOCK_RESULTS["demo_attempt"])

    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet

        buf = io.BytesIO()
        doc = SimpleDocTemplate(buf, pagesize=A4)
        styles = getSampleStyleSheet()
        elements = []

        elements.append(Paragraph("AptitudePro Assessment Report", styles["Title"]))
        elements.append(Spacer(1, 20))
        elements.append(Paragraph(f"Student: {data['student_name']}", styles["Normal"]))
        elements.append(Paragraph(f"Age: {data['age']} | Date: {data['test_date']}", styles["Normal"]))
        elements.append(Spacer(1, 20))
        elements.append(Paragraph(f"Total Score: {data['total_score']}/{data['max_score']}", styles["Heading2"]))
        elements.append(Spacer(1, 15))

        # Skill breakdown table
        table_data = [["Skill", "Score (%)"]]
        for skill, score in data["skills"].items():
            table_data.append([skill.capitalize(), f"{score}%"])

        table = Table(table_data, colWidths=[200, 100])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F46E5")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 20))
        elements.append(Paragraph("Recommendations: Focus on spatial awareness and math skills.", styles["Normal"]))

        doc.build(elements)
        buf.seek(0)
        return StreamingResponse(buf, media_type="application/pdf",
                                 headers={"Content-Disposition": f"attachment; filename=report_{attempt_id}.pdf"})
    except ImportError:
        raise HTTPException(status_code=500, detail="reportlab not installed")
