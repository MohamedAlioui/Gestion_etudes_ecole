import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    classLevel: string;
    subject: string;
    monthNumber: number;
    year: number;
  }) => void;
}

const CLASS_LEVELS = [
  'السنة السابعة اساسي',
  'السنة الثامنة اساسي',
  'السنة التاسعة اساسي',

];

const SUBJECTS = [
  'الرياضيات',
  'اللغة العربية',
  'اللغة الفرنسية',
  'العلوم',
  'التربية الإسلامية',
  'التاريخ والجغرافيا'
];

export function AddMonthModal({ isOpen, onClose, onAdd }: AddMonthModalProps) {
  const [formData, setFormData] = useState({
    classLevel: CLASS_LEVELS[0],
    subject: SUBJECTS[0],
    monthNumber: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" dir="rtl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">إضافة شهر جديد</h2>
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
              المستوى الدراسي
            </label>
            <select
              value={formData.classLevel}
              onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {CLASS_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المادة
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الشهر
            </label>
            <select
              value={formData.monthNumber}
              onChange={(e) => setFormData({ ...formData, monthNumber: Number(e.target.value) })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleDateString('ar-TN', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              السنة
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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