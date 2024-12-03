import React from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { Student, StudentAttendance } from '../store/useStore';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  attendance: StudentAttendance[];
  onUpdateAttendance: (attendance: StudentAttendance[]) => void;
}

export function AttendanceModal({
  isOpen,
  onClose,
  students,
  attendance,
  onUpdateAttendance,
}: AttendanceModalProps) {
  if (!isOpen) return null;

  const updateStudentStatus = (studentId: number, status: StudentAttendance['status']) => {
    const newAttendance = attendance.map(a =>
      a.studentId === studentId ? { ...a, status } : a
    );
    onUpdateAttendance(newAttendance);
  };

  const updateAllStudents = (status: StudentAttendance['status']) => {
    const newAttendance = students.map(student => ({
      studentId: student.id,
      status
    }));
    onUpdateAttendance(newAttendance);
  };

  const getStatusColor = (status: StudentAttendance['status']) => {
    switch (status) {
      case 'present':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'absent':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'absent_verified':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusText = (status: StudentAttendance['status']) => {
    switch (status) {
      case 'present':
        return 'حاضر';
      case 'absent':
        return 'غائب';
      case 'absent_verified':
        return 'غياب مبرر';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4" dir="rtl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">قائمة الحضور</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => updateAllStudents('present')}
              className="px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-md transition-colors border border-green-200 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              الكل حاضر
            </button>
            <button
              onClick={() => updateAllStudents('absent')}
              className="px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              الكل غائب
            </button>
            <button
              onClick={() => updateAllStudents('absent_verified')}
              className="px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-50 rounded-md transition-colors border border-yellow-200 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              غياب مبرر للجميع
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-right text-sm font-medium text-gray-500">اسم التلميذ</th>
                <th className="py-2 px-4 text-center text-sm font-medium text-gray-500">الحالة</th>
                <th className="py-2 px-4 text-center text-sm font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => {
                const studentAttendance = attendance.find(a => a.studentId === student.id);
                const status = studentAttendance?.status || 'absent';

                return (
                  <tr key={student.id}>
                    <td className="py-3 px-4">{student.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex justify-center px-3 py-1 text-sm rounded-full ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => updateStudentStatus(student.id, 'present')}
                          className={`p-1.5 rounded-md transition-colors ${status === 'present' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                          title="حاضر"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStudentStatus(student.id, 'absent')}
                          className={`p-1.5 rounded-md transition-colors ${status === 'absent' ? 'bg-red-100 text-red-700' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                          title="غائب"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStudentStatus(student.id, 'absent_verified')}
                          className={`p-1.5 rounded-md transition-colors ${status === 'absent_verified' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                          title="غياب مبرر"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}