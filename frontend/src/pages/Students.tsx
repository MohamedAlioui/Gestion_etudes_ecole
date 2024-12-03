import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Eye, RefreshCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import StudentModal from '../components/students/StudentModal';
import StudentDetails from '../components/students/StudentDetails';
import ExcelImport from '../components/students/ExcelImport';
import { Student } from '../types/student';
import { Class } from '../types/class';

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [classId, setClassId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/eleves');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddOrUpdateStudent = async (student: Student) => {
    try {
      if (student._id) {
        // Mise à jour
        await axios.put(`http://localhost:3000/api/eleves/${student._id}`, student);
      } else {
        // Ajout
        await axios.post('http://localhost:3000/api/eleves', student);
      }
      setIsModalOpen(false);
      setSelectedStudent(null);
      setClassId(''); // Réinitialiser la sélection de classe
      setSelectedFile(null); // Réinitialiser le fichier sélectionné
      fetchStudents(); 
  
      // Rafraîchir la liste des élèves
      fetchStudents();
    } catch (error) {
      console.error('Erreur lors de l\'ajout ou de la mise à jour d\'un élève :', error);
    }
  };
  

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التلاميذ؟')) {
      try {
        await axios.delete(`http://localhost:3000/api/eleves/${id}`);
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleImportExcel = async () => {
    if (!classId) {
      alert('من فضلك اختر الصف');
      return;
    }
  
    if (!selectedFile) {
      alert('من فضلك اختر ملف Excel');
      return;
    }
  
    if (!['.xlsx', '.xls'].includes(selectedFile.name.slice(-5))) {
      alert('يرجى تحميل ملف Excel صالح');
      return;
    }
  
    setIsUploading(true);
  
    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      const studentsToImport = jsonData.map((row: any) => ({
        nom_eleve: row.nom_eleve || row['اسم العائلة'],
        prenom_eleve: row.prenom_eleve || row['الاسم الأول'],
        date_naissance: row.date_naissance || row['تاريخ الميلاد'],
        nom_parent: row.nom_parent || row['اسم ولي الأمر'],
        num_parent: row.num_parent || row['رقم الهاتف'],
        classe: classId,
      }));
  
      const response = await axios.post('http://localhost:3000/api/eleves/import', {
        students: studentsToImport,
        classId: classId,
      });
  
      if (response.status === 201) {
        alert('تم استيراد البيانات بنجاح!');
        fetchStudents();
        setClassId(''); // Réinitialiser la sélection de classe
        setSelectedFile(null); // Réinitialiser الملف المحدد        
      } else {
        throw new Error('Failed to import students');
      }
    } catch (error) {
      console.error('Error importing students:', error);
      alert('حدث خطأ أثناء استيراد البيانات. يرجى التحقق من تنسيق الملف والمحاولة مرة أخرى.');
    } finally {
      setIsUploading(false);
    }
  };
  

  const filteredStudents = students.filter((student) =>
    [student.nom_eleve, student.prenom_eleve]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة التلاميذ</h1>
        <div className="flex gap-4">
          <ExcelImport
            classes={classes}
            classId={classId}
            isUploading={isUploading}
            onFileSelect={setSelectedFile}
            onImport={handleImportExcel}
            onClassChange={setClassId}
          />
          <button
            onClick={() => {
              setSelectedStudent(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            <span>إضافة تلميذ</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن التلاميذ..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir="rtl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  رقم التلاميذ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الاسم الأول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  اسم العائلة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الصف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {student.prenom_eleve}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {student.nom_eleve}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {student.classe ? student.classe.nom_classe : 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3 space-x-reverse">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsViewMode(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsModalOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student._id!)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 dark:text-gray-300 py-4">
                    لا توجد بيانات لعرضها
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        onSubmit={handleAddOrUpdateStudent}
        student={selectedStudent}
        classes={classes}
      />

      <StudentDetails
        isOpen={isViewMode}
        onClose={() => {
          setIsViewMode(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        classes={classes}
      />
    </div>
  );
};

export default Students;
