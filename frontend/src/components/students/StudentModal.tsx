import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import axios from 'axios';
import { Student } from '../../types/student';
import { Class } from '../../types/class';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Student) => void;
  student?: Student | null;
}

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  student,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Student>({
    defaultValues: student || {
      _id: '',
      nom_eleve: '',
      prenom_eleve: '',
      date_naissance: '',
      nom_parent: '',
      num_parent: '',
      classe: '', // ID ou objet classe
    },
  });

  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Charger les classes disponibles
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/classes`)
      .then((response) => setClasses(response.data))
      .catch((error) => console.error('Erreur lors du chargement des classes :', error));

    if (student) {
      reset({
        ...student,
        date_naissance: student.date_naissance
          ? new Date(student.date_naissance).toISOString().split('T')[0]
          : '',
        classe: student.classe ? student.classe._id : '', // Utiliser l'ID de la classe si présent
      });
    }
  }, [student, reset]);

  const handleFormSubmit = (data: Student) => {
    const payload = {
      ...data,
      classe: data.classe, // Envoyer uniquement l'ID de la classe
    };

    setLoading(true);
    setError(null);

    if (student) {
      axios
        .put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/eleves/${student._id}`, payload)
        .then((response) => {
          onSubmit(response.data);
          reset();
          onClose();
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour de l\'étudiant :', error);
          setError('Une erreur est survenue lors de la mise à jour de l\'étudiant.');
        })
        .finally(() => setLoading(false));
    } else {
      axios
        .post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/eleves`, payload)
        .then((response) => {
          onSubmit(response.data);
          reset();
          onClose();
        })
        .catch((error) => {
          console.error('Erreur lors de l\'ajout de l\'étudiant :', error);
          setError('Une erreur est survenue lors de l\'ajout de l\'étudiant.');
        })
        .finally(() => setLoading(false));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {student ? 'تعديل بيانات التلميذ' : 'إضافة تلميذ جديد'}
          </h2>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم تلميذ
              </label>
              <input
                {...register('nom_eleve', { required: 'اسم تلميذ مطلوب' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                dir="rtl"
              />
              {errors.nom_eleve && <span className="text-red-500 text-sm">{errors.nom_eleve.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الاسم الأول
              </label>
              <input
                {...register('prenom_eleve', { required: 'الاسم الأول مطلوب' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                dir="rtl"
              />
              {errors.prenom_eleve && <span className="text-red-500 text-sm">{errors.prenom_eleve.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                تاريخ الميلاد
              </label>
              <input
                {...register('date_naissance', { required: 'تاريخ الميلاد مطلوب' })}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                dir="rtl"
              />
              {errors.date_naissance && <span className="text-red-500 text-sm">{errors.date_naissance.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اختر الصف
              </label>
              <select
                {...register('classe', { required: 'هذا الحقل مطلوب' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                defaultValue={student?.classe?._id || ''} // Préremplir avec l'ID de la classe
              >
                <option value="">اختر الصف</option>
                {classes.map((classe) => (
                  <option key={classe._id} value={classe._id}>
                    {classe.nom_classe}
                  </option>
                ))}
              </select>
              {errors.classe && <span className="text-red-500 text-sm">{errors.classe.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم ولي الأمر
              </label>
              <input
                {...register('nom_parent', { required: 'اسم ولي الأمر مطلوب' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                dir="rtl"
              />
              {errors.nom_parent && <span className="text-red-500 text-sm">{errors.nom_parent.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                رقم الهاتف
              </label>
              <input
                {...register('num_parent', { required: 'رقم الهاتف مطلوب' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                dir="rtl"
              />
              {errors.num_parent && <span className="text-red-500 text-sm">{errors.num_parent.message}</span>}
            </div>
          </div>

          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

          <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              {student ? 'حفظ التغييرات' : 'إضافة تلميذ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
