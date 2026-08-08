import uuid
from typing import Sequence
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.skill import Skill

class SkillService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_skills(self) -> Sequence[Skill]:
        result = await self.db.execute(select(Skill).order_by(Skill.name))
        return result.scalars().all()

    async def get_skill(self, skill_id: str) -> Skill:
        result = await self.db.execute(select(Skill).where(Skill.id == skill_id))
        skill = result.scalars().first()
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        return skill

    async def create_skill(self, data: dict) -> Skill:
        # Check uniqueness
        existing = await self.db.execute(select(Skill).where(Skill.name == data.get("name")))
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="Skill with this name already exists")
            
        new_skill = Skill(id=str(uuid.uuid4()), **data)
        self.db.add(new_skill)
        await self.db.commit()
        await self.db.refresh(new_skill)
        return new_skill

    async def update_skill(self, skill_id: str, data: dict) -> Skill:
        skill = await self.get_skill(skill_id)
        
        for key, value in data.items():
            if value is not None:
                setattr(skill, key, value)
                
        await self.db.commit()
        await self.db.refresh(skill)
        return skill

    async def delete_skill(self, skill_id: str) -> None:
        skill = await self.get_skill(skill_id)
        await self.db.delete(skill)
        await self.db.commit()

    async def get_trending_skills(self, limit: int = 5) -> Sequence[Skill]:
        result = await self.db.execute(
            select(Skill).order_by(desc(Skill.current_demand_score)).limit(limit)
        )
        return result.scalars().all()

    async def get_emerging_skills(self, limit: int = 5) -> Sequence[Skill]:
        result = await self.db.execute(
            select(Skill)
            .where(Skill.is_emerging == True)
            .order_by(desc(Skill.growth_rate))
            .limit(limit)
        )
        return result.scalars().all()
