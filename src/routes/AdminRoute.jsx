import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

import { NauLoadingLogo } from '../components/brand/NauLoadingLogo';

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
      <div className="flex items-center justify-center min-h-screen p-6">
        <NauLoadingLogo size="md" text="Đang kiểm tra quyền quản trị..." />
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
