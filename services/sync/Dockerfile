FROM python:3.11-slim

WORKDIR /app

COPY . .
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; else echo "No requirements.txt found, skipping..."; fi

# Default to uvicorn, but Flask apps will need different commands if not using uvicorn.
# We'll set the command in docker-compose.yml or use a generic start script.
# For now, let's just use a simple python execution if there's a main.py
CMD ["python", "main.py"]
