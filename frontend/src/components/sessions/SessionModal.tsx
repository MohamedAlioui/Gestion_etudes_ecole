import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Session } from '../../types/sessions';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`;

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (session: Omit<Session, '_id' | 'attendanceList'>) => void;
  session?: Session | null;
  sessions_id: string;
}

interface Etude {
  _id: string;
  niveau: string;
  matiere: string;
  className: string;
  enseignant: {
    _id: string;
    nom_enseignant: string;
    prenom_enseignant: string;
    matiere: string;
  };
  eleves?: string[];
}

export default function SessionModal({
  isOpen,
  onClose,
  onSubmit,
  session,
}: SessionModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    etude_id: '',
  });
  const [generateMultiple, setGenerateMultiple] = useState(false);
  const [etudes, setEtudes] = useState<Etude[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchEtudes();
      if (session) {
        setFormData({
          date: session.date_seance.split('T')[0], 
          time: session.date_seance.split('T')[1]?.slice(0, 5) || '', // Extract time
          etude_id: session.etude._id,
        });
      } else {
        setFormData({
          date: '',
          time: '',
          etude_id: '',
        });
      }
    }
  }, [isOpen, session]);

  const fetchEtudes = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Etude[]>(`${API_URL}/api/etudes`);
      setEtudes(response.data);
    } catch (err) {
      console.error('Error fetching etudes:', err);
      setError('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const generateSessions = (startDate: string, etudeId: string) => {
    const sessions = [];
    for (let i = 0; i < 4; i++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(sessionDate.getDate() + i * 7); // Increment by 7 days
      const formattedDate = sessionDate.toISOString().split('T')[0]; // yyyy-mm-dd

      sessions.push({
        date_seance: `${formattedDate}T${formData.time}`,
        etude: etudes.find((etude) => etude._id === etudeId) as Etude,
      });
    }
    return sessions;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedEtude = etudes.find((etude) => etude._id === formData.etude_id);
    if (!selectedEtude) {
      setError('Please select a valid subject.');
      return;
    }

    if (generateMultiple) {
      const generatedSessions = generateSessions(formData.date, formData.etude_id);
      generatedSessions.forEach((session) => onSubmit(session));
    } else {
      onSubmit({
        date_seance: `${formData.date}T${formData.time}`,
        etude: selectedEtude,
      });
    }

    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
        <button
          type="button"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <h3 id="modal-title" className="text-lg font-semibold text-gray-900 mb-4">
          {session ? 'تعديل الحصة' : 'إضافة حصة جديدة'}
        </h3>

        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="etude" className="block text-sm font-medium text-gray-700">
              المادة
            </label>
            {loading ? (
              <div className="mt-1 text-sm text-gray-500">جاري التحميل...</div>
            ) : (
              <select
                id="etude"
                value={formData.etude_id}
                onChange={(e) =>
                  setFormData({ ...formData, etude_id: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="">اختر المادة</option>
                {etudes.map((etude) => (
                  <option key={etude._id} value={etude._id}>
                    {etude.className} - {etude.matiere} ({etude.niveau})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              التاريخ
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              الوقت
            </label>
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="generateMultiple"
              checked={generateMultiple}
              onChange={() => setGenerateMultiple(!generateMultiple)}
            />
            <label htmlFor="generateMultiple" className="text-sm text-gray-700">
              إنشاء 4 حصص (أسبوعية)
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
            >
              {session ? 'تحديث' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
