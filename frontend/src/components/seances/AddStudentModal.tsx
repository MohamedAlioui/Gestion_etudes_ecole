import React, { useState } from 'react';
import { X } from 'lucide-react';

const SUBJECTS = [
  'الرياضيات',
  'اللغة العربية',
  'اللغة الفرنسية',
];

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; classLevel: string; subjects: string[] }) => void;
  classLevels: string[];
}

export function AddStudentModal({ isOpen, onClose, onAdd, classLevels }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    classLevel: classLevels[0],
    subjects: [] as string[]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subjects.length === 0) {
      alert('الرجاء اختيار مادة واحدة على الأقل');
      return;
    }
    onAdd(formData);
    setFormData({ name: '', classLevel: classLevels[0], subjects: [] });
    onClose();
  };

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" dir="rtl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">إضافة تلميذ جديد</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم التلميذ
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المستوى الدراسي
            </label>
            <select
              value={formData.classLevel}
              onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {classLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المواد
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.map((subject) => (
                <label
                  key={subject}
                  className={`flex items-center p-2 rounded-md border cursor-pointer transition-colors ${
                    formData.subjects.includes(subject)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(subject)}
                    onChange={() => toggleSubject(subject)}
                    className="hidden"
                  />
                  <span className="text-sm">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              إضافة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}