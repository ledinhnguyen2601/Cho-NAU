// File: src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { BannedNoticeModal } from '../common/BannedNoticeModal';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text transition-colors">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
        <Outlet />
      </main>
      <Footer />
      {/* Fixed Mobile Bottom Navigation */}
      <MobileBottomNav />
      {/* Global Ban Notification Modal */}
      <BannedNoticeModal />
    </div>
  );
};

