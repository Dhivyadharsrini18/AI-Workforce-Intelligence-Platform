import { Star } from 'lucide-react';
import type { EmployeeSkill } from '../../types/employee';

export function SkillRating({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star 
          key={i} 
          className={`w-3.5 h-3.5 ${
            i < level 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-transparent text-gray-300 dark:text-gray-700'
          }`} 
        />
      ))}
    </div>
  );
}

export default function SkillBadge({ empSkill }: { empSkill: EmployeeSkill }) {
  const isCritical = empSkill.skill?.is_critical;
  
  return (
    <div className={`inline-flex flex-col gap-1 p-3 rounded-lg border ${
      isCritical 
        ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10' 
        : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800/50'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-sm text-gray-900 dark:text-white">
          {empSkill.skill?.name || 'Unknown Skill'}
        </span>
        {isCritical && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
            Critical
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500 capitalize">{empSkill.skill?.category}</span>
        <SkillRating level={empSkill.proficiency_level} />
      </div>
    </div>
  );
}
