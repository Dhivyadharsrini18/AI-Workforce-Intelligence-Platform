export interface Department {
  id: string;
  name: string;
  description?: string;
  location?: string;
  headcount: number;
  budget: number;
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  is_critical: boolean;
  is_emerging: boolean;
  current_demand_score: number;
  future_demand_score: number;
  growth_rate: number;
  description?: string;
}

export interface EmployeeSkill {
  id: string;
  employee_id: string;
  skill_id: string;
  proficiency_level: number;
  target_level: number;
  assessed_by?: string;
  assessed_at: string;
  skill?: Skill;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  difficulty: string;
  category: string;
}

export interface LearningRecord {
  id: string;
  employee_id: string;
  course_id: string;
  progress_pct: number;
  status: string;
  score?: number;
  started_at?: string;
  completed_at?: string;
  course?: Course;
}

export interface Certification {
  id: string;
  employee_id: string;
  name: string;
  issuer: string;
  credential_id?: string;
  earned_date: string;
  expiry_date?: string;
  status: string;
}

export interface Employee {
  id: string;
  user_id?: string;
  department_id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  job_level: string;
  experience_years: number;
  salary: number;
  performance_score: number;
  engagement_score: number;
  readiness_score: number;
  attrition_risk: number;
  hire_date: string;
  manager_name?: string;
  manager_rating: number;
  status: string;
  created_at: string;
  updated_at: string;
  
  department?: Department;
}

export interface EmployeeDetail extends Employee {
  skills: EmployeeSkill[];
  certifications: Certification[];
}

export interface EmployeeListResponse {
  items: Employee[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
