import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types/teacher';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teacher: Teacher) => void;
  teacher: Teacher | null;
}

const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teacher,
}) => {
  // State variables to manage the form fields
  const [nomEnseignant, setNomEnseignant] = useState('');
  const [prenomEnseignant, setPrenomEnseignant] = useState('');
  const [matiere, setMatiere] = useState(''); // Updated for dropdown
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [emploiFile, setEmploiFile] = useState('');

  // When the `teacher` prop changes (for editing), populate the form fields
  useEffect(() => {
    if (teacher) {
      setNomEnseignant(teacher.nom_enseignant);
      setPrenomEnseignant(teacher.prenom_enseignant);
      setMatiere(teacher.matiere);
      setNumeroTelephone(teacher.numero_telephone);
      setEmploiFile(teacher.emploi_file);
    } else {
      // If no teacher is selected (add mode), reset the form fields
      setNomEnseignant('');
      setPrenomEnseignant('');
      setMatiere('');
      setNumeroTelephone('');
      setEmploiFile('');
    }
  }, [teacher]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send the form data back to the parent component
    onSubmit({
      _id: teacher ? teacher._id : '', // Use teacher's _id for editing, otherwise it will be empty for adding
      nom_enseignant: nomEnseignant,
      prenom_enseignant: prenomEnseignant,
      matiere: matiere,
      numero_telephone: numeroTelephone,
      emploi_file: emploiFile,
    });
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null; // Don't render modal if not open

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {teacher ? 'تعديل أستاذ' : 'إضافة أستاذ'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Nom Enseignant */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              الاسم الأول
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={nomEnseignant}
              onChange={(e) => setNomEnseignant(e.target.value)}
            />
          </div>

          {/* Prenom Enseignant */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              الاسم الأخير
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={prenomEnseignant}
              onChange={(e) => setPrenomEnseignant(e.target.value)}
            />
          </div>

          {/* Matiere - Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              المادة
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md"
                value={matiere}
                onChange={(e) => setMatiere(e.target.value)}
              >
                <option value="" disabled>
                  اختر مادة
                </option>
                <option value="Arabic">العربية</option>
                <option value="Francais">الفرنسية</option>
                <option value="Mathematique">الرياضيات</option>
                <option value="ScienceVieTerre">علوم الحياة و الأرض</option>
                <option value="Anglais">الإنجليزية</option>
            </select>

          </div>

          {/* Numero Telephone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              رقم الهاتف
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={numeroTelephone}
              onChange={(e) => setNumeroTelephone(e.target.value)}
            />
          </div>

     

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="text-gray-600 dark:text-gray-300"
              onClick={onClose}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              {teacher ? 'تعديل' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;
