import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, User, Plus, X } from 'lucide-react';
import type { SupportClass } from '../../types/etude';
import type { Student } from '../../types/student';

interface ApiClass {
  _id: string;
  nom_classe: string;
  niveau: string;
}

interface ApiStudent {
  _id: string;
  prenom_eleve: string;
  nom_eleve: string;
}

interface SupportClassListProps {
  classes: SupportClass[];
  showStudentsForClassId: string | null;
  onToggleStudents: (classId: string) => void;
  onEditClass: (supportClass: SupportClass) => void;
  onDeleteClass: (classId: string) => void;
  onAddStudentToClass: (classId: string, studentId: string) => Promise<void>;
  onRemoveStudentFromClass: (classId: string, studentId: string) => Promise<void>;
  onCreateSeance: (etudeId: string) => Promise<void>;
}

const SupportClassList: React.FC<SupportClassListProps> = ({
  classes,
  showStudentsForClassId,
  onToggleStudents,
  onEditClass,
  onDeleteClass,
  onAddStudentToClass,
  onRemoveStudentFromClass,
  onCreateSeance,
}) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [selectedEtudeId, setSelectedEtudeId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [availableClasses, setAvailableClasses] = useState<ApiClass[]>([]);
  const [availableStudents, setAvailableStudents] = useState<ApiStudent[]>([]);
  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingClassStudents, setIsLoadingClassStudents] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [studentError, setStudentError] = useState<string | null>(null);

  useEffect(() => {
    if (isPopUpOpen) {
      fetchClasses();
    }
  }, [isPopUpOpen]);

  useEffect(() => {
    if (selectedClassId) {
      fetchAvailableStudents();
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (showStudentsForClassId) {
      fetchStudentsForEtude(showStudentsForClassId);
    }
  }, [showStudentsForClassId]);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setAvailableClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching classes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableStudents = async () => {
    if (!selectedClassId) return;
    
    setIsLoadingStudents(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/eleves/classe/${selectedClassId}`);
      if (!response.ok) throw new Error('Failed to fetch available students');
      const data = await response.json();
      setAvailableStudents(data || []);
    } catch (err) {
      setStudentError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching students:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchStudentsForEtude = async (etudeId: string) => {
    setIsLoadingClassStudents(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/etudes/${etudeId}/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudentsInClass(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudentsInClass([]);
    } finally {
      setIsLoadingClassStudents(false);
    }
  };

  const handlePopUpToggle = (etudeId: string) => {
    setSelectedEtudeId(etudeId);
    setIsPopUpOpen(!isPopUpOpen);
    if (!isPopUpOpen) {
      fetchStudentsForEtude(etudeId);
    }
  };

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddStudents = async () => {
    if (!selectedEtudeId || selectedStudentIds.length === 0) {
      console.error('Missing required data for adding students');
      return;
    }
  
    setIsAddingStudent(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/etudes/${selectedEtudeId}`);
      if (!response.ok) throw new Error('Failed to fetch etude class');
      
      const etudeClass: SupportClass = await response.json();
      const updatePayload = {
        ...etudeClass,
        eleves: [...new Set([...(etudeClass.eleves || []), ...selectedStudentIds])],
      };

      const updateResponse = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/etudes/${selectedEtudeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!updateResponse.ok) throw new Error('Failed to update etude class');

      alert(`تمت إضافة ${selectedStudentIds.length} طالب بنجاح`);
      setIsPopUpOpen(false);
      setSelectedStudentIds([]);
      await fetchStudentsForEtude(selectedEtudeId);
    } catch (error) {
      console.error('Error adding students:', error);
      alert('فشل في إضافة الطلاب');
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedEtudeId) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/etudes/${selectedEtudeId}/students/${studentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove student');

      await fetchStudentsForEtude(selectedEtudeId);
      await onRemoveStudentFromClass(selectedEtudeId, studentId);
      alert('تم إزالة الطالب بنجاح');
    } catch (error) {
      console.error('Error removing student:', error);
      alert('فشل في إزالة الطالب');
    }
  };

  const handleRemoveAllStudents = async () => {
    if (!selectedEtudeId) return;

    const confirmDelete = window.confirm('هل أنت متأكد من حذف جميع الطلاب؟');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/etudes/${selectedEtudeId}/students`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove all students');

      await fetchStudentsForEtude(selectedEtudeId);
      alert('تم إزالة جميع الطلاب بنجاح');
    } catch (error) {
      console.error('Error removing all students:', error);
      alert('فشل في إزالة الطلاب');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              رقم الصف
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              اسم الصف
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              المادة
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              الأستاذ
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              المستوى
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {classes.map((classe, index) => (
            <React.Fragment key={classe._id?.toString()}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classe.className}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classe.matiere}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classe.enseignant
                    ? `${classe.enseignant.nom_enseignant} ${classe.enseignant.prenom_enseignant}`
                    : 'غير متوفر'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {classe.niveau}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3 space-x-reverse">
                    <button
                      onClick={() => onToggleStudents(classe._id?.toString() || '')}
                      className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                      title="عرض الطلاب"
                    >
                      <User size={18} />
                    </button>
                    <button
                      onClick={() => onEditClass(classe)}
                      className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                      title="تعديل"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteClass(classe._id?.toString() || '')}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => handlePopUpToggle(classe._id?.toString() || '')}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-1"
                      title="إدارة الطلاب"
                    >
                      <Plus size={16} />
                      <span>إدارة الطلاب</span>
                    </button>
                    <button
                      onClick={() => onCreateSeance(classe._id?.toString() || '')}
                      className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400"
                      title="إنشاء حصة"
                    >
                      إنشاء حصة
                    </button>
                  </div>
                </td>
              </tr>
              {showStudentsForClassId === classe._id?.toString() && (
                <tr>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">قائمة الطلاب:</h4>
                      {isLoadingClassStudents ? (
                        <div className="text-center py-2">جاري تحميل الطلاب...</div>
                      ) : studentsInClass.length > 0 ? (
                        <ul className="space-y-2">
                          {studentsInClass.map(student => (
                            <li 
                              key={student._id?.toString()} 
                              className="flex justify-between items-center text-sm p-2 bg-white dark:bg-gray-600 rounded-lg"
                            >
                              <span>{student.prenom_eleve} {student.nom_eleve}</span>
                              <button
                                onClick={() => handleRemoveStudent(student._id?.toString() || '')}
                                className="text-red-600 hover:text-red-800 px-2 py-1 rounded flex items-center gap-1"
                              >
                                <X size={16} />
                                <span>إزالة</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">لا يوجد طلاب مسجلين في هذا الصف</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {isPopUpOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">إدارة الطلاب في الصف</h2>
              <button
                onClick={() => setIsPopUpOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">اختر الصف</h3>
                {isLoading ? (
                  <div className="text-center py-2">جاري التحميل...</div>
                ) : error ? (
                  <div className="text-red-500 py-2">{error}</div>
                ) : (
                  <select
                    value={selectedClassId || ''}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر صفاً</option>
                    {availableClasses.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.nom_classe}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedClassId && (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">الطلاب الحاليون</h3>
                      {studentsInClass.length > 0 && (
                        <button
                          onClick={handleRemoveAllStudents}
                          className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded border border-red-600 hover:bg-red-50 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          <span>حذف الكل</span>
                        </button>
                      )}
                    </div>
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                      {isLoadingClassStudents ? (
                        <div className="text-center py-2">جاري تحميل الطلاب...</div>
                      ) : studentsInClass.length > 0 ? (
                        <ul className="space-y-2">
                          {studentsInClass.map(student => (
                            <li 
                              key={student._id?.toString()} 
                              className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg"
                            >
                              <span>{student.prenom_eleve} {student.nom_eleve}</span>
                              <button
                                onClick={() => handleRemoveStudent(student._id?.toString() || '')}
                                className="text-red-600 hover:text-red-800 px-2 py-1 rounded flex items-center gap-1"
                              >
                                <X size={16} />
                                <span>إزالة</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">
                          لا يوجد طلاب مسجلين في هذا الصف
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">إضافة طلاب جدد</h3>
                    {isLoadingStudents ? (
                      <div className="text-center py-2">جاري تحميل الطلاب...</div>
                    ) : studentError ? (
                      <div className="text-red-500 py-2">{studentError}</div>
                    ) : (
                      <div className="space-y-4">
                        <div className="max-h-60 overflow-y-auto border rounded-lg">
                          {availableStudents.map((student) => (
                            <div
                              key={student._id}
                              className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${
                                selectedStudentIds.includes(student._id) ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => handleStudentSelection(student._id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedStudentIds.includes(student._id)}
                                onChange={() => handleStudentSelection(student._id)}
                                className="ml-3"
                              />
                              <span>{student.prenom_eleve} {student.nom_eleve}</span>
                            </div>
                          ))}
                          {availableStudents.length === 0 && (
                            <p className="text-sm text-gray-500 p-3 text-center">
                              لا يوجد طلاب متاحين للإضافة
                            </p>
                          )}
                        </div>

                        <button
                          onClick={handleAddStudents}
                          disabled={selectedStudentIds.length === 0 || isAddingStudent}
                          className={`w-full p-2 rounded-lg flex items-center justify-center gap-2 ${
                            selectedStudentIds.length === 0 || isAddingStudent
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          <Plus size={20} />
                          <span>
                            {isAddingStudent
                              ? 'جاري الإضافة...'
                              : `إضافة ${selectedStudentIds.length} طالب`}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportClassList;