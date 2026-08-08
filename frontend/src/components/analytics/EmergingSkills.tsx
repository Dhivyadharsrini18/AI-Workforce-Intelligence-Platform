import { motion } from 'framer-motion';
import { Rocket, TrendingUp } from 'lucide-react';
import type { Skill } from '../../types/employee';

interface EmergingSkillsProps {
  skills: Skill[];
}

export default function EmergingSkills({ skills }: EmergingSkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Rocket className="w-5 h-5 text-purple-500 mr-2" />
          Emerging Technologies
        </h3>
      </div>
      
      <div className="overflow-y-auto pr-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 uppercase">
              <th className="pb-2 font-medium">Technology</th>
              <th className="pb-2 font-medium text-right">Growth</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {skills.map((skill, idx) => (
              <motion.tr 
                key={skill.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
              >
                <td className="py-3 font-medium text-gray-900 dark:text-white">
                  {skill.name}
                  <div className="text-xs text-gray-500 font-normal">{skill.category}</div>
                </td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center text-green-600 dark:text-green-400 font-semibold text-sm">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{skill.growth_rate}%
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
