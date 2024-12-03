import React, { useState } from 'react';
import SupportClassList from './SupportClassList'; // Import the SupportClassList component
import { Student } from '../../types/student'; // Assuming you have a Student type

const ParentComponent = () => {
  // State for managing modal visibility and selected students
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);

  // Example classes and students data (you could fetch this data from an API)
  const classes = [
    { _id: 'class1', matiere: 'Math', niveau: 'Grade 10', nomClasse: 'Class A' },
    { _id: 'class2', matiere: 'Science', niveau: 'Grade 11', nomClasse: 'Class B' }
  ];
  const studentsByClass = {
    class1: [
      { _id: 'student1', prenom_eleve: 'Ali', nom_eleve: 'Mohamed', date_naissance: '2000-01-01' }
    ],
    class2: [
      { _id: 'student2', prenom_eleve: 'Sara', nom_eleve: 'Ahmed', date_naissance: '2001-05-12' }
    ]
  };

  // Function to handle adding a student
  const handleAddStudent = (classId: string) => {
    setSelectedClassId(classId); // Set the class ID
    setStudentModalOpen(true); // Open the modal
    // Fetch available students (this could be an API call)
    setAvailableStudents([
      { _id: 'student1', prenom_eleve: 'Ali', nom_eleve: 'Mohamed', date_naissance: '2000-01-01' },
      { _id: 'student2', prenom_eleve: 'Sara', nom_eleve: 'Ahmed', date_naissance: '2001-05-12' },
    ]);
  };

  // Function to handle student selection
  const handleSelectStudent = (student: Student) => {
    setSelectedStudents(prevState => {
      // If the student is already selected, remove them, otherwise add them
      if (prevState.find(s => s._id === student._id)) {
        return prevState.filter(s => s._id !== student._id);
      }
      return [...prevState, student];
    });
  };

  // Function to confirm adding selected students to the class
  const handleConfirmAddStudents = () => {
    console.log('Students added to class:', selectedStudents);
    // Close the modal after adding students
    setStudentModalOpen(false);
    setSelectedStudents([]); // Clear selected students
  };

  return (
    <div>
      <SupportClassList
        classes={classes}
        studentsByClass={studentsByClass}
        showStudentsForClassId={null}
        onToggleStudents={() => {}}
        onEditClass={() => {}}
        onDeleteClass={() => {}}
        onManageStudents={() => {}}
        onAddStudent={handleAddStudent} // Pass the function to SupportClassList
      />

      {/* Modal to show available students */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Select Students to Add</h2>
            <div className="space-y-3">
              {availableStudents.map(student => (
                <div key={student._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStudents.some(s => s._id === student._id)}
                    onChange={() => handleSelectStudent(student)}
                    className="mr-2"
                  />
                  <span>
                    {student.prenom_eleve} {student.nom_eleve} - {student.date_naissance}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStudentModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleConfirmAddStudents}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
