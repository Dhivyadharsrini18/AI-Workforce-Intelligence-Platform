import urllib.request
import json

try:
    response = urllib.request.urlopen('http://127.0.0.1:8000/api/v1/analytics/ai-insights', timeout=5)
    data = json.loads(response.read())
    print(data)
except Exception as e:
    print(f"ERROR: {e}")
