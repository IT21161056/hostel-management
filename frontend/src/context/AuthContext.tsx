import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo with different roles
const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@ananda.edu', 
    role: 'admin',
    avatar: 'AU'
  },
  { 
    id: '2', 
    name: 'Warden Kumar', 
    email: 'warden@ananda.edu', 
    role: 'warden',
    avatar: 'WK'
  },
  { 
    id: '3', 
    name: 'Accountant Sharma', 
    email: 'accounts@ananda.edu', 
    role: 'accountant',
    avatar: 'AS'
  },
  { 
    id: '4', 
    name: 'Kitchen Manager', 
    email: 'kitchen@ananda.edu', 
    role: 'kitchen',
    avatar: 'KM'
  },
];

// Role-based permissions mapping
const rolePermissions = {
  admin: [
    'view_dashboard',
    'manage_students',
    'view_students',
    'manage_attendance',
    'view_attendance',
    'manage_meals',
    'view_meals',
    'manage_finance',
    'view_finance',
    'view_reports',
    'manage_settings',
    'manage_users',
    'create_users',
    'edit_users',
    'delete_users'
  ],
  warden: [
    'view_dashboard',
    'view_students',
    'manage_students',
    'manage_attendance',
    'view_attendance',
    'view_reports'
  ],
  accountant: [
    'view_dashboard',
    'view_students',
    'manage_finance',
    'view_finance',
    'view_reports'
  ],
  kitchen: [
    'view_dashboard',
    'manage_meals',
    'view_meals',
    'view_reports'
  ]
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasPermission,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}