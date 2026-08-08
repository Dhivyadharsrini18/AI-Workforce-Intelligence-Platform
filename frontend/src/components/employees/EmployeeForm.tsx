import { useState } from 'react';
import type { Employee, Department } from '../../types/employee';

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  departments: Department[];
  onSubmit: (data: Partial<Employee>) => void;
}

export default function EmployeeForm({ initialData, departments, onSubmit }: EmployeeFormProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'performance'>('personal');
  
  // Basic state for form fields - in a real app this would use react-hook-form
  const [formData, setFormData] = useState<Partial<Employee>>(initialData || {
    first_name: '',
    last_name: '',
    email: '',
    department_id: '',
    job_title: '',
    job_level: 'mid',
    status: 'active',
    experience_years: 0,
    salary: 0,
    performance_score: 0,
    readiness_score: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id="employee-form" onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'personal' 
              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Personal Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('employment')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'employment' 
              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Employment
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('performance')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'performance' 
              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Performance
        </button>
      </div>

      {/* Form Content */}
      <div className="space-y-4">
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input required type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input required type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} className="input-field w-full" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="input-field w-full" />
            </div>
          </div>
        )}

        {activeTab === 'employment' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
              <select required name="department_id" value={formData.department_id || ''} onChange={handleChange} className="input-field w-full">
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                <input required type="text" name="job_title" value={formData.job_title || ''} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                <select required name="job_level" value={formData.job_level || 'mid'} onChange={handleChange} className="input-field w-full">
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="director">Director</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select required name="status" value={formData.status || 'active'} onChange={handleChange} className="input-field w-full">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hire Date</label>
                <input type="date" name="hire_date" value={formData.hire_date ? String(formData.hire_date).split('T')[0] : ''} onChange={handleChange} className="input-field w-full" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Performance Score (1-5)</label>
                <input type="number" step="0.1" min="1" max="5" name="performance_score" value={formData.performance_score || 0} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Readiness Score (0-100)</label>
                <input type="number" min="0" max="100" name="readiness_score" value={formData.readiness_score || 0} onChange={handleChange} className="input-field w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Note: Footer buttons are provided by the Drawer component via form="employee-form" */}
    </form>
  );
}
