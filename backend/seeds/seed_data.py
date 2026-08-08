"""
Synthetic Data Generator
========================
Generates massive, realistic datasets for the Workforce Intelligence Platform.
Produces 10K+ employees, 300+ skills, 1K+ courses, and related records.

Usage:
    cd backend
    python -m seeds.seed_data
"""

import asyncio
import json
import random
import uuid
from datetime import date, datetime, timedelta, timezone

from app.database import async_session_factory, init_db
from app.models import (
    AuditLog,
    Certification,
    Course,
    Department,
    Employee,
    EmployeeSkill,
    LearningRecord,
    Notification,
    Prediction,
    Recommendation,
    Report,
    Skill,
    User,
)
from app.utils.security import hash_password

# ===========================================================================
# Data Catalogs — Large, realistic reference data
# ===========================================================================

DEPARTMENTS = [
    ("Engineering", "Software development, infrastructure, and platform engineering", "San Francisco, CA"),
    ("Data Science", "Machine learning, analytics, and data engineering", "San Francisco, CA"),
    ("Product Management", "Product strategy, roadmap, and user research", "New York, NY"),
    ("Design", "UX/UI design, design systems, and user research", "New York, NY"),
    ("Marketing", "Brand, growth, content, and demand generation", "Austin, TX"),
    ("Sales", "Enterprise sales, SDR, and account management", "Chicago, IL"),
    ("Customer Success", "Client onboarding, support, and retention", "Chicago, IL"),
    ("Human Resources", "Talent acquisition, culture, and people ops", "San Francisco, CA"),
    ("Finance", "Financial planning, accounting, and treasury", "New York, NY"),
    ("Legal & Compliance", "Corporate law, regulatory, and compliance", "New York, NY"),
    ("Operations", "Business operations, supply chain, and logistics", "Austin, TX"),
    ("IT & Infrastructure", "IT support, cloud infrastructure, and security", "San Francisco, CA"),
    ("Security", "Cybersecurity, threat detection, and compliance", "San Francisco, CA"),
    ("Quality Assurance", "Testing, automation, and quality engineering", "Austin, TX"),
    ("DevOps & SRE", "CI/CD, reliability, and infrastructure automation", "San Francisco, CA"),
    ("Research", "Applied research, prototyping, and innovation", "Boston, MA"),
    ("Business Intelligence", "BI, reporting, and data visualization", "Chicago, IL"),
    ("Cloud Platform", "Cloud architecture, services, and migration", "Seattle, WA"),
    ("Mobile Engineering", "iOS, Android, and cross-platform development", "San Francisco, CA"),
    ("AI & Machine Learning", "AI research, MLOps, and model deployment", "San Francisco, CA"),
]

