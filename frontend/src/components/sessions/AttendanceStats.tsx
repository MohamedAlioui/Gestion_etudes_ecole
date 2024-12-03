import React from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';

interface AttendanceStatsProps {
  present: number;
  absent: number;
  verified: number;
}

export function AttendanceStats({ present, absent, verified }: AttendanceStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <UserCheck className="w-6 h-6 text-green-600" />
          <span className="text-2xl font-bold text-green-600">{present}</span>
        </div>
        <p className="text-sm text-green-600 mt-1">حاضر</p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <UserX className="w-6 h-6 text-red-600" />
          <span className="text-2xl font-bold text-red-600">{absent}</span>
        </div>
        <p className="text-sm text-red-600 mt-1">غائب</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <Clock className="w-6 h-6 text-yellow-600" />
          <span className="text-2xl font-bold text-yellow-600">{verified}</span>
        </div>
        <p className="text-sm text-yellow-600 mt-1">غياب مبرر</p>
      </div>
    </div>
  );
}