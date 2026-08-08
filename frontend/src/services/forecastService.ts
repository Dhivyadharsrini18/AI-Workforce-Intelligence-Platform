import { apiClient } from './apiClient';
import type { SkillForecast, TechnologyTrend } from '../types/analytics';

const USE_MOCK = true; // Fallback to mock data for predictive pages

// Mock data
const mockForecasts: SkillForecast[] = [
  {
    skill_id: 's-1',
    skill_name: 'Python',
    category: 'Programming Languages',
    is_emerging: false,
    is_critical: true,
    current_demand: 92,
    forecast_6m: 94,
    forecast_12m: 95,
    forecast_24m: 96,
    growth_rate: 4.5,
    confidence: 88,
    trend_direction: 'rising',
    time_series: Array.from({ length: 24 }).map((_, i) => ({
      date: new Date(2023, i, 1).toISOString().split('T')[0],
      demand: 80 + i * 0.5 + Math.random() * 2,
      upper: 82 + i * 0.6,
      lower: 78 + i * 0.4,
      type: i < 12 ? 'historical' : 'forecast'
    }))
  }
];

const mockTrends: TechnologyTrend[] = [
  { rank: 1, skill_id: 's-1', skill_name: 'Generative AI', category: 'AI & ML', current_demand: 85, future_demand: 98, growth_rate: 45, is_emerging: true, is_critical: true, trend_direction: 'rising' },
  { rank: 2, skill_id: 's-2', skill_name: 'Cloud Architecture', category: 'Cloud Platforms', current_demand: 88, future_demand: 92, growth_rate: 15, is_emerging: false, is_critical: true, trend_direction: 'rising' },
];

export const forecastService = {
  async getAllForecasts(months: number = 12): Promise<SkillForecast[]> {
    if (USE_MOCK) return mockForecasts;
    const response = await apiClient.get<SkillForecast[]>('/forecast/skills', { params: { months } });
    return response.data;
  },

  async getSkillForecast(skillId: string, months: number = 12): Promise<SkillForecast> {
    if (USE_MOCK) return mockForecasts[0];
    const response = await apiClient.get<SkillForecast>(`/forecast/skills/${skillId}`, { params: { months } });
    return response.data;
  },

  async getTrends(): Promise<TechnologyTrend[]> {
    if (USE_MOCK) return mockTrends;
    const response = await apiClient.get<TechnologyTrend[]>('/forecast/trends');
    return response.data;
  }
};

