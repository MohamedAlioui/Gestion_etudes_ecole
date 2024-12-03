import { Month, Student } from '../../types/attendance';
import { ExcelSheetConfig } from './types';
import { formatDate, getStatusInArabic, formatMonthYear } from './formatters';

export const createHeaderSheet = (month: Month): ExcelSheetConfig => {
  const data = [
    ['المستوى الدراسي:', month.classLevel],
    ['المادة:', month.subject],
    ['الشهر:', formatMonthYear(month.monthNumber, month.year)],
    ['السنة:', month.year.toString()],
    []
  ];

  return {
    name: 'معلومات عامة',
    data
  };
};

export const createAttendanceSheet = (month: Month, students: Student[]): ExcelSheetConfig => {
  const studentsInClass = students.filter(s => s.classLevel === month.classLevel);
  
  const headers = [
    'الرقم',
    'اسم التلميذ',
    ...month.sessions.map((_, i) => `الحصة ${i + 1}`),
    'مجموع الغياب'
  ];
  
  const data = studentsInClass.map((student, index) => {
    const attendanceRow = month.sessions.map(session => {
      const record = session.attendance.find(a => a.studentId === student.id);
      return getStatusInArabic(record?.status || 'absent');
    });

    const absenceCount = attendanceRow.filter(status => 
      status === 'غائب' || status === 'غياب مبرر'
    ).length;

    return [
      index + 1,
      student.name,
      ...attendanceRow,
      absenceCount
    ];
  });

  return {
    name: 'سجل الحضور',
    data: [headers, ...data]
  };
};

export const createSessionSheets = (month: Month, students: Student[]): ExcelSheetConfig[] => {
  const studentsInClass = students.filter(s => s.classLevel === month.classLevel);

  return month.sessions.map((session, sessionIndex) => {
    const data = [
      ['التاريخ:', formatDate(session.date)],
      ['الوقت:', session.heure],
      [],
      ['الرقم', 'اسم التلميذ', 'الحالة']
    ];

    studentsInClass.forEach((student, index) => {
      const attendance = session.attendance.find(a => a.studentId === student.id);
      data.push([
        index + 1,
        student.name,
        getStatusInArabic(attendance?.status || 'absent')
      ]);
    });

    return {
      name: `الحصة ${sessionIndex + 1}`,
      data
    };
  });
};