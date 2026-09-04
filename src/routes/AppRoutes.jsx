import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { MainLayout } from '../components/layout/MainLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Routes guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Pages
import { HomePage } from '../pages/Home/HomePage';
import { ProductDetailsPage } from '../pages/ProductDetails/ProductDetailsPage';
import { CreateProductPage } from '../pages/CreateProduct/CreateProductPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { VerificationPage } from '../pages/Verification/VerificationPage';
import { ChatPage } from '../pages/Chat/ChatPage';
import { CartPage } from '../pages/Cart/CartPage';
import { OrdersPage } from '../pages/Orders/OrdersPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { SavedProductsPage } from '../pages/SavedProducts/SavedProductsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/Admin/AdminUsersPage';
import { AdminProductsPage } from '../pages/Admin/AdminProductsPage';
import { AdminVerificationsPage } from '../pages/Admin/AdminVerificationsPage';
import { AdminOrdersPage } from '../pages/Admin/AdminOrdersPage';
import { AdminReportsPage } from '../pages/Admin/AdminReportsPage';
import { AdminSettingsPage } from '../pages/Admin/AdminSettingsPage';

// 404 Page
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Marketplace Public / Student Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="create-product" element={<CreateProductPage />} />
          <Route path="verification" element={<VerificationPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="saved" element={<SavedProductsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin SaaS Dashboard Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="verifications" element={<AdminVerificationsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
