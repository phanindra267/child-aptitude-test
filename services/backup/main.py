"""
AptitudePro Backup Service
Runs mongodump and pg_dump, encrypts the output, and provides S3 upload placeholder.
"""
import logging
import subprocess
import os
from datetime import datetime
from fastapi import FastAPI, BackgroundTasks, HTTPException
from cryptography.fernet import Fernet

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backup")

app = FastAPI(title="AptitudePro Backup Service")

# Setup encryption key
# In production, load this from a secure secrets manager.
ENCRYPTION_KEY = os.getenv("BACKUP_ENCRYPTION_KEY", Fernet.generate_key().decode())
fernet = Fernet(ENCRYPTION_KEY.encode())

BACKUP_DIR = "/backups"
os.makedirs(BACKUP_DIR, exist_ok=True)

def _run_backup(job_id: str):
    logger.info(f"Starting backup job {job_id}")
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    pg_out = os.path.join(BACKUP_DIR, f"pg_{timestamp}.sql")
    mongo_out = os.path.join(BACKUP_DIR, f"mongo_{timestamp}.archive")
    
    try:
        # PostgreSQL Backup
        pg_uri = os.getenv("POSTGRES_URI", "postgresql://admin:password@localhost:5432/aptitudepro")
        subprocess.run(["pg_dump", pg_uri, "-F", "c", "-f", pg_out], check=True, capture_output=True)
        
        # MongoDB Backup
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://admin:password@localhost:27017/aptitudepro?authSource=admin")
        subprocess.run(["mongodump", "--uri", mongo_uri, "--archive=" + mongo_out], check=True, capture_output=True)
        
        # Encrypt
        for fpath in [pg_out, mongo_out]:
            with open(fpath, "rb") as f:
                data = f.read()
            encrypted = fernet.encrypt(data)
            with open(fpath + ".enc", "wb") as f:
                f.write(encrypted)
            os.remove(fpath)
            
        logger.info(f"Backup job {job_id} completed successfully")
    except subprocess.CalledProcessError as e:
        logger.error(f"Backup failed: {e.stderr.decode()}")
    except Exception as e:
        logger.error(f"Backup failed: {e}")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "backup"}

@app.post("/api/admin/backup/trigger")
async def trigger_backup(background_tasks: BackgroundTasks):
    job_id = f"backup_{int(datetime.utcnow().timestamp())}"
    background_tasks.add_task(_run_backup, job_id)
    return {"success": True, "message": "Backup triggered", "job_id": job_id}
