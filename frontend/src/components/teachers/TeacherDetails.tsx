import React from 'react';
import { Teacher } from '../../types/teacher';

interface TeacherDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

const TeacherDetails: React.FC<TeacherDetailsProps> = ({
  isOpen,
  onClose,
  teacher,
}) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          تفاصيل الأستاذ
        </h2>

        {/* الاسم */} 
        <div className="mb-4">
          <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            الاسم:
          </strong>
          <p className="text-sm text-gray-900 dark:text-white mt-1">
            {teacher.nom_enseignant} {teacher.prenom_enseignant}
          </p>
        </div>

        {/* المادة */}
        <div className="mb-4">
          <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            المادة:
          </strong>
          <p className="text-sm text-gray-900 dark:text-white mt-1">
            {teacher.matiere}
          </p>
        </div>

        {/* رقم الهاتف */}
        <div className="mb-4">
          <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            رقم الهاتف:
          </strong>
          <p className="text-sm text-gray-900 dark:text-white mt-1">
            {teacher.numero_telephone}
          </p>
        </div>

        {/* ملف العمل */}
        <div className="mb-4">
          <strong className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ملف العمل:
          </strong>
          {teacher.emploi_file ? (
            <a
              href={teacher.emploi_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 mt-1 block"
            >
              عرض الملف
            </a>
          ) : (
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              ملف غير متاح
            </p>
          )}
        </div>

        {/* Close button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
