import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Clock, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import AdminLayout from '../../components/layouts/AdminLayout';
import Modal from '../../components/ui/Modal';
import { useModalState } from '../../hooks/useModalState';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import { Complaint, getComplaints, updateComplaintStatus, deleteComplaint } from '../../services/complaintService';
import { COMPLAINT_STATUS } from '../../config/constants';

const ComplaintManagementPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });

  // Modal states
  const viewComplaintModal = useModalState<Complaint>();
  const deleteComplaintModal = useModalState<Complaint>();
  const changeStatusModal = useModalState<{complaint: Complaint, newStatus: string}>();

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await getComplaints();
        setComplaints(data);
        setFilteredComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints when search term or filters change
  useEffect(() => {
    let result = complaints;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        complaint =>
          complaint.title.toLowerCase().includes(term) ||
          complaint.description.toLowerCase().includes(term) ||
          complaint.studentName.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(complaint => complaint.status === filters.status);
    }

    setFilteredComplaints(result);
  }, [complaints, searchTerm, filters]);

  // Handle status change
  const handleStatusChange = async () => {
    if (!changeStatusModal.data) return;
    
    const { complaint, newStatus } = changeStatusModal.data;
    
    try {
      const updatedComplaint = await updateComplaintStatus(complaint.id, newStatus as any);
      setComplaints(prev =>
        prev.map(c => (c.id === updatedComplaint.id ? updatedComplaint : c))
      );
      toast.success('Complaint status updated successfully');
      changeStatusModal.close();
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast.error('Failed to update complaint status');
    }
  };

  // Handle delete complaint
  const handleDeleteComplaint = async () => {
    if (!deleteComplaintModal.data) return;

    try {
      await deleteComplaint(deleteComplaintModal.data.id);
      setComplaints(prev => prev.filter(c => c.id !== deleteComplaintModal.data?.id));
      toast.success('Complaint deleted successfully');
      deleteComplaintModal.close();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
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
    <AdminLayout title="Complaint Management">
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
          
          <div className="relative">
            <button
              type="button"
              className="btn btn-outline flex items-center"
              onClick={() => document.getElementById('complaintFiltersDropdown')?.classList.toggle('hidden')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter by Status
            </button>
            
            <div id="complaintFiltersDropdown" className="hidden absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="p-4 space-y-3">
                <div>
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">All Statuses</option>
                    <option value={COMPLAINT_STATUS.OPEN}>Open</option>
                    <option value={COMPLAINT_STATUS.IN_PROGRESS}>In Progress</option>
                    <option value={COMPLAINT_STATUS.RESOLVED}>Resolved</option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <button
                    type="button"
                    className="btn btn-outline w-full"
                    onClick={() => setFilters({ status: '' })}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No complaints found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={
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
            }
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Student</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="font-medium">
                      <button
                        className="text-left hover:text-blue-600 focus:outline-none"
                        onClick={() => viewComplaintModal.open(complaint)}
                      >
                        {complaint.title}
                      </button>
                    </td>
                    <td>{complaint.studentName}</td>
                    <td>
                      {complaint.roomNumber ? (
                        <span className="badge badge-info">{complaint.roomNumber}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td>{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</td>
                    <td>
                      <div className="flex space-x-2">
                        <div className="relative">
                          <button
                            type="button"
                            className="p-1 text-blue-600 hover:text-blue-800"
                            onClick={() => document.getElementById(`statusDropdown-${complaint.id}`)?.classList.toggle('hidden')}
                          >
                            <span className="text-xs font-medium">Change Status</span>
                          </button>
                          
                          <div id={`statusDropdown-${complaint.id}`} className="hidden absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              {complaint.status !== COMPLAINT_STATUS.OPEN && (
                                <button
                                  type="button"
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => changeStatusModal.open({
                                    complaint,
                                    newStatus: COMPLAINT_STATUS.OPEN
                                  })}
                                >
                                  Mark as Open
                                </button>
                              )}
                              
                              {complaint.status !== COMPLAINT_STATUS.IN_PROGRESS && (
                                <button
                                  type="button"
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => changeStatusModal.open({
                                    complaint,
                                    newStatus: COMPLAINT_STATUS.IN_PROGRESS
                                  })}
                                >
                                  Mark as In Progress
                                </button>
                              )}
                              
                              {complaint.status !== COMPLAINT_STATUS.RESOLVED && (
                                <button
                                  type="button"
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => changeStatusModal.open({
                                    complaint,
                                    newStatus: COMPLAINT_STATUS.RESOLVED
                                  })}
                                >
                                  Mark as Resolved
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          className="p-1 text-red-600 hover:text-red-800"
                          onClick={() => deleteComplaintModal.open(complaint)}
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

        {/* View Complaint Modal */}
        <Modal
          isOpen={viewComplaintModal.isOpen}
          onClose={viewComplaintModal.close}
          title="View Complaint Details"
          size="lg"
        >
          {viewComplaintModal.data && (
            <div>
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">{viewComplaintModal.data.title}</h3>
                <StatusBadge status={viewComplaintModal.data.status} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Submitted by</p>
                  <p className="font-medium">{viewComplaintModal.data.studentName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Room</p>
                  <p className="font-medium">{viewComplaintModal.data.roomNumber || 'Not assigned'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Submitted on</p>
                  <p className="font-medium">{format(new Date(viewComplaintModal.data.createdAt), 'MMMM d, yyyy h:mm a')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Last updated</p>
                  <p className="font-medium">{format(new Date(viewComplaintModal.data.updatedAt), 'MMMM d, yyyy h:mm a')}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-line">{viewComplaintModal.data.description}</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  {viewComplaintModal.data.status !== COMPLAINT_STATUS.OPEN && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        changeStatusModal.open({
                          complaint: viewComplaintModal.data!,
                          newStatus: COMPLAINT_STATUS.OPEN
                        });
                        viewComplaintModal.close();
                      }}
                    >
                      Mark as Open
                    </button>
                  )}
                  
                  {viewComplaintModal.data.status !== COMPLAINT_STATUS.IN_PROGRESS && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        changeStatusModal.open({
                          complaint: viewComplaintModal.data!,
                          newStatus: COMPLAINT_STATUS.IN_PROGRESS
                        });
                        viewComplaintModal.close();
                      }}
                    >
                      Mark as In Progress
                    </button>
                  )}
                  
                  {viewComplaintModal.data.status !== COMPLAINT_STATUS.RESOLVED && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        changeStatusModal.open({
                          complaint: viewComplaintModal.data!,
                          newStatus: COMPLAINT_STATUS.RESOLVED
                        });
                        viewComplaintModal.close();
                      }}
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={viewComplaintModal.close}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Change Status Modal */}
        <Modal
          isOpen={changeStatusModal.isOpen}
          onClose={changeStatusModal.close}
          title="Change Complaint Status"
          size="sm"
        >
          {changeStatusModal.data && (
            <div>
              <p className="text-gray-700 mb-4">
                Are you sure you want to change the status of "{changeStatusModal.data.complaint.title}" from 
                <span className="font-semibold"> {changeStatusModal.data.complaint.status}</span> to
                <span className="font-semibold"> {changeStatusModal.data.newStatus}</span>?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={changeStatusModal.close}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStatusChange}
                  className="btn btn-primary"
                >
                  Change Status
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Complaint Modal */}
        <Modal
          isOpen={deleteComplaintModal.isOpen}
          onClose={deleteComplaintModal.close}
          title="Delete Complaint"
          size="sm"
        >
          {deleteComplaintModal.data && (
            <div>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this complaint? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={deleteComplaintModal.close}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteComplaint}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ComplaintManagementPage;