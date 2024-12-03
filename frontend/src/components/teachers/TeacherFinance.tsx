import { useEffect, useState } from "react";
import axios from "axios";
import { AttendanceHeader } from "./AttendanceHeader";
import AttendanceTable from "./AttendanceTable";
import { FinancialSummary } from "./FinancialSummary";
import { FinanceFilters } from "./FinanceFilters";
import { SessionStats } from "./SessionStats";
import Modal from "./Modal";
import { FileDown } from "lucide-react";
import { generateAttendanceExcel } from "../utils/excelGenerator";
import { generateTeacherFinancePDF } from "../utils/pdfGenerator"; // Path to the PDF generation file
import type { AttendanceData } from "../../types/attendance";

interface Etude {
  _id: string;
  className: string;
  matiere: string;
  niveau: string;
  enseignant: {
    nom_enseignant: string;
    prenom_enseignant: string;
  };
}

interface TeacherFinanceProps {
  teacherId: string;
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  teacherPrenom: string;
}

function TeacherFinance({ teacherId, isOpen, onClose, teacherName, teacherPrenom }: TeacherFinanceProps) {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1); // Add 1 month
  const newDate = currentDate.toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'

  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(newDate);
  const [selectedEtude, setSelectedEtude] = useState("");
  const [etudes, setEtudes] = useState<Etude[]>([]);
  const [data, setData] = useState<AttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  const fetchEtudes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/etudes`);
      const filteredEtudes = response.data.filter(
        (etude: Etude) => etude.enseignant._id === teacherId
      );
      setEtudes(filteredEtudes);
      if (filteredEtudes.length > 0) {
        setSelectedEtude(filteredEtudes[0]._id);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load études"));
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEtudes();
    }
  }, [isOpen, teacherId]);

  const processAttendanceData = (responseData: any) => {
    const uniqueStudents = new Map();
    const processedSessions = responseData.details.map((detail: any) => ({
      _id: detail.seance,
      date: detail.date,
      attendanceRecords: detail.presences.map((presence: any) => ({
        student: presence.eleve._id,
        status: presence.status,
      })),
    }));

    responseData.details.forEach((detail: any) => {
      detail.presences.forEach((presence: any) => {
        if (!uniqueStudents.has(presence.eleve._id)) {
          uniqueStudents.set(presence.eleve._id, {
            _id: presence.eleve._id,
            name: `${presence.eleve.nom_eleve} ${presence.eleve.prenom_eleve}`,
            class: presence.eleve.classe,
          });
        }
      });
    });

    return {
      students: Array.from(uniqueStudents.values()),
      sessions: processedSessions,
    };
  };

  const fetchData = async () => {
    if (!selectedEtude || !startDate || !endDate) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/finances/enseignant/${teacherId}/etude/${selectedEtude}`,
        {
          params: { start_date: startDate, end_date: endDate },
        }
      );

      const responseData = response.data;
      setData(responseData);

      const { students: processedStudents, sessions: processedSessions } =
        processAttendanceData(responseData);
      setStudents(processedStudents);
      setSessions(processedSessions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEtude && isOpen) {
      fetchData();
    }
  }, [selectedEtude, isOpen]);

  const handleExportExcel = () => {
    if (!data) return;

    const selectedEtudeData = etudes.find((e) => e._id === selectedEtude);
    generateAttendanceExcel({
      teacherName: `${teacherName} ${teacherPrenom}`,
      subject: selectedEtudeData?.matiere || "رياضيات",
      level: selectedEtudeData?.niveau || "السابعة أساسي",
      etudeName: selectedEtudeData?.className || selectedEtude,
      startDate,
      endDate,
      data,
    });
  };

  const handleExportPDF = () => {
    if (data) {
      generateTeacherFinancePDF(
        data,
        teacherName,
        teacherPrenom,
        selectedEtudeData,
        startDate,
        endDate
      );
    }
  };

  const selectedEtudeData = etudes.find((e) => e._id === selectedEtude);
  // No need to declare totalFinance if it's not used

  const teacherShare = data ? data.totalFinance * 0.8 : 0;
  const servicesFee = data ? data.totalFinance * 0.2 : 0;

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="المعلومات المالية" size="xl">
        <div className="flex items-center justify-center p-8">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"
            role="status"
          >
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="المعلومات المالية" size="xl">
        <div className="text-center p-8">
          <p className="text-xl text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`المعلومات المالية - ${teacherName} ${teacherPrenom}`}
      size="xl"
    >
      <div className="p-6">
        <FinanceFilters
          startDate={startDate}
          endDate={endDate}
          selectedEtude={selectedEtude}
          etudes={etudes}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onEtudeChange={setSelectedEtude}
          onSubmit={fetchData}
        />

        {data && (
          <>
            <div className="flex justify-end gap-2 mt-4 mb-6">
              <button
                onClick={handleExportExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FileDown size={20} />
                <span>تصدير Excel</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FileDown size={20} />
                <span>تصدير PDF</span>
              </button>
            </div>

            <div id="pdf-content" style={{ background: "white", padding: "20px" }}>
              <AttendanceHeader
                teacherName={`${teacherName} ${teacherPrenom}`}
                subject={selectedEtudeData?.matiere || "رياضيات"}
                level={selectedEtudeData?.niveau || "السابعة أساسي"}
                etudeName={selectedEtude}
              />

              <SessionStats details={data.details} />

              <AttendanceTable
                baseAmount={8.75}
                idEnseignant={teacherId}
                etudeid={selectedEtude}
                startDate={new Date(startDate)}
                endDate={new Date(endDate)}
              />

              <FinancialSummary
                totalAmount={data.totalFinance}
                teacherShare={teacherShare}
                servicesFee={servicesFee}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default TeacherFinance;
