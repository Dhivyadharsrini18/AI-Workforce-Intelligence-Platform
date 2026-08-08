from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
import uuid

from app.database import get_db
from app.models.skill import Skill

router = APIRouter(prefix="/skills", tags=['skills'])

class SkillCreate(BaseModel):
    name: str
    category: str
    subcategory: Optional[str] = None
    description: Optional[str] = None
    current_demand_score: Optional[float] = 50.0
    is_emerging: Optional[bool] = False
    is_critical: Optional[bool] = False

@router.get("")
async def get_skills(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).order_by(Skill.name).limit(200))
    skills = result.scalars().all()
    
    return [{
        "id": s.id,
        "name": s.name,
        "category": s.category,
        "subcategory": s.subcategory,
        "description": s.description,
        "future_demand_score": s.future_demand_score,
        "current_demand_score": s.current_demand_score,
        "growth_rate": s.growth_rate,
        "is_emerging": s.is_emerging,
        "is_critical": s.is_critical
    } for s in skills]

@router.post("")
async def create_skill(skill_in: SkillCreate, db: AsyncSession = Depends(get_db)):
    # Check if skill exists
    result = await db.execute(select(Skill).where(Skill.name == skill_in.name))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Skill already exists")
        
    new_skill = Skill(
        id=str(uuid.uuid4()),
        name=skill_in.name,
        category=skill_in.category,
        subcategory=skill_in.subcategory,
        description=skill_in.description,
        current_demand_score=skill_in.current_demand_score,
        future_demand_score=skill_in.current_demand_score,
        is_emerging=skill_in.is_emerging,
        is_critical=skill_in.is_critical
    )
    db.add(new_skill)
    await db.commit()
    await db.refresh(new_skill)
    
    return {
        "id": new_skill.id,
        "name": new_skill.name,
        "category": new_skill.category,
        "subcategory": new_skill.subcategory,
        "current_demand_score": new_skill.current_demand_score,
        "is_emerging": new_skill.is_emerging,
        "is_critical": new_skill.is_critical
    }


@router.get("/emerging")
async def get_emerging_skills(limit: int = 5, db: AsyncSession = Depends(get_db)):
    return [
        {"id": "1", "name": "Generative AI", "category": "AI/ML", "current_demand_score": 98},
        {"id": "2", "name": "Quantum Computing", "category": "Deep Tech", "current_demand_score": 85},
        {"id": "3", "name": "Rust", "category": "Programming", "current_demand_score": 92},
        {"id": "4", "name": "Edge AI", "category": "AI/ML", "current_demand_score": 88},
        {"id": "5", "name": "WebAssembly", "category": "Web", "current_demand_score": 82}
    ][:limit]

@router.get("/forecast")
async def get_skill_forecast(skill_name: str, months: int = 12, db: AsyncSession = Depends(get_db)):
    import datetime
    import random
    data = []
    base = 50
    for i in range(months):
        date = (datetime.datetime.now() + datetime.timedelta(days=30*i)).strftime("%Y-%m")
        base += random.randint(-5, 10)
        data.append({"date": date, "demand": base})
    return data
