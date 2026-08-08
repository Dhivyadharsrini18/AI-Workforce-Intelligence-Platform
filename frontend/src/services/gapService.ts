import { apiClient } from './apiClient';
import type { 
  OrganizationGapOverview, 
  DepartmentGaps, 
  EmployeeGaps, 
  DepartmentComparison 
} from '../types/analytics';

const USE_MOCK = true; // Fallback to mock data for predictive pages

// Mock data
const mockOverview: OrganizationGapOverview = {
  total_skills_tracked: 150,
  average_gap_percentage: 15.4,
  critical_gaps_count: 8,
  top_gaps: [
    { skill_id: '1', skill_name: 'Cloud Architecture', category: 'Cloud', is_critical: true, gap_pct: 35.2 },
    { skill_id: '2', skill_name: 'Machine Learning', category: 'AI & ML', is_critical: true, gap_pct: 28.5 }
  ],
  critical_gaps: [],
  skills_at_target: 85
};

export const gapService = {
  async getOverview(): Promise<OrganizationGapOverview> {
    if (USE_MOCK) return mockOverview;
    const response = await apiClient.get<OrganizationGapOverview>('/gaps/overview');
    return response.data;
  },

  async getDepartmentGaps(deptId: string): Promise<DepartmentGaps> {
    if (USE_MOCK) return { department_id: deptId, department: 'Engineering', employee_count: 45, average_gap: 12.5, gaps: [], missing_skills: [] };
    const response = await apiClient.get<DepartmentGaps>(`/gaps/department/${deptId}`);
    return response.data;
  },

  async getEmployeeGaps(empId: string): Promise<EmployeeGaps> {
    if (USE_MOCK) return { employee_id: empId, employee_name: 'John Doe', job_title: 'Engineer', skills_assessed: 15, average_gap: 8.5, readiness_impact: 12, gaps: [] };
    const response = await apiClient.get<EmployeeGaps>(`/gaps/employee/${empId}`);
    return response.data;
  },

  async getComparison(): Promise<DepartmentComparison[]> {
    if (USE_MOCK) return [];
    const response = await apiClient.get<DepartmentComparison[]>('/gaps/comparison');
    return response.data;
  }
};

