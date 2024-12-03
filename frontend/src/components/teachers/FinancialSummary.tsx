import React from 'react';
import { Calendar } from 'lucide-react';

interface FinancialSummaryProps {
  totalAmount: number;
  teacherShare: number;
  servicesFee: number;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalAmount,
  teacherShare,
  servicesFee,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <div className="mb-2">
          <span className="font-bold">المبلغ الجملي:</span> {(totalAmount /65)*100}
        </div>
        <div className="mb-2">
          <span className="font-bold">مناب الأستاذ (80%):</span> {(totalAmount /65)*80}
        </div>
        <div>
          <span className="font-bold">الخصم بعنوان خدمات (20%):</span> {(totalAmount /65)*20}
        </div>
      </div>
      
      <div className="text-right">
        <div className="mb-4">
          <div>إني الممضي أسفله</div>
          <div>أشهد أني تسلمت المبلغ {totalAmount.toFixed(3)}</div>
        </div>
        <div className="flex justify-end items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('ar-TN')}</span>
        </div>
        <div className="mt-2">الإمضاء</div>
      </div>
    </div>
  );
};