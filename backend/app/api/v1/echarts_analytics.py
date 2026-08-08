from fastapi import APIRouter
import random
import datetime

router = APIRouter(prefix="/analytics", tags=["echarts"])

@router.get("/{chart_id}")
def get_chart_data(chart_id: str):
    if "distribution" in chart_id or "mix" in chart_id or "demographics" in chart_id or "diversity" in chart_id:
        return {"series": [{"name": "Data", "data": [
            {"name": "Technical", "value": 35},
            {"name": "Leadership", "value": 25},
            {"name": "Data & AI", "value": 20}
        ]}]}
    elif "trend" in chart_id or "forecast" in chart_id:
        if "accuracy" in chart_id:
             return {"series": [{"name": "Accuracy", "data": [{"value": 94.2, "name": "Score"}]}]}
        if "seasonal" in chart_id:
             return {"series": [{"name": "Trend", "data": [["2024-01-01", 10], ["2024-01-02", 20], ["2024-02-15", 30], ["2024-03-20", 15], ["2024-04-10", 35], ["2024-05-05", 25]]}]}
        return {"xAxis": ["Jan", "Feb", "Mar", "Apr", "May"], "series": [{"name": "Metric", "data": [10, 20, 15, 30, 25]}]}
    elif "radar" in chart_id or "skills" in chart_id:
        return {"radar": {"indicator": [{"name": "Technical", "max": 100}, {"name": "Communication", "max": 100}, {"name": "Leadership", "max": 100}]}, "series": [{"data": [{"value": [80, 75, 90], "name": "Score"}]}]}
    elif "scatter" in chart_id or "matrix" in chart_id or "analysis" in chart_id:
        return {"series": [{"data": [[10, 20], [15, 25], [30, 40], [35, 50], [45, 60], [50, 40]]}]}
    elif "heatmap" in chart_id:
        if "learning" in chart_id or "calendar" in chart_id:
            year = datetime.datetime.now().year
            start_date = datetime.date(year, 1, 1)
            data = []
            for i in range(365):
                current_date = start_date + datetime.timedelta(days=i)
                data.append([current_date.strftime("%Y-%m-%d"), random.randint(0, 100) if random.random() > 0.4 else 0])
            return {"series": [{"name": "Learning Hours", "data": data}]}
        return {"xAxis": ["Mon", "Tue", "Wed"], "yAxis": ["Morning", "Afternoon"], "series": [{"data": [[0, 0, 5], [0, 1, 10], [1, 0, 15], [1, 1, 20], [2, 0, 25], [2, 1, 30]]}]}
    elif "progress" in chart_id or "gauge" in chart_id:
        return {"series": [{"name": "Progress", "data": [{"value": random.randint(65, 95), "name": "Score"}]}]}
    elif "adoption" in chart_id:
        return {"series": [{"data": [{"name": "Applications"}, {"name": "Screening"}, {"name": "Interviews"}], "links": [{"source": "Applications", "target": "Screening", "value": 10}, {"source": "Screening", "target": "Interviews", "value": 5}]}]}
    elif "career-timeline" in chart_id:
        return {"series": [{"data": [{"name": "Junior", "children": [{"name": "Mid", "children": [{"name": "Senior"}]}]}]}]}
    elif "timeline" in chart_id:
        return {"xAxis": ["2020", "2021", "2022", "2023", "2024", "2025"], "series": [{"name": "Progress", "data": [45, 60, 55, 80, 75, 95]}]}
    elif "department-comparison" in chart_id or "boxplot" in chart_id:
        return {
            "xAxis": ["Engineering", "Sales", "Marketing", "HR"],
            "series": [{"name": "Score Distribution", "data": [
                [50, 60, 70, 80, 95],
                [40, 55, 65, 75, 90],
                [30, 45, 60, 70, 85],
                [60, 70, 80, 90, 100]
            ]}]
        }
    elif "funnel" in chart_id:
        return {"series": [{"data": [{"name": "Candidates", "value": 100}, {"name": "Qualified", "value": 50}, {"name": "Promoted", "value": 10}]}]}
    elif "location" in chart_id:
        return {"series": [{"data": [{"name": "North America", "value": 120}, {"name": "Europe", "value": 80}, {"name": "Asia", "value": 150}]}]}
    elif "probability" in chart_id:
        return {"series": [{"name": "Probability", "data": [{"value": 85, "name": "Score"}]}]}
    
    # Generic fallback that should satisfy basic charts
    return {
        "xAxis": ["Q1", "Q2", "Q3", "Q4"],
        "series": [{"name": "Value", "data": [random.randint(10, 100) for _ in range(4)]}]
    }
