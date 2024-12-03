import React from 'react';
import { Student, StudentAttendance } from '../store/useStore';
import { Check, X, AlertCircle } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  attendance: StudentAttendance[];
  onUpdateAttendance: (attendance: StudentAttendance[]) => void;
}

export function StudentList({ students, attendance, onUpdateAttendance }: StudentListProps) {
  const updateStudentStatus = (studentId: number, status: StudentAttendance['status']) => {
    const newAttendance = attendance.map(a =>
      a.studentId === studentId ? { ...a, status } : a
    );
    onUpdateAttendance(newAttendance);
  };

  const getStatusButton = (status: StudentAttendance['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'absent':
        return 'bg-red-100 text-red-700 hover:bg-red-200';
      case 'absent_verified':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
    }
  };

  return (
    <div className="space-y-2">
      {students.map(student => {
        const studentAttendance = attendance.find(a => a.studentId === student.id);
        const status = studentAttendance?.status || 'absent';

        return (
          <div key={student.id} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
            <span className="text-gray-800">{student.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => updateStudentStatus(student.id, 'present')}
                className={`p-1.5 rounded-md transition-colors ${status === 'present' ? getStatusButton('present') : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => updateStudentStatus(student.id, 'absent')}
                className={`p-1.5 rounded-md transition-colors ${status === 'absent' ? getStatusButton('absent') : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
              >
                <X size={16} />
              </button>
              <button
                onClick={() => updateStudentStatus(student.id, 'absent_verified')}
                className={`p-1.5 rounded-md transition-colors ${status === 'absent_verified' ? getStatusButton('absent_verified') : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
              >
                <AlertCircle size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}