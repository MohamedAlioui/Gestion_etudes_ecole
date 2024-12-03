import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Student {
  _id: string;
  name: string;
  class: string;
}

interface AttendanceRecord {
  student: string;
  status: 'present' | 'absent' | 'absent_verified';
}

interface Session {
  _id: string;
  date: string;
  time: string;
  attendanceRecords: AttendanceRecord[];
}

interface Etude {
  id: string;
  name: string;
}

interface AttendanceTableProps {
  baseAmount: number;
  idEnseignant: string;
  etudeid: string;
  startDate: Date;
  endDate: Date;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  baseAmount,
  idEnseignant,
  etudeid,
  startDate,
  endDate,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [etudes, setEtudes] = useState<Etude[]>([]);
  const [selectedEtude, setSelectedEtude] = useState<string>(etudeid);
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/classes`);
        if (!response.ok) {
          throw new Error(`Failed to fetch classes: ${response.statusText}`);
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);
  useEffect(() => {
    const fetchEtudes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/etudes`);
        if (!response.ok) {
          throw new Error(`Failed to fetch études: ${response.statusText}`);
        }
        const data = await response.json();
        setEtudes(data);
      } catch (error) {
        console.error('Error fetching études:', error);
      }
    };
    fetchEtudes();
  }, []);

  useEffect(() => {
    if (!selectedEtude || !startDate || !endDate || !idEnseignant) return;

    const fetchData = async () => {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/finances/enseignant/${idEnseignant}/etude/${etudeid}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const fetchedSessions = data.details.map((detail: any) => ({
          _id: detail.seance,
          date: detail.date,
          time: detail.time || '',
          attendanceRecords: detail.presences.map((presence: any) => ({
            student: presence.eleve._id,
            status: presence.status,
          })),
        }));

        setSessions(fetchedSessions);

        const uniqueStudents = data.details.flatMap((detail: any) =>
          detail.presences.map((presence: any) => ({
            _id: presence.eleve._id,
            name: `${presence.eleve.nom_eleve} ${presence.eleve.prenom_eleve}`,
            class: presence.eleve.classe,
          }))
        );
        const studentMap: Record<string, Student> = {};
        uniqueStudents.forEach((student) => {
          studentMap[student._id] = student;
        });

        setStudents(Object.values(studentMap));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedEtude, startDate, endDate, idEnseignant, etudeid]);

  const getStatusSymbol = (status: string) => {
    switch (status) {
      case 'present':
        return '+';
      case 'absent_verified':
        return 'A';
      case 'absent':
        return '-';
      default:
        return '';
    }
  };

  const calculateStudentAmount = (studentId: string) => {
    const presentCount = sessions.reduce((count, session) => {
      const record = session.attendanceRecords.find(
        (r) => r.student === studentId
      );
      return count + (record?.status === 'present' ? 1 : 0) + (record?.status === 'absent' ? 1 : 0);
    }, 0);
    return presentCount * baseAmount;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-2 py-1 w-12">ع/ر</th>
            <th className="border px-2 py-1">الاسم و اللقب</th>
            <th className="border px-2 py-1 w-16">القسم</th>
            {sessions.map((session) => (
              <th key={session._id} className="border px-2 py-1 w-16">
                {format(new Date(session.date), 'MM/dd')}
              </th>
            ))}
            <th className="border px-2 py-1 w-20">المبلغ</th>
            <th className="border px-2 py-1 w-24">الملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const amount = calculateStudentAmount(student._id);
            return (
              <tr key={student._id}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1">{student.name}</td>
                <td className="border px-12 py-1 text-center">
                  
                  
                  
                  {classes.find((cls) => cls._id === student.class)?.nom_classe || ''}
                
                
                
                    
                
                </td>
                {sessions.map((session) => {
                  const record = session.attendanceRecords.find(
                    (r) => r.student === student._id
                  );
                  return (
                    <td key={session._id} className="border px-2 py-1 text-center">
                      {getStatusSymbol(record?.status || 'absent')}
                    </td>
                  );
                })}
                <td className="border px-2 py-1 text-center">
                  {amount > 0 ? `${amount} د` : ''}
                </td>
                <td className="border px-2 py-1"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;