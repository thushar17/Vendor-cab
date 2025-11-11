import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role: 'super_vendor' | 'sub_vendor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user has no profile, redirect to login to create one
  if (!user.profile) {
    console.warn('User has no profile, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (user.profile.role !== role) {
    // Redirect to their correct dashboard if they try to access the wrong one
    if (user.profile.role === 'super_vendor') {
      return <Navigate to="/super-vendor" />;
    }
    if (user.profile.role === 'sub_vendor') {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute;
