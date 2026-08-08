import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';

interface SkillForecastChartProps {
  data: { date: string; demand: number }[];
  skillName: string;
}

export default function SkillForecastChart({ data, skillName }: SkillForecastChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <LineChartIcon className="w-5 h-5 text-indigo-500 mr-2" />
          {skillName} Demand Forecast
        </h3>
      </div>
      
      <div className="flex-1 w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickMargin={10} minTickGap={30} />
            <YAxis stroke="#9ca3af" fontSize={12} tickMargin={10} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="demand" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorDemand)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
