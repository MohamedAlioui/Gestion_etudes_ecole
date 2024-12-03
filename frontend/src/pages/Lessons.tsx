import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  presence: boolean;
}

interface Month {
  id: string;
  name: string;
  sessions: Session[];
}

interface Study {
  id: string;
  name: string;
  months: Month[];
}

const Lessons = () => {
  const [studies, setStudies] = useState<Study[]>([]);

  // Add a new study
  const handleAddStudy = () => {
    const newStudy = {
      id: uuidv4(),
      name: `الدراسة ${studies.length + 1}`,
      months: [],
    };
    setStudies([...studies, newStudy]);
  };

  // Add a new month to a study
  const handleAddMonth = (studyId: string) => {
    setStudies((prev) =>
      prev.map((study) =>
        study.id === studyId
          ? {
              ...study,
              months: [
                ...study.months,
                {
                  id: uuidv4(),
                  name: `الشهر ${study.months.length + 1}`,
                  sessions: Array(4)
                    .fill(null)
                    .map((_, index) => ({
                      id: `session-${index + 1}`,
                      date: '',
                      startTime: '',
                      endTime: '',
                      presence: false, // Initialize presence as false
                    })),
                },
              ],
            }
          : study
      )
    );
  };

  // Toggle presence for a session
  const handleTogglePresence = (studyId: string, monthId: string, sessionId: string) => {
    setStudies((prev) =>
      prev.map((study) =>
        study.id === studyId
          ? {
              ...study,
              months: study.months.map((month) =>
                month.id === monthId
                  ? {
                      ...month,
                      sessions: month.sessions.map((session) =>
                        session.id === sessionId
                          ? { ...session, presence: !session.presence }
                          : session
                      ),
                    }
                  : month
              ),
            }
          : study
      )
    );
  };

  // Delete a session
  const handleDeleteSession = (studyId: string, monthId: string, sessionId: string) => {
    setStudies((prev) =>
      prev.map((study) =>
        study.id === studyId
          ? {
              ...study,
              months: study.months.map((month) =>
                month.id === monthId
                  ? {
                      ...month,
                      sessions: month.sessions.filter((session) => session.id !== sessionId),
                    }
                  : month
              ),
            }
          : study
      )
    );
  };

  // Delete a month
  const handleDeleteMonth = (studyId: string, monthId: string) => {
    setStudies((prev) =>
      prev.map((study) =>
        study.id === studyId
          ? {
              ...study,
              months: study.months.filter((month) => month.id !== monthId),
            }
          : study
      )
    );
  };

  // Delete a study
  const handleDeleteStudy = (studyId: string) => {
    setStudies((prev) => prev.filter((study) => study.id !== studyId));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الدراسات</h1>

      <button
        onClick={handleAddStudy}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Plus size={20} />
        <span>إضافة دراسة جديدة</span>
      </button>

      {studies.map((study) => (
        <div key={study.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{study.name}</h2>
            <button
              onClick={() => handleDeleteStudy(study.id)}
              className="text-red-500 hover:text-red-600"
            >
              حذف الدراسة
            </button>
          </div>

          {study.months.map((month) => (
            <div key={month.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{month.name}</h3>
              <table className="min-w-full border border-gray-300 divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الوقت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {month.sessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{`الحصة ${session.id.split('-')[1]}`}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{session.date || 'غير محدد'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {session.startTime && session.endTime
                          ? `${session.startTime} - ${session.endTime}`
                          : 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => handleTogglePresence(study.id, month.id, session.id)}
                          className={`${
                            session.presence ? 'text-green-500 hover:text-green-600' : 'text-gray-500 hover:text-gray-600'
                          } ml-2`}
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteSession(study.id, month.id, session.id)}
                          className="text-red-500 hover:text-red-600 ml-2"
                        >
                          <Trash2 size={20} />
                        </button>
                        <button
                          className="text-yellow-500 hover:text-yellow-600"
                          // Example update logic can be added here
                        >
                          <Edit2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => handleDeleteMonth(study.id, month.id)}
                className="mt-2 text-red-500 hover:text-red-600"
              >
                حذف الشهر
              </button>
            </div>
          ))}

          <button
            onClick={() => handleAddMonth(study.id)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            إضافة شهر جديد
          </button>
        </div>
      ))}
    </div>
  );
};

export default Lessons;
