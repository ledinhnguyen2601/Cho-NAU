import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { NauLoadingLogo } from '../components/brand/NauLoadingLogo';

export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <NauLoadingLogo size="md" text="Đang xác thực thông tin..." />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};
