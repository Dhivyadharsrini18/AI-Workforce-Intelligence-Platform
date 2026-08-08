import asyncio
import random
import uuid
from datetime import date, timedelta
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory
from app.models.department import Department
from app.models.employee import Employee
from app.models.skill import Skill
from app.models.employee_skill import EmployeeSkill

# Popular Tech Skills for AI Platform
SKILLS_DATA = [
    {"name": "Python", "category": "technical", "subcategory": "programming", "is_emerging": False, "is_critical": True},
    {"name": "React", "category": "technical", "subcategory": "frontend", "is_emerging": False, "is_critical": False},
    {"name": "TypeScript", "category": "technical", "subcategory": "programming", "is_emerging": False, "is_critical": True},
    {"name": "Generative AI", "category": "technical", "subcategory": "ai", "is_emerging": True, "is_critical": True},
    {"name": "Machine Learning", "category": "technical", "subcategory": "ai", "is_emerging": False, "is_critical": True},
    {"name": "Data Engineering", "category": "technical", "subcategory": "data", "is_emerging": False, "is_critical": True},
    {"name": "Cloud Architecture", "category": "technical", "subcategory": "cloud", "is_emerging": False, "is_critical": True},
    {"name": "Cybersecurity", "category": "technical", "subcategory": "security", "is_emerging": False, "is_critical": True},
    {"name": "DevOps", "category": "technical", "subcategory": "infrastructure", "is_emerging": False, "is_critical": True},
    {"name": "Prompt Engineering", "category": "technical", "subcategory": "ai", "is_emerging": True, "is_critical": False},
    {"name": "RAG (Retrieval-Augmented Generation)", "category": "technical", "subcategory": "ai", "is_emerging": True, "is_critical": True},
    {"name": "Agentic AI", "category": "technical", "subcategory": "ai", "is_emerging": True, "is_critical": True},
    {"name": "Strategic Planning", "category": "leadership", "subcategory": "management", "is_emerging": False, "is_critical": False},
    {"name": "Agile Methodologies", "category": "process", "subcategory": "management", "is_emerging": False, "is_critical": False},
    {"name": "Communication", "category": "soft", "subcategory": "interpersonal", "is_emerging": False, "is_critical": False}
]

async def seed_ml_data():
    print("Seeding ML Data (Skills, EmployeeSkills)...")
    async with async_session_factory() as session:
        # Check if skills already exist
        result = await session.execute(select(Skill))
        existing_skills = result.scalars().all()
        
        if len(existing_skills) < len(SKILLS_DATA):
            # We need to add skills
            for s_data in SKILLS_DATA:
                existing = await session.execute(select(Skill).where(Skill.name == s_data["name"]))
                if not existing.scalars().first():
                    skill = Skill(
                        id=str(uuid.uuid4()),
                        name=s_data["name"],
                        category=s_data["category"],
                        subcategory=s_data["subcategory"],
                        is_emerging=s_data["is_emerging"],
                        is_critical=s_data["is_critical"],
                        current_demand_score=random.uniform(50.0, 95.0),
                        future_demand_score=random.uniform(60.0, 100.0),
                        growth_rate=random.uniform(2.0, 25.0) if s_data["is_emerging"] else random.uniform(0.5, 5.0)
                    )
                    session.add(skill)
            
            await session.commit()
            print("Skills added.")
        
        # Reload skills
        result = await session.execute(select(Skill))
        skills = result.scalars().all()
        
        # Get employees
        result = await session.execute(select(Employee))
        employees = result.scalars().all()
        
        if not employees:
            print("No employees found. Run main seed_data.py first.")
            return

        # Assign random skills to employees
        print("Assigning skills to employees...")
        for emp in employees:
            # Check existing employee skills
            res = await session.execute(select(EmployeeSkill).where(EmployeeSkill.employee_id == emp.id))
            emp_skills = res.scalars().all()
            if len(emp_skills) > 0:
                continue # Already has skills
                
            num_skills = random.randint(3, 8)
            chosen_skills = random.sample(skills, num_skills)
            for sk in chosen_skills:
                target_level = random.randint(3, 5)
                # Ensure a skill gap exists sometimes
                proficiency = random.randint(1, target_level)
                
                es = EmployeeSkill(
                    id=str(uuid.uuid4()),
                    employee_id=emp.id,
                    skill_id=sk.id,
                    proficiency_level=proficiency,
                    target_level=target_level,
                    assessed_at=date.today() - timedelta(days=random.randint(1, 100))
                )
                session.add(es)
                
        await session.commit()
        print("ML Data seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed_ml_data())
