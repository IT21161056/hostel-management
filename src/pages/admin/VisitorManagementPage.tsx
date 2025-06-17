import { useState, useEffect } from 'react';
import { UserCheck, UserX, Filter, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/layouts/AdminLayout';
import Modal from '../../components/ui/Modal';
import { useModalState } from '../../hooks/useModalState';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import { Visitor, getVisitors, checkOutVisitor, deleteVisitor } from '../../services/visitorService';

const VisitorManagementPage = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });

  // Modal states
  const checkOutModal = useModalState<Visitor>();
  const deleteModal = useModalState<Visitor>();
  const viewDetailsModal = useModalState<Visitor>();

  // Fetch visitors
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const data = await getVisitors();
        setVisitors(data);
        setFilteredVisitors(data);
      } catch (error) {
        console.error('Error fetching visitors:', error);
        toast.error('Failed to load visitors');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  // Filter visitors when search term or filters change
  useEffect(() => {
    let result = visitors;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        visitor =>
          visitor.name.toLowerCase().includes(term) ||
          visitor.studentName.toLowerCase().includes(term) ||
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

  // Handle check out visitor
  const handleCheckOut = async () => {
    if (!checkOutModal.data) return;

    try {
      const updatedVisitor = await checkOutVisitor(checkOutModal.data.id);
      setVisitors(prev =>
        prev.map(visitor => (visitor.id === updatedVisitor.id ? updatedVisitor : visitor))
      );
      toast.success('Visitor checked out successfully');
      checkOutModal.close();
    } catch (error) {
      console.error('Error checking out visitor:', error);
      toast.error('Failed to check out visitor');
    }
  };

  // Handle delete visitor
  const handleDelete = async () => {
    if (!deleteModal.data) return;

    try {
      await deleteVisitor(deleteModal.data.id);
      setVisitors(prev => prev.filter(visitor => visitor.id !== deleteModal.data?.id));
      toast.success('Visitor entry deleted successfully');
      deleteModal.close();
    } catch (error) {
      console.error('Error deleting visitor:', error);
      toast.error('Failed to delete visitor entry');
    }
  };

  return (
    <AdminLayout title="Visitor Management">
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
          
          <div className="relative">
            <button
              type="button"
              className="btn btn-outline flex items-center"
              onClick={() => document.getElementById('visitorFiltersDropdown')?.classList.toggle('hidden')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter by Status
            </button>
            
            <div id="visitorFiltersDropdown" className="hidden absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="p-4 space-y-3">
                <div>
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">All Visitors</option>
                    <option value="active">Active Visitors</option>
                    <option value="checked-out">Checked Out</option>
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

        {/* Visitors Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : filteredVisitors.length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No visitors found"
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
                  <th>Visitor Name</th>
                  <th>Student</th>
                  <th>Purpose</th>
                  <th>Check In</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="font-medium">
                      <button
                        className="text-left hover:text-blue-600 focus:outline-none"
                        onClick={() => viewDetailsModal.open(visitor)}
                      >
                        {visitor.name}
                      </button>
                    </td>
                    <td>{visitor.studentName}</td>
                    <td>{visitor.purpose}</td>
                    <td>{format(new Date(visitor.checkIn), 'MMM d, yyyy h:mm a')}</td>
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
                    <td>
                      <div className="flex space-x-2">
                        {visitor.checkOut === null && (
                          <button
                            type="button"
                            className="text-xs font-medium text-blue-600 hover:text-blue-800"
                            onClick={() => checkOutModal.open(visitor)}
                          >
                            Check Out
                          </button>
                        )}
                        <button
                          type="button"
                          className="p-1 text-red-600 hover:text-red-800"
                          onClick={() => deleteModal.open(visitor)}
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

        {/* View Details Modal */}
        <Modal
          isOpen={viewDetailsModal.isOpen}
          onClose={viewDetailsModal.close}
          title="Visitor Details"
          size="md"
        >
          {viewDetailsModal.data && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Visitor Name</p>
                  <p className="font-medium">{viewDetailsModal.data.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{viewDetailsModal.data.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p className="font-medium">{viewDetailsModal.data.relationship}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Student</p>
                  <p className="font-medium">{viewDetailsModal.data.studentName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="font-medium">{viewDetailsModal.data.purpose}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Check In</p>
                  <p className="font-medium">{format(new Date(viewDetailsModal.data.checkIn), 'MMMM d, yyyy h:mm a')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Check Out</p>
                  <p className="font-medium">
                    {viewDetailsModal.data.checkOut
                      ? format(new Date(viewDetailsModal.data.checkOut), 'MMMM d, yyyy h:mm a')
                      : 'Not checked out yet'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {viewDetailsModal.data.checkOut === null ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-info">Checked Out</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between">
                {viewDetailsModal.data.checkOut === null && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      checkOutModal.open(viewDetailsModal.data!);
                      viewDetailsModal.close();
                    }}
                  >
                    Check Out Visitor
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={viewDetailsModal.close}
                  className="btn btn-outline ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Check Out Modal */}
        <Modal
          isOpen={checkOutModal.isOpen}
          onClose={checkOutModal.close}
          title="Check Out Visitor"
          size="sm"
        >
          {checkOutModal.data && (
            <div>
              <p className="text-gray-700 mb-4">
                Are you sure you want to check out <span className="font-semibold">{checkOutModal.data.name}</span>?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={checkOutModal.close}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCheckOut}
                  className="btn btn-primary"
                >
                  Check Out
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          title="Delete Visitor Entry"
          size="sm"
        >
          {deleteModal.data && (
            <div>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this visitor entry? This action cannot be undone.
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
                  onClick={handleDelete}
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

export default VisitorManagementPage;