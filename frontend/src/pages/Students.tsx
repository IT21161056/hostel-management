import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import StudentTable from '../components/Students/StudentTable';
import AddStudentModal from '../components/Students/AddStudentModal';
import { Student } from '../types';

export default function Students() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    console.log('Adding new student:', studentData);
    // This will be handled by the StudentTable component
  };

  return (
    <div className="space-y-6">
      <StudentTable />

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStudent}
      />
    </div>
  );
}