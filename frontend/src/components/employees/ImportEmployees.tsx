import { useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import Modal from '../shared/Modal';

interface ImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export default function ImportEmployees({ isOpen, onClose, onImport }: ImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateFile(droppedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateFile(selectedFile);
  };

  const validateFile = (file: File) => {
    setError('');
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV or Excel file.');
      return;
    }
    setFile(file);
  };

  const handleSubmit = () => {
    if (file) {
      onImport(file);
      onClose();
    }
  };

  const footer = (
    <>
      <button onClick={onClose} className="btn-secondary">Cancel</button>
      <button onClick={handleSubmit} disabled={!file} className="btn-primary">
        Import Data
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Employees"
      size="md"
      footer={footer}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload a CSV or Excel file containing employee records. Download our template for the correct format.
        </p>

        <div 
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            file 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
              : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
          }`}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <FileText className="w-10 h-10 text-primary-500 mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <button onClick={() => setFile(null)} className="text-xs text-red-500 hover:text-red-600 mt-3 font-medium">
                Remove file
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Click to upload</span>
              <span className="text-xs text-gray-500 mt-1">or drag and drop your file here</span>
              <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleChange} />
            </label>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-900/50">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
