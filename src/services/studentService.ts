// Mock student data
export interface Student {
  id: string;
  name: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  course: string;
  year: number;
  roomId: string | null;
  roomNumber?: string;
  parentDetails: {
    name: string;
    phone: string;
    relationship: string;
    email: string;
  };
  createdAt: string;
}

// Mock student data
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    gender: 'male',
    course: 'Computer Science',
    year: 2,
    roomId: '101',
    roomNumber: 'A-101',
    parentDetails: {
      name: 'Robert Doe',
      phone: '+1234567890',
      relationship: 'Father',
      email: 'robert.doe@example.com',
    },
    createdAt: '2023-01-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    gender: 'female',
    course: 'Electrical Engineering',
    year: 3,
    roomId: '203',
    roomNumber: 'B-203',
    parentDetails: {
      name: 'Emily Smith',
      phone: '+1987654321',
      relationship: 'Mother',
      email: 'emily.smith@example.com',
    },
    createdAt: '2023-02-10T10:45:00Z',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    gender: 'male',
    course: 'Business Administration',
    year: 1,
    roomId: '305',
    roomNumber: 'C-305',
    parentDetails: {
      name: 'David Johnson',
      phone: '+1122334455',
      relationship: 'Father',
      email: 'david.j@example.com',
    },
    createdAt: '2023-03-05T14:20:00Z',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    gender: 'female',
    course: 'Psychology',
    year: 4,
    roomId: null,
    parentDetails: {
      name: 'Jennifer Williams',
      phone: '+1555666777',
      relationship: 'Mother',
      email: 'jennifer.w@example.com',
    },
    createdAt: '2023-01-20T09:15:00Z',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.b@example.com',
    gender: 'male',
    course: 'Mechanical Engineering',
    year: 2,
    roomId: '102',
    roomNumber: 'A-102',
    parentDetails: {
      name: 'Thomas Brown',
      phone: '+1888999000',
      relationship: 'Father',
      email: 'thomas.b@example.com',
    },
    createdAt: '2023-02-25T11:30:00Z',
  },
];

// Get all students
export const getStudents = async (): Promise<Student[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStudents);
    }, 500);
  });
};

// Get student by ID
export const getStudentById = async (id: string): Promise<Student | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const student = mockStudents.find((s) => s.id === id) || null;
      resolve(student);
    }, 500);
  });
};

// Create a new student
export const createStudent = async (student: Omit<Student, 'id' | 'createdAt'>): Promise<Student> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStudent: Student = {
        ...student,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      };
      // In a real app, we would persist this
      resolve(newStudent);
    }, 500);
  });
};

// Update a student
export const updateStudent = async (id: string, student: Partial<Student>): Promise<Student> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockStudents.findIndex((s) => s.id === id);
      if (index === -1) {
        reject(new Error('Student not found'));
        return;
      }
      
      const updatedStudent = {
        ...mockStudents[index],
        ...student,
      };
      
      // In a real app, we would persist this
      resolve(updatedStudent);
    }, 500);
  });
};

// Delete a student
export const deleteStudent = async (id: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockStudents.findIndex((s) => s.id === id);
      if (index === -1) {
        reject(new Error('Student not found'));
        return;
      }
      
      // In a real app, we would persist this
      resolve();
    }, 500);
  });
};

// Assign student to room
export const assignStudentToRoom = async (studentId: string, roomId: string, roomNumber: string): Promise<Student> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockStudents.findIndex((s) => s.id === studentId);
      if (index === -1) {
        reject(new Error('Student not found'));
        return;
      }
      
      const updatedStudent = {
        ...mockStudents[index],
        roomId,
        roomNumber,
      };
      
      // In a real app, we would persist this
      resolve(updatedStudent);
    }, 500);
  });
};