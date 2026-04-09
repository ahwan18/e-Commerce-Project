/**
 * ProtectedRoute Component
 *
 * Wrapper component to protect admin routes.
 * Redirects to login if user is not authenticated.
 *
 * DO NOT modify this component unless changing auth logic.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loading message="Memeriksa autentikasi..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
