import React, { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { AttendanceModal } from './AttendanceModal';
import Students from '../../pages/Students';
interface Student {
  id: number;
  name: string;
  status: 'absent' | 'present' | 'absent_verified';
}

interface PresenceButtonProps {
  status: 'absent' | 'present' | 'absent_verified';
  onChange: (status: 'absent' | 'present' | 'absent_verified') => void;
}

export function PresenceButton({ status, onChange }: PresenceButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Ahmed Hassan', status: 'present' },
    { id: 2, name: 'Sara Ahmed', status: 'absent' },
    { id: 3, name: 'Mohammed Ali', status: 'absent_verified' },
    { id: 4, name: 'Fatima Omar', status: 'present' },
    { id: 5, name: 'Youssef Karim', status: 'absent' },
  ]);

  const getButtonStyle = () => {
    switch (status) {
      case 'present':
        return 'border-green-200 text-green-600 hover:bg-green-50';
      case 'absent':
        return 'border-red-200 text-red-600 hover:bg-red-50';
      case 'absent_verified':
        return 'border-yellow-200 text-yellow-600 hover:bg-yellow-50';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'present':
        return <Check size={14} />;
      case 'absent':
        return <X size={14} />;
      case 'absent_verified':
        return <AlertCircle size={14} />;
    }
  };

  const handleStatusUpdate = (studentId: number, newStatus: Student['status']) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status: newStatus } : student
    ));
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`w-full h-9 rounded-md flex items-center justify-center transition-all border ${getButtonStyle()}`}
      >
        {getIcon()}
      </button>

      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        students={students}
        onUpdateStatus={handleStatusUpdate}
        currentStatus={status}
        onStatusChange={onChange}
      />
    </>
  );
}