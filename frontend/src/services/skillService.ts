import { apiClient } from './apiClient';
import type { Skill } from '../types/employee';

export const skillService = {
  getSkills: async (): Promise<Skill[]> => {
    const res = await apiClient.get('/skills');
    return res.data;
  },
  
  createSkill: async (data: Partial<Skill>): Promise<Skill> => {
    const res = await apiClient.post('/skills', data);
    return res.data;
  },
  
  updateSkill: async (id: string, data: Partial<Skill>): Promise<Skill> => {
    const res = await apiClient.put(`/skills/${id}`, data);
    return res.data;
  },
  
  deleteSkill: async (id: string): Promise<void> => {
    await apiClient.delete(`/skills/${id}`);
  },
  
  getTrending: async (limit = 5): Promise<Skill[]> => {
    const res = await apiClient.get(`/skills/trending?limit=${limit}`);
    return res.data;
  },
  
  getEmerging: async (limit = 5): Promise<Skill[]> => {
    const res = await apiClient.get(`/skills/emerging?limit=${limit}`);
    return res.data;
  },
  
  getForecast: async (skillName: string, months = 12): Promise<{ date: string; demand: number }[]> => {
    const res = await apiClient.get(`/skills/forecast?skill_name=${skillName}&months=${months}`);
    return res.data;
  },
};
