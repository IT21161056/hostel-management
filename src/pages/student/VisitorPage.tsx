import { useState, useEffect } from 'react';
import { UserCheck, Search, Plus, UserX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import StudentLayout from '../../components/layouts/StudentLayout';
import Modal from '../../components/ui/Modal';
import { useModalState } from '../../hooks/useModalState';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import { useAuthStore } from '../../stores/authStore';
import { Visitor, getVisitorsByStudentId, createVisitor } from '../../services/visitorService';
import { Student, getStudentById } from '../../services/studentService';

interface VisitorFormData {
  name: string;
  phone: string;
  relationship: string;
  purpose: string;
}

const VisitorPage = () => {
  const { user } = useAuthStore();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });

  // Modal states
  const addModal = useModalState();
  const viewModal = useModalState<Visitor>();

  // Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VisitorFormData>();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // In a real app, these would use the actual user ID
        const [visitorsData, studentData] = await Promise.all([
          getVisitorsByStudentId('1'), // Mocked to use ID 1 for demo
          getStudentById('1'), // Mocked to use ID 1 for demo
        ]);
        
        setVisitors(visitorsData);
        setFilteredVisitors(visitorsData);
        setStudent(studentData);
      } catch (error) {
        console.error('Error fetching visitors data:', error);
        toast.error('Failed to load visitors');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filter visitors when search term or filters change
  useEffect(() => {
    let result = visitors;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        visitor =>
          visitor.name.toLowerCase().includes(term) ||
          visitor.relationship.toLowerCase().includes(term) ||
          visitor.purpose.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filters.status) {
      if (filters.status === 'active') {
        result = result.filter(visitor => visitor.checkOut === null);
      } else if (filters.status === 'checked-out') {
        result = result.filter(visitor => visitor.checkOut !== null);
      }
    }

    setFilteredVisitors(result);
  }, [visitors, searchTerm, filters]);

  // Submit new visitor
  const onSubmit = async (data: VisitorFormData) => {
    if (!student) return;
    
    try {
      const now = new Date().toISOString();
      
      const newVisitor = await createVisitor({
        name: data.name,
        phone: data.phone,
        relationship: data.relationship,
        purpose: data.purpose,
        studentId: student.id,
        studentName: student.name,
        checkIn: now,
        checkOut: null,
      });
      
      setVisitors(prev => [newVisitor, ...prev]);
      toast.success('Visitor entry added successfully');
      reset();
      addModal.close();
    } catch (error) {
      console.error('Error adding visitor:', error);
      toast.error('Failed to add visitor');
    }
  };

  return (
    <StudentLayout title="My Visitors">
      <div className="fade-in">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <SearchInput
              onSearch={setSearchTerm}
              placeholder="Search visitors..."
              className="w-full sm:w-80"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <select 
                className="form-input pr-8 py-2"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Visitors</option>
                <option value="active">Active Visitors</option>
                <option value="checked-out">Checked Out</option>
              </select>
            </div>
            
            <button
              type="button"
              className="btn btn-primary flex items-center"
              onClick={() => {
                reset();
                addModal.open();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Visitor Entry
            </button>
          </div>
        </div>

        {/* Visitors List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : filteredVisitors.length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No visitors found"
            description={
              searchTerm || filters.status
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't added any visitor entries yet."
            }
            action={
              searchTerm || filters.status ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ status: '' });
                  }}
                >
                  Clear search and filters
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    reset();
                    addModal.open();
                  }}
                >
                  Add visitor entry
                </button>
              )
            }
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Relationship</th>
                  <th>Purpose</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((visitor) => (
                  <tr 
                    key={visitor.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => viewModal.open(visitor)}
                  >
                    <td className="font-medium">{visitor.name}</td>
                    <td>{visitor.relationship}</td>
                    <td>{visitor.purpose}</td>
                    <td>{format(new Date(visitor.checkIn), 'MMM d, yyyy h:mm a')}</td>
                    <td>
                      {visitor.checkOut 
                        ? format(new Date(visitor.checkOut), 'MMM d, yyyy h:mm a') 
                        : '-'}
                    </td>
                    <td>
                      {visitor.checkOut === null ? (
                        <span className="badge badge-success flex items-center">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="badge badge-info flex items-center">
                          <UserX className="h-3 w-3 mr-1" />
                          Checked Out
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Visitor Modal */}
        <Modal
          isOpen={addModal.isOpen}
          onClose={addModal.close}
          title="Add Visitor Entry"
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="form-label">Visitor Name</label>
                <input
                  id="name"
                  type="text"
                  className={`form-input ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Full name of the visitor"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  className={`form-input ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Visitor's phone number"
                  {...register('phone', { required: 'Phone number is required' })}
                />
                {errors.phone && <p className="form-error">{errors.phone.message}</p>}
              </div>
              
              <div>
                <label htmlFor="relationship" className="form-label">Relationship</label>
                <input
                  id="relationship"
                  type="text"
                  className={`form-input ${errors.relationship ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., Parent, Sibling, Friend"
                  {...register('relationship', { required: 'Relationship is required' })}
                />
                {errors.relationship && <p className="form-error">{errors.relationship.message}</p>}
              </div>
              
              <div>
                <label htmlFor="purpose" className="form-label">Purpose of Visit</label>
                <input
                  id="purpose"
                  type="text"
                  className={`form-input ${errors.purpose ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., Dropping off supplies, Weekend visit"
                  {...register('purpose', { required: 'Purpose is required' })}
                />
                {errors.purpose && <p className="form-error">{errors.purpose.message}</p>}
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
                Add Visitor
              </button>
            </div>
          </form>
        </Modal>

        {/* View Visitor Modal */}
        <Modal
          isOpen={viewModal.isOpen}
          onClose={viewModal.close}
          title="Visitor Details"
          size="md"
        >
          {viewModal.data && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Visitor Name</p>
                  <p className="font-medium">{viewModal.data.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{viewModal.data.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p className="font-medium">{viewModal.data.relationship}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="font-medium">{viewModal.data.purpose}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Check In</p>
                  <p className="font-medium">{format(new Date(viewModal.data.checkIn), 'MMMM d, yyyy h:mm a')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Check Out</p>
                  <p className="font-medium">
                    {viewModal.data.checkOut
                      ? format(new Date(viewModal.data.checkOut), 'MMMM d, yyyy h:mm a')
                      : 'Not checked out yet'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {viewModal.data.checkOut === null ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-info">Checked Out</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={viewModal.close}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </StudentLayout>
  );
};

export default VisitorPage;