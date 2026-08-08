import { Trash2, FolderOutput, MoreHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkActionsProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
}

export default function BulkActions({ selectedCount, onClear, onDelete }: BulkActionsProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-6"
        >
          <div className="flex items-center gap-3 border-r border-gray-700 pr-6">
            <span className="flex items-center justify-center w-6 h-6 bg-primary-500 rounded-full text-xs font-bold">
              {selectedCount}
            </span>
            <span className="text-sm font-medium">Selected</span>
            <button onClick={onClear} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onDelete}
              className="px-3 py-1.5 rounded hover:bg-gray-800 text-sm font-medium flex items-center text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
            <button className="px-3 py-1.5 rounded hover:bg-gray-800 text-sm font-medium flex items-center text-gray-300 hover:text-white transition-colors">
              <FolderOutput className="w-4 h-4 mr-2" />
              Move
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
