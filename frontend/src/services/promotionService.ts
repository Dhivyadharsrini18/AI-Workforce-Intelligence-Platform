import { apiClient } from './apiClient';
import type { PromotionPrediction } from '../types/analytics';

const USE_MOCK = true; // Fallback to mock data for predictive pages

const mockPromotion: PromotionPrediction = {
  employee_id: 'emp-1',
  employee_name: 'John Doe',
  job_title: 'Senior Engineer',
  promotion_probability: 82.5,
  leadership_potential: 85.0,
  confidence: 91.2,
  features: {
    readiness_score: 80,
    performance: 95,
    tenure: 60,
    leadership_certifications: 100,
    skill_breadth: 80,
    manager_rating: 90
  },
  shap_values: [
    { feature: 'performance', value: 95, contribution: 12.5, direction: 'positive' },
    { feature: 'leadership_certifications', value: 100, contribution: 8.2, direction: 'positive' },
    { feature: 'tenure', value: 60, contribution: -2.1, direction: 'negative' }
  ],
  explanation: 'High probability of promotion (82.5%). Driven strongly by performance, leadership certifications.',
  suggested_action: 'Approve for next promotion cycle. Enroll in executive transition track.',
  timeline: 'Short-term (3-6 months)'
};

export const promotionService = {
  async predictPromotion(empId: string): Promise<PromotionPrediction> {
    if (USE_MOCK) return mockPromotion;
    const response = await apiClient.get<PromotionPrediction>(`/promotion/predict/${empId}`);
    return response.data;
  }
};

