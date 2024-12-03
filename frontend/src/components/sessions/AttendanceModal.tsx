import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Student } from '../../types/student';
import { Session, AttendanceRecord } from '../../types/sessions';
import { AttendanceStats } from './AttendanceStats';
import { StudentAttendanceRow } from './StudentAttendanceRow';

const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`;

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  students: Student[];
  attendance: AttendanceRecord[];
  onUpdateAttendance: (attendance: AttendanceRecord[]) => void;
}

export function AttendanceModal({
  isOpen,
  onClose,
  session,
  students,
  attendance = [],
  onUpdateAttendance,
}: AttendanceModalProps) {
  const [localAttendance, setLocalAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ present: 0, absent: 0, verified: 0 });

  useEffect(() => {
    if (isOpen && session._id) {
      fetchAttendance();
    }
  }, [isOpen, session._id]);

  useEffect(() => {
    updateStats();
  }, [localAttendance]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/seances/${session._id}`);
      const sessionData = response.data;
      
      const initialAttendance = students.map(student => {
        const existingRecord = sessionData.presences?.find(
          (p: any) => p.eleve?._id === student._id.toString()
        );
        return {
          studentId: student._id.toString(),
          status: existingRecord?.status || 'absent'
        };
      });
      
      setLocalAttendance(initialAttendance);
      onUpdateAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('فشل تحميل سجل الحضور');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const present = localAttendance.filter(a => a.status === 'present').length;
    const absent = localAttendance.filter(a => a.status === 'absent').length;
    const verified = localAttendance.filter(a => a.status === 'absent_verified').length;
    setStats({ present, absent, verified });
  };

  const handleUpdateAttendance = async (
    studentId: string,
    status: 'present' | 'absent' | 'absent_verified'
  ) => {
    setSaving(true);
    try {
      const updatedAttendance = localAttendance.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      );
      setLocalAttendance(updatedAttendance);

      // Update the attendance record in the presences array
      const presencesData = updatedAttendance.map(record => ({
        eleve: record.studentId,
        status: record.status
      }));

      // Use the main session update endpoint instead of the non-existent student endpoint
      await axios.put(`${API_URL}/api/seances/${session._id}`, {
        presences: presencesData
      });

      onUpdateAttendance(updatedAttendance);
    } catch (error) {
      console.error('Error updating attendance:', error);
      setError('فشل تحديث حالة الحضور');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const presencesData = localAttendance.map(record => ({
        eleve: record.studentId,
        status: record.status
      }));

      await axios.put(`${API_URL}/api/seances/${session._id}`, {
        presences: presencesData
      });
      
      onUpdateAttendance(localAttendance);
      onClose();
    } catch (error) {
      console.error('Error saving attendance:', error);
      setError('فشل حفظ سجلات الحضور');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(student => 
    `${student.nom_eleve} ${student.prenom_eleve}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
        <div className="inline-block w-full max-w-2xl p-6 my-8 text-right bg-white rounded-lg shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900">سجل الحضور</h3>
          </div>

          <AttendanceStats
            present={stats.present}
            absent={stats.absent}
            verified={stats.verified}
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="بحث عن طالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Student List */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_#f1f5f9]">
            {loading ? (
              <div className="text-center py-4">جاري التحميل...</div>
            ) : (
              filteredStudents.map((student) => {
                const record = localAttendance?.find(
                  (a) => a.studentId === student._id.toString()
                ) || { studentId: student._id.toString(), status: 'absent' };

                return (
                  <StudentAttendanceRow
                    key={student._id.toString()}
                    student={student}
                    status={record.status}
                    onUpdateStatus={handleUpdateAttendance}
                    saving={saving}
                  />
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-start gap-3">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={saving || loading}
            >
              {saving && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              حفظ التغييرات
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}