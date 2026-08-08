import { apiClient } from './apiClient';
import type { Employee, EmployeeDetail, EmployeeListResponse, Department } from '../types/employee';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Mock data
const mockDepartments: Department[] = [
  { id: 'dept-1', name: 'Engineering', headcount: 45, budget: 1500000 },
  { id: 'dept-2', name: 'Product', headcount: 15, budget: 500000 },
  { id: 'dept-3', name: 'Marketing', headcount: 20, budget: 800000 },
];

const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    department_id: 'dept-1',
    employee_code: 'EMP-001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@workforce.ai',
    job_title: 'Senior ML Engineer',
    job_level: 'senior',
    experience_years: 8,
    salary: 150000,
    performance_score: 4.5,
    engagement_score: 4.2,
    readiness_score: 85,
    attrition_risk: 0.15,
    hire_date: '2020-03-15',
    manager_rating: 4.8,
    status: 'active',
    created_at: '2020-03-15T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    department: mockDepartments[0],
  },
  {
    id: 'emp-2',
    department_id: 'dept-1',
    employee_code: 'EMP-002',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@workforce.ai',
    job_title: 'Frontend Developer',
    job_level: 'mid',
    experience_years: 4,
    salary: 110000,
    performance_score: 4.2,
    engagement_score: 4.5,
    readiness_score: 75,
    attrition_risk: 0.25,
    hire_date: '2021-06-01',
    manager_rating: 4.5,
    status: 'active',
    created_at: '2021-06-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    department: mockDepartments[0],
  },
];

export const employeeService = {
  async getEmployees(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    department_id?: string;
    status?: string;
    sort_by?: string;
    sort_desc?: boolean;
  }): Promise<EmployeeListResponse> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let items = [...mockEmployees];
      if (params?.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (e) =>
            e.first_name.toLowerCase().includes(s) ||
            e.last_name.toLowerCase().includes(s) ||
            e.email.toLowerCase().includes(s)
        );
      }
      if (params?.department_id) {
        items = items.filter((e) => e.department_id === params.department_id);
      }
      
      return {
        items,
        total: items.length,
        page: params?.page || 1,
        page_size: params?.page_size || 20,
        total_pages: Math.ceil(items.length / (params?.page_size || 20)),
      };
    }
    
    const response = await apiClient.get<EmployeeListResponse>('/employees', { params });
    return response.data;
  },

  async getEmployee(id: string): Promise<EmployeeDetail> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const emp = mockEmployees.find((e) => e.id === id);
      if (!emp) throw new Error('Employee not found');
      
      return {
        ...emp,
        skills: [],
        certifications: [],
      };
    }
    
    const response = await apiClient.get<EmployeeDetail>(`/employees/${id}`);
    return response.data;
  },
  
  async getDepartments(): Promise<Department[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDepartments;
    }
    const response = await apiClient.get<Department[]>('/departments');
    return response.data;
  }
};
