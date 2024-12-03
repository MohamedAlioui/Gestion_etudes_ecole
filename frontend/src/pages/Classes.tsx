import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Eye, User } from 'lucide-react';
import ClassModal from '../components/classes/ClassModal';
import ClassDetails from '../components/classes/ClassDetails';
import { Class } from '../types/class';
import { Student } from '../types/student';

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<Record<string, Student[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentsForClassId, setShowStudentsForClassId] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/classes`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setClasses(response.data);
        } else {
          console.error('API response is not an array:', response.data);
          setClasses([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
        setClasses([]);
      });
  };

  const fetchStudentsByClass = (classId: string) => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/eleves?classId=${classId}`)
      .then((response) => {
        setStudentsByClass((prev) => ({
          ...prev,
          [classId]: response.data,
        }));
      })
      .catch((error) => {
        console.error('Error fetching students by class:', error);
        setStudentsByClass((prev) => ({
          ...prev,
          [classId]: [],
        }));
      });
  };

  const handleToggleStudents = (classId: string) => {
    if (showStudentsForClassId === classId) {
      setShowStudentsForClassId(null);
    } else {
      if (!studentsByClass[classId]) {
        fetchStudentsByClass(classId);
      }
      setShowStudentsForClassId(classId);
    }
  };

  const handleAddOrUpdateClass = (classe: Class) => {
    if (classe._id) {
      // Si c'est une mise à jour
      axios
        .put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/classes/${classe._id}`, classe)
        .then(() => {
          fetchClasses(); // Recharger les classes après la mise à jour
        })
        .catch((error) => console.error('Error updating class:', error));
    } else {
      // Si c'est un ajout
      axios
        .post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/classes`, classe)
        .then(() => {
          fetchClasses(); // Recharger les classes après l'ajout
        })
        .catch((error) => console.error('Error adding class:', error));
    }
  
    setIsModalOpen(false);
    setSelectedClass(null);
  };
  

  const handleDeleteClass = (classId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الصف؟')) {
      axios
        .delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}/api/classes/${classId}`)
        .then(() => {
          setClasses(classes.filter((classe) => classe._id !== classId));
          setStudentsByClass((prev) => {
            const updatedStudents = { ...prev };
            delete updatedStudents[classId];
            return updatedStudents;
          });
        })
        .catch((error) => {
          console.error('Error deleting class:', error);
        });
    }
  };

  const handleAddStudent = (newStudent: Student, classId: string) => {
    // Update the students list directly without fetching again
    setStudentsByClass((prev) => {
      const updatedStudents = { ...prev };
      if (updatedStudents[classId]) {
        updatedStudents[classId] = [...updatedStudents[classId], newStudent]; // Append the new student
      } else {
        updatedStudents[classId] = [newStudent]; // Add the student if no students were fetched before
      }
      return updatedStudents;
    });

    // Optionally, you could call fetchStudentsByClass again here if you want to ensure that the server reflects the latest data.
    // fetchStudentsByClass(classId);
  };

  const filteredClasses = classes.filter((classe) =>
    classe.nom_classe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الصفوف</h1>
        <button
          onClick={() => {
            setSelectedClass(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>إضافة صف</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن صف..."
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
                  رقم الصف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المستوى
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  اسم الصف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClasses.map((classe, index) => (
                <React.Fragment key={classe._id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {classe.niveau_classe}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {classe.nom_classe}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3 space-x-reverse">
                        <button
                          onClick={() => handleToggleStudents(classe._id)}
                          className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                        >
                          <User size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClass(classe);
                            setIsViewMode(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClass(classe);
                            setIsModalOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(classe._id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {showStudentsForClassId === classe._id &&
                    studentsByClass[classe._id]?.map((student) => (
                      <tr key={student._id} className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan={4} className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {student.prenom_eleve} {student.nom_eleve} - {student.date_naissance}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClass(null);
        }}
        onSubmit={handleAddOrUpdateClass}
        classe={selectedClass}
      />

      <ClassDetails
        isOpen={isViewMode}
        onClose={() => {
          setIsViewMode(false);
          setSelectedClass(null);
        }}
        classe={selectedClass}
      />
    </div>
  );
};

export default Classes;
