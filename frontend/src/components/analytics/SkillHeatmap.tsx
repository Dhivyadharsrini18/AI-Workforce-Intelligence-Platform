import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

interface SkillHeatmapProps {
  data: { columns: string[]; data: any[] };
}

export default function SkillHeatmap({ data }: SkillHeatmapProps) {
  if (!data || !data.columns || data.columns.length === 0) return null;

  const getColorForValue = (val: number) => {
    if (val < 20) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    if (val < 40) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
    if (val < 60) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    if (val < 80) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    return 'bg-emerald-500 text-white';
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Layers className="w-5 h-5 text-blue-500 mr-2" />
          Department Skill Heatmap
        </h3>
      </div>
      
      <div className="overflow-x-auto flex-1 pb-2">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr>
              <th className="p-2 border-b border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-500 sticky left-0 bg-white dark:bg-gray-900 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                Department
              </th>
              {data.columns.map(col => (
                <th key={col} className="p-2 border-b border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-500 text-center w-20">
                  <div className="truncate w-16 mx-auto" title={col}>{col}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.data.map((row, idx) => (
              <motion.tr 
                key={row.department}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td className="p-2 border-b border-gray-50 dark:border-gray-800/50 font-medium text-gray-900 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-900 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                  {row.department}
                </td>
                {data.columns.map(col => {
                  const val = row[col] || 0;
                  return (
                    <td key={col} className="p-1 border-b border-gray-50 dark:border-gray-800/50 text-center">
                      <div className={`w-10 h-10 mx-auto rounded flex items-center justify-center text-xs font-semibold ${getColorForValue(val)}`} title={`${row.department} - ${col}: ${val}`}>
                        {val}
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
