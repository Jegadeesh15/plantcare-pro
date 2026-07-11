import sqlite3
import os

db_path = os.path.join('backend', 'app.db')
print(f"Testing connection to: {db_path}")

try:
    if os.path.exists(db_path):
        print("File exists.")
    else:
        print("File does not exist. Creating...")
        
    conn = sqlite3.connect(db_path)
    print("Connection established via sqlite3.")
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)")
    print("Table created.")
    conn.close()
    print("Connection closed.")
except Exception as e:
    print(f"Error: {e}")