TECHNICAL_SKILLS = [
    # Programming Languages
    ("Python", "Programming Languages"), ("JavaScript", "Programming Languages"),
    ("TypeScript", "Programming Languages"), ("Java", "Programming Languages"),
    ("C++", "Programming Languages"), ("Go", "Programming Languages"),
    ("Rust", "Programming Languages"), ("Kotlin", "Programming Languages"),
    ("Swift", "Programming Languages"), ("R", "Programming Languages"),
    ("Scala", "Programming Languages"), ("Ruby", "Programming Languages"),
    ("PHP", "Programming Languages"), ("C#", "Programming Languages"),
    ("Dart", "Programming Languages"),
    # Cloud & Infrastructure
    ("AWS", "Cloud Platforms"), ("Azure", "Cloud Platforms"),
    ("Google Cloud Platform", "Cloud Platforms"), ("Docker", "Containers"),
    ("Kubernetes", "Containers"), ("Terraform", "Infrastructure as Code"),
    ("Ansible", "Infrastructure as Code"), ("CloudFormation", "Infrastructure as Code"),
    ("Pulumi", "Infrastructure as Code"),
    # AI/ML
    ("Machine Learning", "AI & ML"), ("Deep Learning", "AI & ML"),
    ("Natural Language Processing", "AI & ML"), ("Computer Vision", "AI & ML"),
    ("Reinforcement Learning", "AI & ML"), ("MLOps", "AI & ML"),
    ("TensorFlow", "AI & ML"), ("PyTorch", "AI & ML"),
    ("Scikit-learn", "AI & ML"), ("Hugging Face Transformers", "AI & ML"),
    ("LangChain", "AI & ML"), ("Generative AI", "AI & ML"),
    ("Prompt Engineering", "AI & ML"), ("RAG Architecture", "AI & ML"),
    ("Fine-tuning LLMs", "AI & ML"), ("Model Optimization", "AI & ML"),
    # Data Engineering
    ("SQL", "Data Engineering"), ("PostgreSQL", "Data Engineering"),
    ("MongoDB", "Data Engineering"), ("Redis", "Data Engineering"),
    ("Apache Kafka", "Data Engineering"), ("Apache Spark", "Data Engineering"),
    ("Airflow", "Data Engineering"), ("dbt", "Data Engineering"),
    ("Snowflake", "Data Engineering"), ("Databricks", "Data Engineering"),
    ("BigQuery", "Data Engineering"), ("Elasticsearch", "Data Engineering"),
    ("Neo4j", "Data Engineering"), ("Cassandra", "Data Engineering"),
    # Web Development
    ("React", "Web Development"), ("Next.js", "Web Development"),
    ("Vue.js", "Web Development"), ("Angular", "Web Development"),
    ("Node.js", "Web Development"), ("FastAPI", "Web Development"),
    ("Django", "Web Development"), ("Spring Boot", "Web Development"),
    ("GraphQL", "Web Development"), ("REST API Design", "Web Development"),
    ("Tailwind CSS", "Web Development"), ("WebSocket", "Web Development"),
    # DevOps & CI/CD
    ("CI/CD Pipelines", "DevOps"), ("Jenkins", "DevOps"),
    ("GitHub Actions", "DevOps"), ("GitLab CI", "DevOps"),
    ("ArgoCD", "DevOps"), ("Prometheus", "DevOps"),
    ("Grafana", "DevOps"), ("ELK Stack", "DevOps"),
    ("Datadog", "DevOps"), ("New Relic", "DevOps"),
    # Security
    ("Cybersecurity", "Security"), ("Penetration Testing", "Security"),
    ("SIEM", "Security"), ("Zero Trust Architecture", "Security"),
    ("OAuth 2.0", "Security"), ("IAM", "Security"),
    ("SOC 2 Compliance", "Security"), ("OWASP", "Security"),
    # Mobile
    ("iOS Development", "Mobile"), ("Android Development", "Mobile"),
    ("React Native", "Mobile"), ("Flutter", "Mobile"),
    ("SwiftUI", "Mobile"),
    # Data Analytics
    ("Tableau", "Analytics"), ("Power BI", "Analytics"),
    ("Looker", "Analytics"), ("Data Visualization", "Analytics"),
    ("Statistical Analysis", "Analytics"), ("A/B Testing", "Analytics"),
    ("Pandas", "Analytics"), ("NumPy", "Analytics"),
]

SOFT_SKILLS = [
    ("Leadership", "Management"), ("Project Management", "Management"),
    ("Agile Methodology", "Management"), ("Scrum", "Management"),
    ("Strategic Thinking", "Management"), ("Team Building", "Management"),
    ("Stakeholder Management", "Communication"), ("Public Speaking", "Communication"),
    ("Technical Writing", "Communication"), ("Cross-functional Collaboration", "Communication"),
    ("Mentoring", "Development"), ("Coaching", "Development"),
    ("Critical Thinking", "Cognitive"), ("Problem Solving", "Cognitive"),
    ("Decision Making", "Cognitive"), ("Analytical Thinking", "Cognitive"),
    ("Creativity", "Cognitive"), ("Innovation", "Cognitive"),
    ("Time Management", "Productivity"), ("Conflict Resolution", "Interpersonal"),
    ("Emotional Intelligence", "Interpersonal"), ("Negotiation", "Interpersonal"),
    ("Adaptability", "Interpersonal"), ("Communication", "Interpersonal"),
]

