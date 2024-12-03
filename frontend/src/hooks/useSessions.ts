import { useState, useEffect } from 'react';
import axios from 'axios';
import { Session, AttendanceRecord } from '../types/sessions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get<Session[]>(`${API_URL}/api/seances`);
      setSessions(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('فشل في جلب قائمة الحصص');
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (sessionData: Omit<Session, '_id' | 'attendanceList'>) => {
    try {
      const response = await axios.post(`${API_URL}/api/seances`, {
        date_seance: sessionData.date_seance,
        etude_id: sessionData.etude._id,
        presences: [],
      });
      setSessions((prev) => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error adding session:', err);
      setError('فشل في إضافة الحصة');
      throw err;
    }
  };

  const addMultipleSessions = async (
    sessionsData: Omit<Session, '_id' | 'attendanceList'>[]
  ) => {
    try {
      const createdSessions = [];
      for (const session of sessionsData) {
        const createdSession = await addSession(session);
        createdSessions.push(createdSession);
      }
      return createdSessions;
    } catch (err) {
      console.error('Error adding multiple sessions:', err);
      setError('فشل في إضافة الحصص المتعددة');
      throw err;
    }
  };

  const updateSession = async (sessionData: Session) => {
    try {
      if (!sessionData._id) {
        throw new Error('Session ID is missing');
      }
      const response = await axios.put(`${API_URL}/api/seances/${sessionData._id}`, {
        date_seance: sessionData.date_seance,
        etude: sessionData.etude._id,
      });
      setSessions((prev) =>
        prev.map((session) =>
          session._id === sessionData._id ? response.data : session
        )
      );
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error updating session:', err);
      setError('Failed to update session');
      throw err;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await axios.delete(`${API_URL}/api/seances/${sessionId}`);
      setSessions((prev) => prev.filter((session) => session._id !== sessionId));
      setError(null);
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('فشل في حذف الحصة');
      throw err;
    }
  };

  const updateAttendance = async (
    sessionId: string,
    attendance: AttendanceRecord[]
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/seances/${sessionId}/attendance`,
        {
          presences: attendance.map((record) => ({
            eleve: record.studentId,
            status: record.status,
          })),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  };

  return {
    sessions,
    loading,
    error,
    addSession,
    addMultipleSessions,
    updateSession,
    deleteSession,
    updateAttendance,
    refreshSessions: fetchSessions,
  };
}
