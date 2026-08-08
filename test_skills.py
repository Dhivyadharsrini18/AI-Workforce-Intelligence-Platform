import urllib.request
import json

try:
    response = urllib.request.urlopen('http://127.0.0.1:8000/api/v1/analytics/department-heatmap', timeout=5)
    print("Department Heatmap:", json.loads(response.read())[:50])
except Exception as e:
    print(f"ERROR: {e}")

try:
    response = urllib.request.urlopen('http://127.0.0.1:8000/api/v1/skills/forecast?skill_name=Python&months=12', timeout=5)
    print("Forecast:", json.loads(response.read())[:50])
except Exception as e:
    print(f"ERROR: {e}")