DOMAIN_SKILLS = [
    ("Product Strategy", "Product"), ("User Research", "Product"),
    ("Market Analysis", "Business"), ("Financial Modeling", "Finance"),
    ("Risk Management", "Finance"), ("Regulatory Compliance", "Legal"),
    ("Contract Negotiation", "Legal"), ("Digital Marketing", "Marketing"),
    ("SEO/SEM", "Marketing"), ("Content Strategy", "Marketing"),
    ("Brand Management", "Marketing"), ("Sales Strategy", "Sales"),
    ("CRM Management", "Sales"), ("Customer Journey Mapping", "Customer"),
    ("UX Design", "Design"), ("UI Design", "Design"),
    ("Design Systems", "Design"), ("Figma", "Design"),
    ("Accessibility (WCAG)", "Design"), ("Supply Chain Management", "Operations"),
    ("Business Process Optimization", "Operations"),
    ("Change Management", "Operations"),
]

EMERGING_SKILLS = [
    "Generative AI", "Prompt Engineering", "RAG Architecture",
    "Fine-tuning LLMs", "LangChain", "MLOps",
    "Rust", "WebAssembly", "Zero Trust Architecture",
    "Quantum Computing Basics", "Edge Computing",
    "Sustainability Analytics", "AI Ethics",
]

JOB_TITLES_BY_DEPT = {
    "Engineering": [
        "Software Engineer", "Senior Software Engineer", "Staff Engineer",
        "Principal Engineer", "Engineering Manager", "Frontend Engineer",
        "Backend Engineer", "Full-Stack Engineer", "Platform Engineer",
    ],
    "Data Science": [
        "Data Scientist", "Senior Data Scientist", "ML Engineer",
        "Senior ML Engineer", "Data Analyst", "Analytics Engineer",
        "Research Scientist", "Applied Scientist",
    ],
    "Product Management": [
        "Product Manager", "Senior Product Manager", "Director of Product",
        "Technical Product Manager", "Product Analyst",
    ],
    "Design": [
        "UX Designer", "Senior UX Designer", "UI Designer",
        "Product Designer", "Design Lead", "UX Researcher",
    ],
    "Marketing": [
        "Marketing Manager", "Growth Marketing Manager", "Content Strategist",
        "SEO Specialist", "Digital Marketing Analyst", "Brand Manager",
    ],
    "Sales": [
        "Account Executive", "Senior Account Executive", "Sales Manager",
        "Business Development Rep", "Sales Engineer", "VP of Sales",
    ],
    "Customer Success": [
        "Customer Success Manager", "Senior CSM", "Implementation Specialist",
        "Support Engineer", "Technical Account Manager",
    ],
    "Human Resources": [
        "HR Business Partner", "Talent Acquisition Specialist", "HR Manager",
        "People Operations Analyst", "Compensation Analyst", "L&D Specialist",
    ],
    "Finance": [
        "Financial Analyst", "Senior Financial Analyst", "FP&A Manager",
        "Controller", "Accountant", "Treasury Analyst",
    ],
    "Legal & Compliance": [
        "Corporate Counsel", "Compliance Officer", "Paralegal",
        "Privacy Counsel", "Regulatory Affairs Manager",
    ],
    "Operations": [
        "Operations Manager", "Business Analyst", "Process Engineer",
        "Supply Chain Analyst", "Operations Director",
    ],
    "IT & Infrastructure": [
        "Systems Administrator", "IT Support Specialist", "Network Engineer",
        "IT Manager", "Cloud Administrator", "Help Desk Analyst",
    ],
    "Security": [
        "Security Engineer", "Senior Security Engineer", "Security Analyst",
        "CISO", "Penetration Tester", "SOC Analyst",
    ],
    "Quality Assurance": [
        "QA Engineer", "Senior QA Engineer", "QA Lead",
        "Automation Engineer", "Test Architect",
    ],
    "DevOps & SRE": [
        "DevOps Engineer", "Senior DevOps Engineer", "SRE",
        "Platform Engineer", "Release Engineer", "Infrastructure Engineer",
    ],
    "Research": [
        "Research Scientist", "Senior Researcher", "Research Engineer",
        "Applied Scientist", "Research Director",
    ],
    "Business Intelligence": [
        "BI Analyst", "Senior BI Analyst", "BI Developer",
        "Data Visualization Specialist", "BI Manager",
    ],
    "Cloud Platform": [
        "Cloud Architect", "Cloud Engineer", "Solutions Architect",
        "Cloud Platform Engineer", "Cloud Migration Specialist",
    ],
    "Mobile Engineering": [
        "iOS Engineer", "Android Engineer", "Mobile Lead",
        "React Native Developer", "Flutter Developer",
    ],
    "AI & Machine Learning": [
        "AI Engineer", "ML Platform Engineer", "NLP Engineer",
        "Computer Vision Engineer", "AI Research Scientist", "MLOps Engineer",
    ],
}

