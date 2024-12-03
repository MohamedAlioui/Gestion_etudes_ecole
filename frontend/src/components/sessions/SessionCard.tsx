import React from 'react';
import { Edit2, Trash2, Users } from 'lucide-react';
import { Session } from '../../types/sessions';

interface SessionCardProps {
  session: Session;
  onEdit: () => void;
  onDelete: () => void;
  onAttendance: () => void;
}

export default function SessionCard({
  session,
  onEdit,
  onDelete,
  onAttendance
}: SessionCardProps) {
  const getAttendanceStats = () => {
    const total = session.attendanceList.length;
    const present = session.attendanceList.filter(a => a.status === 'present').length;
    const absentVerified = session.attendanceList.filter(
      a => a.status === 'absent_verified'
    ).length;
    const absent = total - present - absentVerified;

    return { total, present, absent, absentVerified };
  };

  const stats = getAttendanceStats();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {session.etude.matiere}
            </h3>
            <p className="text-sm text-gray-600">
              {session.etude.className} - {session.etude.niveau}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="تعديل"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">التاريخ:</span> {session.date_seance}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">الوقت:</span> {new Date(session.date_seance).toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">المدرس:</span>{' '}
            {session.etude.enseignant.nom_enseignant}{' '}
            {session.etude.enseignant.prenom_enseignant}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-green-600 font-semibold">{stats.present}</div>
            <div className="text-xs text-green-800">حاضر</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="text-red-600 font-semibold">{stats.absent}</div>
            <div className="text-xs text-red-800">غائب</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="text-yellow-600 font-semibold">{stats.absentVerified}</div>
            <div className="text-xs text-yellow-800">مبرر</div>
          </div>
        </div>

        <button
          onClick={onAttendance}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
        >
          <Users className="w-4 h-4" />
          <span>إدارة الحضور</span>
        </button>
      </div>
    </div>
  );
}