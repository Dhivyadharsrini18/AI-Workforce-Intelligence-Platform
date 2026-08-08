import os
import random
import uuid
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from faker import Faker

print("Initializing Enterprise Dataset Generation...")

# Setup
fake = Faker()
Faker.seed(42)
np.random.seed(42)
random.seed(42)

OUTPUT_DIR = "datasets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_csv(df, filename):
    filepath = os.path.join(OUTPUT_DIR, filename)
    df.to_csv(filepath, index=False)
    print(f"Generated {filename} ({len(df):,} records)")

# ---------------------------------------------------------
# Configuration & Record Counts
# ---------------------------------------------------------
N_DEPARTMENTS = 20
N_SKILLS = 300
N_COURSES = 1000
N_CERTIFICATIONS = 500
N_EMPLOYEES = 10000
N_EMPLOYEE_SKILLS = 85000
N_LEARNING_RECORDS = 100000
N_PROJECTS = 5000
N_EMPLOYEE_PROJECTS = 30000
N_PERF_REVIEWS = 50000
N_ATTENDANCE = 500000
N_PROMOTIONS = 10000
N_ATTRITIONS = 10000
N_MGR_RATINGS = 50000
N_JOB_MARKET = 50000
N_INDUSTRY_TRENDS = 100000
N_RECRUITMENT = 25000
N_CANDIDATES = 15000
N_INTERVIEWS = 40000
N_FEEDBACK = 80000
N_ENGAGEMENT = 80000
N_CAREER_PATHS = 300
N_LEARNING_PATHS = 500
N_SKILL_RELS = 5000

# ---------------------------------------------------------
# Phase 1: Foundation (Taxonomies & Catalogs)
# ---------------------------------------------------------

# 1. Departments
department_names = [
    "Engineering", "Data Science", "Product Management", "Design", 
    "Marketing", "Sales", "Human Resources", "Finance", "Legal", 
    "Customer Support", "Operations", "Information Technology",
    "Research & Development", "Quality Assurance", "Security",
    "DevOps", "Cloud Infrastructure", "Business Intelligence",
    "Supply Chain", "Corporate Strategy"
]
depts = pd.DataFrame({
    "department_id": [f"D{str(i).zfill(3)}" for i in range(1, N_DEPARTMENTS + 1)],
    "department_name": department_names[:N_DEPARTMENTS],
    "head": [fake.name() for _ in range(N_DEPARTMENTS)]
})
save_csv(depts, "departments.csv")

# 2. Skills
skill_categories = ["Technical", "Soft Skill", "Domain Expertise", "Leadership", "Tools"]
skills = pd.DataFrame({
    "skill_id": [f"SK{str(i).zfill(4)}" for i in range(1, N_SKILLS + 1)],
    "skill_name": [fake.job().split()[0] + " " + fake.bs().split()[-1].capitalize() for _ in range(N_SKILLS)],
    "category": np.random.choice(skill_categories, N_SKILLS),
    "subcategory": [fake.word().capitalize() for _ in range(N_SKILLS)],
    "current_demand": np.random.randint(1, 100, N_SKILLS),
    "future_demand": np.random.randint(1, 100, N_SKILLS),
    "difficulty": np.random.choice(["Beginner", "Intermediate", "Advanced", "Expert"], N_SKILLS, p=[0.2, 0.4, 0.3, 0.1]),
    "emerging_score": np.random.randint(1, 100, N_SKILLS)
})
skills["growth_rate"] = ((skills["future_demand"] - skills["current_demand"]) / skills["current_demand"]) * 100
skills["growth_rate"] = skills["growth_rate"].round(2)
skills["market_trend"] = np.where(skills["growth_rate"] > 10, "Rising", np.where(skills["growth_rate"] < -10, "Declining", "Stable"))
save_csv(skills, "skills.csv")

# 3. Skill Taxonomy & Relationships
taxonomy = skills[["skill_id", "category", "subcategory"]].copy()
save_csv(taxonomy, "skill_taxonomy.csv")

