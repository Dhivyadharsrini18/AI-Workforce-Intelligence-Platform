/**
 * Brand — Logo
 * ============
 * The AI Workforce Intelligence Platform mark: an abstract, premium enterprise symbol.
 * Features connected nodes forming a geometric "W" / growth chart,
 * representing network, analytics, people, and AI integration.
 * 
 * Palette: Deep Blue → Indigo → Purple
 */
import { APP_NAME } from '../../utils/constants';

interface LogoMarkProps {
  size?: number;
  className?: string;
  gradientId?: string;
}

/** Standalone SVG symbol mark — Network / Nodes / Growth */
export function LogoMark({ size = 32, className = '', gradientId = 'logo-gradient' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={APP_NAME}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />   {/* Blue-600 */}
          <stop offset="50%" stopColor="#4F46E5" />  {/* Indigo-600 */}
          <stop offset="100%" stopColor="#9333EA" /> {/* Purple-600 */}
        </linearGradient>
      </defs>
      
      {/* Background / Container */}
      <rect width="40" height="40" rx="10" fill={`url(#${gradientId})`} />
      
      {/* 
        Abstract 'W' / Analytics Nodes structure 
        Connecting data points that represent workforce and growth.
      */}
      <g stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Lines connecting the nodes */}
        <path d="M10 24 L16 14 L20 22 L26 12 L30 18" fill="none" opacity="0.8" />
        
        {/* Nodes representing people/data points */}
        <circle cx="10" cy="24" r="3" fill="white" />
        <circle cx="16" cy="14" r="3" fill="white" />
        <circle cx="20" cy="22" r="3" fill="white" />
        <circle cx="26" cy="12" r="3" fill="white" />
        <circle cx="30" cy="18" r="3" fill="white" />
      </g>
    </svg>
  );
}

interface LogoTextProps {
  tagline?: string;
  className?: string;
}

/** Wordmark only — no icon. */
export function LogoText({ tagline, className = '' }: LogoTextProps) {
  return (
    <div className={`min-w-0 overflow-hidden ${className}`}>
      <p
        className="font-bold leading-tight truncate whitespace-nowrap tracking-tight"
        style={{ color: 'var(--text-primary)', fontSize: '15px' }}
      >
        AI Workforce
      </p>
      {tagline ? (
        <p
          className="text-[10px] font-semibold leading-tight truncate whitespace-nowrap tracking-widest uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {tagline}
        </p>
      ) : (
        <p
          className="text-[11px] font-medium leading-tight truncate whitespace-nowrap"
          style={{ color: 'var(--text-secondary)' }}
        >
          Intelligence Platform
        </p>
      )}
    </div>
  );
}

interface LogoProps {
  variant?: 'full' | 'compact' | 'symbol';
  size?: number;
  className?: string;
  tagline?: string;
}

export default function Logo({ variant = 'full', size = 32, className = '', tagline }: LogoProps) {
  if (variant === 'symbol' || variant === 'compact') {
    return <LogoMark size={size} className={className} gradientId={`logo-gradient-${variant}`} />;
  }

  return (
    <div className={`flex items-center gap-3 min-w-0 ${className}`}>
      <LogoMark size={size} gradientId="logo-gradient-full" />
      <LogoText tagline={tagline} />
    </div>
  );
}
