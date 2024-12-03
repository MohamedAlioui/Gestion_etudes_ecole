import React, { useState } from 'react';
import { Plus, FileDown, UserPlus } from 'lucide-react';
import { SessionCell } from '../components/seances/SessionCell';
import { AddMonthModal } from '../components/seances/AddMonthModal';
import { AddStudentModal } from '../components/seances/AddStudentModal';
import { exportToExcel } from '../components/utils/excelExport';
import { useStore } from '../components/store/useStore';

const CLASS_LEVELS = [
  'السنة السابعة اساسي',
  'السنة الثامنة اساسي',
  'السنة التاسعة اساسي',
];

function Seance() {
  const { students, months, addStudent, addMonth, updateSessionAttendance } = useStore();
  const [isAddMonthModalOpen, setIsAddMonthModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const filteredMonths = months.filter(month => 
    (selectedYear === 0 || month.year === selectedYear) &&
    (selectedMonth === 0 || month.monthNumber === selectedMonth)
  );

  const handleExportMonth = (month: Month, format: 'excel' | 'pdf') => {
    if (format === 'excel') {
      generateExcel({ month, students });
    } else {
      generatePDF({ month, students });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">نظام تتبع الحضور</h1>
          <div className="flex gap-4">
            <div className="flex gap-4">
              <button 
                onClick={() => setIsAddStudentModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserPlus size={20} />
                إضافة تلميذ
              </button>
              <button 
                onClick={() => setIsAddMonthModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                إضافة شهر جديد
              </button>
            </div>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm"
            >
              <option value={0}>كل السنوات</option>
              {Array.from(new Set(months.map(m => m.year))).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm"
            >
              <option value={0}>كل الشهور</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleDateString('ar-TN', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-4 text-right">اسم القسم</th>
                  <th className="py-3 px-4 text-right">الشهر</th>
                  <th colSpan={4} className="py-3 px-4 text-center border-l border-gray-700">
                    الحصص
                  </th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
                <tr className="bg-gray-100">
                  <th></th>
                  <th></th>
                  <th></th>
                  <th className="py-2 px-4">رقم الحصة</th>
                  <th className="py-2 px-4">التاريخ و الوقت</th>
                  <th className="py-2 px-4">الحضور</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredMonths.map((month) => (
                  <React.Fragment key={month.id}>
                    <tr className="border-t border-gray-200">
                      <td rowSpan={5} className="border-r border-gray-200 text-center">
                        {month.classLevel}
                      </td>
                      <td rowSpan={5} className="border-r border-gray-200 text-center">
                        {new Date(2024, month.monthNumber - 1).toLocaleDateString('ar-TN', { month: 'long' })} {month.year}
                      </td>
                      <td colSpan={4}></td>
                      <td rowSpan={5} className="border-l border-gray-200 px-4 py-2">
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleExportMonth(month, 'excel')}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-all text-sm"
                          >
                            <FileDown size={14} />
                            تصدير Excel
                          </button>
                          <button 
                            onClick={() => handleExportMonth(month, 'pdf')}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-all text-sm"
                          >
                            <FilePdf size={14} />
                            تصدير PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                    {month.sessions.map((session) => {
                      const classStudents = students.filter(s => s.classLevel === month.classLevel);
                      return (
                        <SessionCell 
                          key={session.id}
                          sessionId={session.id}
                          date={session.date}
                          heure={session.heure}
                          students={classStudents}
                          attendance={session.attendance}
                          onUpdateSession={(data) => {
                            if (data.attendance) {
                              updateSessionAttendance(month.id, session.id, data.attendance);
                            }
                          }}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AddMonthModal
          isOpen={isAddMonthModalOpen}
          onClose={() => setIsAddMonthModalOpen(false)}
          onAdd={addMonth}
        />
        <AddStudentModal
          isOpen={isAddStudentModalOpen}
          onClose={() => setIsAddStudentModalOpen(false)}
          onAdd={addStudent}
          classLevels={CLASS_LEVELS}
        />
      </div>
    </div>
  );
}

export default Seance;