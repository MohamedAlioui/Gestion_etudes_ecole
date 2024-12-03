import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { X } from 'lucide-react';
import { SupportClass } from '../../types/etude';
import { Teacher } from '../../types/teacher';

interface SupportClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  supportClass?: SupportClass | null;
}

export const SUBJECTS = [
  { value: 'Francais', label: 'الفرنسية' },
  { value: 'Arabic', label: 'العربية' },
  { value: 'Mathematique', label: 'الرياضيات' },
  { value: 'ScienceVieTerre', label: 'علوم الحياة و الأرض' },
  { value: 'Anglais', label: 'الإنجليزية' },
] as const;

export const LEVELS = [
  { value: 'السابعة اساسي', label: 'السابعة اساسي' },
  { value: 'الثامنة أساسي', label: 'الثامنة أساسي' },
  { value: 'التاسعة أساسي', label: 'التاسعة أساسي' },
] as const;

const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`;

const SupportClassModal: React.FC<SupportClassModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  supportClass,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SupportClass>({
    defaultValues: {
      matiere: 'Francais',
      niveau: '',
      enseignant: '',
      className: '',
    },
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [matiere, setMatiere] = useState<SupportClass['matiere']>('Francais');
  const [error, setError] = useState<string>('');

  // Fetch teachers whenever the subject (matiere) changes
  useEffect(() => {
    const fetchTeachers = async () => {
      if (matiere) {
        try {
          const response = await axios.get<Teacher[]>(`${API_URL}/api/enseignants`, {
            params: { matiere },
          });
          setTeachers(response.data);
        } catch (err) {
          console.error('Error fetching teachers:', err);
          setError('فشل في جلب قائمة الأساتذة. يرجى المحاولة مرة أخرى.');
        }
      }
    };

    fetchTeachers();
  }, [matiere]);

  // Initialize form when editing a support class
  useEffect(() => {
    const initializeForm = async () => {
      if (supportClass) {
        setMatiere(supportClass.matiere);

        try {
          const response = await axios.get<Teacher[]>(`${API_URL}/api/enseignants`, {
            params: { matiere: supportClass.matiere },
          });
          setTeachers(response.data);

          // Populate the form once teachers are loaded
          reset({
            ...supportClass,
            enseignant: supportClass.enseignant?._id || '',
          });
        } catch (err) {
          console.error('Error fetching teachers:', err);
          setError('فشل في جلب قائمة الأساتذة. يرجى المحاولة مرة أخرى.');
        }
      }
    };

    initializeForm();
  }, [supportClass, reset]);

  const handleFormSubmit = async (data: SupportClass) => {
    try {
      setError('');
      const isEditMode = Boolean(supportClass?._id);
      const apiEndpoint = `${API_URL}/api/etudes${isEditMode ? `/${supportClass?._id}` : ''}`;

      const updatedData = {
        ...data,
        matiere,
      };

      const response = await (isEditMode
        ? axios.put(apiEndpoint, updatedData)
        : axios.post(apiEndpoint, updatedData));

      if (response.status === 201 || response.status === 200) {
        onSubmitSuccess?.();
        reset();
        setMatiere('Francais');
        onClose();
      }
    } catch (err) {
      console.error('Failed to save support class:', err);
      setError('فشل في حفظ الصف الداعم. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleClose = () => {
    reset();
    setMatiere('Francais');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {supportClass ? 'تعديل بيانات الصف الداعم' : 'إضافة صف داعم جديد'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اختر المادة
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={matiere}
                onChange={(e) => {
                  setMatiere(e.target.value as SupportClass['matiere']);
                  setValue('matiere', e.target.value as SupportClass['matiere']);
                }}
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                المستوى
              </label>
              <select
                {...register('niveau', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">اختر المستوى</option>
                {LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.niveau && (
                <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الأستاذ
              </label>
              <select
                {...register('enseignant', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">اختر الأستاذ</option>
                {teachers.map((teacher) => (
                  <option key={String(teacher._id)} value={String(teacher._id)}>
                    {teacher.nom_enseignant} {teacher.prenom_enseignant}
                  </option>
                ))}
              </select>
              {errors.enseignant && (
                <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم الصف
              </label>
              <input
                type="text"
                {...register('className', { required: true })}
                placeholder="أدخل اسم الصف"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.className && (
                <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="ml-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'جاري الحفظ...'
                : supportClass
                ? 'حفظ التغييرات'
                : 'إضافة الصف الداعم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportClassModal;
