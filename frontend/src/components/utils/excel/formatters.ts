import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export const getStatusInArabic = (status: string): string => {
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

export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  return format(new Date(date), formatStr, { locale: ar });
};

export const formatMonthYear = (monthNumber: number, year: number): string => {
  return new Date(year, monthNumber - 1).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
};