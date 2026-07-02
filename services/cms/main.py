"""
AptitudePro CMS Service (Content Management System)
Flask-based microservice for managing question templates and generation rules.
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import logging
from datetime import datetime
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cms")

app = Flask(__name__)
CORS(app)

DB_PATH = "cms.db"

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                skill_type TEXT NOT NULL,
                age_group TEXT NOT NULL,
                content TEXT NOT NULL,
                variables TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        ''')
init_db()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "cms"})

@app.route('/api/cms/templates', methods=['GET'])
def get_templates():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM templates ORDER BY created_at DESC")
        templates = [dict(row) for row in cursor.fetchall()]
        # parse json fields
        for t in templates:
            t['variables'] = json.loads(t['variables'])
    return jsonify({"success": True, "templates": templates})

@app.route('/api/cms/templates', methods=['POST'])
def create_template():
    data = request.json
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO templates (title, skill_type, age_group, content, variables, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (data['title'], data['skill_type'], data['age_group'], data['content'], json.dumps(data.get('variables', {})), datetime.utcnow().isoformat())
            )
            conn.commit()
            return jsonify({"success": True, "id": cursor.lastrowid}), 201
    except Exception as e:
        logger.error(f"Failed to create template: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8012)
