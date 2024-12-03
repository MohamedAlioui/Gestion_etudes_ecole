import React, { useState } from 'react';
import { Student, StudentAttendance } from '../store/useStore';
import { AttendanceModal } from './AttendanceModal';
import { ClipboardList } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface SessionCellProps {
  sessionId: number;
  date: string;
  heure: string;
  students: Student[];
  attendance: StudentAttendance[];
  onUpdateSession: (data: { date?: string; heure?: string; attendance?: StudentAttendance[] }) => void;
  onEditSession: (sessionId: number) => void;
  onDeleteSession: (sessionId: number) => void;
}

export function SessionCell({
  sessionId,
  date,
  heure,
  students,
  attendance,
  onUpdateSession,
  onEditSession,
  onDeleteSession,
}: SessionCellProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs(date || heure));

  const getAttendanceStatus = () => {
    const present = attendance.filter((a) => a.status === 'present').length;
    const total = students.length;
    return `${present}/${total}`;
  };

  const handleUpdateAttendance = (newAttendance: StudentAttendance[]) => {
    onUpdateSession({ attendance: newAttendance });
  };

  const handleDateTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setDateTime(newValue);
      onUpdateSession({ date: newValue.format('YYYY-MM-DD'), heure: newValue.format('HH:mm') });
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {/* Session ID */}
      <td className="py-3 px-4 text-right">الحصة {sessionId}</td>

      {/* Date & Time Picker */}
      <td className="py-3 px-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Edit Date & Time"
            value={dateTime}
            onChange={handleDateTimeChange}
            renderInput={({ inputRef, inputProps, InputProps }) => (
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  {...inputProps}
                  className="p-2 border rounded-md w-full text-gray-600"
                />
                {InputProps?.endAdornment}
              </div>
            )}
          />
        </LocalizationProvider>
      </td>

      {/* Attendance Status & Modal */}
      <td className="py-3 px-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-600">{getAttendanceStatus()}</span>
          <ClipboardList className="w-5 h-5 text-gray-500" />
        </button>

        {/* Attendance Modal */}
        <AttendanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          students={students}
          attendance={attendance}
          onUpdateAttendance={handleUpdateAttendance}
        />
      </td>

      {/* Edit & Delete Buttons */}
      <td className="py-3 px-4 flex space-x-2">
        <button
          onClick={() => onEditSession(sessionId)}
          className="px-4 py-2 flex items-center  text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
        >
          ✏️ 
        </button>
        <button
          onClick={() => onDeleteSession(sessionId)}
          className="px-4 py-2 flex items-center  text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
        >
          🗑️ 
        </button>
      </td>
    </tr>
  );
}
