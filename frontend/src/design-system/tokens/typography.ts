/**
 * Design Tokens — Typography
 * ==========================
 * Linear-inspired type scale using Inter.
 */

export const fontFamily = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
} as const;

export const fontSize = {
  '2xs': '0.625rem',   // 10px
  xs: '0.75rem',       // 12px
  sm: '0.8125rem',     // 13px
  base: '0.875rem',    // 14px
  md: '0.9375rem',     // 15px
  lg: '1.0625rem',     // 17px
  xl: '1.25rem',       // 20px
  '2xl': '1.5rem',     // 24px
  '3xl': '1.875rem',   // 30px
  '4xl': '2.25rem',    // 36px
} as const;

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const lineHeight = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 1.75,
} as const;

export const letterSpacing = {
  tighter: '-0.03em',
  tight: '-0.02em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.08em',
} as const;
