import { AlertTriangle } from 'lucide-react';
import Modal from '../shared/Modal';

interface DeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  itemName?: string;
}

export default function DeleteEmployeeDialog({ isOpen, onClose, onConfirm, count, itemName = 'employee' }: DeleteProps) {
  const footer = (
    <>
      <button onClick={onClose} className="btn-secondary">Cancel</button>
      <button onClick={onConfirm} className="btn-primary bg-red-600 hover:bg-red-700 text-white border-transparent">
        Yes, Delete {count > 1 ? `${count} ${itemName}s` : itemName}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      size="sm"
      footer={footer}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Are you sure you want to delete {count > 1 ? 'these records' : 'this record'}?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This action cannot be undone. All associated data including skills, certifications, and learning records will be permanently removed.
        </p>
      </div>
    </Modal>
  );
}