skill_rels = pd.DataFrame({
    "source_skill_id": np.random.choice(skills["skill_id"], N_SKILL_RELS),
    "target_skill_id": np.random.choice(skills["skill_id"], N_SKILL_RELS),
    "relationship_type": np.random.choice(["Prerequisite", "Related", "Advanced", "Alternative"], N_SKILL_RELS)
})
skill_rels = skill_rels[skill_rels["source_skill_id"] != skill_rels["target_skill_id"]].drop_duplicates()
save_csv(skill_rels, "skill_relationships.csv")

# 4. Courses & Learning Catalog
providers = ["Coursera", "Udemy", "LinkedIn Learning", "Internal", "Microsoft", "AWS", "Google"]
courses = pd.DataFrame({
    "course_id": [f"C{str(i).zfill(5)}" for i in range(1, N_COURSES + 1)],
    "course_name": [f"{fake.catch_phrase()} in {fake.word().capitalize()}" for _ in range(N_COURSES)],
    "provider": np.random.choice(providers, N_COURSES),
    "duration_hours": np.random.randint(1, 100, N_COURSES),
    "difficulty": np.random.choice(["Beginner", "Intermediate", "Advanced"], N_COURSES),
    "rating": np.random.uniform(3.0, 5.0, N_COURSES).round(1),
    "completion_rate": np.random.uniform(20, 95, N_COURSES).round(1),
    "estimated_roi": np.random.uniform(5, 50, N_COURSES).round(1)
})
# Map course to a primary skill
courses["primary_skill_id"] = np.random.choice(skills["skill_id"], N_COURSES)
save_csv(courses, "courses.csv")
save_csv(courses[["course_id", "course_name", "provider", "primary_skill_id"]], "learning_catalog.csv")

# 5. Certifications
certifications = pd.DataFrame({
    "certification_id": [f"CERT{str(i).zfill(4)}" for i in range(1, N_CERTIFICATIONS + 1)],
    "certification_name": [f"Certified {fake.job()} Professional" for _ in range(N_CERTIFICATIONS)],
    "provider": np.random.choice(providers, N_CERTIFICATIONS),
    "validity_months": np.random.choice([12, 24, 36, 999], N_CERTIFICATIONS), # 999 = lifetime
    "primary_skill_id": np.random.choice(skills["skill_id"], N_CERTIFICATIONS)
})
save_csv(certifications, "certifications.csv")

# 6. Career Paths & Learning Paths
career_paths = pd.DataFrame({
    "path_id": [f"CP{str(i).zfill(3)}" for i in range(1, N_CAREER_PATHS + 1)],
    "path_name": [f"{fake.job()} Track" for _ in range(N_CAREER_PATHS)],
    "department_id": np.random.choice(depts["department_id"], N_CAREER_PATHS),
    "required_skills": [",".join(np.random.choice(skills["skill_id"], np.random.randint(3, 8), replace=False)) for _ in range(N_CAREER_PATHS)]
})
save_csv(career_paths, "career_paths.csv")

learning_paths = pd.DataFrame({
    "lp_id": [f"LP{str(i).zfill(3)}" for i in range(1, N_LEARNING_PATHS + 1)],
    "lp_name": [f"Path to {fake.job()}" for _ in range(N_LEARNING_PATHS)],
    "course_ids": [",".join(np.random.choice(courses["course_id"], np.random.randint(3, 10), replace=False)) for _ in range(N_LEARNING_PATHS)],
    "target_skill_id": np.random.choice(skills["skill_id"], N_LEARNING_PATHS)
})
save_csv(learning_paths, "learning_paths.csv")

# ---------------------------------------------------------
# Phase 2: Core Entity (Employees)
# ---------------------------------------------------------
print("Generating 10,000 Employees (Phase 2)...")
emp_ids = [f"EMP{str(i).zfill(5)}" for i in range(1, N_EMPLOYEES + 1)]
departments_assigned = np.random.choice(depts["department_id"], N_EMPLOYEES)
join_dates = [fake.date_between(start_date='-10y', end_date='today') for _ in range(N_EMPLOYEES)]

# Calculate tenure in years
today = datetime.now().date()
tenure = [(today - d).days / 365.25 for d in join_dates]
experience = [round(t + np.random.uniform(0, 15), 1) for t in tenure]

# Salaries based on experience
base_salaries = np.clip(np.random.normal(70000, 20000, N_EMPLOYEES) + (np.array(experience) * 3000), 40000, 250000)

# Performance & ML Targets
performance = np.clip(np.random.normal(3.5, 0.8, N_EMPLOYEES), 1.0, 5.0).round(1)
learning_hours = np.random.randint(0, 120, N_EMPLOYEES)
manager_ratings = np.clip(performance + np.random.normal(0, 0.5, N_EMPLOYEES), 1.0, 5.0).round(1)

# Synthetic ML Targets based on features
readiness_score = np.clip((performance * 10) + (learning_hours * 0.2) + (np.array(experience) * 2) + np.random.normal(0, 5, N_EMPLOYEES), 0, 100)
leadership_score = np.clip((manager_ratings * 15) + (np.array(experience) * 1.5) + np.random.normal(0, 10, N_EMPLOYEES), 0, 100)
promotion_target = np.where(readiness_score + leadership_score > 150, 1, 0)
attrition_target = np.where((manager_ratings < 2.5) | (np.array(tenure) > 5) & (promotion_target == 0), np.random.choice([0, 1], p=[0.7, 0.3]), 0)

employees = pd.DataFrame({
    "employee_id": emp_ids,
    "first_name": [fake.first_name() for _ in range(N_EMPLOYEES)],
    "last_name": [fake.last_name() for _ in range(N_EMPLOYEES)],
    "gender": np.random.choice(["Male", "Female", "Non-Binary", "Prefer not to say"], N_EMPLOYEES, p=[0.48, 0.48, 0.02, 0.02]),
    "age": np.clip(np.array(experience) + 22 + np.random.normal(0, 3, N_EMPLOYEES), 22, 65).astype(int),
    "department_id": departments_assigned,
    "job_title": [fake.job() for _ in range(N_EMPLOYEES)],
    "employment_type": np.random.choice(["Full-Time", "Contract", "Part-Time"], N_EMPLOYEES, p=[0.85, 0.1, 0.05]),
    "experience_years": experience,
    "joining_date": join_dates,
    "salary": base_salaries.round(2),
    "bonus": (base_salaries * np.random.uniform(0, 0.2, N_EMPLOYEES)).round(2),
    "manager_id": np.random.choice(emp_ids, N_EMPLOYEES), # Self/random assigned for simplicity, fixed below
    "location": [fake.city() for _ in range(N_EMPLOYEES)],
    "country": [fake.country() for _ in range(N_EMPLOYEES)],
    "performance": performance,
    "training_hours": learning_hours,
    "manager_rating": manager_ratings,
    "project_count": np.random.randint(1, 15, N_EMPLOYEES),
    "certification_count": np.random.randint(0, 5, N_EMPLOYEES),
    "status": np.where(attrition_target == 1, "Exited", "Active"),
    # ML Targets
    "readiness_score": readiness_score.round(2),
    "leadership_score": leadership_score.round(2),
    "technical_score": np.clip(np.random.normal(70, 15, N_EMPLOYEES), 0, 100).round(2),
    "business_score": np.clip(np.random.normal(65, 15, N_EMPLOYEES), 0, 100).round(2),
    "skill_gap_score": np.clip(100 - readiness_score + np.random.normal(0, 5, N_EMPLOYEES), 0, 100).round(2),
    "promotion_probability": np.clip((readiness_score + leadership_score) / 2, 0, 100).round(2),
    "attrition_probability": np.where(attrition_target == 1, np.random.uniform(70, 99, N_EMPLOYEES), np.random.uniform(5, 40, N_EMPLOYEES)).round(2),
    "engagement_score": np.where(attrition_target == 1, np.random.uniform(1, 3, N_EMPLOYEES), np.random.uniform(3, 5, N_EMPLOYEES)).round(1),
    "promotion_target": promotion_target,
    "attrition_target": attrition_target,
    "learning_priority": np.random.choice(["High", "Medium", "Low"], N_EMPLOYEES, p=[0.2, 0.5, 0.3])
})

