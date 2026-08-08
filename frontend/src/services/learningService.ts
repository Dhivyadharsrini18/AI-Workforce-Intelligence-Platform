import { apiClient } from './apiClient';
import type { LearningPath, LearningRecommendation } from '../types/analytics';

const USE_MOCK = true; // Fallback to mock data for predictive pages

const mockRecommendations: LearningRecommendation[] = [
  {
    id: 'r-1',
    skill_name: 'Python',
    skill_category: 'Programming',
    is_critical: true,
    current_level: 2,
    target_level: 4,
    gap: 2,
    course_id: 'c-1',
    course_title: 'Advanced Python for Data Science',
    provider: 'Coursera',
    difficulty: 'advanced',
    duration_hours: 40,
    rating: 4.8,
    relevance_score: 95,
    readiness_impact: '+12%',
    priority: 'high',
    career_growth: 'High — Data Scientist Track'
  }
];

export const learningService = {
  async getEmployeeRecommendations(empId: string, limit: number = 10): Promise<{ employee_name: string; recommendations: LearningRecommendation[] }> {
    if (USE_MOCK) return { employee_name: 'John Doe', recommendations: mockRecommendations };
    const response = await apiClient.get(`/recommendations/employee/${empId}`, { params: { limit } });
    return response.data;
  },

  async getLearningPath(empId: string): Promise<LearningPath> {
    if (USE_MOCK) return { employee_id: empId, employee_name: 'John Doe', phases: [], total_duration_weeks: 12 };
    const response = await apiClient.get<LearningPath>(`/recommendations/employee/${empId}/path`);
    return response.data;
  }
};

