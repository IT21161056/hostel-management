import { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2, DoorOpen, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/layouts/AdminLayout';
import Modal from '../../components/ui/Modal';
import { useModalState } from '../../hooks/useModalState';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import { Student, getStudents, createStudent, updateStudent, deleteStudent, assignStudentToRoom } from '../../services/studentService';
import { Room, getRooms } from '../../services/roomService';

// Student form data interface
interface StudentFormData {
  name: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  course: string;
  year: number;
  parentDetails: {
    name: string;
    phone: string;
    relationship: string;
    email: string;
  };
}

const StudentManagementPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    course: '',
    year: '',
    room: '',
  });

  // Modal states
  const addModal = useModalState();
  const editModal = useModalState<Student>();
  const deleteModal = useModalState<Student>();
  const assignRoomModal = useModalState<Student>();

  // Form states
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    gender: 'male',
    course: '',
    year: 1,
    parentDetails: {
      name: '',
      phone: '',
      relationship: '',
      email: '',
    },
  });

  const [selectedRoomId, setSelectedRoomId] = useState('');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsData, roomsData] = await Promise.all([
          getStudents(),
          getRooms()
        ]);
        setStudents(studentsData);
        setFilteredStudents(studentsData);
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load students data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter students when search term or filters change
  useEffect(() => {
    let result = students;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        student =>
          student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.course) {
      result = result.filter(student => student.course === filters.course);
    }
    if (filters.year) {
      result = result.filter(student => student.year === parseInt(filters.year));
    }
    if (filters.room) {
      if (filters.room === 'assigned') {
        result = result.filter(student => student.roomId !== null);
      } else if (filters.room === 'unassigned') {
        result = result.filter(student => student.roomId === null);
      }
    }

    setFilteredStudents(result);
  }, [students, searchTerm, filters]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      gender: 'male',
      course: '',
      year: 1,
      parentDetails: {
        name: '',
        phone: '',
        relationship: '',
        email: '',
      },
    });
  };

  // Open edit modal
  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      email: student.email,
      gender: student.gender,
      course: student.course,
      year: student.year,
      parentDetails: {
        name: student.parentDetails.name,
        phone: student.parentDetails.phone,
        relationship: student.parentDetails.relationship,
        email: student.parentDetails.email,
      },
    });
    editModal.open(student);
  };

  // Open assign room modal
  const openAssignRoomModal = (student: Student) => {
    setSelectedRoomId(student.roomId || '');
    assignRoomModal.open(student);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('parent.')) {
      const parentField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        parentDetails: {
          ...prev.parentDetails,
          [parentField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year' ? parseInt(value) : value,
      }));
    }
  };

  // Handle add student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newStudent = await createStudent({
        ...formData,
        roomId: null,
      });
      setStudents(prev => [...prev, newStudent]);
      toast.success('Student added successfully');
      addModal.close();
      resetForm();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
    }
  };

  // Handle update student
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.data) return;

    try {
      const updatedStudent = await updateStudent(editModal.data.id, formData);
      setStudents(prev =>
        prev.map(student => (student.id === updatedStudent.id ? { ...student, ...updatedStudent } : student))
      );
      toast.success('Student updated successfully');
      editModal.close();
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    }
  };

  // Handle delete student
  const handleDeleteStudent = async () => {
    if (!deleteModal.data) return;

    try {
      await deleteStudent(deleteModal.data.id);
      setStudents(prev => prev.filter(student => student.id !== deleteModal.data?.id));
      toast.success('Student deleted successfully');
      deleteModal.close();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  // Handle assign room
  const handleAssignRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignRoomModal.data) return;

    try {
      // Find the room to get the room number
      const room = rooms.find(r => r.id === selectedRoomId);
      if (!room && selectedRoomId) {
        throw new Error('Selected room not found');
      }

      const updatedStudent = await assignStudentToRoom(
        assignRoomModal.data.id, 
        selectedRoomId,
        room?.roomNumber || ''
      );
      
      setStudents(prev =>
        prev.map(student => (student.id === updatedStudent.id ? { ...student, ...updatedStudent } : student))
      );
      
      toast.success(selectedRoomId ? 'Room assigned successfully' : 'Room unassigned successfully');
      assignRoomModal.close();
    } catch (error) {
      console.error('Error assigning room:', error);
      toast.error('Failed to assign room');
    }
  };

  // Get available rooms (not at full capacity)
  const availableRooms = rooms.filter(room => room.occupancy < room.capacity);

  // Get unique courses and years for filters
  const uniqueCourses = Array.from(new Set(students.map(student => student.course)));
  const uniqueYears = Array.from(new Set(students.map(student => student.year))).sort();

  return (
    <AdminLayout title="Student Management">
      <div className="fade-in">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <SearchInput
              onSearch={setSearchTerm}
              placeholder="Search students..."
              className="w-full sm:w-80"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <button
                type="button"
                className="btn btn-outline flex items-center"
                onClick={() => document.getElementById('filtersDropdown')?.classList.toggle('hidden')}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              <div id="filtersDropdown" className="hidden absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-4 space-y-3">
                  <div>
                    <label className="form-label">Course</label>
                    <select 
                      className="form-input"
                      value={filters.course}
                      onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                    >
                      <option value="">All Courses</option>
                      {uniqueCourses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Year</label>
                    <select 
                      className="form-input"
                      value={filters.year}
                      onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                    >
                      <option value="">All Years</option>
                      {uniqueYears.map(year => (
                        <option key={year} value={year}>Year {year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Room Status</label>
                    <select 
                      className="form-input"
                      value={filters.room}
                      onChange={(e) => setFilters(prev => ({ ...prev, room: e.target.value }))}
                    >
                      <option value="">All Students</option>
                      <option value="assigned">Room Assigned</option>
                      <option value="unassigned">Room Not Assigned</option>
                    </select>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="button"
                      className="btn btn-outline w-full"
                      onClick={() => setFilters({ course: '', year: '', room: '' })}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              className="btn btn-primary flex items-center"
              onClick={() => {
                resetForm();
                addModal.open();
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </button>
          </div>
        </div>

        {/* Students Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No students found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ course: '', year: '', room: '' });
                }}
              >
                Clear search and filters
              </button>
            }
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Room</th>
                  <th>Parent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>Year {student.year}</td>
                    <td>
                      {student.roomNumber ? (
                        <span className="badge badge-success">{student.roomNumber}</span>
                      ) : (
                        <span className="badge badge-error">Not Assigned</span>
                      )}
                    </td>
                    <td>{student.parentDetails.name}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="p-1 text-blue-600 hover:text-blue-800"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-teal-600 hover:text-teal-800"
                          onClick={() => openAssignRoomModal(student)}
                        >
                          <DoorOpen className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-red-600 hover:text-red-800"
                          onClick={() => deleteModal.open(student)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Student Modal */}
        <Modal
          isOpen={addModal.isOpen}
          onClose={addModal.close}
          title="Add New Student"
          size="lg"
        >
          <form onSubmit={handleAddStudent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="course" className="form-label">Course</label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="year" className="form-label">Year</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </div>
            </div>
            
            <h3 className="text-md font-medium mt-6 mb-3 text-gray-900">Parent/Guardian Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="parent.name" className="form-label">Parent Name</label>
                <input
                  type="text"
                  id="parent.name"
                  name="parent.name"
                  value={formData.parentDetails.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="parent.phone" className="form-label">Parent Phone</label>
                <input
                  type="text"
                  id="parent.phone"
                  name="parent.phone"
                  value={formData.parentDetails.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="parent.relationship" className="form-label">Relationship</label>
                <input
                  type="text"
                  id="parent.relationship"
                  name="parent.relationship"
                  value={formData.parentDetails.relationship}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="parent.email" className="form-label">Parent Email</label>
                <input
                  type="email"
                  id="parent.email"
                  name="parent.email"
                  value={formData.parentDetails.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={addModal.close}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Student
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Student Modal */}
        <Modal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          title="Edit Student"
          size="lg"
        >
          <form onSubmit={handleUpdateStudent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-email" className="form-label">Email</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-gender" className="form-label">Gender</label>
                <select
                  id="edit-gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="edit-course" className="form-label">Course</label>
                <input
                  type="text"
                  id="edit-course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-year" className="form-label">Year</label>
                <select
                  id="edit-year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </div>
            </div>
            
            <h3 className="text-md font-medium mt-6 mb-3 text-gray-900">Parent/Guardian Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-parent-name" className="form-label">Parent Name</label>
                <input
                  type="text"
                  id="edit-parent-name"
                  name="parent.name"
                  value={formData.parentDetails.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-parent-phone" className="form-label">Parent Phone</label>
                <input
                  type="text"
                  id="edit-parent-phone"
                  name="parent.phone"
                  value={formData.parentDetails.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-parent-relationship" className="form-label">Relationship</label>
                <input
                  type="text"
                  id="edit-parent-relationship"
                  name="parent.relationship"
                  value={formData.parentDetails.relationship}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-parent-email" className="form-label">Parent Email</label>
                <input
                  type="email"
                  id="edit-parent-email"
                  name="parent.email"
                  value={formData.parentDetails.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={editModal.close}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Update Student
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Student Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          title="Delete Student"
          size="sm"
        >
          <div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <span className="font-semibold">{deleteModal.data?.name}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={deleteModal.close}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* Assign Room Modal */}
        <Modal
          isOpen={assignRoomModal.isOpen}
          onClose={assignRoomModal.close}
          title="Assign Room"
          size="md"
        >
          <form onSubmit={handleAssignRoom}>
            <div>
              <p className="text-gray-700 mb-4">
                Assign a room to <span className="font-semibold">{assignRoomModal.data?.name}</span>
              </p>
              
              <div className="mb-4">
                <label htmlFor="roomId" className="form-label">Select Room</label>
                <select
                  id="roomId"
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="form-input"
                >
                  <option value="">-- Unassign Room --</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber} ({room.type}, {room.occupancy}/{room.capacity} occupied)
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={assignRoomModal.close}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {selectedRoomId ? 'Assign Room' : 'Unassign Room'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default StudentManagementPage;