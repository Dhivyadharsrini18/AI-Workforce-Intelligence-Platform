import { Filter, X } from 'lucide-react';
import type { Department } from '../../types/employee';

interface EmployeeFiltersProps {
  departments: Department[];
  filters: {
    department: string;
    role: string;
    status: string;
  };
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeFilters({ 
  departments, 
  filters, 
  onChange, 
  onClear,
  isOpen,
  onClose
}: EmployeeFiltersProps) {
  if (!isOpen) return null;

  return (
    <div className="card p-4 mb-6 animate-in slide-in-from-top-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
          <Filter className="w-4 h-4 mr-2" /> Advanced Filters
        </h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
          <select 
            value={filters.department} 
            onChange={(e) => onChange('department', e.target.value)}
            className="input-field w-full text-sm py-1.5"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select 
            value={filters.status} 
            onChange={(e) => onChange('status', e.target.value)}
            className="input-field w-full text-sm py-1.5"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button 
            onClick={onClear}
            className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 py-1.5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
