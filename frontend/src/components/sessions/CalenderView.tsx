import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Users, X, Edit2, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Session } from '../types/sessions';

interface CalendarViewProps {
  sessions: Session[];
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onEditSession: (session: Session) => void;
  onDeleteSession: (id: string) => void;
  onAttendanceClick: (session: Session) => void;
  enseignants: any[];
}

export function CalendarView({
  sessions,
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  onEditSession,
  onDeleteSession,
  onAttendanceClick,
  enseignants,
}: CalendarViewProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDaySessions = (date: Date) => {
    return sessions.filter(session => 
      isSameDay(new Date(session.date_seance), date)
    );
  };

  const handleSessionClick = (e: React.MouseEvent, session: Session) => {
    e.stopPropagation();
    setSelectedSession(session);
  };

  const handleCloseDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSession(null);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button 
            onClick={() => onMonthChange('prev')} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy', { locale: ar })}
          </h2>
          <button 
            onClick={() => onMonthChange('next')} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-5 w-5 ml-2" />
          <span>عرض شهري</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
          <div key={day} className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 relative">
        {daysInMonth.map((date) => {
          const daySessions = getDaySessions(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <div
              key={date.toString()}
              className={`min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 ${
                isSelected ? 'ring-2 ring-indigo-600' : ''
              }`}
              onClick={() => onDateSelect(date)}
            >
              <div className="font-semibold text-sm text-gray-900">
                {format(date, 'd')}
              </div>
              <div className="mt-2 space-y-1">
                {daySessions.map((session) => (
                  <div
                    key={session._id}
                    onClick={(e) => handleSessionClick(e, session)}
                    className={`p-2 rounded-md text-xs transition-colors ${
                      selectedSession?._id === session._id
                        ? 'bg-indigo-100 ring-2 ring-indigo-500'
                        : 'bg-indigo-50 hover:bg-indigo-100'
                    }`}
                  >
                    <div className="font-semibold text-indigo-700">
                      {session.etude.matiere}
                    </div>
                    <div className="flex items-center text-indigo-600 mt-1">
                      <Clock className="h-3 w-3 ml-1" />
                      {format(new Date(session.date_seance), 'HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Inline Session Details */}
        {selectedSession && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {selectedSession.etude.matiere}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSession(selectedSession);
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-gray-100"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(selectedSession._id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCloseDetails}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 ml-2" />
                    <span className="text-lg">
                      {format(new Date(selectedSession.date_seance), 'EEEE, d MMMM yyyy', { locale: ar })}
                      {' - '}
                      {format(new Date(selectedSession.date_seance), 'HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 ml-2" />
                    <span className="text-lg">{selectedSession.etude.className}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    {enseignants.map((enseignant) => {
                      if (enseignant._id === selectedSession.etude.enseignant) {
                        return (
                          <span key={enseignant._id} className="text-lg">
                            الأستاذ : {enseignant.nom_enseignant} {enseignant.prenom_enseignant}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAttendanceClick(selectedSession);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    سجل الحضور
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}