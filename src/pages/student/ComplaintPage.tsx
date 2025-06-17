import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, Search, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import StudentLayout from '../../components/layouts/StudentLayout';
import Modal from '../../components/ui/Modal';
import { useModalState } from '../../hooks/useModalState';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import { useAuthStore } from '../../stores/authStore';
import { Complaint, getComplaintsByStudentId, createComplaint } from '../../services/complaintService';
import { Student, getStudentById } from '../../services/studentService';
import { COMPLAINT_STATUS } from '../../config/constants';

interface ComplaintFormData {
  title: string;
  description: string;
}

const ComplaintPage = () => {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });

  // Modal states
  const addModal = useModalState();
  const viewModal = useModalState<Complaint>();

  // Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComplaintFormData>();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // In a real app, these would use the actual user ID
        const [complaintsData, studentData] = await Promise.all([
          getComplaintsByStudentId('1'), // Mocked to use ID 1 for demo
          getStudentById('1'), // Mocked to use ID 1 for demo
        ]);
        
        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
        setStudent(studentData);
      } catch (error) {
        console.error('Error fetching complaints data:', error);
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filter complaints when search term or filters change
  useEffect(() => {
    let result = complaints;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        complaint =>
          complaint.title.toLowerCase().includes(term) ||
          complaint.description.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(complaint => complaint.status === filters.status);
    }

    setFilteredComplaints(result);
  }, [complaints, searchTerm, filters]);

  // Submit new complaint
  const onSubmit = async (data: ComplaintFormData) => {
    if (!student) return;
    
    try {
      const newComplaint = await createComplaint({
        title: data.title,
        description: data.description,
        studentId: student.id,
        studentName: student.name,
        roomNumber: student.roomNumber,
      });
      
      setComplaints(prev => [newComplaint, ...prev]);
      toast.success('Complaint submitted successfully');
      reset();
      addModal.close();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint');
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case COMPLAINT_STATUS.OPEN:
        return (
          <span className="badge badge-error flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Open
          </span>
        );
      case COMPLAINT_STATUS.IN_PROGRESS:
        return (
          <span className="badge badge-warning flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </span>
        );
      case COMPLAINT_STATUS.RESOLVED:
        return (
          <span className="badge badge-success flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <StudentLayout title="My Complaints">
      <div className="fade-in">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <SearchInput
              onSearch={setSearchTerm}
              placeholder="Search complaints..."
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
                <option value="">All Statuses</option>
                <option value={COMPLAINT_STATUS.OPEN}>Open</option>
                <option value={COMPLAINT_STATUS.IN_PROGRESS}>In Progress</option>
                <option value={COMPLAINT_STATUS.RESOLVED}>Resolved</option>
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
              Submit New Complaint
            </button>
          </div>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No complaints found"
            description={
              searchTerm || filters.status
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't submitted any complaints yet."
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
                  Submit a complaint
                </button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComplaints.map(complaint => (
              <div 
                key={complaint.id} 
                className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => viewModal.open(complaint)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900 truncate pr-4">{complaint.title}</h3>
                  <StatusBadge status={complaint.status} />
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{complaint.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                  <span>{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
                  {complaint.status === COMPLAINT_STATUS.IN_PROGRESS && (
                    <span className="text-amber-600">Admin is working on this</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Complaint Modal */}
        <Modal
          isOpen={addModal.isOpen}
          onClose={addModal.close}
          title="Submit New Complaint"
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  id="title"
                  type="text"
                  className={`form-input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Brief title of your complaint"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="form-error">{errors.title.message}</p>}
              </div>
              
              <div>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  rows={5}
                  className={`form-input ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Please provide details about your complaint"
                  {...register('description', { 
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters long' }
                  })}
                ></textarea>
                {errors.description && <p className="form-error">{errors.description.message}</p>}
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
                Submit Complaint
              </button>
            </div>
          </form>
        </Modal>

        {/* View Complaint Modal */}
        <Modal
          isOpen={viewModal.isOpen}
          onClose={viewModal.close}
          title="Complaint Details"
          size="lg"
        >
          {viewModal.data && (
            <div>
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">{viewModal.data.title}</h3>
                <StatusBadge status={viewModal.data.status} />
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Submitted on</p>
                <p className="text-gray-700">{format(new Date(viewModal.data.createdAt), 'MMMM d, yyyy h:mm a')}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-line">{viewModal.data.description}</p>
                </div>
              </div>
              
              {viewModal.data.status === COMPLAINT_STATUS.RESOLVED && (
                <div className="p-4 bg-green-50 rounded-md border border-green-200 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">This complaint has been resolved</p>
                      <p className="text-sm text-green-700 mt-1">
                        The issue has been addressed by the hostel administration.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {viewModal.data.status === COMPLAINT_STATUS.IN_PROGRESS && (
                <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mb-6">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">This complaint is being processed</p>
                      <p className="text-sm text-amber-700 mt-1">
                        The hostel administration is currently working on resolving this issue.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
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

export default ComplaintPage;