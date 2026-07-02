"""
AptitudePro Email Worker - Celery tasks for email notifications.
"""
import smtplib
import logging
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from celery import Celery

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("email_worker")

app = Celery("email_worker", broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"))


def _send_email(to: str, subject: str, body: str):
    """Send email via SMTP (local, no external API)."""
    smtp_host = os.getenv("SMTP_HOST", "localhost")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")

    msg = MIMEMultipart()
    msg["From"] = smtp_user or "noreply@aptitudepro.com"
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            if smtp_user:
                server.starttls()
                server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        logger.info("Email sent to %s: %s", to, subject)
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to, e)


@app.task(name="send_welcome_email")
def send_welcome_email(email: str, name: str):
    _send_email(email, "Welcome to AptitudePro!", f"<h1>Welcome, {name}!</h1><p>Start your learning journey today.</p>")


@app.task(name="send_test_notification")
def send_test_notification(email: str, test_name: str, child_name: str):
    _send_email(email, f"Test Completed: {test_name}", f"<p>{child_name} has completed the test <b>{test_name}</b>.</p>")


@app.task(name="send_report_email")
def send_report_email(email: str, report_url: str, child_name: str):
    _send_email(email, f"Assessment Report Ready for {child_name}", f"<p>Download the report: <a href='{report_url}'>View Report</a></p>")
