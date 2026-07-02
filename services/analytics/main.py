"""
AptitudePro Interactive Analytics Dashboard
Flask + Dash application serving mock analytics with Plotly figures:
  - Test scores over time
  - Skill distribution radar chart
  - Engagement metrics bar chart
"""
import logging
import os

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dash import Dash, dcc, html
from flask import Flask, jsonify

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("analytics")

# ---------------------------------------------------------------------------
# Flask server
# ---------------------------------------------------------------------------
server = Flask(__name__)


@server.route("/health")
def health_check():
    return jsonify(status="ok", service="analytics")


# ---------------------------------------------------------------------------
# Mock data generation
# ---------------------------------------------------------------------------
np.random.seed(42)

_dates = pd.date_range("2026-01-01", periods=30, freq="W")
_scores = np.clip(50 + np.cumsum(np.random.randn(30) * 3), 0, 100).round(1)
scores_df = pd.DataFrame({"date": _dates, "score": _scores})

_skills = [
    "Logical Reasoning", "Numerical Ability", "Verbal Comprehension",
    "Spatial Awareness", "Pattern Recognition", "Memory",
]
_skill_values = np.random.uniform(40, 95, len(_skills)).round(1)

_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
_engagement = np.random.uniform(60, 100, len(_months)).round(1)

# ---------------------------------------------------------------------------
# Plotly figures
# ---------------------------------------------------------------------------

# 1. Scores over time (line chart)
fig_scores = px.line(
    scores_df, x="date", y="score",
    title="Test Scores Over Time",
    labels={"date": "Week", "score": "Score (%)"},
    markers=True,
)
fig_scores.update_layout(template="plotly_white")

# 2. Skill distribution (radar / polar)
fig_skills = go.Figure(
    go.Scatterpolar(
        r=list(_skill_values) + [_skill_values[0]],
        theta=_skills + [_skills[0]],
        fill="toself",
        name="Proficiency",
    )
)
fig_skills.update_layout(
    title="Skill Distribution",
    polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
    template="plotly_white",
)

# 3. Engagement metrics (bar chart)
fig_engagement = px.bar(
    x=_months, y=_engagement,
    title="Monthly Engagement Score",
    labels={"x": "Month", "y": "Engagement (%)"},
    color=_engagement,
    color_continuous_scale="Viridis",
)
fig_engagement.update_layout(template="plotly_white")

# ---------------------------------------------------------------------------
# Dash app
# ---------------------------------------------------------------------------
dash_app = Dash(
    __name__,
    server=server,
    url_base_pathname="/api/analytics/dash/",
)

dash_app.layout = html.Div(
    style={"fontFamily": "Segoe UI, sans-serif", "maxWidth": "1200px", "margin": "auto", "padding": "20px"},
    children=[
        html.H1("AptitudePro Analytics Dashboard", style={"textAlign": "center", "color": "#2c3e50"}),
        html.Hr(),
        html.Div(
            style={"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "20px"},
            children=[
                html.Div([
                    dcc.Graph(figure=fig_scores, config={"displayModeBar": False}),
                ]),
                html.Div([
                    dcc.Graph(figure=fig_skills, config={"displayModeBar": False}),
                ]),
            ],
        ),
        html.Div([
            dcc.Graph(figure=fig_engagement, config={"displayModeBar": False}),
        ]),
        html.Footer(
            "© 2026 AptitudePro – Mock analytics for demonstration purposes.",
            style={"textAlign": "center", "marginTop": "30px", "color": "#7f8c8d"},
        ),
    ],
)

# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8007))
    logger.info("Analytics dashboard starting on port %d", port)
    server.run(host="0.0.0.0", port=port, debug=False)
