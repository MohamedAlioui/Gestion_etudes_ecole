import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Clock, Users, Trash2, Edit2 } from 'lucide-react';
import { CalendarView } from '../components/sessions/CalenderView';
import { ViewToggle } from '../components/sessions/ViewToggle';
import SessionModal from '../components/sessions/SessionModal';
import { AttendanceModal } from '../components/sessions/AttendanceModal';
import { Session } from '../types/sessions';
import { Student } from '../types/student';
import { useSessions } from '../hooks/useSessions';

export default function Sessions() {
  const {
    sessions,
    loading,
    error,
    addSession,
    updateSession,
    deleteSession,
    updateAttendance
  } = useSessions();

  const [view, setView] = useState<'calendar' | 'grid'>('grid');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [selectedMatiere, setSelectedMatiere] = useState<string>('');
  const [selectedEtudeClass, setSelectedEtudeClass] = useState<string>('');
  const [selectedEnseignant, setSelectedEnseignant] = useState<string>('');
  const [enseignants, setEnseignants] = useState<any[]>([]);

  // Arabic months (Tunisian)
  const tunisianMonths = [
    'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت',
    'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ];

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/enseignants`);
        setEnseignants(response.data);
      } catch (error) {
        console.error('Error fetching enseignants:', error);
      }
    };

    fetchEnseignants();
  }, []);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + (direction === 'next' ? 1 : -1)
    ));
  };

  // Handle filters
  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.date_seance);
    const sessionMonth = sessionDate.getMonth();
    const sessionWeek = `Week ${Math.ceil(sessionDate.getDate() / 7)}`;
    
    const matchesMonth = !selectedMonth || sessionMonth === parseInt(selectedMonth, 10) - 1;
    const matchesWeek = !selectedWeek || sessionWeek === selectedWeek;
    const matchesMatiere = !selectedMatiere || session.etude.matiere === selectedMatiere;
    const matchesEtudeClass = !selectedEtudeClass || session.etude.className === selectedEtudeClass;
    const matchesEnseignant = !selectedEnseignant || session.etude.enseignant === selectedEnseignant;

    return matchesMonth && matchesWeek && matchesMatiere && matchesEtudeClass && matchesEnseignant;
  });

  const handleAddSession = async (newSession: Omit<Session, '_id' | 'attendanceList'>) => {
    try {
      await addSession(newSession);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const handleEditSession = async (updatedSession: Session) => {
    try {
      await updateSession(updatedSession);
      setEditingSession(updatedSession);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
      try {
        await deleteSession(id);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const handleAttendanceClick = (session: Session) => {
    setSelectedSession(session);
    setStudents(session.etude.eleves as Student[] || []);
    setIsAttendanceModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">الحصص الدراسية</h1>
          <p className="mt-2 text-sm text-gray-700">جدول الحصص الدراسية وإدارة الحضور</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <button
            onClick={() => {
              setEditingSession(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 ml-2" />
            إضافة حصة جديدة
          </button>
        </div>
      </div>

      {view === 'grid' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-select"
            >
              <option value="">كل الأشهر</option>
              {tunisianMonths.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>

            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="form-select"
            >
              <option value="">كل الأسابيع</option>
              {[...Array(5).keys()].map((week) => (
                <option key={week} value={`Week ${week + 1}`}>{`الأسبوع : ${week + 1}`}</option>
              ))}
            </select>

            <select
              value={selectedMatiere}
              onChange={(e) => setSelectedMatiere(e.target.value)}
              className="form-select"
            >
              <option value="">كل المواد</option>
              {[...new Set(sessions.map((s) => s.etude.matiere))].map((matiere) => (
                <option key={matiere} value={matiere}>{matiere}</option>
              ))}
            </select>

            <select
              value={selectedEtudeClass}
              onChange={(e) => setSelectedEtudeClass(e.target.value)}
              className="form-select"
            >
              <option value="">كل الأقسام</option>
              {[...new Set(sessions.map((s) => s.etude.className))].map((className) => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>

            <select
              value={selectedEnseignant}
              onChange={(e) => setSelectedEnseignant(e.target.value)}
              className="form-select"
            >
              <option value="">كل الأساتذة</option>
              {enseignants.map((enseignant) => (
                <option key={enseignant._id} value={enseignant._id}>
                  {enseignant.nom_enseignant} {enseignant.prenom_enseignant}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">جاري التحميل...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {session.etude.matiere}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingSession(session);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session._id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 ml-2" />
                        <span>
                          {new Date(session.date_seance).toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' })} {new Date(session.date_seance).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 ml-2" />
                        <span>{session.etude.className}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        {enseignants.map((enseignant) => {
                          if (enseignant._id === session.etude.enseignant) {
                            return (
                              <span key={enseignant._id}>
                                الأستاذ : {enseignant.nom_enseignant} {enseignant.prenom_enseignant}
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAttendanceClick(session)}
                      className="mt-4 w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      سجل الحضور
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'calendar' && (
        <CalendarView
          sessions={filteredSessions}
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onMonthChange={handleMonthChange}
          onEditSession={(session) => {
            setEditingSession(session);
            setIsModalOpen(true);
          }}
          onDeleteSession={handleDeleteSession}
          onAttendanceClick={handleAttendanceClick}
          enseignants={enseignants}
        />
      )}

      <SessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(null);
        }}
        onSubmit={editingSession ? (session) => handleEditSession(session as Session) : handleAddSession}
        session={editingSession}
      />

      {selectedSession && (
        <AttendanceModal
          isOpen={isAttendanceModalOpen}
          onClose={() => {
            setIsAttendanceModalOpen(false);
            setSelectedSession(null);
          }}
          session={selectedSession}
          students={students}
          attendance={selectedSession.attendanceList}
          onUpdateAttendance={(attendance) => updateAttendance(selectedSession._id, attendance)}
        />
      )}
    </div>
  );
}