import React, { useState, useEffect } from 'react';
import { Payment } from '../../types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payment: Payment) => void;
  payment: Payment | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  payment,
}) => {
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  const [method, setMethod] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (payment) {
      setStudentId(payment.studentId);
      setAmount(payment.amount);
      setDate(payment.date);
      setMethod(payment.method);
      setDescription(payment.description || '');
    }
  }, [payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: payment ? payment.id : '', // Will be auto-generated when adding
      studentId,
      amount,
      date,
      method,
      description,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {payment ? 'تعديل الدفع' : 'إضافة دفع'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              رقم الطالب
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              المبلغ
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              التاريخ
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              طريقة الدفع
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ملاحظات (اختياري)
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {payment ? 'تعديل' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