FIRST_NAMES = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Lisa", "Daniel", "Nancy",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Aiden", "Sofia", "Liam", "Olivia", "Noah", "Emma", "Ethan", "Ava",
    "Wei", "Yuki", "Raj", "Priya", "Ali", "Fatima", "Carlos", "Maria",
    "Hiroshi", "Sakura", "Ahmed", "Aisha", "Chen", "Mei", "Pavel", "Olga",
    "Diego", "Isabella", "Arjun", "Sneha", "Sven", "Ingrid", "Pierre", "Marie",
    "Kenji", "Hana", "Boris", "Natasha", "Jin", "Soo-yeon", "Marco", "Giulia",
    "Amit", "Deepika", "Ravi", "Ananya", "Vikram", "Kavita", "Suresh", "Lakshmi",
    "Kiran", "Neha", "Nikhil", "Pooja", "Arun", "Shreya", "Sanjay", "Divya",
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen",
    "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera",
    "Campbell", "Mitchell", "Carter", "Roberts", "Chen", "Wang", "Liu", "Zhang",
    "Li", "Yang", "Huang", "Wu", "Kim", "Park", "Choi", "Tanaka",
    "Sato", "Suzuki", "Patel", "Shah", "Mehta", "Kumar", "Singh", "Gupta",
    "Sharma", "Verma", "Joshi", "Iyer", "Reddy", "Nair", "Rao", "Pillai",
    "Muller", "Schmidt", "Fischer", "Weber", "Petrov", "Ivanov", "Rossi", "Ferrari",
]

COURSE_PROVIDERS = ["Microsoft Learn", "Coursera", "AWS Training", "Google Cloud Skills", "Udemy"]

CERTIFICATION_CATALOG = [
    ("AWS Solutions Architect Associate", "Amazon Web Services"),
    ("AWS Solutions Architect Professional", "Amazon Web Services"),
    ("AWS Developer Associate", "Amazon Web Services"),
    ("AWS Machine Learning Specialty", "Amazon Web Services"),
    ("AWS Data Analytics Specialty", "Amazon Web Services"),
    ("Azure Fundamentals (AZ-900)", "Microsoft"),
    ("Azure Administrator (AZ-104)", "Microsoft"),
    ("Azure Solutions Architect (AZ-305)", "Microsoft"),
    ("Azure AI Engineer (AI-102)", "Microsoft"),
    ("Azure Data Engineer (DP-203)", "Microsoft"),
    ("Azure DevOps Engineer (AZ-400)", "Microsoft"),
    ("Microsoft Power BI Data Analyst", "Microsoft"),
    ("Google Cloud Associate Cloud Engineer", "Google"),
    ("Google Cloud Professional Data Engineer", "Google"),
    ("Google Cloud Professional ML Engineer", "Google"),
    ("Google Cloud Professional Cloud Architect", "Google"),
    ("Certified Kubernetes Administrator (CKA)", "CNCF"),
    ("Certified Kubernetes Application Developer (CKAD)", "CNCF"),
    ("Terraform Associate", "HashiCorp"),
    ("Docker Certified Associate", "Docker"),
    ("Certified Scrum Master (CSM)", "Scrum Alliance"),
    ("Professional Scrum Master (PSM I)", "Scrum.org"),
    ("PMP (Project Management Professional)", "PMI"),
    ("CISSP", "ISC2"),
    ("CompTIA Security+", "CompTIA"),
    ("CEH (Certified Ethical Hacker)", "EC-Council"),
    ("Databricks Certified Data Engineer", "Databricks"),
    ("Snowflake SnowPro Core", "Snowflake"),
    ("MongoDB Certified Developer", "MongoDB"),
    ("Neo4j Certified Professional", "Neo4j"),
    ("TensorFlow Developer Certificate", "Google"),
    ("Confluent Certified Developer for Apache Kafka", "Confluent"),
    ("TOGAF Certified", "The Open Group"),
    ("ITIL 4 Foundation", "Axelos"),
    ("Six Sigma Green Belt", "ASQ"),
]

