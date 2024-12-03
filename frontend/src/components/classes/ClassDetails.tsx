import React from 'react';
import { X } from 'lucide-react';
import { Class } from '../../types/class';

interface ClassDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  classe: Class | null;
}

const ClassDetails: React.FC<ClassDetailsProps> = ({
  isOpen,
  onClose,
  classe,
}) => {
  if (!isOpen || !classe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            تفاصيل الصف
          </h2>
          <button onClick={onClose} className="text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p><strong>اسم الصف:</strong> {classe.nom_classe}</p>
          <p><strong>المستوى:</strong> {classe.niveau_classe}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
