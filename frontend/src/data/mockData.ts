import { Student, Study, Session } from '../types/sessions';

export const mockStudents: Student[] = [
  { _id: '1', name: 'أحمد محمد', class: 'الصف العاشر - أ' },
  { _id: '2', name: 'سارة علي', class: 'الصف العاشر - أ' },
  { _id: '3', name: 'محمد خالد', class: 'الصف العاشر - أ' },
  { _id: '4', name: 'فاطمة أحمد', class: 'الصف العاشر - أ' },
  { _id: '5', name: 'عمر حسن', class: 'الصف العاشر - أ' },
];

export const mockStudies: Study[] = [
  {
    _id: '1',
    name: 'الرياضيات',
    class: 'الصف العاشر - أ',
    teacher: 'أحمد محمد'
  },
  {
    _id: '2',
    name: 'الفيزياء',
    class: 'الصف الحادي عشر - ب',
    teacher: 'سارة علي'
  },
  {
    _id: '3',
    name: 'اللغة العربية',
    class: 'الصف العاشر - ب',
    teacher: 'محمد أحمد'
  }
];

export const mockSessions: Session[] = [
  {
    _id: '1',
    date: '٢٠٢٤/٠٣/١٥',
    time: '١٠:٠٠ - ١١:٣٠',
    study: mockStudies[0],
    attendanceList: mockStudents.slice(0, 3).map(student => ({
      student,
      status: 'غائب'
    }))
  },
  {
    _id: '2',
    date: '٢٠٢٤/٠٣/١٥',
    time: '٠٩:٠٠ - ١٠:٣٠',
    study: mockStudies[1],
    attendanceList: mockStudents.slice(2, 5).map(student => ({
      student,
      status: 'حاضر'
    }))
  }
];