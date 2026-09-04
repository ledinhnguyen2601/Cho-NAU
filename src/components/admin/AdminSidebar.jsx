// File: src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Settings, 
  ArrowLeft,
  X
} from 'lucide-react';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/admin', label: 'Tổng quan KPI', icon: LayoutDashboard, end: true },
    { to: '/admin/verifications', label: 'Duyệt Thẻ Sinh Viên', icon: ShieldCheck },
    { to: '/admin/users', label: 'Quản lý Người dùng', icon: Users },
    { to: '/admin/products', label: 'Kiểm duyệt Sản phẩm', icon: Package },
    { to: '/admin/orders', label: 'Quản lý Đơn hàng', icon: ShoppingCart },
    { to: '/admin/reports', label: 'Xử lý Báo cáo & Lừa đảo', icon: AlertTriangle },
    { to: '/admin/settings', label: 'Cấu hình Hệ thống', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-nau-surface dark:bg-nau-background border-r border-nau-border dark:border-nau-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-nau-border">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border-2 border-nau-blue flex items-center justify-center shadow-xs overflow-hidden">
              <div className="flex items-center justify-center font-black tracking-tighter text-xs select-none">
                <span className="text-nau-blue">N</span>
                <span className="text-nau-red text-sm -mx-0.5">A</span>
                <span className="text-nau-blue">U</span>
              </div>
            </div>
            <div>
              <span className="text-sm font-black text-nau-text dark:text-nau-text tracking-tight">
                ADMIN SAAS
              </span>
              <span className="block text-[10px] font-bold text-nau-red dark:text-nau-red-hover">
                Chợ NAU Portal
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-nau-text-muted uppercase tracking-wider mb-2">
            Quản trị viên
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-nau-red-light dark:bg-nau-red-dark/30 text-nau-red dark:text-nau-red-hover font-bold border-l-4 border-nau-red shadow-xs'
                      : 'text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-nau-text dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer / Back to Marketplace */}
        <div className="p-4 border-t border-slate-100 dark:border-nau-border">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-nau-border dark:border-nau-border hover:bg-slate-100 dark:hover:bg-slate-800 text-nau-text dark:text-nau-text-secondary text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Sàn Chợ NAU</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
