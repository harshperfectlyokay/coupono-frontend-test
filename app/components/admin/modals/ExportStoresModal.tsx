import React, { useState } from 'react';

interface ExportModalProps {
  onClose: () => void;
  onExport: (selectedColumns: string[]) => void;
  columns: string[]; 
}

const ExportStoresModal: React.FC<ExportModalProps> = ({ onClose, onExport, columns }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((item) => item !== column)
        : [...prev, column]
    );
  };

  const handleExport = () => {
    onExport(selectedColumns);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl mb-4">Select Columns to Export</h2>
        <div>
          {columns.map((column) => (
            <div key={column} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedColumns.includes(column)}
                onChange={() => handleColumnChange(column)}
                className="mr-2"
              />
              <label>{column}</label>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button onClick={handleExport} className="btn btn-primary">
            Export
          </button>
          <button onClick={onClose} className="btn btn-secondary ml-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportStoresModal;
