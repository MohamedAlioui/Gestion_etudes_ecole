import * as XLSX from 'xlsx';
import { Month, Student } from '../../types/attendance';
import { ExcelGeneratorOptions, ExcelSheetConfig } from './types';
import { createHeaderSheet, createAttendanceSheet, createSessionSheets } from './sheets';
import { formatMonthYear } from './formatters';

export const generateExcel = ({ month, students }: ExcelGeneratorOptions): void => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Generate all sheets
  const sheets: ExcelSheetConfig[] = [
    createHeaderSheet(month),
    createAttendanceSheet(month, students),
    ...createSessionSheets(month, students)
  ];

  // Add all sheets to workbook
  sheets.forEach(sheet => {
    const ws = XLSX.utils.aoa_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  // Generate filename and save
  const fileName = `تقرير_الحضور_${month.classLevel}_${formatMonthYear(month.monthNumber, month.year)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};