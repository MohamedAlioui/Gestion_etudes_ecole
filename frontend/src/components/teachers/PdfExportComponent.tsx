import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfExportComponent = ({ data }) => {
  const handleGeneratePdf = () => {
    const element = document.getElementById('pdf-content');

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('attendance-report.pdf');
    });
  };

  return (
    <div>
      <div id="pdf-content" style={{ padding: '20px', background: 'white' }}>
        <h2 style={{ textAlign: 'center' }}>بطاقة حضور دروس التدارك</h2>
        <div>
          <p>المادة: {data.subject}</p>
          <p>المستوى: {data.level}</p>
          <p>الأستاذ: {data.teacherName}</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>القسم</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>المبلغ</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>الملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {data.records.map((record, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{record.class}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{record.amount}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{record.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px' }}>
          <p>المبلغ الإجمالي: {data.totalAmount}</p>
          <p>مناب الأستاذ (80%): {data.teacherShare}</p>
          <p>الخضم بعنوان خدمات (20%): {data.servicesFee}</p>
        </div>
      </div>
      <button
        onClick={handleGeneratePdf}
        style={{
          marginTop: '20px',
          background: 'blue',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        تحميل PDF
      </button>
    </div>
  );
};

export default PdfExportComponent;
