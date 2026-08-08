/**
 * Design Tokens — Motion
 * ======================
 * Subtle, professional animation presets. No flashy animations.
 */

import type { Variants, Transition } from 'framer-motion';

/** Standard easing curves */
export const easing = {
  standard: [0.2, 0, 0, 1] as [number, number, number, number],
  decelerate: [0, 0, 0, 1] as [number, number, number, number],
  accelerate: [0.3, 0, 1, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;

/** Duration presets */
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  page: 0.35,
} as const;

/** Transition presets */
export const transition: Record<string, Transition> = {
  fast: { duration: duration.fast, ease: easing.standard },
  normal: { duration: duration.normal, ease: easing.standard },
  slow: { duration: duration.slow, ease: easing.standard },
  page: { duration: duration.page, ease: easing.decelerate },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 25 },
};

/** Page enter/exit */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: transition.page },
  exit: { opacity: 0, y: -4, transition: { duration: duration.fast } },
};

/** Stagger container for lists/grids */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
};

/** Stagger child — subtle fade + slide */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easing.decelerate },
  },
};

/** Scale-in for modals / overlays */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: transition.normal },
  exit: { opacity: 0, scale: 0.97, transition: { duration: duration.fast } },
};

/** Slide from right for drawers */
export const slideRight: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: transition.slow },
  exit: { x: '100%', transition: { duration: duration.normal } },
};

/** Card hover preset — subtle lift */
export const cardHover = {
  whileHover: { y: -2, transition: transition.fast },
  whileTap: { scale: 0.995 },
};

/** Fade in from below */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easing.decelerate },
  },
};

/** Fade in scale — for modal content, cards appearing */
export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease: easing.decelerate },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: duration.fast },
  },
};

/** List item animation — for table rows, list entries */
export const listItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.decelerate },
  },
};

/** Pulse animation for AI elements */
export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 5px rgba(99, 102, 241, 0.3)',
      '0 0 20px rgba(99, 102, 241, 0.6)',
      '0 0 5px rgba(99, 102, 241, 0.3)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};
