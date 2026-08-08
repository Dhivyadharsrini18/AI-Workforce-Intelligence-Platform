import { apiClient } from './apiClient';
import type { AttritionPrediction, DepartmentAttritionRisk } from '../types/analytics';

const USE_MOCK = true; // Fallback to mock data for predictive pages

const mockAttrition: AttritionPrediction = {
  employee_id: 'emp-1',
  employee_name: 'John Doe',
  job_title: 'Senior Engineer',
  attrition_probability: 65.4,
  risk_level: 'High',
  confidence: 88.5,
  features: {
    engagement_risk: 70,
    compensation_risk: 60,
    manager_risk: 40,
    stagnation_risk: 80,
    burnout_risk: 75,
    commute_risk: 30
  },
  shap_values: [
    { feature: 'stagnation_risk', value: 80, contribution: 15.2, direction: 'positive' },
    { feature: 'burnout_risk', value: 75, contribution: 10.5, direction: 'positive' },
    { feature: 'commute_risk', value: 30, contribution: -5.1, direction: 'negative' }
  ],
  explanation: 'Elevated flight risk (65.4%). Watch factors: stagnation risk, burnout risk.',
  recommended_action: 'Schedule 1:1 check-in. Discuss career goals and current engagement.'
};

const mockDepartmentRisk: DepartmentAttritionRisk = {
  department_id: 'dept-1',
  department: 'Engineering',
  employee_count: 150,
  average_risk: 35.2,
  risk_level: 'Medium',
  high_risk_count: 12,
  top_flight_risks: [
    { employee_id: 'emp-1', name: 'John Doe', risk: 85.0 },
    { employee_id: 'emp-2', name: 'Jane Smith', risk: 78.2 }
  ]
};

export const attritionService = {
  async predictAttrition(empId: string): Promise<AttritionPrediction> {
    if (USE_MOCK) return mockAttrition;
    const response = await apiClient.get<AttritionPrediction>(`/attrition/predict/${empId}`);
    return response.data;
  },

  async getDepartmentRisk(deptId: string): Promise<DepartmentAttritionRisk> {
    if (USE_MOCK) return mockDepartmentRisk;
    const response = await apiClient.get<DepartmentAttritionRisk>(`/attrition/department/${deptId}`);
    return response.data;
  }
};

