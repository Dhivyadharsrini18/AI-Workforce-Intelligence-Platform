import { motion } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';
import type { DashboardKPIs } from '../../types/analytics';

interface SkillDashboardProps extends Partial<DashboardKPIs> {
  ai_readiness_index?: number;
  future_demand_score?: number;
}

export default function SkillDashboard({
  total_skills = 0,
  emerging_skills_count = 0,
  ai_readiness_index = 84,
  future_demand_score = 78
}: SkillDashboardProps) {
  const kpis = [
    {
      title: 'Total Skills Tracked',
      value: total_skills || 142,
      icon: Target,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-bg)'
    },
    {
      title: 'Emerging Technologies',
      value: emerging_skills_count || 18,
      icon: Zap,
      color: 'var(--color-accent)',
      bg: 'rgba(167, 139, 250, 0.12)'
    },
    {
      title: 'AI Readiness Index',
      value: `${ai_readiness_index}%`,
      icon: Brain,
      color: 'var(--color-success)',
      bg: 'var(--color-success-bg)'
    },
    {
      title: 'Future Demand Score',
      value: future_demand_score,
      icon: TrendingUp,
      color: 'var(--color-warning)',
      bg: 'var(--color-warning-bg)'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="card p-4 flex items-center gap-3.5 card-accent"
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
            style={{ background: kpi.bg, color: kpi.color }}
          >
            <kpi.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
              {kpi.title}
            </div>
            <div className="text-xl font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {kpi.value}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
