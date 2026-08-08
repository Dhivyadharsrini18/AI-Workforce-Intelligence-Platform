/**
 * Design Tokens — Spacing
 * =======================
 * Material 3 inspired spacing scale.
 */

export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

/** Page-level padding */
export const page = {
  paddingX: spacing[6],
  paddingY: spacing[6],
  maxWidth: '1480px',
  gap: spacing[6],
} as const;

/** Section spacing */
export const section = {
  gap: spacing[6],
  headerGap: spacing[2],
} as const;
