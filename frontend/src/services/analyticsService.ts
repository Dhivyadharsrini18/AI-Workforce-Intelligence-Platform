import { apiClient } from './apiClient';
import type { DashboardKPIs, SkillGap } from '../types/analytics';

export const analyticsService = {
  getDashboardKPIs: async (): Promise<Partial<DashboardKPIs>> => {
    const res = await apiClient.get('/analytics/dashboard');
    return res.data.data;
  },
  
  getSkillGaps: async (): Promise<SkillGap[]> => {
    const res = await apiClient.get('/analytics/skill-gap');
    return res.data.data;
  },
  
  getDepartmentHeatmap: async (): Promise<{ columns: string[]; data: any[] }> => {
    const res = await apiClient.get('/analytics/heatmap');
    return res.data.data;
  },
  
  getAIInsights: async (): Promise<string[]> => {
    const res = await apiClient.get('/analytics/insights');
    return res.data.data;
  },
  
  getRecommendations: async (employeeId: string): Promise<any[]> => {
    const res = await apiClient.get(`/recommendations/skills/${employeeId}`);
    return res.data;
  }
};
