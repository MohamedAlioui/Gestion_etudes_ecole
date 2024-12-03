import * as XLSX from 'xlsx';
import { Month, Student } from '../store/useStore';

const getStatusInArabic = (status: string): string => {
  switch (status) {
    case 'present':
      return 'حاضر';
    case 'absent':
      return 'غائب';
    case 'absent_verified':
      return 'غياب مبرر';
    default:
      return '';
  }
};

const createHeaderSheet = (wb: XLSX.WorkBook, month: Month): void => {
  const headerData = [
    [,'المستوى الدراسي:', month.classLevel],
    ['المادة:', month.subject],
    ['الشهر:', new Date(2024, month.monthNumber - 1).toLocaleDateString('ar-SA', { month: 'long' })],
    ['السنة:', month.year.toString()],
    []
  ];

  const ws = XLSX.utils.aoa_to_sheet(headerData);
  ws['!rtl'] = true; // Set right-to-left
  XLSX.utils.book_append_sheet(wb, ws, 'معلومات عامة');
};

const createAttendanceSheet = (wb: XLSX.WorkBook, month: Month, students: Student[]): void => {
  const studentsInClass = students.filter(s => s.classLevel === month.classLevel);
  
  const headers = ['الرقم', 'اسم التلميذ', ...month.sessions.map((_, i) => `الحصة ${i + 1}`), 'مجموع الغياب'];
  
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

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  ws['rtl'] = true; // Set right-to-left
  XLSX.utils.book_append_sheet(wb, ws, 'سجل الحضور');
};

const createSessionSheets = (wb: XLSX.WorkBook, month: Month, students: Student[]): void => {
  const studentsInClass = students.filter(s => s.classLevel === month.classLevel);

  month.sessions.forEach((session, sessionIndex) => {
    const sheetData = [
      ['التاريخ:', session.date],
      ['الوقت:', session.heure],
      [],
      ['الرقم', 'اسم التلميذ', 'الحالة']
    ];

    studentsInClass.forEach((student, index) => {
      const attendance = session.attendance.find(a => a.studentId === student.id);
      sheetData.push([
        index + 1,
        student.name,
        getStatusInArabic(attendance?.status || 'absent')
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws['!rtl'] = true; // Set right-to-left
    XLSX.utils.book_append_sheet(wb, ws, `الحصة ${sessionIndex + 1}`);
  });
};

export const exportToExcel = (month: Month, students: Student[]): void => {
  // Create new workbook
  const wb = XLSX.utils.book_new();

  // Add sheets
  createHeaderSheet(wb, month);
  createAttendanceSheet(wb, month, students);
  createSessionSheets(wb, month, students);

  // Generate filename
  const monthName = new Date(2024, month.monthNumber - 1).toLocaleDateString('ar-SA', { month: 'long' });
  const fileName = `تقرير_الحضور_${month.classLevel}_${monthName}_${month.year}.xlsx`;

  // Save workbook
  XLSX.writeFile(wb, fileName);
};