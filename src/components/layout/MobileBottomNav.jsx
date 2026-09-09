// File: src/components/layout/MobileBottomNav.jsx
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { subscribeToUnreadCount } from '../../services/chatService';
import { 
  Home, 
  Tag, 
  Plus, 
  MessageSquare, 
  User 
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { currentUser, isVerified } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadChatCount, setUnreadChatCount] = React.useState(0);

  React.useEffect(() => {
    if (!currentUser?.id) {
      setUnreadChatCount(0);
      return;
    }

    const unsubscribe = subscribeToUnreadCount(currentUser.id, (count) => {
      setUnreadChatCount(count);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser?.id, location.pathname]);

  const handlePostListingClick = (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để đăng tin bán sản phẩm.');
      navigate('/login');
      return;
    }
    if (!isVerified) {
      toast.warning('Bạn cần gửi Thẻ sinh viên hoặc CCCD để xác thực tài khoản trước khi đăng tin.');
      navigate('/verification');
      return;
    }
    navigate('/create-product');
  };

  const handleAuthRequiredClick = (path, e) => {
    if (!currentUser) {
      e.preventDefault();
      toast.warning('Vui lòng đăng nhập để sử dụng tính năng này.');
      navigate('/login');
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        
        {/* 1. Trang chủ */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
              isActive
                ? 'text-nau-red dark:text-nau-red-hover'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span>Trang chủ</span>
            </>
          )}
        </NavLink>

        {/* 2. Quản lý tin */}
        <NavLink
          to="/manage-listings"
          onClick={(e) => handleAuthRequiredClick('/manage-listings', e)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
              isActive
                ? 'text-nau-red dark:text-nau-red-hover'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Tag className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span>Quản lý tin</span>
            </>
          )}
        </NavLink>

        {/* 3. Nút Đăng tin trung tâm nổi bật chuẩn NAU Red */}
        <div className="flex flex-col items-center justify-center flex-1 -mt-4">
          <button
            type="button"
            onClick={handlePostListingClick}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-nau-red to-red-600 hover:from-nau-red-hover hover:to-red-700 text-white flex items-center justify-center shadow-lg shadow-nau-red/35 active:scale-90 transition-transform ring-4 ring-white dark:ring-slate-900 cursor-pointer"
            title="Đăng tin bán mới"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
          <span className="text-[10px] font-black text-nau-red dark:text-nau-red-hover mt-0.5">
            Đăng tin
          </span>
        </div>

        {/* 4. Liên hệ (Chat) */}
        <NavLink
          to="/chat"
          onClick={(e) => handleAuthRequiredClick('/chat', e)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors relative ${
              isActive
                ? 'text-nau-red dark:text-nau-red-hover'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <MessageSquare className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {currentUser && unreadChatCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {unreadChatCount > 99 ? '99+' : unreadChatCount}
                  </span>
                )}
              </div>
              <span>Liên hệ</span>
            </>
          )}
        </NavLink>

        {/* 5. Tài khoản */}
        <NavLink
          to="/profile"
          onClick={(e) => handleAuthRequiredClick('/profile', e)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
              isActive
                ? 'text-nau-red dark:text-nau-red-hover'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className={`w-5 h-5 rounded-full object-cover mb-0.5 border ${
                    isActive ? 'border-nau-red dark:border-nau-red-hover ring-1 ring-nau-red' : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
              ) : (
                <User className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              )}
              <span>Tài khoản</span>
            </>
          )}
        </NavLink>

      </div>
    </nav>
  );
};
