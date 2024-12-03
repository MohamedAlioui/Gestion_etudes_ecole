import React from 'react';
import { Class } from '../../types/class';

interface ExcelImportProps {
  classes: Class[];
  classId: string;
  isUploading: boolean;
  onFileSelect: (file: File | null) => void;
  onImport: () => void;
  onClassChange: (classId: string) => void;
}

const ExcelImport: React.FC<ExcelImportProps> = ({
  classes,
  classId,
  isUploading,
  onFileSelect,
  onImport,
  onClassChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <select
        value={classId}
        onChange={(e) => onClassChange(e.target.value)}
        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg"
      >
        <option value="">اختيار الصف</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.nom_classe}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
      />

      <button
        onClick={onImport}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        disabled={isUploading}
      >
        {isUploading ? 'جار التحميل...' : 'استيراد البيانات'}
      </button>
    </div>
  );
};

export default ExcelImport;