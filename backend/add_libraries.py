import asyncio
import uuid
from sqlalchemy.exc import IntegrityError
from app.database import async_session_factory
from app.models.skill import Skill

async def add_more_library_skills():
    async with async_session_factory() as db:
        skills = [
            # Web & Mobile
            Skill(id=str(uuid.uuid4()), name="Angular", category="technical", subcategory="Web Development", current_demand_score=85.0, is_emerging=False, is_critical=False),
            Skill(id=str(uuid.uuid4()), name="Vue.js", category="technical", subcategory="Web Development", current_demand_score=87.0, is_emerging=False, is_critical=False),
            Skill(id=str(uuid.uuid4()), name="Svelte", category="technical", subcategory="Web Development", current_demand_score=89.0, is_emerging=True, is_critical=False),
            Skill(id=str(uuid.uuid4()), name="React Native", category="technical", subcategory="Mobile Development", current_demand_score=91.0, is_emerging=False, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="Flutter", category="technical", subcategory="Mobile Development", current_demand_score=93.0, is_emerging=False, is_critical=True),
            
            # Backend & APIs
            Skill(id=str(uuid.uuid4()), name="FastAPI", category="technical", subcategory="Backend Development", current_demand_score=95.0, is_emerging=True, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="Express.js", category="technical", subcategory="Backend Development", current_demand_score=88.0, is_emerging=False, is_critical=False),
            Skill(id=str(uuid.uuid4()), name="Django", category="technical", subcategory="Backend Development", current_demand_score=86.0, is_emerging=False, is_critical=False),
            Skill(id=str(uuid.uuid4()), name="Spring Boot", category="technical", subcategory="Backend Development", current_demand_score=90.0, is_emerging=False, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="GraphQL", category="technical", subcategory="API Design", current_demand_score=89.0, is_emerging=False, is_critical=False),
            
            # Data & AI
            Skill(id=str(uuid.uuid4()), name="Hugging Face Transformers", category="technical", subcategory="AI & ML", current_demand_score=97.0, is_emerging=True, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="OpenAI API", category="technical", subcategory="AI & ML", current_demand_score=98.0, is_emerging=True, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="Keras", category="technical", subcategory="AI & ML", current_demand_score=82.0, is_emerging=False, is_critical=False),
            Skill(id=str(uuid.uuid4()), name="Apache Spark", category="technical", subcategory="Data Engineering", current_demand_score=92.0, is_emerging=False, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="dbt (Data Build Tool)", category="technical", subcategory="Data Engineering", current_demand_score=94.0, is_emerging=True, is_critical=True),
            
            # DevOps & Cloud Infrastructure
            Skill(id=str(uuid.uuid4()), name="Docker", category="technical", subcategory="DevOps", current_demand_score=96.0, is_emerging=False, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="Kubernetes", category="technical", subcategory="DevOps", current_demand_score=98.0, is_emerging=False, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="Terraform", category="technical", subcategory="DevOps", current_demand_score=95.0, is_emerging=False, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="Ansible", category="technical", subcategory="DevOps", current_demand_score=87.0, is_emerging=False, is_critical=False),
            Skill(id=str(uuid.uuid4()), name="GitHub Actions", category="technical", subcategory="DevOps", current_demand_score=93.0, is_emerging=True, is_critical=True)
        ]
        
        added = 0
        for skill in skills:
            try:
                db.add(skill)
                await db.commit()
                added += 1
            except IntegrityError:
                await db.rollback()
        
        print(f"Successfully added {added} more comprehensive library skills!")

if __name__ == "__main__":
    asyncio.run(add_more_library_skills())
