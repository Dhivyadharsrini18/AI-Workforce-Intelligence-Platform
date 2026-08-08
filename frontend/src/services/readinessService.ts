import { apiClient } from './apiClient';
import type { ReadinessScore, ReadinessRanking } from '../types/analytics';

const USE_MOCK = true; // Fallback to mock data for predictive pages

// Mock data
const mockScore: ReadinessScore = {
  employee_id: 'emp-1',
  employee_name: 'John Doe',
  job_title: 'Senior Engineer',
  readiness_score: 82,
  confidence: 90,
  features: { experience: 85, performance: 90, skills_coverage: 75, learning_progress: 88, certifications: 60, manager_rating: 95, engagement: 80 },
  shap_values: [
    { feature: 'performance', value: 90, contribution: 8.5, direction: 'positive' },
    { feature: 'skills_coverage', value: 75, contribution: -3.2, direction: 'negative' }
  ],
  explanation: 'Readiness score is 82/100. Strongest drivers: performance and manager rating. Areas for improvement: skills coverage.',
  trend: 'improving',
  recommendation: 'Ready for promotion or leadership role expansion.'
};

export const readinessService = {
  async getEmployeeScore(empId: string): Promise<ReadinessScore> {
    if (USE_MOCK) return mockScore;
    const response = await apiClient.get<ReadinessScore>(`/readiness/score/${empId}`);
    return response.data;
  },

  async getDepartmentScore(deptId: string): Promise<any> {
    if (USE_MOCK) return { department: 'Engineering', average_readiness: 75, top_performers: [], needs_improvement: [] };
    const response = await apiClient.get(`/readiness/department/${deptId}`);
    return response.data;
  },

  async getRanking(): Promise<ReadinessRanking[]> {
    if (USE_MOCK) return [];
    const response = await apiClient.get<ReadinessRanking[]>('/readiness/ranking');
    return response.data;
  }
};

