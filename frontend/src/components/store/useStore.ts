import { create } from 'zustand';

export interface Student {
  id: number;
  nom_eleve: string;
  prenom_eleve: string;
  classLevel: string;
  subjects: string[];
}

export interface StudentAttendance {
  studentId: number;
  status: 'present' | 'absent' | 'absent_verified';
}

export interface Session {
  id: number;
  date: string;
  heure: string;
  attendance: StudentAttendance[];
}

export interface Month {
  id: number;
  sessions: Session[];
  classLevel: string;
  subject: string;
  monthNumber: number;
  year: number;
}

interface Store {
  students: Student[];
  months: Month[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  addMonth: (month: Omit<Month, 'id'>) => void;
  updateSessionAttendance: (monthId: number, sessionId: number, attendance: StudentAttendance[]) => void;
  deleteMonth: (monthId: number) => void;
}

export const useStore = create<Store>((set) => ({
  students: [],
  months: [],
  
  addStudent: (student) => set((state) => ({
    students: [...state.students, { ...student, id: state.students.length + 1 }]
  })),
  
  addMonth: (month) => set((state) => {
    const studentsInClass = state.students.filter(s => 
      s.classLevel === month.classLevel && 
      s.subjects.includes(month.subject)
    );
    
    const sessions = Array(4).fill(null).map((_, i) => ({
      id: i + 1,
      date: '',
      heure: '',
      attendance: studentsInClass.map(student => ({
        studentId: student.id,
        status: 'absent' as const
      }))
    }));

    return {
      months: [...state.months, {
        ...month,
        id: state.months.length + 1,
        sessions
      }]
    };
  }),
  
  updateSessionAttendance: (monthId, sessionId, attendance) => set((state) => ({
    months: state.months.map(month => 
      month.id === monthId
        ? {
            ...month,
            sessions: month.sessions.map(session =>
              session.id === sessionId
                ? { ...session, attendance }
                : session
            )
          }
        : month
    )
  })),
  
  deleteMonth: (monthId) => set((state) => ({
    months: state.months.filter(month => month.id !== monthId)
  }))
}));