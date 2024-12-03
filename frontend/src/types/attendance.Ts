export interface Student {
    _id: string;
    nom_eleve: string;
    prenom_eleve: string;
    date_naissance: string;
    nom_parent: string;
    num_parent: string;
    classe: string;
  }
  
  export interface Presence {
    eleve: Student;
    status: 'present' | 'absent' | 'absent_verified';
    montant: number;
  }
  
  export interface SessionDetail {
    seance: string;
    date: string;
    presences: Presence[];
    presenceStats: {
      total: number;
      present: number;
      absent_verified: number;
      absent: number;
    };
    totalSeance: number;
  }
  
  export interface MonthlyBreakdown {
    month: number;
    year: number;
    totalMontant: number;
    sessionCount: number;
    presenceStats: {
      total: number;
      present: number;
      absent_verified: number;
      absent: number;
    };
  }
  
  export interface AttendanceData {
    details: SessionDetail[];
    monthlyBreakdown: MonthlyBreakdown[];
    totalFinance: number;
    summary: {
      totalSessions: number;
      averagePerSession: string;
      baseRate: number;
      presenceRate: number;
      presenceStats: {
        total: number;
        present: number;
        absent_verified: number;
        absent: number;
      };
    };
  }