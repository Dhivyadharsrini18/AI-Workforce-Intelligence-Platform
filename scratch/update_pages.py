import os
import re

PAGES_DIR = r"c:\vs project\Agilisium DIVI\frontend\src\pages"

def insert_lazy_imports(content, components):
    imports = "\n// Lazy loaded charts\n"
    for comp in components:
        imports += f"const {comp} = React.lazy(() => import('../components/charts/{comp}'));\n"
    
    # insert before "export default function"
    if "import React" not in content and "import { useState" in content:
        content = content.replace("import { useState", "import React, { useState, Suspense")
    elif "import React" not in content:
        content = "import React, { Suspense } from 'react';\n" + content
    else:
        if "Suspense" not in content:
            content = content.replace("import React, {", "import React, { Suspense,")
    
    content = content.replace("export default function", imports + "\nexport default function")
    return content

def insert_charts_grid(content, charts):
    grid = "\n      {/* Advanced Enterprise Analytics */}\n"
    
    for i in range(0, len(charts), 2):
        grid += '      <motion.div variants={staggerItem} className="modular-grid mt-6">\n'
        for chart in charts[i:i+2]:
            grid += f'''        <Suspense fallback={{<div className="span-6 h-64 bg-card rounded animate-pulse" />}}>
          <div className="span-6">
            <{chart['type']} title="{chart['title']}" endpoint="{chart['endpoint']}" />
          </div>
        </Suspense>\n'''
        grid += '      </motion.div>\n'
        
    # insert before the final </motion.div>
    last_motion_div = content.rfind("</motion.div>")
    if last_motion_div != -1:
        content = content[:last_motion_div] + grid + content[last_motion_div:]
    return content

