/**
 * Design Tokens — Elevation (Shadows)
 * ====================================
 * Soft, muted shadows inspired by Fluent 2.
 */

export const elevation = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 8px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
  lg: '0 12px 24px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
  card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02)',
  cardHover: '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
  glow: '0 0 0 1px rgba(37, 99, 235, 0.3), 0 0 20px -4px rgba(37, 99, 235, 0.2)',
  /** For dark mode — slightly stronger to stand out against dark bg */
  dark: {
    card: '0 1px 3px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.04)',
    cardHover: '0 8px 24px -4px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.06)',
    glow: '0 0 0 1px rgba(37, 99, 235, 0.4), 0 0 24px -4px rgba(37, 99, 235, 0.3)',
  },
} as const;
