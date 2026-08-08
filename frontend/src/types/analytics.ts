/**
 * Analytics & Dashboard Types
 * ===========================
 */

export interface DashboardKPIs {
  total_employees: number;
  active_employees: number;
  total_departments: number;
  total_skills: number;
  avg_readiness_score: number;
  avg_performance_score: number;
  avg_attrition_risk: number;
  total_courses: number;
  total_certifications: number;
  learning_completion_rate: number;
  skills_gap_percentage: number;
  emerging_skills_count: number;
}

export interface DepartmentStats {
  department_id: string;
  department_name: string;
  headcount: number;
  avg_performance: number;
  avg_readiness: number;
  avg_attrition_risk: number;
  skill_coverage: number;
  learning_progress: number;
}

export interface TimeSeriesPoint {
  date: string;
  demand: number;
  upper: number;
  lower: number;
  type: string;
}

export interface SkillForecast {
  skill_id: string;
  skill_name: string;
  category: string;
  is_emerging: boolean;
  is_critical: boolean;
  current_demand: number;
  forecast_6m: number;
  forecast_12m: number;
  forecast_24m: number;
  growth_rate: number;
  confidence: number;
  trend_direction: string;
  time_series?: TimeSeriesPoint[];
}

export interface TechnologyTrend {
  rank: number;
  skill_id: string;
  skill_name: string;
  category: string;
  subcategory?: string;
  current_demand: number;
  future_demand: number;
  growth_rate: number;
  is_emerging: boolean;
  is_critical: boolean;
  trend_direction: string;
}

export interface SkillGap {
  skill_id: string;
  skill_name: string;
  category: string;
  is_critical: boolean;
  current_level?: number;
  target_level?: number;
  avg_current?: number;
  avg_target?: number;
  gap?: number;
  gap_pct: number;
  priority?: string;
  employees_assessed?: number;
}

export interface MissingSkill {
  skill_id: string;
  skill_name: string;
  category: string;
  future_demand: number;
}

export interface OrganizationGapOverview {
  total_skills_tracked: number;
  average_gap_percentage: number;
  critical_gaps_count: number;
  top_gaps: SkillGap[];
  critical_gaps: SkillGap[];
  skills_at_target: number;
}

export interface DepartmentGaps {
  department_id: string;
  department: string;
  employee_count: number;
  average_gap: number;
  gaps: SkillGap[];
  missing_skills: MissingSkill[];
}

export interface EmployeeGaps {
  employee_id: string;
  employee_name: string;
  job_title: string;
  skills_assessed: number;
  average_gap: number;
  readiness_impact: number;
  gaps: SkillGap[];
}

export interface DepartmentComparison {
  department_id: string;
  department_name: string;
  employee_count: number;
  average_gap: number;
  critical_gaps: number;
  skills_tracked: number;
  risk_level: string;
}

export interface SHAPValue {
  feature: string;
  value: number;
  contribution: number;
  direction: string;
}

export interface ReadinessScore {
  employee_id: string;
  employee_name: string;
  job_title: string;
  readiness_score: number;
  confidence: number;
  features: Record<string, number>;
  shap_values: SHAPValue[];
  explanation: string;
  trend: string;
  recommendation: string;
}

export interface ReadinessRanking {
  rank: number;
  department_id: string;
  department_name: string;
  average_readiness: number;
  employee_count: number;
  status: string;
}

export interface LearningRecommendation {
  id: string;
  skill_name: string;
  skill_category: string;
  is_critical: boolean;
  current_level: number;
  target_level: number;
  gap: number;
  course_id: string;
  course_title: string;
  provider: string;
  difficulty: string;
  duration_hours: number;
  rating: number;
  relevance_score: number;
  readiness_impact: string;
  priority: string;
  career_growth: string;
}

export interface LearningPathPhase {
  name: string;
  duration_weeks: number;
  courses: LearningRecommendation[];
}

export interface LearningPath {
  employee_id: string;
  employee_name: string;
  phases: LearningPathPhase[];
  total_duration_weeks: number;
}

export interface PromotionPrediction {
  employee_id: string;
  employee_name: string;
  job_title: string;
  promotion_probability: number;
  leadership_potential: number;
  confidence: number;
  features: Record<string, number>;
  shap_values: SHAPValue[];
  explanation: string;
  suggested_action: string;
  timeline: string;
}

export interface AttritionPrediction {
  employee_id: string;
  employee_name: string;
  job_title: string;
  attrition_probability: number;
  risk_level: string;
  confidence: number;
  features: Record<string, number>;
  shap_values: SHAPValue[];
  explanation: string;
  recommended_action: string;
}

export interface HighRiskEmployee {
  employee_id: string;
  name: string;
  risk: number;
}

export interface DepartmentAttritionRisk {
  department_id: string;
  department: string;
  employee_count: number;
  average_risk: number;
  risk_level: string;
  high_risk_count: number;
  top_flight_risks: HighRiskEmployee[];
}

export interface DecisionMetrics {
  market_availability: string;
  demand_growth: number;
  required_headcount: number;
}

export interface DecisionRecommendation {
  skill_id: string;
  skill_name: string;
  strategy: string;
  priority: string;
  confidence: number;
  business_impact: string;
  estimated_cost: number;
  estimated_time_months: number;
  roi_percentage: number;
  alternative_strategy: string;
  metrics: DecisionMetrics;
}

export interface Recommendation {
  id: string;
  employee_id: string;
  course_id: string;
  relevance_score: number;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  skill_gap_addressed: string;
  estimated_hours: number;
  status: 'pending' | 'accepted' | 'completed' | 'dismissed';
  course?: import('./employee').Course;
}

export interface Prediction {
  id: string;
  employee_id?: string;
  prediction_type: string;
  prediction_data?: string;
  result_value: number;
  confidence: number;
  model_version: string;
  shap_values?: string;
  explanation?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'ai_alert' | 'skill_update' | 'learning' | 'system' | 'achievement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  metadata_json?: string;
  action_url?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface AIInsight {
  id: string;
  agent: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  created_at: string;
}
