import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { getUnreadConversationsCount } from '../../services/chatService';
import { 
  Search, 
  PlusCircle, 
  MessageSquare, 
  ShoppingCart, 
  User, 
  ShieldCheck, 
  LogOut, 
  Package, 
  Bookmark, 
  LayoutDashboard, 
  Menu, 
  X,
  BadgeCheck,
  Building2
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout, isVerified, isAdmin } = useAuth();
  const { totalItemsCount } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    if (!currentUser?.id) {
      setUnreadChatCount(0);
      return;
    }

    const checkUnread = async () => {
      try {
        const count = await getUnreadConversationsCount(currentUser.id);
        setUnreadChatCount(count);
      } catch (e) {}
    };

    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => clearInterval(interval);
  }, [currentUser?.id, location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handlePostListingClick = () => {
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để đăng bán sản phẩm.');
      navigate('/login');
      return;
    }
    if (!isVerified) {
      toast.warning('Bạn cần xác thực danh tính sinh viên NAU trước khi đăng bán sản phẩm.');
      navigate('/verification');
      return;
    }
    navigate('/create-product');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-nau-border/80 dark:border-nau-border/80 bg-nau-surface/90 dark:bg-nau-background/90 backdrop-blur-md transition-colors">
      {/* Top Banner Alert for NAU Students */}
      <div className="bg-nau-red text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs">
        <Building2 className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
        <span>Cộng đồng Thương Mại Điện Tử Sinh Viên & Giảng Viên Đại Học Nghệ An (NAU)</span>
        <span className="hidden md:inline bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">100% Đã Xác Thực</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo - Chuẩn nhận diện NAU */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-nau-blue flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden relative">
              <div className="flex items-center justify-center font-black tracking-tighter text-sm select-none">
                <span className="text-nau-blue">N</span>
                <span className="text-nau-red text-base -mx-0.5">A</span>
                <span className="text-nau-blue">U</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black tracking-tight text-nau-text dark:text-white">
                  CHỢ <span className="text-nau-red">NAU</span>
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-bold text-nau-blue dark:text-nau-blue-light uppercase tracking-wider -mt-0.5">
                Sàn Đồ Cũ Sinh Viên
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop / Tablet) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-2 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm giáo trình, laptop, xe đạp, phòng trọ NAU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2 text-sm rounded-xl border border-nau-border dark:border-nau-border bg-nau-background/80 dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nau-red/20 focus:border-nau-red focus:bg-nau-surface dark:focus:bg-slate-900 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-nau-red hover:bg-nau-red-hover text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark/Light Mode Toggle */}
            <ThemeToggle />

            {/* Chat Direct Messenger */}
            <Link
              to="/chat"
              className="relative p-2 rounded-xl text-nau-text-secondary dark:text-nau-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Tin nhắn giao dịch"
            >
              <MessageSquare className="w-5 h-5" />
              {currentUser && unreadChatCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-nau-red ring-2 ring-white dark:ring-slate-950 animate-pulse-subtle" />
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-nau-text-secondary dark:text-nau-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-nau-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950 animate-pulse-subtle">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Admin Quick Action */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-nau-blue hover:bg-nau-blue-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>QUẢN TRỊ</span>
              </Link>
            )}

            {/* Post Listing CTA */}
            <button
              onClick={handlePostListingClick}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 bg-nau-red hover:bg-nau-red-hover text-white text-xs font-bold rounded-xl shadow-md shadow-nau-red/25 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ĐĂNG TIN BÁN</span>
            </button>

            {/* User Profile Menu / Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-nau-border dark:border-slate-700"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-nau-border dark:border-nau-border"
                    />
                    {/* Green online presence indicator */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Đang trực tuyến" />
                  </div>
                  <span className="hidden xl:block text-xs font-semibold text-nau-text dark:text-nau-text max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-nau-surface dark:bg-nau-background border border-nau-border dark:border-nau-border shadow-xl p-2 z-50 animate-slide-up">
                      <div className="p-3 border-b border-slate-100 dark:border-nau-border">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-nau-text dark:text-nau-text truncate">
                            {currentUser.name}
                          </p>
                          {isAdmin ? (
                            <span className="text-[10px] px-2 py-0.5 bg-nau-red/10 text-nau-red font-bold rounded-full border border-nau-red/30">
                              👑 Quản trị viên
                            </span>
                          ) : isVerified ? (
                            <span className="text-[10px] px-2 py-0.5 bg-nau-blue-light dark:bg-nau-blue/20 text-nau-blue dark:text-nau-blue-light font-bold rounded-full border border-nau-blue/30 dark:border-nau-blue/40">
                              ✓ Đã xác thực
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 bg-nau-warning/10 dark:bg-nau-warning/20 text-nau-warning dark:text-nau-warning font-bold rounded-full border border-nau-warning/30 dark:border-nau-warning/40">
                              Chưa xác thực
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted truncate mt-0.5">
                          {currentUser.email}
                        </p>
                      </div>

                      <div className="py-1 text-xs font-medium text-nau-text dark:text-nau-text-secondary">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-nau-red dark:text-nau-red-hover hover:bg-nau-red-light dark:hover:bg-nau-red-dark/20 font-semibold"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>👑 Quản Trị Hệ Thống (Admin)</span>
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Trang cá nhân & Uy tín</span>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          <span>Quản lý đơn hàng</span>
                        </Link>
                        <Link
                          to="/saved"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          <span>Tin đã lưu</span>
                        </Link>
                        <Link
                          to="/verification"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <ShieldCheck className="w-4 h-4 text-slate-400" />
                          <span>Xác thực thẻ SV / CCCD</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-nau-border">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                            toast.info('Đã đăng xuất tài khoản.');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-nau-danger hover:bg-nau-danger/10 dark:hover:bg-nau-danger/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl bg-nau-blue hover:bg-nau-blue-hover text-white text-xs font-bold transition-all shadow-sm"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-nau-text-secondary dark:text-nau-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Tìm giáo trình, laptop, xe đạp NAU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 focus:outline-none focus:border-nau-red"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-nau-red text-white text-[11px] font-bold rounded-lg"
            >
              Tìm
            </button>
          </form>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-nau-border dark:border-nau-border py-3 space-y-2 animate-slide-up">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handlePostListingClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-nau-red text-white text-xs font-bold rounded-xl shadow-md shadow-nau-red/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ĐĂNG TIN BÁN SẢN PHẨM</span>
            </button>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-nau-text dark:text-nau-text-secondary pt-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-nau-background text-center"
              >
                Trang chủ
              </Link>
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-nau-background text-center"
              >
                Đơn hàng
              </Link>
              <Link
                to="/chat"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-nau-background text-center"
              >
                Tin nhắn
              </Link>
              <Link
                to="/verification"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-nau-background text-center"
              >
                Xác thực SV
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
