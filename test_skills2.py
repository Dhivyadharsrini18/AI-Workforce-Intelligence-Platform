import urllib.request
import json

try:
    response = urllib.request.urlopen('http://127.0.0.1:8000/api/v1/skills/emerging?limit=5', timeout=5)
    print("Emerging:", json.loads(response.read()))
except Exception as e:
    print(f"ERROR: {e}")
