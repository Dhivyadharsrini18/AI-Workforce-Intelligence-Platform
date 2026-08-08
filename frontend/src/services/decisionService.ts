import { apiClient } from './apiClient';
import type { DecisionRecommendation } from '../types/analytics';

const USE_MOCK = true; // Fallback to mock data for predictive pages

const mockDecision: DecisionRecommendation = {
  skill_id: 'skill-1',
  skill_name: 'Generative AI',
  strategy: 'Upskill (Build)',
  priority: 'Critical',
  confidence: 85.0,
  business_impact: 'Extreme market shortage for Generative AI. Highly cost-effective to upskill internal talent.',
  estimated_cost: 25000,
  estimated_time_months: 6,
  roi_percentage: 140.5,
  alternative_strategy: 'Hire (Buy)',
  metrics: {
    market_availability: 'Low',
    demand_growth: 45.5,
    required_headcount: 5
  }
};

export const decisionService = {
  async getStrategyRecommendation(skillId: string, headcount: number = 1): Promise<DecisionRecommendation> {
    if (USE_MOCK) return mockDecision;
    const response = await apiClient.get<DecisionRecommendation>(`/decision/strategy/${skillId}`, { params: { headcount } });
    return response.data;
  }
};