PAGE_CONFIGS = {
    "SkillForecastPage.tsx": {
        "components": ["LineChart", "AreaChart", "GaugeChart", "CalendarHeatmap", "SankeyChart", "BarChart", "WaterfallChart", "HeatmapChart"],
        "charts": [
            {"title": "Historical vs Forecast", "type": "LineChart", "endpoint": "/analytics/historical-forecast"},
            {"title": "Confidence Interval", "type": "AreaChart", "endpoint": "/analytics/confidence-interval"},
            {"title": "Forecast Accuracy", "type": "GaugeChart", "endpoint": "/analytics/forecast-accuracy"},
            {"title": "Seasonal Trend", "type": "CalendarHeatmap", "endpoint": "/analytics/seasonal-trend"},
            {"title": "Technology Adoption", "type": "SankeyChart", "endpoint": "/analytics/technology-adoption"},
            {"title": "Industry Benchmark", "type": "BarChart", "endpoint": "/analytics/industry-benchmark"},
            {"title": "Growth Projection", "type": "WaterfallChart", "endpoint": "/analytics/growth-projection"},
            {"title": "Future Demand Heatmap", "type": "HeatmapChart", "endpoint": "/analytics/future-demand"},
        ]
    },
    "SkillGapPage.tsx": {
        "components": ["RadarChart", "HeatmapChart", "ScatterChart", "ParallelChart", "PieChart", "BarChart", "LineChart"],
        "charts": [
            {"title": "Skill Gap Radar", "type": "RadarChart", "endpoint": "/analytics/skill-gap-radar"},
            {"title": "Department Heatmap", "type": "HeatmapChart", "endpoint": "/analytics/gap-department-heatmap"},
            {"title": "Priority Matrix", "type": "ScatterChart", "endpoint": "/analytics/priority-matrix"},
            {"title": "Capability Comparison", "type": "ParallelChart", "endpoint": "/analytics/capability-comparison"},
            {"title": "Gap Distribution", "type": "PieChart", "endpoint": "/analytics/gap-distribution"},
            {"title": "Critical Skills Ranking", "type": "BarChart", "endpoint": "/analytics/critical-skills"},
            {"title": "AI Recommendation Timeline", "type": "LineChart", "endpoint": "/analytics/ai-timeline"},
        ]
    },
    "LearningPage.tsx": {
        "components": ["GaugeChart", "LineChart", "DonutChart", "CalendarHeatmap", "FunnelChart", "BarChart", "AreaChart"],
        "charts": [
            {"title": "Learning Progress", "type": "GaugeChart", "endpoint": "/analytics/learning-progress"},
            {"title": "Weekly Learning Trend", "type": "LineChart", "endpoint": "/analytics/learning-trend"},
            {"title": "Course Completion", "type": "DonutChart", "endpoint": "/analytics/course-completion"},
            {"title": "Certification Timeline", "type": "LineChart", "endpoint": "/analytics/certification-timeline"},
            {"title": "Learning Heatmap", "type": "CalendarHeatmap", "endpoint": "/analytics/learning-heatmap"},
            {"title": "Completion Funnel", "type": "FunnelChart", "endpoint": "/analytics/completion-funnel"},
            {"title": "AI Recommended Courses", "type": "BarChart", "endpoint": "/analytics/recommended-courses"},
            {"title": "Learning ROI", "type": "AreaChart", "endpoint": "/analytics/learning-roi"},
        ]
    },
    "ReadinessPage.tsx": {
        "components": ["GaugeChart", "ScatterChart", "BoxPlot", "BarChart", "PieChart", "LineChart"],
        "charts": [
            {"title": "Readiness Gauge", "type": "GaugeChart", "endpoint": "/analytics/readiness-gauge"},
            {"title": "Promotion Readiness", "type": "ScatterChart", "endpoint": "/analytics/promotion-readiness"},
            {"title": "Department Comparison", "type": "BoxPlot", "endpoint": "/analytics/department-comparison"},
            {"title": "Feature Importance", "type": "BarChart", "endpoint": "/analytics/feature-importance"},
            {"title": "SHAP Summary", "type": "BarChart", "endpoint": "/analytics/shap-summary"},
            {"title": "Readiness Distribution", "type": "PieChart", "endpoint": "/analytics/readiness-distribution"},
            {"title": "Readiness Timeline", "type": "LineChart", "endpoint": "/analytics/readiness-timeline"},
            {"title": "AI Confidence", "type": "GaugeChart", "endpoint": "/analytics/ai-confidence"},
        ]
    },
    "PromotionAnalyticsPage.tsx": {
        "components": ["GaugeChart", "BarChart", "RadarChart", "ScatterChart", "FunnelChart", "TreeChart", "AreaChart"],
        "charts": [
            {"title": "Promotion Probability", "type": "GaugeChart", "endpoint": "/analytics/promotion-probability"},
            {"title": "Candidate Ranking", "type": "BarChart", "endpoint": "/analytics/candidate-ranking"},
            {"title": "Leadership Radar", "type": "RadarChart", "endpoint": "/analytics/leadership-radar"},
            {"title": "Performance Matrix", "type": "ScatterChart", "endpoint": "/analytics/performance-matrix"},
            {"title": "Promotion Funnel", "type": "FunnelChart", "endpoint": "/analytics/promotion-funnel"},
            {"title": "Career Timeline", "type": "TreeChart", "endpoint": "/analytics/career-timeline"},
            {"title": "AI Confidence Chart", "type": "AreaChart", "endpoint": "/analytics/promotion-ai-confidence"},
        ]
    },
    "AttritionAnalyticsPage.tsx": {
        "components": ["LineChart", "ScatterChart", "DonutChart", "HeatmapChart", "BarChart", "GaugeChart"],
        "charts": [
            {"title": "Attrition Trend", "type": "LineChart", "endpoint": "/analytics/attrition-trend"},
            {"title": "Burnout Analysis", "type": "ScatterChart", "endpoint": "/analytics/burnout-analysis"},
            {"title": "Risk Distribution", "type": "DonutChart", "endpoint": "/analytics/risk-distribution"},
            {"title": "Department Risk Heatmap", "type": "HeatmapChart", "endpoint": "/analytics/department-risk-heatmap"},
            {"title": "Employee Risk Ranking", "type": "BarChart", "endpoint": "/analytics/employee-risk-ranking"},
            {"title": "Retention Probability", "type": "GaugeChart", "endpoint": "/analytics/retention-probability"},
            {"title": "SHAP Explanation", "type": "BarChart", "endpoint": "/analytics/attrition-shap"},
        ]
    },
    "ROIAnalyticsPage.tsx": {
        "components": ["MixedChart", "PieChart", "AreaChart", "LineChart", "ScatterChart", "WaterfallChart", "BarChart"],
        "charts": [
            {"title": "ROI Comparison", "type": "MixedChart", "endpoint": "/analytics/roi-comparison"},
            {"title": "Cost Breakdown", "type": "PieChart", "endpoint": "/analytics/cost-breakdown"},
            {"title": "Investment Timeline", "type": "AreaChart", "endpoint": "/analytics/investment-timeline"},
            {"title": "Scenario Simulation", "type": "LineChart", "endpoint": "/analytics/scenario-simulation"},
            {"title": "Decision Matrix", "type": "ScatterChart", "endpoint": "/analytics/decision-matrix"},
            {"title": "Financial Projection", "type": "WaterfallChart", "endpoint": "/analytics/financial-projection"},
            {"title": "Cost Saving Analysis", "type": "BarChart", "endpoint": "/analytics/cost-saving"},
        ]
    }
}

for page_file, config in PAGE_CONFIGS.items():
    file_path = os.path.join(PAGES_DIR, page_file)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # fallback MixedChart for BarChart if not created explicitly
        if "BarChart" in config["components"]:
            content = insert_lazy_imports(content, [c for c in config["components"] if c != "BarChart"])
            content = content.replace("export default function", "const BarChart = React.lazy(() => import('../components/charts/MixedChart'));\nexport default function")
        else:
            content = insert_lazy_imports(content, config["components"])
            
        content = insert_charts_grid(content, config["charts"])
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {page_file}")
    else:
        print(f"Warning: {page_file} not found.")

