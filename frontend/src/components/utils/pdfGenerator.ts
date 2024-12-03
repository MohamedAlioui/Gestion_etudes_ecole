import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateTeacherFinancePDF = async (data: any, teacherName: string, teacherPrenom: string, etudeData: any, startDate: string, endDate: string) => {
  const element = document.getElementById("pdf-content");
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`Teacher_Finance_${teacherName}_${etudeData?.matiere || "Subject"}.pdf`);
};
