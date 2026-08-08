import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, PlayCircle } from 'lucide-react';

interface Recommendation {
  id: string;
  skill_name: string;
  course: string;
  estimated_hours: number;
  priority: string;
  readiness_impact: string;
}

interface RecommendationPreviewProps {
  recommendations: Recommendation[];
}

export default function RecommendationPreview({ recommendations }: RecommendationPreviewProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Award className="w-5 h-5 text-amber-500 mr-2" />
          AI Course Recommendations
        </h3>
      </div>
      
      <div className="space-y-4 overflow-y-auto pr-2">
        {recommendations.map((rec, idx) => (
          <motion.div 
            key={rec.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
              {rec.priority} Priority
            </div>
            
            <h4 className="font-semibold text-gray-900 dark:text-white pr-16 text-sm mb-1 line-clamp-1">
              {rec.course}
            </h4>
            
            <div className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 mb-3">
              <BookOpen className="w-3 h-3 mr-1" />
              {rec.skill_name}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {rec.estimated_hours}h
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Impact: {rec.readiness_impact}
                </span>
              </div>
              <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium text-xs flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                Start <PlayCircle className="w-3 h-3 ml-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
