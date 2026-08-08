import { useState } from 'react';
import { Download, FileText, Table } from 'lucide-react';
import Modal from '../shared/Modal';

interface ExportProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
  selectedCount?: number;
}

export default function ExportEmployees({ isOpen, onClose, onExport, selectedCount }: ExportProps) {
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');

  const handleSubmit = () => {
    onExport(format);
    onClose();
  };

  const footer = (
    <>
      <button onClick={onClose} className="btn-secondary">Cancel</button>
      <button onClick={handleSubmit} className="btn-primary">
        <Download className="w-4 h-4 mr-2" />
        Export
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Employee Data"
      size="sm"
      footer={footer}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedCount 
            ? `Export ${selectedCount} selected employees.` 
            : 'Export all employees currently matching your filters.'
          }
        </p>

        <div className="space-y-3">
          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
            format === 'csv' 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 ring-1 ring-primary-500' 
              : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
          }`}>
            <input type="radio" name="format" value="csv" checked={format === 'csv'} onChange={() => setFormat('csv')} className="text-primary-600 focus:ring-primary-500" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">CSV Document</div>
                <div className="text-xs text-gray-500">Best for importing into other systems</div>
              </div>
            </div>
          </label>

          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
            format === 'excel' 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 ring-1 ring-primary-500' 
              : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
          }`}>
            <input type="radio" name="format" value="excel" checked={format === 'excel'} onChange={() => setFormat('excel')} className="text-primary-600 focus:ring-primary-500" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                <Table className="w-5 h-5 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Excel Workbook</div>
                <div className="text-xs text-gray-500">Includes formatting and multiple sheets</div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </Modal>
  );
}
