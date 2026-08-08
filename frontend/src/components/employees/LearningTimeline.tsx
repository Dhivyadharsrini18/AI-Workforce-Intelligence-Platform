import { CheckCircle2, PlayCircle, BookOpen } from 'lucide-react';
import type { LearningRecord } from '../../types/employee';

interface LearningTimelineProps {
  records: LearningRecord[];
}

export default function LearningTimeline({ records }: LearningTimelineProps) {
  if (!records || records.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BookOpen className="w-8 h-8 mx-auto text-gray-300 mb-2" />
        No learning records found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {records.map((record) => (
        <div key={record.id} className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-[-24px] before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700 last:before:hidden">
          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700">
            {record.status === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <PlayCircle className="w-4 h-4 text-blue-500" />
            )}
          </div>
          
          <div className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {record.course?.title || 'Unknown Course'}
                </h4>
                <p className="text-sm text-gray-500">{record.course?.provider}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                record.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {record.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
            
            {record.status !== 'completed' && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500" 
                    style={{ width: `${record.progress_pct}%` }} 
                  />
                </div>
                <span className="text-xs font-medium text-gray-500">{record.progress_pct}%</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
