import { Month, Student } from '../../types/attendance';

export interface ExcelSheetConfig {
  name: string;
  data: any[][];
}

export interface ExcelGeneratorOptions {
  month: Month;
  students: Student[];
  locale?: string;
}