# Fix managers (Managers shouldn't manage themselves, mostly point to older employees)
employees["manager_id"] = np.roll(employees["employee_id"], 10) 

save_csv(employees, "employees.csv")

# ---------------------------------------------------------
# Phase 3: Employee Mappings & History
# ---------------------------------------------------------
print("Generating Mappings (Phase 3)...")
employee_skills = pd.DataFrame({
    "employee_id": np.random.choice(emp_ids, N_EMPLOYEE_SKILLS),
    "skill_id": np.random.choice(skills["skill_id"], N_EMPLOYEE_SKILLS),
    "proficiency_level": np.random.randint(1, 6, N_EMPLOYEE_SKILLS),
    "target_level": np.random.randint(1, 6, N_EMPLOYEE_SKILLS)
})
employee_skills = employee_skills.drop_duplicates(subset=["employee_id", "skill_id"])
save_csv(employee_skills, "employee_skills.csv")

learning_records = pd.DataFrame({
    "record_id": [f"LR{str(i).zfill(6)}" for i in range(1, N_LEARNING_RECORDS + 1)],
    "employee_id": np.random.choice(emp_ids, N_LEARNING_RECORDS),
    "course_id": np.random.choice(courses["course_id"], N_LEARNING_RECORDS),
    "status": np.random.choice(["Completed", "In Progress", "Not Started"], N_LEARNING_RECORDS, p=[0.7, 0.2, 0.1]),
    "score": np.random.uniform(50, 100, N_LEARNING_RECORDS).round(1),
    "completion_date": [fake.date_between(start_date='-2y', end_date='today') for _ in range(N_LEARNING_RECORDS)],
    "training_roi": np.random.uniform(10, 150, N_LEARNING_RECORDS).round(1) # ML target
})
save_csv(learning_records, "learning_records.csv")

perf_reviews = pd.DataFrame({
    "review_id": [f"PR{str(i).zfill(5)}" for i in range(1, N_PERF_REVIEWS + 1)],
    "employee_id": np.random.choice(emp_ids, N_PERF_REVIEWS),
    "review_date": [fake.date_between(start_date='-3y', end_date='today') for _ in range(N_PERF_REVIEWS)],
    "score": np.random.uniform(1, 5, N_PERF_REVIEWS).round(1),
    "reviewer_id": np.random.choice(emp_ids, N_PERF_REVIEWS)
})
save_csv(perf_reviews, "performance_reviews.csv")

manager_ratings_df = perf_reviews.copy()
manager_ratings_df["rating_type"] = "Upward Feedback"
manager_ratings_df.rename(columns={"score": "manager_effectiveness_score"}, inplace=True)
save_csv(manager_ratings_df, "manager_ratings.csv")

engagement_df = pd.DataFrame({
    "employee_id": np.random.choice(emp_ids, N_ENGAGEMENT),
    "date": [fake.date_between(start_date='-2y', end_date='today') for _ in range(N_ENGAGEMENT)],
    "engagement_score": np.random.uniform(1, 5, N_ENGAGEMENT).round(1),
    "sentiment": np.random.choice(["Positive", "Neutral", "Negative"], N_ENGAGEMENT, p=[0.6, 0.3, 0.1])
})
save_csv(engagement_df, "engagement_scores.csv")
save_csv(engagement_df, "employee_feedback.csv") # Duplicating structure for simplicity

print(f"Generating {N_ATTENDANCE:,} Attendance records (this might take a few seconds)...")
attendance = pd.DataFrame({
    "employee_id": np.random.choice(emp_ids, N_ATTENDANCE),
    "date": [fake.date_between(start_date='-1y', end_date='today') for _ in range(N_ATTENDANCE)],
    "status": np.random.choice(["Present", "Absent", "Leave", "Half-Day"], N_ATTENDANCE, p=[0.85, 0.05, 0.08, 0.02]),
    "hours_worked": np.random.uniform(4, 10, N_ATTENDANCE).round(1)
})
save_csv(attendance, "attendance.csv")

