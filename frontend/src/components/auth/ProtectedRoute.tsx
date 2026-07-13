import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const location = useLocation();

  if (!token || !user) {
    // Redirect to login page, saving the original location for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
