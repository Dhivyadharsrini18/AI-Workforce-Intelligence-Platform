import random
from typing import Dict, Any, List
from sqlalchemy import select, func, case, extract
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from app.models.employee import Employee
from app.models.department import Department
from app.models.skill import Skill
from app.models.history_records import HiringRecord, AttritionRecord, SalaryHistory

class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_employee_distribution(self) -> Dict[str, Any]:
        """Data for PieChart: Employee Distribution by Department."""
        stmt = select(Department.name, func.count(Employee.id)).outerjoin(Employee).group_by(Department.name)
        result = await self.db.execute(stmt)
        data = [{"name": row[0], "value": row[1]} for row in result.all()]
        return {"series": [{"name": "Employees", "data": data}]}

    async def get_department_performance(self) -> Dict[str, Any]:
        """Data for RadarChart: Department Performance metrics."""
        stmt = select(
            Department.name, 
            func.avg(Employee.performance_score),
            func.avg(Employee.engagement_score),
            func.avg(Employee.readiness_score)
        ).join(Employee).group_by(Department.name).limit(5)
        
        result = await self.db.execute(stmt)
        rows = result.all()
        
        indicator = [
            {"name": "Performance", "max": 100},
            {"name": "Engagement", "max": 100},
            {"name": "Readiness", "max": 100},
            {"name": "Retention", "max": 100},
            {"name": "Utilization", "max": 100}
        ]
        
        series_data = []
        for row in rows:
            dept_name = row[0]
            perf = row[1] or 0
            eng = row[2] or 0
            readiness = row[3] or 0
            # mock retention and utilization for now
            retention = random.randint(70, 95)
            utilization = random.randint(60, 90)
            
            series_data.append({
                "value": [round(perf), round(eng), round(readiness), retention, utilization],
                "name": dept_name
            })
            
        return {
            "radar": {"indicator": indicator},
            "series": [{"data": series_data}]
        }

    async def get_hiring_vs_attrition(self) -> Dict[str, Any]:
        """Data for AreaChart: Hiring vs Attrition trend (last 12 months)."""
        months = [(datetime.now().replace(day=1) - timedelta(days=30*i)).strftime('%Y-%m') for i in range(11, -1, -1)]
        
        # This is a simplified approximation; in SQLite, exact date grouping might be tricky
        # We will mock the trend based on DB counts but distributed over months
        hiring_stmt = select(func.count(HiringRecord.id))
        attr_stmt = select(func.count(AttritionRecord.id))
        
        total_hires = (await self.db.execute(hiring_stmt)).scalar() or 0
        total_attr = (await self.db.execute(attr_stmt)).scalar() or 0
        
        # Distribute roughly
        hiring_data = [max(0, int(total_hires/12) + random.randint(-5, 5)) for _ in months]
        attr_data = [max(0, int(total_attr/12) + random.randint(-2, 2)) for _ in months]
        
        return {
            "xAxis": months,
            "series": [
                {"name": "Hiring", "data": hiring_data},
                {"name": "Attrition", "data": attr_data}
            ]
        }

    async def get_revenue_vs_cost(self) -> Dict[str, Any]:
        """Data for MixedChart: Revenue vs Cost."""
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        revenue = [random.randint(500, 800) for _ in months]
        cost = [random.randint(300, 500) for _ in months]
        return {
            "xAxis": months,
            "series": [
                {"name": "Revenue ($k)", "data": revenue, "type": "bar"},
                {"name": "Cost ($k)", "data": cost, "type": "line"}
            ]
        }

    async def get_monthly_productivity(self) -> Dict[str, Any]:
        """Data for LineChart: Monthly Productivity."""
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        return {
            "xAxis": months,
            "series": [{"name": "Productivity Score", "data": [75, 78, 80, 85, 82, 88]}]
        }

    async def get_ai_accuracy(self) -> Dict[str, Any]:
        """Data for GaugeChart: AI Prediction Accuracy."""
        return {
            "series": [{"data": [{"value": 94.2, "name": "Accuracy"}]}]
        }

    async def get_workforce_utilization(self) -> Dict[str, Any]:
        """Data for HeatmapChart: Workforce Utilization."""
        return {
            "xAxis": ["Mon", "Tue", "Wed", "Thu", "Fri"],
            "yAxis": ["Engineering", "Sales", "HR", "Marketing"],
            "series": [{"data": [[i, j, random.randint(60, 100)] for i in range(5) for j in range(4)]}]
        }

    async def get_executive_kpi(self) -> Dict[str, Any]:
        """Data for LineChart: Executive KPI Trend."""
        months = ["Q1", "Q2", "Q3", "Q4"]
        return {
            "xAxis": months,
            "series": [
                {"name": "Goal", "data": [80, 85, 90, 95]},
                {"name": "Actual", "data": [78, 86, 88, 96]}
            ]
        }

    async def get_skill_demand_trend(self) -> Dict[str, Any]:
        """Data for LineChart: Skill Demand Trend."""
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        return {
            "xAxis": months,
            "series": [
                {"name": "AI/ML", "data": [50, 60, 75, 85, 95, 100]},
                {"name": "Cloud", "data": [70, 72, 75, 78, 80, 82]},
                {"name": "Cybersecurity", "data": [40, 45, 55, 60, 70, 75]}
            ]
        }

    async def get_workforce_forecast(self) -> Dict[str, Any]:
        """Data for LineChart: Workforce Forecast."""
        years = ["2023", "2024", "2025 (Est)", "2026 (Est)"]
        return {
            "xAxis": years,
            "series": [{"name": "Headcount", "data": [5000, 5200, 5500, 5900]}]
        }

    async def get_recruitment_pipeline(self) -> Dict[str, Any]:
        """Data for FunnelChart: Recruitment Pipeline."""
        return {
            "series": [{"data": [
                {"value": 1000, "name": "Applications"},
                {"value": 500, "name": "Screening"},
                {"value": 200, "name": "Interviews"},
                {"value": 50, "name": "Offers"},
                {"value": 40, "name": "Hires"}
            ]}]
        }
