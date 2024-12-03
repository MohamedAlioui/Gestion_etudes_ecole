import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AttendancePDF } from './AttendancePDF';
import { FileText } from 'lucide-react';

interface PDFExportButtonProps {
  teacherName: string;
  subject: string;
  level: string;
  etudeName: string;
  students: any[];
  sessions: any[];
  totalAmount: number;
  teacherShare: number;
  servicesFee: number;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  teacherName,
  subject,
  level,
  etudeName,
  students,
  sessions,
  totalAmount,
  teacherShare,
  servicesFee
}) => {
  // Only render the button if we have data
  if (!students.length || !sessions.length) {
    return null;
  }

  return (
    <PDFDownloadLink
      document={
        <AttendancePDF
          teacherName={teacherName}
          subject={subject}
          level={level}
          etudeName={etudeName}
          students={students}
          sessions={sessions}
          totalAmount={totalAmount}
          teacherShare={teacherShare}
          servicesFee={servicesFee}
        />
      }
      fileName={`attendance-${teacherName}-${new Date().toISOString().split('T')[0]}.pdf`}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
      {({ loading, error }) => 
        loading ? (
          <>
            <FileText className="w-5 h-5" />
            <span>جاري التحميل...</span>
          </>
        ) : error ? (
          <>
            <FileText className="w-5 h-5" />
            <span>خطأ في التحميل</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>تصدير PDF</span>
          </>
        )
      }
    </PDFDownloadLink>
  );
};