// Mock visitor data
export interface Visitor {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  purpose: string;
  studentId: string;
  studentName: string;
  checkIn: string;
  checkOut: string | null;
}

// Mock visitor data
const mockVisitors: Visitor[] = [
  {
    id: '1',
    name: 'Robert Doe',
    phone: '+1234567890',
    relationship: 'Father',
    purpose: 'Dropping off supplies',
    studentId: '1',
    studentName: 'John Doe',
    checkIn: '2023-04-01T10:30:00Z',
    checkOut: '2023-04-01T11:45:00Z',
  },
  {
    id: '2',
    name: 'Emily Smith',
    phone: '+1987654321',
    relationship: 'Mother',
    purpose: 'Weekend visit',
    studentId: '2',
    studentName: 'Jane Smith',
    checkIn: '2023-04-02T14:00:00Z',
    checkOut: '2023-04-02T17:30:00Z',
  },
  {
    id: '3',
    name: 'Michael Wilson',
    phone: '+1122334455',
    relationship: 'Friend',
    purpose: 'Study group',
    studentId: '3',
    studentName: 'Michael Johnson',
    checkIn: '2023-04-03T16:15:00Z',
    checkOut: null,
  },
  {
    id: '4',
    name: 'Sarah Parker',
    phone: '+1555666777',
    relationship: 'Sister',
    purpose: 'Bringing textbooks',
    studentId: '1',
    studentName: 'John Doe',
    checkIn: '2023-04-04T09:30:00Z',
    checkOut: '2023-04-04T10:45:00Z',
  },
  {
    id: '5',
    name: 'Thomas Brown',
    phone: '+1888999000',
    relationship: 'Father',
    purpose: 'Parent-teacher meeting',
    studentId: '5',
    studentName: 'David Brown',
    checkIn: '2023-04-05T13:00:00Z',
    checkOut: null,
  },
];

// Get all visitors
export const getVisitors = async (): Promise<Visitor[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockVisitors);
    }, 500);
  });
};

// Get visitors by student ID
export const getVisitorsByStudentId = async (studentId: string): Promise<Visitor[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const visitors = mockVisitors.filter((v) => v.studentId === studentId);
      resolve(visitors);
    }, 500);
  });
};

// Get visitor by ID
export const getVisitorById = async (id: string): Promise<Visitor | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const visitor = mockVisitors.find((v) => v.id === id) || null;
      resolve(visitor);
    }, 500);
  });
};

// Create a new visitor
export const createVisitor = async (visitor: Omit<Visitor, 'id'>): Promise<Visitor> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newVisitor: Visitor = {
        ...visitor,
        id: Math.random().toString(36).substring(2, 9),
      };
      // In a real app, we would persist this
      resolve(newVisitor);
    }, 500);
  });
};

// Update a visitor
export const updateVisitor = async (id: string, visitor: Partial<Visitor>): Promise<Visitor> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockVisitors.findIndex((v) => v.id === id);
      if (index === -1) {
        reject(new Error('Visitor not found'));
        return;
      }
      
      const updatedVisitor = {
        ...mockVisitors[index],
        ...visitor,
      };
      
      // In a real app, we would persist this
      resolve(updatedVisitor);
    }, 500);
  });
};

// Delete a visitor
export const deleteVisitor = async (id: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockVisitors.findIndex((v) => v.id === id);
      if (index === -1) {
        reject(new Error('Visitor not found'));
        return;
      }
      
      // In a real app, we would persist this
      resolve();
    }, 500);
  });
};

// Check out a visitor
export const checkOutVisitor = async (id: string): Promise<Visitor> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockVisitors.findIndex((v) => v.id === id);
      if (index === -1) {
        reject(new Error('Visitor not found'));
        return;
      }
      
      const updatedVisitor = {
        ...mockVisitors[index],
        checkOut: new Date().toISOString(),
      };
      
      // In a real app, we would persist this
      resolve(updatedVisitor);
    }, 500);
  });
};