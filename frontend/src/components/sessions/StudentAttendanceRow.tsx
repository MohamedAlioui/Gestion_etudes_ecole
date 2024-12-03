import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { Student } from '../../types/student';

interface StudentAttendanceRowProps {
  student: Student;
  status: string;
  onUpdateStatus: (studentId: string, status: 'present' | 'absent' | 'absent_verified') => void;
  saving: boolean;
}

export function StudentAttendanceRow({ 
  student, 
  status, 
  onUpdateStatus, 
  saving 
}: StudentAttendanceRowProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={() => onUpdateStatus(student._id, 'present')}
            className={`p-2 rounded-full transition-all transform hover:scale-110 ${
              status === 'present'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-green-100'
            }`}
            disabled={saving}
            title="حاضر"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={() => onUpdateStatus(student._id, 'absent')}
            className={`p-2 rounded-full transition-all transform hover:scale-110 ${
              status === 'absent'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-red-100'
            }`}
            disabled={saving}
            title="غائب"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => onUpdateStatus(student._id, 'absent_verified')}
            className={`p-2 rounded-full transition-all transform hover:scale-110 ${
              status === 'absent_verified'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-yellow-100'
            }`}
            disabled={saving}
            title="غياب مبرر"
          >
            <AlertCircle className="w-5 h-5" />
          </button>
        </div>
        <span className="font-medium text-gray-900">
          {student.nom_eleve} {student.prenom_eleve}
        </span>
      </div>
    </div>
  );
} 