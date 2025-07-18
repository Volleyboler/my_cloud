import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/error" state={{ 
      error: { 
        status: 403,
        data: { message: 'Доступ только для администраторов' }
      } 
    }} replace />;
  }

  return children;
};

export default ProtectedRoute;