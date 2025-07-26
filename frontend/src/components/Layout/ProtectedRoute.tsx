import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  permission, 
  role, 
  fallback 
}: ProtectedRouteProps) {
  const { hasPermission, hasRole } = useAuth();

  // Check permission if provided
  if (permission && !hasPermission(permission)) {
    return fallback || (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to access this feature.</p>
        </div>
      </div>
    );
  }

  // Check role if provided
  if (role && !hasRole(role)) {
    return fallback || (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">This feature is restricted to {role} users only.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}