/**
 * Constants
 * =========
 */

export const APP_NAME = 'Workforce Intelligence';

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Employees', path: '/employees', icon: 'Users' },
  { label: 'Skill Intelligence', path: '/skills', icon: 'Brain' },
  { label: 'Skill Gap Analysis', path: '/skill-gaps', icon: 'GitCompareArrows' },
  { label: 'AI Recommendations', path: '/recommendations', icon: 'Sparkles' },
  { label: 'Workforce Forecast', path: '/forecast', icon: 'TrendingUp' },
  { label: 'Reports', path: '/reports', icon: 'FileBarChart' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
] as const;

export const CHART_COLORS = [
  '#6366F1', '#818CF8', '#A78BFA', '#10B981', '#06B6D4',
  '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316',
  '#4F46E5', '#D946EF', '#0EA5E9', '#84CC16', '#8B5CF6',
];

export const GRADIENT_PAIRS = [
  ['#4F46E5', '#6366F1'],
  ['#10B981', '#059669'],
  ['#F59E0B', '#D97706'],
  ['#EF4444', '#DC2626'],
  ['#06B6D4', '#0891B2'],
  ['#6366F1', '#A78BFA'],
];

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-emerald-600 bg-emerald-50',
  intermediate: 'text-blue-600 bg-blue-50',
  advanced: 'text-purple-600 bg-purple-50',
  expert: 'text-red-600 bg-red-50',
};

export const PROVIDERS: Record<string, { color: string; bg: string }> = {
  'Microsoft Learn': { color: '#00A4EF', bg: '#E6F7FF' },
  'Coursera': { color: '#0056D2', bg: '#EFF6FF' },
  'AWS Training': { color: '#FF9900', bg: '#FFF8E1' },
  'Google Cloud Skills': { color: '#4285F4', bg: '#E8F0FE' },
  'Udemy': { color: '#A435F0', bg: '#F3E8FF' },
};
