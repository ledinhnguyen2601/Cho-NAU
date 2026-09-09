// File: src/pages/ManageListings/ManageListingsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  getUserProducts, 
  toggleHideProduct, 
  markProductAsSold, 
  deleteProduct 
} from '../../services/productService';
import { formatCurrency, formatDateTime, getVerificationBadgeInfo } from '../../utils/formatters';
import { NauLoadingLogo } from '../../components/brand/NauLoadingLogo';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { 
  PlusCircle, 
  Search, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Trash2, 
  Tag, 
  ExternalLink,
  Store,
  Sparkles,
  AlertCircle,
  PackageOpen
} from 'lucide-react';

export const ManageListingsPage = () => {
  const { currentUser, isVerified } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'sold_hidden' | 'expired' | 'rejected'

  // Delete modal state
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      const list = await getUserProducts(currentUser.id);
      setProducts(list);
    } catch (e) {
      console.error('Error loading user products:', e);
      toast.error('Không thể tải danh sách tin đăng.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentUser?.id]);

  // Tab counts
  const activeProducts = products.filter(p => p.status === 'active');
  const soldOrHiddenProducts = products.filter(p => p.status === 'sold' || p.status === 'hidden');
  const expiredProducts = products.filter(p => p.status === 'expired');
  const rejectedProducts = products.filter(p => p.status === 'rejected');

  // Filter based on active tab and search
  const currentTabProducts = (() => {
    let list = [];
    if (activeTab === 'active') list = activeProducts;
    else if (activeTab === 'sold_hidden') list = soldOrHiddenProducts;
    else if (activeTab === 'expired') list = expiredProducts;
    else if (activeTab === 'rejected') list = rejectedProducts;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }
    return list;
  })();

  // Toggle hide / unhide product
  const handleToggleHide = async (product) => {
    const isCurrentlyHidden = product.status === 'hidden';
    try {
      await toggleHideProduct(product.id, !isCurrentlyHidden);
      toast.success(
        !isCurrentlyHidden 
          ? 'Đã ẩn tin đăng thành công! Tin sẽ không còn hiển thị trên Chợ công khai.' 
          : 'Đã hiển thị lại tin đăng trên Chợ NAU!'
      );
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, status: !isCurrentlyHidden ? 'hidden' : 'active' } : p
      ));
    } catch (e) {
      toast.error('Có lỗi xảy ra khi thay đổi trạng thái tin.');
    }
  };

  // Mark as sold
  const handleMarkAsSold = async (product) => {
    try {
      await markProductAsSold(product.id);
      toast.success('Đã chuyển trạng thái sản phẩm sang ĐÃ BÁN!');
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, status: 'sold' } : p
      ));
    } catch (e) {
      toast.error('Lỗi khi cập nhật trạng thái đã bán.');
    }
  };

  // Delete product
  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      toast.success('Đã xóa tin đăng vĩnh viễn.');
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (e) {
      toast.error('Không thể xóa tin đăng.');
    } finally {
      setIsDeleting(false);
    }
  };

  const badgeInfo = getVerificationBadgeInfo(currentUser?.verificationStatus);

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in pb-12">
      
      {/* Top User Summary Card (Phong cách Chợ Tốt Mobile / Desktop) */}
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl sm:rounded-3xl border border-nau-border dark:border-nau-border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentUser?.name}
              className="w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-nau-red shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-nau-text dark:text-nau-text truncate">
                {currentUser?.name || 'Sinh viên NAU'}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border}`}>
                {badgeInfo.label}
              </span>
            </div>
            <p className="text-xs text-nau-text-muted dark:text-nau-text-muted truncate mt-0.5">
              {currentUser?.faculty || 'Đại học Nghệ An'} • Mã SV: <strong>{currentUser?.studentId || 'Chưa cập nhật'}</strong>
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-bold mt-1">
              <span>★ {currentUser?.ratingCount > 0 ? (currentUser?.rating || 0) : '0.0'}</span>
              <span className="text-slate-400 font-normal">({products.length} tin đăng đã tạo)</span>
            </div>
          </div>
        </div>

        {/* Post new listing action */}
        <Link
          to="/create-product"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-nau-red hover:bg-nau-red-hover text-white text-xs font-bold rounded-xl shadow-md shadow-nau-red/25 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>ĐĂNG TIN MỚI</span>
        </Link>
      </div>

      {/* Search Input for User's Listings (Phong cách Chợ Tốt) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm tin đăng của bạn theo tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nau-red/30 focus:border-nau-red shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Filter Tabs Bar (Cuộn ngang trên điện thoại chuẩn Chợ Tốt) */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-nau-border dark:border-nau-border">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'active'
              ? 'bg-nau-red text-white shadow-sm'
              : 'bg-nau-surface dark:bg-nau-background text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>ĐANG HIỂN THỊ</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'
          }`}>
            {activeProducts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sold_hidden')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'sold_hidden'
              ? 'bg-nau-red text-white shadow-sm'
              : 'bg-nau-surface dark:bg-nau-background text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>ĐÃ BÁN / ẨN TIN</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            activeTab === 'sold_hidden' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'
          }`}>
            {soldOrHiddenProducts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('expired')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'expired'
              ? 'bg-nau-red text-white shadow-sm'
              : 'bg-nau-surface dark:bg-nau-background text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>HẾT HẠN</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            activeTab === 'expired' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'
          }`}>
            {expiredProducts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rejected')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'rejected'
              ? 'bg-nau-red text-white shadow-sm'
              : 'bg-nau-surface dark:bg-nau-background text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>BỊ TỪ CHỐI</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            activeTab === 'rejected' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'
          }`}>
            {rejectedProducts.length}
          </span>
        </button>
      </div>

      {/* Products Listings List */}
      {isLoading ? (
        <div className="p-12 text-center">
          <NauLoadingLogo size="sm" text="Đang tải tin đăng của bạn..." />
        </div>
      ) : currentTabProducts.length === 0 ? (
        /* Empty State chuẩn phong cách Chợ Tốt */
        <div className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto text-nau-red">
            <PackageOpen className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-nau-text dark:text-nau-text">
              Không tìm thấy tin đăng
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm 
                ? `Không có tin nào khớp với từ khóa "${searchTerm}".`
                : activeTab === 'sold_hidden' 
                ? 'Bạn chưa có tin nào được đánh dấu đã bán hoặc ẩn.'
                : 'Bạn hiện chưa có tin nào trong mục này.'}
            </p>
          </div>
          <Link
            to="/create-product"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-nau-red hover:bg-nau-red-hover text-white text-xs font-bold rounded-xl shadow-md shadow-nau-red/25 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng tin bán ngay</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {currentTabProducts.map((product) => {
            const isSold = product.status === 'sold';
            const isHidden = product.status === 'hidden';

            return (
              <div
                key={product.id}
                className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-3 sm:p-4 shadow-xs hover:border-nau-red/40 transition-all flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-nau-border dark:border-nau-border">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Status Badge Over Image */}
                    {isSold && (
                      <span className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center text-white text-[10px] font-black uppercase tracking-wider">
                        ĐÃ BÁN
                      </span>
                    )}
                    {isHidden && !isSold && (
                      <span className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center text-white text-[10px] font-black uppercase tracking-wider">
                        ĐÃ ẨN
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {product.categoryName || 'Sản phẩm'}
                      </span>
                      {product.status === 'active' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          ● Đang hiển thị
                        </span>
                      )}
                      {isHidden && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          ○ Đã ẩn khỏi chợ
                        </span>
                      )}
                      {isSold && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                          ✓ Đã bán thành công
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/product/${product.id}`}
                      className="block font-bold text-xs sm:text-sm text-nau-text dark:text-nau-text hover:text-nau-red transition-colors line-clamp-1"
                    >
                      {product.title}
                    </Link>

                    <p className="text-sm font-black text-red-600 dark:text-red-400">
                      {formatCurrency(product.price)}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Đăng lúc {formatDateTime(product.createdAt)} • {product.views || 0} lượt xem
                    </p>
                  </div>
                </div>

                {/* Quick Actions (Ẩn tin khi đã bán, Hiện lại, Xóa) */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  
                  {/* View on market */}
                  <Link
                    to={`/product/${product.id}`}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                    title="Xem chi tiết tin đăng"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* 1. Nút Ẩn tin / Hiện lại tin (Theo yêu cầu User) */}
                  {product.status === 'active' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleToggleHide(product)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                        title="Ẩn tin này để không bị làm phiền trên chợ"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ẩn tin</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMarkAsSold(product)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        title="Đánh dấu sản phẩm đã giao dịch thành công"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã bán</span>
                      </button>
                    </>
                  ) : (
                    /* Hiện lại tin */
                    <button
                      type="button"
                      onClick={() => handleToggleHide(product)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-nau-blue hover:bg-nau-blue-hover text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      title="Hiện lại tin đăng trên Chợ NAU"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Hiện lại tin</span>
                    </button>
                  )}

                  {/* Delete listing */}
                  <button
                    type="button"
                    onClick={() => setDeletingProduct(product)}
                    className="p-2 rounded-xl text-red-500 hover:text-white bg-red-50 hover:bg-red-500 dark:bg-red-950/40 dark:hover:bg-red-600 transition-colors cursor-pointer"
                    title="Xóa tin đăng vĩnh viễn"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        title="Xác nhận xóa tin đăng"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-nau-text dark:text-nau-text">
              Bạn có chắc chắn muốn xóa tin này?
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Hành động này sẽ xóa vĩnh viễn tin đăng <strong>"{deletingProduct?.title}"</strong> khỏi hệ thống và không thể khôi phục lại.
            </p>
          </div>
          <div className="flex gap-2 pt-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingProduct(null)}
              disabled={isDeleting}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDelete}
              isLoading={isDeleting}
            >
              Xóa vĩnh viễn
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
