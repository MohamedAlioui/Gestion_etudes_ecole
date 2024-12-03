import React from 'react';
import { X } from 'lucide-react';
import { Student } from '../../types/student';

interface StudentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen || !student) return null;

  // Function to format the date of birth to a readable format
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            تفاصيل الطالب
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                الاسم
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.nom_eleve} {student.prenom_eleve}
              </p>
            </div>

            

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                تاريخ الميلاد
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(student.date_naissance)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                الصف
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.classe ? student.classe.nom_classe : 'غير محدد'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                اسم ولي الأمر
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.nom_parent}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                رقم الهاتف
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.num_parent}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              المواد الدراسية
            </h3>
            <ul className="mt-1 text-sm text-gray-900 dark:text-white">
              {student.etudes && student.etudes.length > 0 ? (
                student.etudes.map((etude, index) => (
                  <li key={index}>Subject ID: {etude}</li> // Display subject IDs as placeholders
                ))
              ) : (
                <p>لا توجد مواد دراسية</p>
              )}
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
