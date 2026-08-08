import asyncio
import uuid
from app.database import async_session_factory
from app.models.skill import Skill

async def add_custom_skills():
    async with async_session_factory() as db:
        skills = [
            Skill(id=str(uuid.uuid4()), name="Agentic AI Development", category="technical", subcategory="AI & ML", current_demand_score=95.0, is_emerging=True, is_critical=True),
            Skill(id=str(uuid.uuid4()), name="Multi-Agent Systems", category="technical", subcategory="AI & ML", current_demand_score=92.0, is_emerging=True),
            Skill(id=str(uuid.uuid4()), name="LLM Orchestration", category="technical", subcategory="AI & ML", current_demand_score=88.0, is_emerging=True),
            Skill(id=str(uuid.uuid4()), name="Prompt Engineering Pro", category="technical", subcategory="AI & ML", current_demand_score=98.0, is_critical=True)
        ]
        db.add_all(skills)
        await db.commit()
        print("Successfully added custom skills!")

if __name__ == "__main__":
    asyncio.run(add_custom_skills())
