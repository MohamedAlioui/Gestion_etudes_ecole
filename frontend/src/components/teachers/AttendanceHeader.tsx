import { set } from 'mongoose';
import React, { useEffect, useState } from 'react';

interface AttendanceHeaderProps {
  teacherName: string;
  subject: string;
  level: string;
  etudeName: string;
}

export const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  teacherName,
  subject,
  level,
  etudeName,
}) => {
  const [fetchedMatiere, setFetchedMatiere] = useState<string>('');
  const [fetchedNiveau, setFetchedNiveau] = useState<string>('');
  const [fetchedEtudeName, setFetchedEtudeName] = useState<string>('');

  useEffect(() => {
    const fetchEtudeName = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/etudes/${etudeName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch etude data');
        }
        const data = await response.json();

        // Assuming the API response has a `name` field for the etude
        setFetchedEtudeName(data.className); // Set the fetched etude name
        setFetchedMatiere(data.matiere);
        setFetchedNiveau(data.niveau);
      } catch (error) {
        console.error('Error fetching etude name:', error);
      }
    };

    // Fetch the etude name only if it's passed as a prop
    if (etudeName) {
      fetchEtudeName();
    }
  }, [etudeName]); // Dependency on etudeName to refetch if it changes

  return (
    <>
      <div className="text-center mb-6 text-xl font-bold">
        بطاقة حضور دروس التدارك
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div>
          <span className="font-bold">الاستاذ:</span> {teacherName}
        </div>
        <div>
          <span className="font-bold">المادة:</span> {fetchedMatiere || subject}
        </div>
        <div>
          <span className="font-bold">المستوى:</span> {fetchedNiveau || level}
        </div>
        <div>
          <span className="font-bold">الدراسة:</span> {fetchedEtudeName || etudeName}
        </div>
      </div>
    </>
  );
};
