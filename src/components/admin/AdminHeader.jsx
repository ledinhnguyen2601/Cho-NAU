// File: src/components/admin/AdminHeader.jsx
import React from 'react';
import { Menu, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';

export const AdminHeader = ({ onMenuClick }) => {
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-nau-surface/90 dark:bg-nau-background/90 backdrop-blur-md border-b border-nau-border dark:border-nau-border px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-nau-text-secondary dark:text-nau-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-nau-warning/10 text-nau-warning">
            <Shield className="w-4 h-4" />
          </span>
          <h1 className="text-sm sm:text-base font-bold text-nau-text dark:text-nau-text hidden sm:block">
            Trung Tâm Kiểm Duyệt & Quản Trị Hệ Thống
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="flex items-center gap-2.5 pl-3 border-l border-nau-border dark:border-nau-border">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover border border-nau-border dark:border-nau-border"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-nau-text dark:text-nau-text">
              {currentUser?.name || 'Admin NAU'}
            </p>
            <p className="text-[10px] font-semibold text-nau-primary dark:text-nau-primary">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
