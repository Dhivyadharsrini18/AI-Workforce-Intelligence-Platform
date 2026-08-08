/**
 * Design Tokens — Colors
 * ======================
 * Centralized color palette for the entire application.
 * Premium enterprise palette: Indigo → Violet → Purple
 */

export const colors = {
  // --- Dark Theme ---
  dark: {
    bg: {
      primary: '#080E1A',
      secondary: '#0F1629',
      tertiary: '#141C32',
      card: '#111827',
      elevated: '#141C32',
      sidebar: '#0A1120',
      header: 'rgba(8, 14, 26, 0.78)',
      overlay: 'rgba(0, 0, 0, 0.65)',
      hover: 'rgba(255, 255, 255, 0.04)',
      active: 'rgba(99, 102, 241, 0.12)',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      tertiary: '#64748B',
      muted: '#475569',
      inverse: '#0F172A',
      link: '#818CF8',
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.08)',
      secondary: 'rgba(255, 255, 255, 0.12)',
      subtle: 'rgba(255, 255, 255, 0.04)',
      focus: '#6366F1',
    },
  },

  // --- Light Theme ---
  light: {
    bg: {
      primary: '#F8FAFC',
      secondary: '#FFFFFF',
      tertiary: '#F1F5F9',
      card: '#FFFFFF',
      elevated: '#FFFFFF',
      sidebar: '#FFFFFF',
      header: 'rgba(255, 255, 255, 0.80)',
      overlay: 'rgba(0, 0, 0, 0.4)',
      hover: 'rgba(0, 0, 0, 0.03)',
      active: 'rgba(99, 102, 241, 0.08)',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      tertiary: '#94A3B8',
      muted: '#CBD5E1',
      inverse: '#FFFFFF',
      link: '#4F46E5',
    },
    border: {
      primary: 'rgba(0, 0, 0, 0.08)',
      secondary: 'rgba(0, 0, 0, 0.12)',
      subtle: 'rgba(0, 0, 0, 0.04)',
      focus: '#6366F1',
    },
  },

  // --- Brand / Semantic ---
  brand: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#4F46E5',
    secondaryLight: '#6366F1',
    accent: '#A78BFA',
  },
  semantic: {
    success: '#10B981',
    successLight: '#34D399',
    successBg: 'rgba(16, 185, 129, 0.1)',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningBg: 'rgba(245, 158, 11, 0.1)',
    danger: '#EF4444',
    dangerLight: '#F87171',
    dangerBg: 'rgba(239, 68, 68, 0.1)',
    info: '#06B6D4',
    infoLight: '#22D3EE',
    infoBg: 'rgba(6, 182, 212, 0.1)',
  },

  // --- Chart Palette ---
  chart: [
    '#6366F1', '#818CF8', '#A78BFA', '#10B981', '#06B6D4',
    '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316',
  ],

  // --- Gradient Presets ---
  gradient: {
    primary: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)',
    accent: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)',
    success: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    danger: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
    dark: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
  },
} as const;
