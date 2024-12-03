import React from 'react';
import type { SessionDetail } from '../../types/attendance';

interface SessionStatsProps {
  details: SessionDetail[];
}

export const SessionStats: React.FC<SessionStatsProps> = ({ details }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">إحصائيات الحصص</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {details.map((session) => (
          <div 
            key={session.seance} 
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="text-sm font-medium mb-2">
              {new Date(session.date).toLocaleDateString('ar-TN')}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>الحضور: {session.presenceStats.present}</div>
                    <div>الغياب: {session.presenceStats.absent}</div>
                    <div>الغياب المبرر: {session.presenceStats.absent_verified}</div>
              <div>المجموع: {session.presenceStats.total}</div>
              <div>المبلغ: {session.totalSeance.toFixed(3)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};