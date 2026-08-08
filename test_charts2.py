import urllib.request
import json

endpoints = [
    '/api/v1/analytics/investment-timeline',
    '/api/v1/analytics/career-timeline',
    '/api/v1/analytics/department-comparison',
    '/api/v1/analytics/readiness-timeline',
    '/api/v1/analytics/ai-timeline'
]

for ep in endpoints:
    try:
        response = urllib.request.urlopen(f'http://127.0.0.1:8000{ep}', timeout=5)
        data = json.loads(response.read())
        print(f"--- {ep} ---")
        print(json.dumps(data)[:300] + "...")
    except Exception as e:
        print(f"Error for {ep}: {e}")
