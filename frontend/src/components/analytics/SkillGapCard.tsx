import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import type { SkillGap } from '../../types/analytics';

interface SkillGapCardProps {
  gaps: SkillGap[];
}

export default function SkillGapCard({ gaps }: SkillGapCardProps) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="card h-full flex flex-col p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold flex items-center" style={{ color: 'var(--text-primary)' }}>
          <AlertCircle className="w-4 h-4 mr-2" style={{ color: 'var(--color-warning)' }} />
          Critical Skill Gaps
        </h3>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {gaps.map((gap, idx) => (
          <motion.div 
            key={gap.skill_name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3 rounded-lg"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-primary)' }}
          >
            <div className="flex justify-between items-start mb-1.5">
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{gap.skill_name}</h4>
              {gap.is_critical && (
                <span className="badge badge-danger">
                  Critical
                </span>
              )}
            </div>

            {/* Visual Bar */}
            <div className="progress-bar my-2">
              <div 
                className="progress-bar-fill primary" 
                style={{ width: `${((gap.avg_current || gap.current_level || 0) / (gap.avg_target || gap.target_level || 5)) * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-medium mt-1">
              <span style={{ color: 'var(--text-tertiary)' }}>Current: {gap.avg_current || gap.current_level} / Target: {gap.avg_target || gap.target_level}</span>
              <span style={{ color: 'var(--color-danger)' }}>
                {(gap.gap_pct || 0).toFixed(1)}% Gap
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
