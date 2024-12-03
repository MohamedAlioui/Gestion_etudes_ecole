import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Class } from '../../types/class';
import axios from 'axios';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Class) => void;
  classe?: Class | null;
}

const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classe,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Class>({
    defaultValues: classe || {
      nom_classe: '',
      niveau_classe: '',
    },
  });

  useEffect(() => {
    if (classe) reset(classe);
  }, [classe, reset]);

  const handleFormSubmit = (data: Class) => {
    if (classe) {
      // Update existing class
      axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/classes/${classe._id}`, data)
        .then(response => {
          onSubmit(response.data);
          reset();
        })
        .catch(error => console.error('Error updating class:', error));
    } else {
      // Add new class
      axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/classes`, data)
        .then(response => {
          onSubmit(response.data);
          reset();
        })
        .catch(error => console.error('Error adding class:', error));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {classe ? 'تعديل بيانات الصف' : 'إضافة صف جديد'}
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
    المستوى
  </label>
  <select
    {...register('niveau_classe', { required: true })}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
    dir="rtl"
  >
    <option value="">اختر المستوى</option>
    <option value="السابعة أساسي">السابعة أساسي</option>
    <option value="الثامنة أساسي">الثامنة أساسي</option>
    <option value="التاسعة أساسي">التاسعة أساسي</option>
  </select>
  {errors.niveau_classe && <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>}
</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم الصف
              </label>
              <input
                {...register('nom_classe', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                dir="rtl"
              />
              {errors.nom_classe && <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>}
            </div>
            
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {classe ? 'حفظ التغييرات' : 'إضافة الصف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassModal;