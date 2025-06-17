import { COMPLAINT_STATUS } from '../config/constants';

// Mock complaint data
export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: typeof COMPLAINT_STATUS[keyof typeof COMPLAINT_STATUS];
  studentId: string;
  studentName: string;
  roomNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock complaint data
const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Broken shower in bathroom',
    description: 'The shower head is leaking and needs to be fixed or replaced.',
    status: COMPLAINT_STATUS.OPEN,
    studentId: '1',
    studentName: 'John Doe',
    roomNumber: 'A-101',
    createdAt: '2023-04-01T08:30:00Z',
    updatedAt: '2023-04-01T08:30:00Z',
  },
  {
    id: '2',
    title: 'Noisy neighbors',
    description: 'The students in the next room are playing loud music after 11 PM every night.',
    status: COMPLAINT_STATUS.IN_PROGRESS,
    studentId: '2',
    studentName: 'Jane Smith',
    roomNumber: 'B-203',
    createdAt: '2023-04-02T14:20:00Z',
    updatedAt: '2023-04-03T09:15:00Z',
  },
  {
    id: '3',
    title: 'Wi-Fi connection issues',
    description: 'The Wi-Fi signal is very weak in my room, making it difficult to study online.',
    status: COMPLAINT_STATUS.RESOLVED,
    studentId: '3',
    studentName: 'Michael Johnson',
    roomNumber: 'C-305',
    createdAt: '2023-03-25T10:45:00Z',
    updatedAt: '2023-03-28T16:30:00Z',
  },
  {
    id: '4',
    title: 'Bed frame is damaged',
    description: 'The wooden support under my bed is broken, causing the mattress to sag.',
    status: COMPLAINT_STATUS.OPEN,
    studentId: '1',
    studentName: 'John Doe',
    roomNumber: 'A-101',
    createdAt: '2023-04-05T11:20:00Z',
    updatedAt: '2023-04-05T11:20:00Z',
  },
  {
    id: '5',
    title: 'Room heating not working',
    description: 'The heating in my room has stopped working, and it gets very cold at night.',
    status: COMPLAINT_STATUS.IN_PROGRESS,
    studentId: '5',
    studentName: 'David Brown',
    roomNumber: 'A-102',
    createdAt: '2023-03-30T09:10:00Z',
    updatedAt: '2023-03-31T14:45:00Z',
  },
];

// Get all complaints
export const getComplaints = async (): Promise<Complaint[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockComplaints);
    }, 500);
  });
};

// Get complaints by student ID
export const getComplaintsByStudentId = async (studentId: string): Promise<Complaint[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const complaints = mockComplaints.filter((c) => c.studentId === studentId);
      resolve(complaints);
    }, 500);
  });
};

// Get complaint by ID
export const getComplaintById = async (id: string): Promise<Complaint | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const complaint = mockComplaints.find((c) => c.id === id) || null;
      resolve(complaint);
    }, 500);
  });
};

// Create a new complaint
export const createComplaint = async (
  complaint: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<Complaint> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString();
      const newComplaint: Complaint = {
        ...complaint,
        id: Math.random().toString(36).substring(2, 9),
        status: COMPLAINT_STATUS.OPEN,
        createdAt: now,
        updatedAt: now,
      };
      // In a real app, we would persist this
      resolve(newComplaint);
    }, 500);
  });
};

// Update a complaint
export const updateComplaint = async (id: string, complaint: Partial<Complaint>): Promise<Complaint> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockComplaints.findIndex((c) => c.id === id);
      if (index === -1) {
        reject(new Error('Complaint not found'));
        return;
      }
      
      const updatedComplaint = {
        ...mockComplaints[index],
        ...complaint,
        updatedAt: new Date().toISOString(),
      };
      
      // In a real app, we would persist this
      resolve(updatedComplaint);
    }, 500);
  });
};

// Delete a complaint
export const deleteComplaint = async (id: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockComplaints.findIndex((c) => c.id === id);
      if (index === -1) {
        reject(new Error('Complaint not found'));
        return;
      }
      
      // In a real app, we would persist this
      resolve();
    }, 500);
  });
};

// Update complaint status
export const updateComplaintStatus = async (
  id: string,
  status: typeof COMPLAINT_STATUS[keyof typeof COMPLAINT_STATUS]
): Promise<Complaint> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockComplaints.findIndex((c) => c.id === id);
      if (index === -1) {
        reject(new Error('Complaint not found'));
        return;
      }
      
      const updatedComplaint = {
        ...mockComplaints[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      
      // In a real app, we would persist this
      resolve(updatedComplaint);
    }, 500);
  });
};