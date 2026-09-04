import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!loading && currentUser && !isAdmin) {
      toast.error('Bạn không có quyền truy cập trang quản trị!');
    }
  }, [loading, currentUser, isAdmin, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nau-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};
