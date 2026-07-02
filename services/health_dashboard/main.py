"""
AptitudePro Health Dashboard
Aggregates health from all microservices.
"""
from flask import Flask, jsonify
import requests
import os
import concurrent.futures

app = Flask(__name__)

SERVICES = {
    "server": os.getenv("SERVER_URL", "http://server:5000/api/admin/health"),
    "adaptive": os.getenv("ADAPTIVE_URL", "http://adaptive:8001/health"),
    "generator": os.getenv("GENERATOR_URL", "http://generator:8002/health"),
    "gamification": os.getenv("GAMIFICATION_URL", "http://gamification:8003/health"),
    "voice": os.getenv("VOICE_URL", "http://voice:8004/health"),
    "nlg": os.getenv("NLG_URL", "http://nlg:8005/health"),
    "grading": os.getenv("GRADING_URL", "http://grading:8006/health"),
    "recommender": os.getenv("RECOMMENDER_URL", "http://recommender:8007/health"),
    "sync": os.getenv("SYNC_URL", "http://sync:8008/health"),
    "analytics": os.getenv("ANALYTICS_URL", "http://analytics:8009/health"),
    "pdf": os.getenv("PDF_URL", "http://pdf:8010/health"),
    "proctoring": os.getenv("PROCTORING_URL", "http://proctoring:8011/health"),
    "cms": os.getenv("CMS_URL", "http://cms:8012/health"),
    "backup": os.getenv("BACKUP_URL", "http://backup:8013/health"),
}

def ping_service(name, url):
    try:
        resp = requests.get(url, timeout=3)
        return name, {"status": "up" if resp.ok else "down", "details": resp.json() if resp.ok else {}}
    except Exception as e:
        return name, {"status": "down", "error": str(e)}

@app.route('/health')
def health():
    return jsonify({"status": "ok", "service": "health_dashboard"})

@app.route('/api/admin/health/detailed')
def detailed_health():
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(SERVICES)) as executor:
        future_to_service = {executor.submit(ping_service, name, url): name for name, url in SERVICES.items()}
        for future in concurrent.futures.as_completed(future_to_service):
            name, data = future.result()
            results[name] = data
            
    all_up = all(v["status"] == "up" for v in results.values())
    return jsonify({
        "status": "ok" if all_up else "degraded",
        "services": results
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8014)