COURSE_TEMPLATES = [
    ("{skill} Fundamentals", "beginner", 8),
    ("{skill} for Beginners: Complete Guide", "beginner", 12),
    ("Introduction to {skill}", "beginner", 6),
    ("{skill} Masterclass", "intermediate", 20),
    ("Advanced {skill} Techniques", "advanced", 25),
    ("{skill} in Practice", "intermediate", 15),
    ("Professional {skill} Development", "intermediate", 18),
    ("{skill}: Deep Dive", "advanced", 30),
    ("{skill} for Enterprise", "advanced", 22),
    ("{skill} Best Practices & Patterns", "intermediate", 16),
]

NOTIFICATION_TEMPLATES = [
    ("ai_alert", "high", "Skill Demand Surge", "{skill} demand increased by {pct}% this quarter"),
    ("ai_alert", "medium", "Emerging Skill Detected", "{skill} is trending across {industry} industry"),
    ("skill_update", "low", "New Skill Added", "{skill} has been added to the skills catalog"),
    ("learning", "medium", "Course Recommendation", "Based on your profile, consider taking '{course}'"),
    ("system", "low", "Profile Updated", "Your skill assessment has been updated"),
    ("achievement", "medium", "Certification Earned", "Congratulations on earning {cert}!"),
    ("ai_alert", "critical", "Attrition Risk Alert", "{dept} department shows elevated attrition risk"),
    ("learning", "high", "Learning Path Update", "Your learning path has been recalculated"),
]


def _random_date(start_year: int = 2018, end_year: int = 2026) -> date:
    """Generate a random date between start_year and end_year."""
    start = date(start_year, 1, 1)
    end = date(end_year, 7, 1)
    delta = (end - start).days
    return start + timedelta(days=random.randint(0, delta))


def _generate_employee_code(index: int) -> str:
    """Generate EMP-XXXXX style codes."""
    return f"EMP-{index:05d}"


