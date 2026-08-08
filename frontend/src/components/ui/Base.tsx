/**
 * Base UI Components — Onyx Edition
 * ==================================
 * Sharp, high-contrast structural components.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '../../design-system';

// --- Card ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ interactive, glass, padding = 'md', className = '', children, ...props }: CardProps) {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = `card rounded-[var(--radius-xl)] border border-[var(--border-primary)] ${paddingMap[padding]}`;
  const bgClass = glass ? 'glass' : 'bg-[var(--bg-card)] shadow-[var(--shadow-card)]';
  const interactiveClass = interactive ? 'card-interactive cursor-pointer hover:border-[var(--border-secondary)]' : '';

  if (interactive) {
    return (
      <motion.div
        {...cardHover}
        className={`${baseClasses} ${bgClass} ${interactiveClass} ${className}`}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${bgClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

// --- Badge ---
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ variant = 'neutral', size = 'md', className = '', children, ...props }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]';
  
  return (
    <span 
      className={`inline-flex items-center gap-1 font-bold font-outfit uppercase tracking-widest rounded-sm whitespace-nowrap badge-${variant} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

// --- Status Dot ---
export function StatusDot({ status }: { status: 'active' | 'inactive' | 'warning' | 'danger' }) {
  return <span className={`w-1.5 h-1.5 rounded-full status-dot-${status} shrink-0`} />;
}

// --- Section Header ---
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-[15px] font-bold font-outfit uppercase tracking-widest text-[var(--text-primary)]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[13px] text-[var(--text-secondary)] mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// --- Skeleton ---
export function Skeleton({ className = '', style }: { className?: string, style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />;
}
