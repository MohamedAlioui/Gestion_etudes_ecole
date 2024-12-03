import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AttendanceData } from '../../types/attendance';

interface GenerateExcelParams {
  teacherName: string;
  subject: string;
  level: string;
  etudeName: string;
  startDate: string;
  endDate: string;
  data: AttendanceData;
}

const getStatusSymbol = (status: string) => {
  switch (status) {
    case 'present':
      return 'حاضر';
    case 'absent_verified':
      return 'غياب مبرر';
    case 'absent':
      return 'غائب';
    default:
      return '';
  }
};

export const generateAttendanceExcel = ({
  teacherName,
  subject,
  level,
  etudeName,
  startDate,
  endDate,
  data,
}: GenerateExcelParams) => {
  // Process data for attendance sheets
  const students = new Map();
  const sessions = new Set();
  const attendanceMap = new Map();

  data.details.forEach(detail => {
    sessions.add(detail.date);
    detail.presences.forEach(presence => {
      const studentId = presence.eleve._id;
      students.set(studentId, {
        name: `${presence.eleve.nom_eleve} ${presence.eleve.prenom_eleve}`,
        class: presence.eleve.classe
      });
      const key = `${studentId}-${detail.date}`;
      attendanceMap.set(key, presence.status);
    });
  });

  const sortedSessions = Array.from(sessions).sort();
  const studentArray = Array.from(students.entries());

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Header information
  const headerData = [
    ['الأستاذ:', teacherName],
    ['المادة:', subject],
    ['المستوى:', level],
    ['الدراسة:', etudeName],
    ['الفترة:', `${format(new Date(startDate), 'dd MMMM yyyy', { locale: ar })} - ${format(new Date(endDate), 'dd MMMM yyyy', { locale: ar })}`],
    [],
  ];

  // Create summary sheet
  const summaryData = [
    ...headerData,
    ['ع/ر', 'الاسم و اللقب', 'القسم', ...sortedSessions.map(date => format(new Date(date), 'MM/dd')), 'المبلغ', 'الملاحظات']
  ];

  studentArray.forEach(([studentId, student], index) => {
    const row = [
      index + 1,
      student.name,
      student.class
    ];

    const attendanceStatuses = sortedSessions.map(date => {
      const key = `${studentId}-${date}`;
      return getStatusSymbol(attendanceMap.get(key) || 'absent');
    });

    const presentCount = attendanceStatuses.filter(status => status === 'حاضر').length;
    const amount = presentCount > 0 ? `${presentCount * 10} د` : '';

    row.push(...attendanceStatuses, amount, '');
    summaryData.push(row);
  });

  // Add summary sheet
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!rtl'] = true; // Set right-to-left
  XLSX.utils.book_append_sheet(wb, wsSummary, 'ملخص الحضور');

  // Create individual session sheets
  sortedSessions.forEach((sessionDate, index) => {
    const sessionData = [
      ['التاريخ:', format(new Date(sessionDate), 'dd/MM/yyyy')],
      [],
      ['ع/ر', 'الاسم و اللقب', 'القسم', 'الحالة']
    ];

    studentArray.forEach(([studentId, student], studentIndex) => {
      const key = `${studentId}-${sessionDate}`;
      const status = getStatusSymbol(attendanceMap.get(key) || 'absent');
      
      sessionData.push([
        studentIndex + 1,
        student.name,
        student.class,
        status
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(sessionData);
    ws['!rtl'] = true; // Set right-to-left
    XLSX.utils.book_append_sheet(wb, ws, `الحصة ${index + 1}`);
  });

  // Add financial summary sheet
  const financialData = [
    ...headerData,
    [],
    ['المجموع الجملي:', `${data.totalFinance} د.ت`],
    ['حصة الأستاذ (80%):', `${(data.totalFinance * 0.8).toFixed(3)} د.ت`],
    ['معلوم الخدمات (20%):', `${(data.totalFinance * 0.2).toFixed(3)} د.ت`]
  ];

  const wsFinancial = XLSX.utils.aoa_to_sheet(financialData);
  wsFinancial['!rtl'] = true; // Set right-to-left
  XLSX.utils.book_append_sheet(wb, wsFinancial, 'الملخص المالي');

  // Generate file name and save
  const fileName = `attendance_${teacherName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