async def seed_database(
    num_employees: int = 10000,
    num_courses: int = 1000,
) -> dict:
    """
    Generate and insert all synthetic data.
    Returns summary of created records.
    """
    print("🌱 Starting database seeding...")
    counts = {}

    async with async_session_factory() as db:
        # ===========================================================
        # 1. Create Admin User
        # ===========================================================
        print("  👤 Creating admin user...")
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin@workforce.ai",
            password_hash=hash_password("Admin@123"),
            first_name="System",
            last_name="Administrator",
            role="admin",
            is_active=True,
        )
        db.add(admin_user)

        # HR Manager user
        hr_user = User(
            id=str(uuid.uuid4()),
            email="hr@workforce.ai",
            password_hash=hash_password("HRManager@123"),
            first_name="Sarah",
            last_name="Johnson",
            role="hr_manager",
            is_active=True,
        )
        db.add(hr_user)

        # Demo employee user
        demo_user = User(
            id=str(uuid.uuid4()),
            email="demo@workforce.ai",
            password_hash=hash_password("Demo@123"),
            first_name="Alex",
            last_name="Demo",
            role="employee",
            is_active=True,
        )
        db.add(demo_user)
        await db.flush()
        counts["users"] = 3

        # ===========================================================
        # 2. Create Departments
        # ===========================================================
        print("  🏢 Creating departments...")
        dept_objects = []
        for name, desc, loc in DEPARTMENTS:
            dept = Department(
                id=str(uuid.uuid4()),
                name=name,
                description=desc,
                location=loc,
                headcount=0,
                budget=random.uniform(500000, 5000000),
            )
            db.add(dept)
            dept_objects.append(dept)
        await db.flush()
        counts["departments"] = len(dept_objects)

        # ===========================================================
        # 3. Create Skills (300+)
        # ===========================================================
        print("  🎯 Creating skills...")
        skill_objects = []
        all_skills_data = (
            [(name, "technical", sub) for name, sub in TECHNICAL_SKILLS]
            + [(name, "soft", sub) for name, sub in SOFT_SKILLS]
            + [(name, "domain", sub) for name, sub in DOMAIN_SKILLS]
        )

        for name, category, subcategory in all_skills_data:
            is_emerging = name in EMERGING_SKILLS
            growth = random.uniform(15, 45) if is_emerging else random.uniform(-5, 20)
            skill = Skill(
                id=str(uuid.uuid4()),
                name=name,
                category=category,
                subcategory=subcategory,
                future_demand_score=random.uniform(40, 98) if is_emerging else random.uniform(20, 85),
                current_demand_score=random.uniform(30, 90),
                growth_rate=round(growth, 1),
                is_emerging=is_emerging,
                is_critical=random.random() < 0.15,
                description=f"Proficiency in {name} — {subcategory} domain.",
            )
            db.add(skill)
            skill_objects.append(skill)
        await db.flush()
        counts["skills"] = len(skill_objects)

        # ===========================================================
        # 4. Create Courses (1000+)
        # ===========================================================
        print("  📚 Creating courses...")
        course_objects = []
        course_count = 0
        for skill in skill_objects:
            # Generate 2-4 courses per skill
            templates = random.sample(COURSE_TEMPLATES, min(random.randint(2, 4), len(COURSE_TEMPLATES)))
            for template_title, difficulty, base_hours in templates:
                if course_count >= num_courses:
                    break
                title = template_title.format(skill=skill.name)
                provider = random.choice(COURSE_PROVIDERS)
                course = Course(
                    id=str(uuid.uuid4()),
                    title=title,
                    description=f"Comprehensive {difficulty} course on {skill.name}. "
                                f"Covers key concepts, hands-on labs, and real-world projects.",
                    provider=provider,
                    url=f"https://{provider.lower().replace(' ', '')}.com/courses/{skill.name.lower().replace(' ', '-')}",
                    difficulty=difficulty,
                    duration_hours=base_hours + random.randint(-2, 10),
                    category=skill.subcategory or skill.category,
                    rating=round(random.uniform(3.5, 5.0), 1),
                    enrolled_count=random.randint(100, 50000),
                    skills_covered=json.dumps([skill.name]),
                )
                db.add(course)
                course_objects.append(course)
                course_count += 1
            if course_count >= num_courses:
                break
        await db.flush()
        counts["courses"] = len(course_objects)

        # ===========================================================
        # 5. Create Employees (10,000+)
        # ===========================================================
        print(f"  👥 Creating {num_employees} employees...")
        employee_objects = []
        levels = ["junior", "mid", "senior", "lead", "director", "vp"]
        level_weights = [0.25, 0.35, 0.20, 0.10, 0.07, 0.03]
        statuses = ["active", "active", "active", "active", "on_leave", "inactive"]

        batch_size = 500
        for batch_start in range(0, num_employees, batch_size):
            batch_end = min(batch_start + batch_size, num_employees)
            for i in range(batch_start, batch_end):
                dept = random.choice(dept_objects)
                dept_name = dept.name
                job_title = random.choice(
                    JOB_TITLES_BY_DEPT.get(dept_name, ["Specialist", "Analyst", "Manager"])
                )
                level = random.choices(levels, weights=level_weights, k=1)[0]
                exp_years = {
                    "junior": random.randint(0, 2),
                    "mid": random.randint(2, 5),
                    "senior": random.randint(5, 10),
                    "lead": random.randint(7, 15),
                    "director": random.randint(10, 20),
                    "vp": random.randint(15, 30),
                }[level]

                salary_base = {
                    "junior": 55000, "mid": 80000, "senior": 120000,
                    "lead": 150000, "director": 180000, "vp": 220000,
                }[level]
                salary = salary_base + random.randint(-10000, 30000)

                perf = round(min(5.0, max(1.0, random.gauss(3.5, 0.8))), 2)
                engagement = round(min(100, max(10, random.gauss(72, 15))), 1)
                readiness = round(min(100, max(5, random.gauss(55, 20))), 1)
                attrition = round(min(1.0, max(0.0, random.gauss(0.15, 0.12))), 3)

                first_name = random.choice(FIRST_NAMES)
                last_name = random.choice(LAST_NAMES)

                emp = Employee(
                    id=str(uuid.uuid4()),
                    department_id=dept.id,
                    employee_code=_generate_employee_code(i + 1),
                    first_name=first_name,
                    last_name=last_name,
                    email=f"{first_name.lower()}.{last_name.lower()}.{i}@company.com",
                    job_title=job_title,
                    job_level=level,
                    experience_years=exp_years,
                    salary=salary,
                    performance_score=perf,
                    engagement_score=engagement,
                    readiness_score=readiness,
                    attrition_risk=attrition,
                    manager_name=f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
                    manager_rating=round(min(5.0, max(1.0, random.gauss(3.8, 0.7))), 2),
                    hire_date=_random_date(2015, 2026),
                    projects_count=random.randint(1, 30),
                    status=random.choice(statuses),
                )
                db.add(emp)
                employee_objects.append(emp)

            await db.flush()
            if (batch_end) % 2000 == 0 or batch_end == num_employees:
                print(f"    → {batch_end}/{num_employees} employees created")

        # Update department headcounts
        dept_counts = {}
        for emp in employee_objects:
            dept_counts[emp.department_id] = dept_counts.get(emp.department_id, 0) + 1
        for dept in dept_objects:
            dept.headcount = dept_counts.get(dept.id, 0)
        await db.flush()
        counts["employees"] = len(employee_objects)

        # ===========================================================
        # 6. Create Employee Skills (50,000+)
        # ===========================================================
        print("  🔗 Assigning skills to employees...")
        es_count = 0
        for idx, emp in enumerate(employee_objects):
            # Each employee gets 5-15 skills
            num_skills = random.randint(5, 15)
            selected_skills = random.sample(skill_objects, min(num_skills, len(skill_objects)))
            for sk in selected_skills:
                proficiency = random.randint(1, 5)
                target = min(5, proficiency + random.randint(0, 2))
                es = EmployeeSkill(
                    id=str(uuid.uuid4()),
                    employee_id=emp.id,
                    skill_id=sk.id,
                    proficiency_level=proficiency,
                    target_level=target,
                    assessed_at=_random_date(2023, 2026),
                    assessed_by=emp.manager_name,
                )
                db.add(es)
                es_count += 1

            if (idx + 1) % 2000 == 0:
                await db.flush()
                print(f"    → Skills assigned to {idx + 1}/{len(employee_objects)} employees")

        await db.flush()
        counts["employee_skills"] = es_count

        # ===========================================================
        # 7. Create Learning Records (100,000+)
        # ===========================================================
        print("  📖 Creating learning records...")
        lr_count = 0
        statuses_lr = ["not_started", "in_progress", "in_progress", "completed", "completed", "completed", "dropped"]
        for idx, emp in enumerate(employee_objects):
            # Each employee has 5-20 learning records
            num_records = random.randint(5, 20)
            selected_courses = random.sample(course_objects, min(num_records, len(course_objects)))
            for course in selected_courses:
                st = random.choice(statuses_lr)
                started = _random_date(2022, 2026)
                progress = {
                    "not_started": 0.0,
                    "in_progress": round(random.uniform(10, 90), 1),
                    "completed": 100.0,
                    "dropped": round(random.uniform(5, 40), 1),
                }[st]
                lr = LearningRecord(
                    id=str(uuid.uuid4()),
                    employee_id=emp.id,
                    course_id=course.id,
                    progress_pct=progress,
                    score=round(random.uniform(60, 100), 1) if st == "completed" else None,
                    status=st,
                    started_at=started if st != "not_started" else None,
                    completed_at=(started + timedelta(days=random.randint(7, 90))) if st == "completed" else None,
                )
                db.add(lr)
                lr_count += 1

            if (idx + 1) % 2000 == 0:
                await db.flush()
                print(f"    → Learning records for {idx + 1}/{len(employee_objects)} employees ({lr_count} total)")

        await db.flush()
        counts["learning_records"] = lr_count

        # ===========================================================
        # 8. Create Certifications
        # ===========================================================
        print("  🏅 Creating certifications...")
        cert_count = 0
        for emp in employee_objects:
            # 30% of employees have 1-4 certifications
            if random.random() < 0.3:
                num_certs = random.randint(1, 4)
                selected_certs = random.sample(
                    CERTIFICATION_CATALOG, min(num_certs, len(CERTIFICATION_CATALOG))
                )
                for cert_name, issuer in selected_certs:
                    earned = _random_date(2020, 2026)
                    cert = Certification(
                        id=str(uuid.uuid4()),
                        employee_id=emp.id,
                        name=cert_name,
                        issuer=issuer,
                        credential_id=f"CRED-{random.randint(100000, 999999)}",
                        earned_date=earned,
                        expiry_date=earned + timedelta(days=random.choice([730, 1095, 1825])),
                        status=random.choice(["active", "active", "active", "expired"]),
                    )
                    db.add(cert)
                    cert_count += 1
        await db.flush()
        counts["certifications"] = cert_count

        # ===========================================================
        # 9. Create Recommendations
        # ===========================================================
        print("  💡 Creating recommendations...")
        rec_count = 0
        priorities = ["low", "medium", "medium", "high", "high", "critical"]
        # Only create for first 2000 employees to keep it manageable
        for emp in employee_objects[:2000]:
            num_recs = random.randint(2, 6)
            selected_courses = random.sample(course_objects, min(num_recs, len(course_objects)))
            for course in selected_courses:
                rec = Recommendation(
                    id=str(uuid.uuid4()),
                    employee_id=emp.id,
                    course_id=course.id,
                    relevance_score=round(random.uniform(0.5, 1.0), 3),
                    reason=f"AI analysis indicates a skill gap in {course.category}. "
                           f"This course will improve proficiency by an estimated {random.randint(15, 40)}%.",
                    priority=random.choice(priorities),
                    skill_gap_addressed=course.category,
                    estimated_hours=course.duration_hours,
                    status=random.choice(["pending", "pending", "accepted", "completed", "dismissed"]),
                )
                db.add(rec)
                rec_count += 1
        await db.flush()
        counts["recommendations"] = rec_count

        # ===========================================================
        # 10. Create Notifications
        # ===========================================================
        print("  🔔 Creating notifications...")
        notif_count = 0
        for _ in range(5000):
            template = random.choice(NOTIFICATION_TEMPLATES)
            ntype, priority, title, msg_template = template
            skill = random.choice(skill_objects)
            msg = msg_template.format(
                skill=skill.name,
                pct=random.randint(10, 50),
                industry="Technology",
                course=random.choice(course_objects).title if course_objects else "Course",
                cert=random.choice(CERTIFICATION_CATALOG)[0],
                dept=random.choice(dept_objects).name,
            )
            notif = Notification(
                id=str(uuid.uuid4()),
                user_id=random.choice([admin_user.id, hr_user.id, demo_user.id]),
                title=title,
                message=msg,
                notification_type=ntype,
                priority=priority,
                is_read=random.random() < 0.6,
            )
            db.add(notif)
            notif_count += 1
        await db.flush()
        counts["notifications"] = notif_count

        # ===========================================================
        # 11. Commit everything
        # ===========================================================
        print("  💾 Committing to database...")
        await db.commit()

    print("\n✅ Database seeding complete!")
    print("=" * 50)
    for entity, count in counts.items():
        print(f"  {entity:.<30} {count:>10,}")
    print("=" * 50)
    print("\n📌 Default login credentials:")
    print("  Admin:    admin@workforce.ai / Admin@123")
    print("  HR:       hr@workforce.ai / HRManager@123")
    print("  Employee: demo@workforce.ai / Demo@123")

    return counts


# --- CLI Entry Point ---
if __name__ == "__main__":
    asyncio.run(seed_database())