salary_data = employees[["employee_id", "salary", "bonus", "department_id", "job_title"]].copy()
salary_data["effective_date"] = [fake.date_between(start_date='-3y', end_date='today') for _ in range(N_EMPLOYEES)]
save_csv(salary_data, "salary_data.csv")

promotions = pd.DataFrame({
    "employee_id": np.random.choice(emp_ids, N_PROMOTIONS),
    "previous_title": [fake.job() for _ in range(N_PROMOTIONS)],
    "new_title": [fake.job() for _ in range(N_PROMOTIONS)],
    "promotion_date": [fake.date_between(start_date='-5y', end_date='today') for _ in range(N_PROMOTIONS)],
    "salary_increase_pct": np.random.uniform(5, 25, N_PROMOTIONS).round(1)
})
save_csv(promotions, "promotion_history.csv")

attrition = pd.DataFrame({
    "employee_id": np.random.choice(emp_ids, N_ATTRITIONS),
    "exit_date": [fake.date_between(start_date='-3y', end_date='today') for _ in range(N_ATTRITIONS)],
    "reason": np.random.choice(["Better Offer", "Career Change", "Relocation", "Performance", "Personal"], N_ATTRITIONS),
    "type": np.random.choice(["Voluntary", "Involuntary"], N_ATTRITIONS, p=[0.8, 0.2])
})
save_csv(attrition, "attrition_history.csv")

succession = pd.DataFrame({
    "target_role": [fake.job() for _ in range(300)],
    "department_id": np.random.choice(depts["department_id"], 300),
    "successor_id": np.random.choice(emp_ids, 300),
    "readiness_timeframe": np.random.choice(["Ready Now", "1-2 Years", "3-5 Years"], 300)
})
save_csv(succession, "succession_planning.csv")

# ---------------------------------------------------------
# Phase 4: Operational Data (Projects & Budgets)
# ---------------------------------------------------------
print("Generating Operational Data (Phase 4)...")
projects = pd.DataFrame({
    "project_id": [f"PRJ{str(i).zfill(4)}" for i in range(1, N_PROJECTS + 1)],
    "project_name": [f"Project {fake.catch_phrase()}" for _ in range(N_PROJECTS)],
    "department_id": np.random.choice(depts["department_id"], N_PROJECTS),
    "status": np.random.choice(["Completed", "In Progress", "Planning", "Cancelled"], N_PROJECTS, p=[0.5, 0.3, 0.15, 0.05]),
    "budget": np.random.uniform(10000, 1000000, N_PROJECTS).round(2),
    "business_value": np.random.uniform(50000, 5000000, N_PROJECTS).round(2),
    "complexity": np.random.choice(["Low", "Medium", "High", "Critical"], N_PROJECTS)
})
save_csv(projects, "projects.csv")

employee_projects = pd.DataFrame({
    "employee_id": np.random.choice(emp_ids, N_EMPLOYEE_PROJECTS),
    "project_id": np.random.choice(projects["project_id"], N_EMPLOYEE_PROJECTS),
    "role": np.random.choice(["Lead", "Contributor", "Reviewer", "Manager"], N_EMPLOYEE_PROJECTS),
    "hours_allocated": np.random.randint(10, 500, N_EMPLOYEE_PROJECTS)
})
save_csv(employee_projects, "employee_projects.csv")

project_skills = pd.DataFrame({
    "project_id": np.random.choice(projects["project_id"], 15000),
    "skill_id": np.random.choice(skills["skill_id"], 15000),
    "required_proficiency": np.random.randint(2, 5, 15000)
})
save_csv(project_skills, "project_skills.csv")

dept_budget = depts.copy()
dept_budget["annual_budget"] = np.random.uniform(1000000, 50000000, N_DEPARTMENTS).round(2)
dept_budget["year"] = 2026
save_csv(dept_budget, "department_budget.csv")
save_csv(dept_budget, "training_budget.csv") # Simplified duplication

org_metrics = pd.DataFrame({
    "month": pd.date_range(start="2020-01-01", periods=72, freq="ME"),
    "revenue": np.random.uniform(10_000_000, 50_000_000, 72).round(2),
    "headcount": np.linspace(5000, 10000, 72).astype(int) + np.random.randint(-100, 100, 72),
    "attrition_rate": np.random.uniform(0.05, 0.15, 72).round(3)
})
save_csv(org_metrics, "organization_metrics.csv")

