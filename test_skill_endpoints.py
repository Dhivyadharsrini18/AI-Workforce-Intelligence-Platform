import urllib.request
import json

endpoints = [
    '/api/v1/analytics/skill-demand-trend-global',
    '/api/v1/analytics/skill-supply-demand',
    '/api/v1/analytics/skill-heatmap-advanced',
    '/api/v1/analytics/technology-radar',
    '/api/v1/analytics/emerging-skills-advanced',
    '/api/v1/analytics/skill-dependency',
    '/api/v1/analytics/certification-distribution',
    '/api/v1/analytics/ai-readiness-comparison',
    '/api/v1/analytics/department-skill-matrix'
]

for ep in endpoints:
    try:
        response = urllib.request.urlopen(f'http://127.0.0.1:8000{ep}', timeout=5)
        data = json.loads(response.read())
        print(f"--- {ep} --- SUCCESS")
    except Exception as e:
        print(f"--- {ep} --- ERROR: {e}")
