/**
 * Employee Analytics Cards
 * ========================
 * Top KPIs for the employees page.
 */

import { Users, UserCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, StatusDot } from '../ui/Base';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { staggerItem } from '../../design-system';

interface AnalyticsProps {
  total: number;
  active: number;
  avgReadiness: number;
  highRisk: number;
}

export default function EmployeeAnalytics({ total, active, avgReadiness, highRisk }: AnalyticsProps) {
  const stats = [
    {
      label: 'Total Workforce',
      value: total,
      icon: Users,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-bg)',
      dot: 'active' as const,
      subtext: '+3.2% vs last month',
    },
    {
      label: 'Active Employees',
      value: active,
      icon: UserCheck,
      color: 'var(--color-success)',
      bg: 'var(--color-success-bg)',
      dot: 'active' as const,
      subtext: '98% utilization',
    },
    {
      label: 'Avg Readiness',
      value: avgReadiness,
      suffix: '%',
      icon: TrendingUp,
      color: 'var(--color-info)',
      bg: 'var(--color-info-bg)',
      dot: 'warning' as const,
      subtext: 'Target is 85%',
    },
    {
      label: 'High Attrition Risk',
      value: highRisk,
      icon: AlertTriangle,
      color: 'var(--color-danger)',
      bg: 'var(--color-danger-bg)',
      dot: 'danger' as const,
      subtext: 'Requires immediate action',
    }
  ];

  return (
    <div className="modular-grid mb-6">
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={staggerItem} className="span-3">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-10 h-10 rounded-md flex items-center justify-center border border-[var(--border-subtle)]" 
                  style={{ background: stat.bg }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] font-medium uppercase tracking-widest font-outfit">
                {stat.label}
              </p>
              <p className="text-[32px] font-bold text-[var(--text-primary)] mt-1 tracking-tight font-outfit">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-[var(--border-primary)]">
              <p className="text-[12px] text-[var(--text-tertiary)] flex items-center gap-2 font-medium">
                <StatusDot status={stat.dot} /> {stat.subtext}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
