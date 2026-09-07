import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { MainLayout } from '../components/layout/MainLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Routes guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Lazy-loaded Marketplace Pages
const HomePage = lazy(() => import('../pages/Home/HomePage').then(m => ({ default: m.HomePage })));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetails/ProductDetailsPage').then(m => ({ default: m.ProductDetailsPage })));
const CreateProductPage = lazy(() => import('../pages/CreateProduct/CreateProductPage').then(m => ({ default: m.CreateProductPage })));
const LoginPage = lazy(() => import('../pages/Login/LoginPage').then(m => ({ default: m.LoginPage })));
const VerificationPage = lazy(() => import('../pages/Verification/VerificationPage').then(m => ({ default: m.VerificationPage })));
const ChatPage = lazy(() => import('../pages/Chat/ChatPage').then(m => ({ default: m.ChatPage })));
const CartPage = lazy(() => import('../pages/Cart/CartPage').then(m => ({ default: m.CartPage })));
const OrdersPage = lazy(() => import('../pages/Orders/OrdersPage').then(m => ({ default: m.OrdersPage })));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SavedProductsPage = lazy(() => import('../pages/SavedProducts/SavedProductsPage').then(m => ({ default: m.SavedProductsPage })));
const ManageListingsPage = lazy(() => import('../pages/ManageListings/ManageListingsPage').then(m => ({ default: m.ManageListingsPage })));

// Lazy-loaded Admin SaaS Dashboard Pages
const AdminDashboardPage = lazy(() => import('../pages/Admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('../pages/Admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminProductsPage = lazy(() => import('../pages/Admin/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })));
const AdminVerificationsPage = lazy(() => import('../pages/Admin/AdminVerificationsPage').then(m => ({ default: m.AdminVerificationsPage })));
const AdminOrdersPage = lazy(() => import('../pages/Admin/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminReportsPage = lazy(() => import('../pages/Admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));
const AdminSettingsPage = lazy(() => import('../pages/Admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

// 404 Page
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

import { NauLoadingLogo } from '../components/brand/NauLoadingLogo';

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
    <NauLoadingLogo size="md" text="Đang tải trang..." />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
            <Route path="manage-listings" element={<ManageListingsPage />} />
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
    </Suspense>
  );
};
