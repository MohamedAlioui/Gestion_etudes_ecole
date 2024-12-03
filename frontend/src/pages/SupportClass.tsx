// src/components/SupportClassComponent.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import SupportClassModal from '../components/supportClass/SupportClassModal';
import SupportClassList from '../components/supportClass/SupportClassList';
import SearchBar from '../components/supportClass/SearchBar';
import { SupportClass } from '../types/etude';
import { Student } from '../types/student';

const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://gestion-etudes-ecole.vercel.app'}`;

const SupportClassComponent = () => {
  const [supportClasses, setSupportClasses] = useState<SupportClass[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<SupportClass | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentsForClassId, setShowStudentsForClassId] = useState<string | null>(null);

  useEffect(() => {
    fetchSupportClasses();
  }, []);

  const fetchSupportClasses = async () => {
    try {
      const response = await axios.get<SupportClass[]>(`${API_URL}/api/etudes`);
      setSupportClasses(
        response.data.map((classe) => ({
          ...classe,
          matiere: classe.matiere || '', // Ensure `matiere` is always a string
        }))
      );
    } catch (error) {
      console.error('Error fetching support classes:', error);
      setSupportClasses([]);
    }
  };

  const handleToggleStudents = async (classId: string) => {
    if (showStudentsForClassId === classId) {
      setShowStudentsForClassId(null);
    } else {
      setShowStudentsForClassId(classId);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    const confirmDelete = window.confirm('هل أنت متأكد من حذف هذا الصف؟');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/etudes/${classId}`);
      setSupportClasses((prevClasses) => prevClasses.filter((c) => c._id !== classId));
    } catch (error) {
      console.error(`Error deleting class with ID ${classId}:`, error);
    }
  };

  const handleAddStudentToClass = async (etudeId: string, studentId: string) => {
    try {
      // Fetch current etude data
      const response = await axios.get<SupportClass>(`${API_URL}/api/etudes/${etudeId}`);
      const currentEtude = response.data;

      // Add student to eleves array
      const updatedEleves = [...(currentEtude.eleves || []), studentId];

      // Update the etude
      await axios.put(`${API_URL}/api/etude/${etudeId}`, {
        ...currentEtude,
        eleves: updatedEleves
      });

      // Refresh the classes
      await fetchSupportClasses();
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const handleRemoveStudentFromClass = async (etudeId: string, studentId: string) => {
    try {
      // Use the dedicated endpoint for removing a student
      await axios.delete(`${API_URL}/api/etudes/${etudeId}/students/${studentId}`);
      
      // Refresh the classes
      await fetchSupportClasses();
    } catch (error) {
      console.error('Error removing student:', error);
      throw error;
    }
  };

  const handleRemoveAllStudents = async (etudeId: string) => {
    try {
      // Use the dedicated endpoint for removing all students
      await axios.delete(`${API_URL}/api/etude/${etudeId}/students`);
      
      // Refresh the classes
      await fetchSupportClasses();
      console.log('All students removed successfully');
    } catch (error) {
      console.error('Error removing all students:', error);
      throw error;
    }
  };

  const handleDeleteAllClasses = async () => {
    try {
      await axios.delete(`${API_URL}/api/etudes/all`);
      setSupportClasses([]); // Clear all classes from state
      setShowStudentsForClassId(null); // Reset selected class
    } catch (error) {
      console.error('Error deleting all classes:', error);
      throw error;
    }
  };

  const filteredClasses = supportClasses.filter(
    (classe) => classe.matiere && classe.matiere.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
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
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        <SupportClassList
          classes={filteredClasses}
          showStudentsForClassId={showStudentsForClassId}
          onToggleStudents={handleToggleStudents}
          onEditClass={(supportClass) => {
            setSelectedClass(supportClass);
            setIsModalOpen(true);
          }}
          onDeleteClass={handleDeleteClass}
          onAddStudentToClass={handleAddStudentToClass}
          onRemoveStudentFromClass={handleRemoveStudentFromClass}
          onRemoveAllStudents={handleRemoveAllStudents}
          onDeleteAllClasses={handleDeleteAllClasses}
        />
      </div>

      <SupportClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClass(null);
        }}
        onSubmitSuccess={fetchSupportClasses}
        supportClass={selectedClass}
      />
    </div>
  );
};

export default SupportClassComponent;
