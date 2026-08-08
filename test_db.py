import sqlite3
import os

db_path = os.path.join("backend", "workforce_intelligence.db")
if not os.path.exists(db_path):
    print("DB NOT FOUND!")
else:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT count(*) FROM skills")
    count = cur.fetchone()[0]
    print(f"Skills count: {count}")
