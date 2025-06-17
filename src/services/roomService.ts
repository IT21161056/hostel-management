// Mock room data
export interface Room {
  id: string;
  roomNumber: string;
  type: 'single' | 'shared';
  capacity: number;
  occupancy: number;
  floor: number;
  building: string;
  occupants?: string[];
}

// Mock room data
const mockRooms: Room[] = [
  {
    id: '101',
    roomNumber: 'A-101',
    type: 'single',
    capacity: 1,
    occupancy: 1,
    floor: 1,
    building: 'A',
    occupants: ['1'],
  },
  {
    id: '102',
    roomNumber: 'A-102',
    type: 'single',
    capacity: 1,
    occupancy: 1,
    floor: 1,
    building: 'A',
    occupants: ['5'],
  },
  {
    id: '203',
    roomNumber: 'B-203',
    type: 'shared',
    capacity: 2,
    occupancy: 1,
    floor: 2,
    building: 'B',
    occupants: ['2'],
  },
  {
    id: '204',
    roomNumber: 'B-204',
    type: 'shared',
    capacity: 2,
    occupancy: 0,
    floor: 2,
    building: 'B',
    occupants: [],
  },
  {
    id: '305',
    roomNumber: 'C-305',
    type: 'single',
    capacity: 1,
    occupancy: 1,
    floor: 3,
    building: 'C',
    occupants: ['3'],
  },
  {
    id: '306',
    roomNumber: 'C-306',
    type: 'shared',
    capacity: 2,
    occupancy: 0,
    floor: 3,
    building: 'C',
    occupants: [],
  },
];

// Get all rooms
export const getRooms = async (): Promise<Room[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRooms);
    }, 500);
  });
};

// Get room by ID
export const getRoomById = async (id: string): Promise<Room | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const room = mockRooms.find((r) => r.id === id) || null;
      resolve(room);
    }, 500);
  });
};

// Create a new room
export const createRoom = async (room: Omit<Room, 'id' | 'occupants'>): Promise<Room> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRoom: Room = {
        ...room,
        id: Math.random().toString(36).substring(2, 9),
        occupants: [],
      };
      // In a real app, we would persist this
      resolve(newRoom);
    }, 500);
  });
};

// Update a room
export const updateRoom = async (id: string, room: Partial<Room>): Promise<Room> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRooms.findIndex((r) => r.id === id);
      if (index === -1) {
        reject(new Error('Room not found'));
        return;
      }
      
      const updatedRoom = {
        ...mockRooms[index],
        ...room,
      };
      
      // In a real app, we would persist this
      resolve(updatedRoom);
    }, 500);
  });
};

// Delete a room
export const deleteRoom = async (id: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRooms.findIndex((r) => r.id === id);
      if (index === -1) {
        reject(new Error('Room not found'));
        return;
      }
      
      // In a real app, we would persist this
      resolve();
    }, 500);
  });
};

// Add student to room
export const addStudentToRoom = async (roomId: string, studentId: string): Promise<Room> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRooms.findIndex((r) => r.id === roomId);
      if (index === -1) {
        reject(new Error('Room not found'));
        return;
      }
      
      const room = mockRooms[index];
      
      if (room.occupancy >= room.capacity) {
        reject(new Error('Room is at full capacity'));
        return;
      }
      
      const updatedRoom = {
        ...room,
        occupancy: room.occupancy + 1,
        occupants: [...(room.occupants || []), studentId],
      };
      
      // In a real app, we would persist this
      resolve(updatedRoom);
    }, 500);
  });
};

// Remove student from room
export const removeStudentFromRoom = async (roomId: string, studentId: string): Promise<Room> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRooms.findIndex((r) => r.id === roomId);
      if (index === -1) {
        reject(new Error('Room not found'));
        return;
      }
      
      const room = mockRooms[index];
      
      if (!room.occupants?.includes(studentId)) {
        reject(new Error('Student not found in room'));
        return;
      }
      
      const updatedRoom = {
        ...room,
        occupancy: room.occupancy - 1,
        occupants: room.occupants.filter((id) => id !== studentId),
      };
      
      // In a real app, we would persist this
      resolve(updatedRoom);
    }, 500);
  });
};