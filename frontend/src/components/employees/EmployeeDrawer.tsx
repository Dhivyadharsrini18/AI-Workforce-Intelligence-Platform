import Drawer from '../shared/Drawer';
import EmployeeForm from './EmployeeForm';
import type { Employee } from '../../types/employee';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../../services/employeeService';

interface EmployeeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Partial<Employee>;
}

export default function EmployeeDrawer({ isOpen, onClose, employee }: EmployeeDrawerProps) {
  const isEditing = !!employee?.id;

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => employeeService.getDepartments(),
  });

  const handleSubmit = async (data: Partial<Employee>) => {
    // In real app, call API
    console.log('Submitting', data);
    onClose();
  };

  const footer = (
    <>
      <button type="button" onClick={onClose} className="btn-secondary">
        Cancel
      </button>
      <button type="submit" form="employee-form" className="btn-primary">
        {isEditing ? 'Save Changes' : 'Create Employee'}
      </button>
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Employee' : 'Add New Employee'}
      size="md"
      footer={footer}
    >
      <EmployeeForm 
        initialData={employee} 
        departments={departments} 
        onSubmit={handleSubmit} 
      />
    </Drawer>
  );
}
