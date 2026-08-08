import uuid
from typing import Tuple, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc, or_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models import Employee, Department, EmployeeSkill, Certification, LearningRecord
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.schemas.department import DepartmentCreate, DepartmentUpdate

class EmployeeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =====================================================================
    # Department Operations
    # =====================================================================
    
    async def get_departments(self) -> List[Department]:
        result = await self.db.execute(select(Department).order_by(Department.name))
        return list(result.scalars().all())
    
    async def get_department(self, dept_id: str) -> Optional[Department]:
        result = await self.db.execute(select(Department).where(Department.id == dept_id))
        return result.scalars().first()

    # =====================================================================
    # Employee Operations
    # =====================================================================
    
    async def get_employees(
        self,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
        department_id: Optional[str] = None,
        status: Optional[str] = None,
        sort_by: str = "created_at",
        sort_desc: bool = True
    ) -> Tuple[List[Employee], int]:
        
        query = select(Employee).options(selectinload(Employee.department))
        count_query = select(func.count(Employee.id))
        
        # Apply filters
        if search:
            search_filter = or_(
                Employee.first_name.ilike(f"%{search}%"),
                Employee.last_name.ilike(f"%{search}%"),
                Employee.email.ilike(f"%{search}%"),
                Employee.employee_code.ilike(f"%{search}%"),
                Employee.job_title.ilike(f"%{search}%")
            )
            query = query.where(search_filter)
            count_query = count_query.where(search_filter)
            
        if department_id:
            query = query.where(Employee.department_id == department_id)
            count_query = count_query.where(Employee.department_id == department_id)
            
        if status:
            query = query.where(Employee.status == status)
            count_query = count_query.where(Employee.status == status)
            
        # Apply sorting
        sort_col = getattr(Employee, sort_by, Employee.created_at)
        if sort_desc:
            query = query.order_by(desc(sort_col))
        else:
            query = query.order_by(asc(sort_col))
            
        # Execute count
        total = await self.db.scalar(count_query) or 0
        
        # Apply pagination and execute
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        items = list(result.scalars().all())
        
        return items, total

    async def get_employee_detail(self, emp_id: str) -> Optional[Employee]:
        query = (
            select(Employee)
            .options(
                selectinload(Employee.department),
                selectinload(Employee.skills).selectinload(EmployeeSkill.skill),
                selectinload(Employee.certifications)
            )
            .where(Employee.id == emp_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_employee(self, data: EmployeeCreate) -> Employee:
        # Check if dept exists
        dept = await self.get_department(data.department_id)
        if not dept:
            raise HTTPException(status_code=400, detail="Department not found")
            
        # Check employee code
        existing = await self.db.scalar(select(Employee).where(Employee.employee_code == data.employee_code))
        if existing:
            raise HTTPException(status_code=400, detail="Employee code already exists")
            
        db_emp = Employee(**data.model_dump(), id=str(uuid.uuid4()))
        self.db.add(db_emp)
        
        # Update department headcount
        dept.headcount += 1
        
        await self.db.commit()
        await self.db.refresh(db_emp)
        return db_emp

    async def update_employee(self, emp_id: str, data: EmployeeUpdate) -> Optional[Employee]:
        emp = await self.get_employee_detail(emp_id)
        if not emp:
            return None
            
        update_data = data.model_dump(exclude_unset=True)
        
        # Handle department change logic for headcount
        if "department_id" in update_data and update_data["department_id"] != emp.department_id:
            old_dept = await self.get_department(emp.department_id)
            new_dept = await self.get_department(update_data["department_id"])
            if old_dept: old_dept.headcount = max(0, old_dept.headcount - 1)
            if new_dept: new_dept.headcount += 1
            
        for key, value in update_data.items():
            setattr(emp, key, value)
            
        await self.db.commit()
        await self.db.refresh(emp)
        return emp

    async def delete_employee(self, emp_id: str) -> bool:
        emp = await self.get_employee_detail(emp_id)
        if not emp:
            return False
            
        # Soft delete by setting status
        emp.status = "terminated"
        
        dept = await self.get_department(emp.department_id)
        if dept:
            dept.headcount = max(0, dept.headcount - 1)
            
        await self.db.commit()
        return True

    async def get_employee_learning_records(self, emp_id: str) -> List[LearningRecord]:
        query = (
            select(LearningRecord)
            .options(selectinload(LearningRecord.course))
            .where(LearningRecord.employee_id == emp_id)
            .order_by(desc(LearningRecord.started_at))
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
