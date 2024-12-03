export interface Session {
  _id: string;
  date_seance: string;
  etude: {
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
  };
  attendanceList: AttendanceRecord[];
}

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'absent_verified';
}