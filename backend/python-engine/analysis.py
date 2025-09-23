import os
import psycopg2
from flask import Flask, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

DB_HOST = os.getenv('DB_HOST', 'postgres')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASS = os.getenv('DB_PASSWORD', 'postgres')
DB_NAME = os.getenv('DB_NAME', 'metricsdb')
DB_PORT = int(os.getenv('DB_PORT', 5432))

def get_conn():
    return psycopg2.connect(host=DB_HOST, user=DB_USER, password=DB_PASS, dbname=DB_NAME, port=DB_PORT)

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Lê raw_data, calcula média/min/max/count dos últimos 7 dias,
    grava 1 métrica de exemplo na tabela metrics e retorna o resultado.
    """
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT value FROM raw_data WHERE created_at >= now() - interval '7 days'")
        rows = cur.fetchall()
        values = [float(r[0]) for r in rows] if rows else []
        if values:
            avg = sum(values) / len(values)
            mx = max(values)
            mn = min(values)
            cnt = len(values)
        else:
            avg = mx = mn = 0
            cnt = 0
        # salva uma métrica de exemplo
        cur.execute("INSERT INTO metrics(metric_name, metric_value, computed_at) VALUES (%s, %s, now())",
                    ('avg_last7', avg))
        conn.commit()
        return jsonify({"avg": avg, "max": mx, "min": mn, "count": cnt})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/metrics', methods=['GET'])
def metrics():
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, metric_name, metric_value, computed_at FROM metrics ORDER BY computed_at DESC LIMIT 100")
        rows = cur.fetchall()
        data = [{"id": r[0], "metric_name": r[1], "metric_value": float(r[2]), "computed_at": r[3].isoformat()} for r in rows]
        return jsonify({"rows": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
