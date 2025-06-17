import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy loaded components
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const StudentManagementPage = lazy(() => import('./pages/admin/StudentManagementPage'));
const RoomManagementPage = lazy(() => import('./pages/admin/RoomManagementPage'));
const ComplaintManagementPage = lazy(() => import('./pages/admin/ComplaintManagementPage'));
const VisitorManagementPage = lazy(() => import('./pages/admin/VisitorManagementPage'));
const StudentDashboardPage = lazy(() => import('./pages/student/DashboardPage'));
const StudentProfilePage = lazy(() => import('./pages/student/ProfilePage'));
const StudentComplaintPage = lazy(() => import('./pages/student/ComplaintPage'));
const StudentVisitorPage = lazy(() => import('./pages/student/VisitorPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { isAuthenticated, user } = useAuthStore();
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />
            ) : (
              <LoginPage />
            )
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Navigate to="/admin/dashboard" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StudentManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/rooms" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RoomManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/complaints" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ComplaintManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/visitors" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VisitorManagementPage />
            </ProtectedRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Navigate to="/student/dashboard" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/profile" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/complaints" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentComplaintPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/visitors" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentVisitorPage />
            </ProtectedRoute>
          } 
        />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard') : '/login'} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;