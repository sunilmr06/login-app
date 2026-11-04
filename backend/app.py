from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])  # Update with your Vercel URL in production

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn


@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Login App API is running!"})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "").strip()

    if not username:
        return jsonify({"error": "Username is required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, username, email, password, created_at FROM users WHERE username = %s",
            (username,),
        )
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user:
            return jsonify(
                {
                    "success": True,
                    "user": {
                        "id": user[0],
                        "username": user[1],
                        "email": user[2],
                        "password": user[3],  # shown for demo purposes only
                        "created_at": str(user[4]),
                    },
                }
            )
        else:
            return jsonify({"success": False, "error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
