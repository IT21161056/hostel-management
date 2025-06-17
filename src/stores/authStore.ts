import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '../config/constants';

// Types
export type Role = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      
      login: async (email: string, password: string) => {
        try {
          // In a real app, this would be an API call
          // const response = await axios.post(`${API_URL}/auth/login`, { email, password });
          // const { user, token } = response.data;
          
          // For demo purposes, we'll use mock data
          const mockUsers = {
            'admin@example.com': {
              id: '1',
              name: 'Admin User',
              email: 'admin@example.com',
              role: 'admin' as Role,
            },
            'student@example.com': {
              id: '2',
              name: 'John Doe',
              email: 'student@example.com',
              role: 'student' as Role,
            },
          };
          
          // Check if user exists
          if (!mockUsers[email as keyof typeof mockUsers]) {
            throw new Error('Invalid credentials');
          }
          
          // Check password (mock check)
          if (password !== 'password') {
            throw new Error('Invalid credentials');
          }
          
          const user = mockUsers[email as keyof typeof mockUsers];
          const token = 'mock-jwt-token';
          
          // Configure axios with auth token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ user, isAuthenticated: true, token });
        } catch (error) {
          throw error;
        }
      },
      
      logout: () => {
        // Remove token from axios headers
        delete axios.defaults.headers.common['Authorization'];
        
        set({ user: null, isAuthenticated: false, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Initialize axios with token from storage
export const initializeAuth = () => {
  const authState = useAuthStore.getState();
  
  if (authState.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
  }
};