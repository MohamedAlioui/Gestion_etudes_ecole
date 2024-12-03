import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Wallet } from 'lucide-react';
import TeacherModal from '../components/teachers/TeacherModal';
import TeacherDetails from '../components/teachers/TeacherDetails';
import axios from 'axios';
import { Teacher } from '../types/teacher';
import TeacherFinance from '../components/teachers/TeacherFinance';

const TeacherPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [financeTeacher, setFinanceTeacher] = useState<Teacher | null>(null);

  const API = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const fetchTeachers = async () => {
    try {
      const response = await API.get('/enseignants');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (teacher: Teacher) => {
    try {
      const response = await API.post('/enseignants', teacher);
      setTeachers([...teachers, response.data]);
      setIsModalOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const handleEditTeacher = async (teacher: Teacher) => {
    try {
      const response = await API.put(`/enseignants/${teacher._id}`, teacher);
      setTeachers(
        teachers.map((t) => (t._id === teacher._id ? response.data : t))
      );
      setIsModalOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const handleDeleteTeacher = async (_id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الاستاذ؟')) {
      try {
        await API.delete(`/enseignants/${_id}`);
        setTeachers(teachers.filter((t) => t._id !== _id));
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  const handleOpenFinanceModal = (teacher: Teacher) => {
    setFinanceTeacher(teacher);
    setIsFinanceModalOpen(true);
  };

  const handleCloseFinanceModal = () => {
    setIsFinanceModalOpen(false);
    setFinanceTeacher(null);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      (teacher.nom_enseignant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.prenom_enseignant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.numero_telephone.includes(searchTerm)) &&
      (!selectedSubject || teacher.matiere === selectedSubject)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الأساتذة</h1>
        <button
          onClick={() => {
            setSelectedTeacher(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>إضافة أستاذ</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن أستاذ..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            dir="rtl"
          />
        </div>
        <select
          className="w-56 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">كل المواد</option>
          <option value="Arabic">اللغة العربية</option>
          <option value="Francais">اللغة الفرنسية</option>
          <option value="Mathematique">الرياضيات</option>
          <option value="ScienceVieTerre">علوم الحياة و الأرض</option>
          <option value="Anglais">الإنجليزية</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الاسم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                المادة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                رقم الهاتف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {teacher.nom_enseignant} {teacher.prenom_enseignant}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {teacher.matiere}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {teacher.numero_telephone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3 space-x-reverse">
                    <button
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setIsViewMode(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setIsModalOpen(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher._id)}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenFinanceModal(teacher)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Wallet size={20} />
                      <span>المعلومات المالية</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTeacher(null);
        }}
        onSubmit={selectedTeacher ? handleEditTeacher : handleAddTeacher}
        teacher={selectedTeacher}
      />

      <TeacherDetails
        isOpen={isViewMode}
        onClose={() => {
          setIsViewMode(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
      />

      {financeTeacher && (
        <TeacherFinance
          isOpen={isFinanceModalOpen}
          onClose={handleCloseFinanceModal}
          teacherName={financeTeacher.nom_enseignant}
          teacherPrenom={financeTeacher.prenom_enseignant}
          teacherId={financeTeacher._id}
        />
      )}
    </div>
  );
};

export default TeacherPage;