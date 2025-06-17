import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/layouts/AdminLayout';
import Modal from '../../components/ui/Modal';
import { useModalState } from '../../hooks/useModalState';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import { Room, getRooms, createRoom, updateRoom, deleteRoom } from '../../services/roomService';
import { Student, getStudents } from '../../services/studentService';
import { ROOM_TYPES } from '../../config/constants';

// Room form data interface
interface RoomFormData {
  roomNumber: string;
  type: 'single' | 'shared';
  capacity: number;
  floor: number;
  building: string;
}

const RoomManagementPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    building: '',
    type: '',
    occupancy: '',
  });

  // Modal states
  const addModal = useModalState();
  const editModal = useModalState<Room>();
  const deleteModal = useModalState<Room>();
  const viewOccupantsModal = useModalState<Room>();

  // Form state
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: '',
    type: 'single',
    capacity: 1,
    floor: 1,
    building: 'A',
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsData, studentsData] = await Promise.all([
          getRooms(),
          getStudents()
        ]);
        setRooms(roomsData);
        setFilteredRooms(roomsData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load rooms data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter rooms when search term or filters change
  useEffect(() => {
    let result = rooms;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        room => room.roomNumber.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.building) {
      result = result.filter(room => room.building === filters.building);
    }
    if (filters.type) {
      result = result.filter(room => room.type === filters.type);
    }
    if (filters.occupancy) {
      if (filters.occupancy === 'vacant') {
        result = result.filter(room => room.occupancy === 0);
      } else if (filters.occupancy === 'partially') {
        result = result.filter(room => room.occupancy > 0 && room.occupancy < room.capacity);
      } else if (filters.occupancy === 'full') {
        result = result.filter(room => room.occupancy === room.capacity);
      }
    }

    setFilteredRooms(result);
  }, [rooms, searchTerm, filters]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      roomNumber: '',
      type: 'single',
      capacity: 1,
      floor: 1,
      building: 'A',
    });
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      const type = value as 'single' | 'shared';
      const defaultCapacity = type === 'single' ? 1 : 2;
      
      setFormData(prev => ({
        ...prev,
        type,
        capacity: defaultCapacity,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'capacity' || name === 'floor' ? parseInt(value) : value,
      }));
    }
  };

  // Open edit modal
  const handleEdit = (room: Room) => {
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      floor: room.floor,
      building: room.building,
    });
    editModal.open(room);
  };

  // Handle add room
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRoom = await createRoom({
        ...formData,
        occupancy: 0,
      });
      setRooms(prev => [...prev, newRoom]);
      toast.success('Room added successfully');
      addModal.close();
      resetForm();
    } catch (error) {
      console.error('Error adding room:', error);
      toast.error('Failed to add room');
    }
  };

  // Handle update room
  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.data) return;

    try {
      const updatedRoom = await updateRoom(editModal.data.id, formData);
      setRooms(prev =>
        prev.map(room => (room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room))
      );
      toast.success('Room updated successfully');
      editModal.close();
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
    }
  };

  // Handle delete room
  const handleDeleteRoom = async () => {
    if (!deleteModal.data) return;

    try {
      await deleteRoom(deleteModal.data.id);
      setRooms(prev => prev.filter(room => room.id !== deleteModal.data?.id));
      toast.success('Room deleted successfully');
      deleteModal.close();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };

  // Get room occupants
  const getRoomOccupants = (roomId: string) => {
    return students.filter(student => student.roomId === roomId);
  };

  // Get unique buildings for filter
  const uniqueBuildings = Array.from(new Set(rooms.map(room => room.building))).sort();

  return (
    <AdminLayout title="Room Management">
      <div className="fade-in">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <SearchInput
              onSearch={setSearchTerm}
              placeholder="Search rooms..."
              className="w-full sm:w-80"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <button
                type="button"
                className="btn btn-outline flex items-center"
                onClick={() => document.getElementById('roomFiltersDropdown')?.classList.toggle('hidden')}
              >
                <Search className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              <div id="roomFiltersDropdown" className="hidden absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-4 space-y-3">
                  <div>
                    <label className="form-label">Building</label>
                    <select 
                      className="form-input"
                      value={filters.building}
                      onChange={(e) => setFilters(prev => ({ ...prev, building: e.target.value }))}
                    >
                      <option value="">All Buildings</option>
                      {uniqueBuildings.map(building => (
                        <option key={building} value={building}>Building {building}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Room Type</label>
                    <select 
                      className="form-input"
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="">All Types</option>
                      <option value={ROOM_TYPES.SINGLE}>Single</option>
                      <option value={ROOM_TYPES.SHARED}>Shared</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Occupancy</label>
                    <select 
                      className="form-input"
                      value={filters.occupancy}
                      onChange={(e) => setFilters(prev => ({ ...prev, occupancy: e.target.value }))}
                    >
                      <option value="">All Rooms</option>
                      <option value="vacant">Vacant</option>
                      <option value="partially">Partially Occupied</option>
                      <option value="full">Fully Occupied</option>
                    </select>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="button"
                      className="btn btn-outline w-full"
                      onClick={() => setFilters({ building: '', type: '', occupancy: '' })}
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
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </button>
          </div>
        </div>

        {/* Rooms Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No rooms found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ building: '', type: '', occupancy: '' });
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
                  <th>Room Number</th>
                  <th>Building</th>
                  <th>Floor</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Occupancy</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td>{room.roomNumber}</td>
                    <td>Building {room.building}</td>
                    <td>Floor {room.floor}</td>
                    <td>
                      <span className={`capitalize badge ${room.type === 'single' ? 'badge-info' : 'badge-warning'}`}>
                        {room.type}
                      </span>
                    </td>
                    <td>{room.capacity}</td>
                    <td>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              room.occupancy === 0 
                                ? 'bg-gray-400' 
                                : room.occupancy === room.capacity 
                                  ? 'bg-red-500' 
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${(room.occupancy / room.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">
                          {room.occupancy}/{room.capacity}
                        </span>
                        {room.occupancy > 0 && (
                          <button
                            type="button"
                            className="ml-2 text-blue-600 hover:text-blue-800"
                            onClick={() => viewOccupantsModal.open(room)}
                          >
                            <Users className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="p-1 text-blue-600 hover:text-blue-800"
                          onClick={() => handleEdit(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-red-600 hover:text-red-800"
                          onClick={() => {
                            if (room.occupancy > 0) {
                              toast.error('Cannot delete a room with occupants');
                            } else {
                              deleteModal.open(room);
                            }
                          }}
                          disabled={room.occupancy > 0}
                        >
                          <Trash2 className={`h-4 w-4 ${room.occupancy > 0 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Room Modal */}
        <Modal
          isOpen={addModal.isOpen}
          onClose={addModal.close}
          title="Add New Room"
          size="md"
        >
          <form onSubmit={handleAddRoom}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="roomNumber" className="form-label">Room Number</label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., A-101"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="building" className="form-label">Building</label>
                <input
                  type="text"
                  id="building"
                  name="building"
                  value={formData.building}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., A"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="floor" className="form-label">Floor</label>
                <input
                  type="number"
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="form-label">Room Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value={ROOM_TYPES.SINGLE}>Single</option>
                  <option value={ROOM_TYPES.SHARED}>Shared</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="capacity" className="form-label">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="form-input"
                  min={formData.type === ROOM_TYPES.SINGLE ? 1 : 2}
                  max={formData.type === ROOM_TYPES.SINGLE ? 1 : 4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === ROOM_TYPES.SINGLE 
                    ? 'Single rooms can only have a capacity of 1.' 
                    : 'Shared rooms can have a capacity between 2-4.'}
                </p>
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
                Add Room
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Room Modal */}
        <Modal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          title="Edit Room"
          size="md"
        >
          <form onSubmit={handleUpdateRoom}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-roomNumber" className="form-label">Room Number</label>
                <input
                  type="text"
                  id="edit-roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-building" className="form-label">Building</label>
                <input
                  type="text"
                  id="edit-building"
                  name="building"
                  value={formData.building}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-floor" className="form-label">Floor</label>
                <input
                  type="number"
                  id="edit-floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-type" className="form-label">Room Type</label>
                <select
                  id="edit-type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={editModal.data?.occupancy ? true : false}
                >
                  <option value={ROOM_TYPES.SINGLE}>Single</option>
                  <option value={ROOM_TYPES.SHARED}>Shared</option>
                </select>
                {editModal.data?.occupancy ? (
                  <p className="text-xs text-red-500 mt-1">
                    Room type cannot be changed when room has occupants.
                  </p>
                ) : null}
              </div>
              
              <div>
                <label htmlFor="edit-capacity" className="form-label">Capacity</label>
                <input
                  type="number"
                  id="edit-capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="form-input"
                  min={formData.type === ROOM_TYPES.SINGLE ? 1 : 2}
                  max={formData.type === ROOM_TYPES.SINGLE ? 1 : 4}
                  disabled={editModal.data?.occupancy ? editModal.data.occupancy > 0 : false}
                  required
                />
                {editModal.data?.occupancy ? (
                  <p className="text-xs text-red-500 mt-1">
                    Capacity cannot be changed when room has occupants.
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.type === ROOM_TYPES.SINGLE 
                      ? 'Single rooms can only have a capacity of 1.' 
                      : 'Shared rooms can have a capacity between 2-4.'}
                  </p>
                )}
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
                Update Room
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Room Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          title="Delete Room"
          size="sm"
        >
          <div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete room <span className="font-semibold">{deleteModal.data?.roomNumber}</span>? This action cannot be undone.
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
                onClick={handleDeleteRoom}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* View Occupants Modal */}
        <Modal
          isOpen={viewOccupantsModal.isOpen}
          onClose={viewOccupantsModal.close}
          title={`Occupants of ${viewOccupantsModal.data?.roomNumber}`}
          size="md"
        >
          <div>
            {viewOccupantsModal.data && (
              <>
                <div className="flex justify-between mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Room Type</span>
                    <p className="capitalize">{viewOccupantsModal.data.type}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Capacity</span>
                    <p>{viewOccupantsModal.data.occupancy}/{viewOccupantsModal.data.capacity}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Building</span>
                    <p>Building {viewOccupantsModal.data.building}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Floor</span>
                    <p>Floor {viewOccupantsModal.data.floor}</p>
                  </div>
                </div>
                
                <h3 className="text-md font-medium mb-3 text-gray-900">Student Occupants</h3>
                
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRoomOccupants(viewOccupantsModal.data.id).map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td>{student.name}</td>
                          <td>{student.course}</td>
                          <td>Year {student.year}</td>
                          <td>{student.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={viewOccupantsModal.close}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default RoomManagementPage;