# ---------------------------------------------------------
# Phase 5: Market & Forecasting Data
# ---------------------------------------------------------
print("Generating Market & Forecast Data (Phase 5)...")
job_market = pd.DataFrame({
    "job_title": np.random.choice(employees["job_title"], N_JOB_MARKET),
    "date": [fake.date_between(start_date='-2y', end_date='today') for _ in range(N_JOB_MARKET)],
    "open_positions": np.random.randint(10, 5000, N_JOB_MARKET),
    "average_market_salary": np.random.uniform(50000, 200000, N_JOB_MARKET).round(2)
})
save_csv(job_market, "job_market_trends.csv")

hist_demand = pd.DataFrame({
    "skill_id": np.random.choice(skills["skill_id"], 50000),
    "year": np.random.choice([2021, 2022, 2023, 2024, 2025, 2026], 50000),
    "demand_index": np.random.randint(10, 100, 50000)
})
save_csv(hist_demand, "historical_skill_demand.csv")

tech_forecast = skills[["skill_id", "skill_name", "category"]].copy()
for year in range(2027, 2037):
    tech_forecast[f"forecast_{year}"] = np.clip(tech_forecast["skill_name"].apply(lambda x: np.random.randint(20, 100) + (year-2026)*np.random.randint(-5, 10)), 0, 100)
save_csv(tech_forecast, "technology_forecast.csv")
save_csv(hist_demand, "industry_trends.csv") # Structural duplication for simplicity

# ---------------------------------------------------------
# Phase 6: Recruitment Pipeline
# ---------------------------------------------------------
print("Generating Recruitment Pipeline (Phase 6)...")
recruitment = pd.DataFrame({
    "requisition_id": [f"REQ{str(i).zfill(5)}" for i in range(1, N_RECRUITMENT + 1)],
    "job_title": [fake.job() for _ in range(N_RECRUITMENT)],
    "department_id": np.random.choice(depts["department_id"], N_RECRUITMENT),
    "status": np.random.choice(["Open", "Closed", "On Hold"], N_RECRUITMENT, p=[0.2, 0.7, 0.1]),
    "time_to_fill_days": np.random.randint(15, 120, N_RECRUITMENT)
})
save_csv(recruitment, "recruitment.csv")

candidates = pd.DataFrame({
    "candidate_id": [f"CAND{str(i).zfill(5)}" for i in range(1, N_CANDIDATES + 1)],
    "requisition_id": np.random.choice(recruitment["requisition_id"], N_CANDIDATES),
    "first_name": [fake.first_name() for _ in range(N_CANDIDATES)],
    "last_name": [fake.last_name() for _ in range(N_CANDIDATES)],
    "experience_years": np.random.uniform(0, 20, N_CANDIDATES).round(1),
    "status": np.random.choice(["Hired", "Rejected", "Interviewing", "Offer Extended"], N_CANDIDATES, p=[0.1, 0.7, 0.15, 0.05])
})
save_csv(candidates, "candidates.csv")

cand_skills = pd.DataFrame({
    "candidate_id": np.random.choice(candidates["candidate_id"], 45000),
    "skill_id": np.random.choice(skills["skill_id"], 45000),
    "proficiency": np.random.randint(1, 6, 45000)
})
save_csv(cand_skills, "candidate_skills.csv")

interviews = pd.DataFrame({
    "interview_id": [f"INT{str(i).zfill(5)}" for i in range(1, N_INTERVIEWS + 1)],
    "candidate_id": np.random.choice(candidates["candidate_id"], N_INTERVIEWS),
    "interviewer_id": np.random.choice(emp_ids, N_INTERVIEWS),
    "score": np.random.uniform(1, 5, N_INTERVIEWS).round(1),
    "result": np.random.choice(["Pass", "Fail"], N_INTERVIEWS)
})
save_csv(interviews, "interviews.csv")

print("All 34 datasets generated successfully in the 'datasets' folder.")
