// File: src/pages/Home/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts } from '../../services/productService';
import { INITIAL_CATEGORIES } from '../../config/constants';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductFilters } from '../../components/product/ProductFilters';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  BookOpen, 
  Laptop, 
  Smartphone, 
  Tv, 
  Headphones, 
  Bike, 
  Home, 
  Utensils, 
  Shirt, 
  Package,
  SlidersHorizontal,
  LayoutGrid,
  X
} from 'lucide-react';

const iconMap = {
  BookOpen,
  Laptop,
  Smartphone,
  Tv,
  Headphones,
  Bike,
  Home,
  Utensils,
  Shirt,
  Package
};

export const HomePage = () => {
  const { currentUser, isVerified } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';

  const [filters, setFilters] = useState({
    search: searchParam,
    category: categoryParam,
    minPrice: '',
    maxPrice: '',
    condition: 'all',
    location: 'all',
    verifiedOnly: false,
    status: 'active',
    sortBy: 'newest'
  });

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = 10;

  // Sync state with URL params
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchParam,
      category: categoryParam
    }));
  }, [searchParam, categoryParam]);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts(filters);
        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        console.error('Fetch products error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleCategorySelect = (catId) => {
    const newCat = filters.category === catId ? 'all' : catId;
    setFilters(prev => ({ ...prev, category: newCat }));
    if (newCat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCat);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setActiveTab('all');
    setFilters({
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      condition: 'all',
      location: 'all',
      verifiedOnly: false,
      status: 'all',
      sortBy: 'newest'
    });
    setSearchParams({});
  };

  // Pagination calculation
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Hero Banner Section - Phong cách trang nhã chuẩn Cổng người học NAU */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-50/90 via-white to-red-50/40 dark:from-slate-900 dark:via-nau-surface dark:to-slate-900 border border-red-100/80 dark:border-nau-border p-6 sm:p-10 shadow-sm transition-colors">
        {/* Background glow tints */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-nau-red-light/70 dark:bg-nau-red-dark/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-nau-blue-light/50 dark:bg-nau-blue-dark/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nau-red-light dark:bg-nau-red-dark/30 text-nau-red dark:text-nau-red-hover text-xs font-bold border border-nau-red/20 dark:border-nau-red/30 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-nau-red dark:text-nau-red-hover" />
            <span>Sàn Thương Mại Điện Tử Sinh Viên NAU</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-nau-text dark:text-white">
            Mua Bán & Trao Đổi Đồ Cũ <br className="hidden sm:block" />
            <span className="text-nau-red">An Toàn - Giá Rẻ - Uy Tín</span>
          </h1>

          <p className="text-xs sm:text-sm text-nau-text-secondary dark:text-nau-text-muted leading-relaxed max-w-xl">
            Tiết kiệm chi phí học tập với hàng ngàn sách giáo trình, laptop, xe cộ và đồ dùng sinh hoạt được xác thực 100% từ sinh viên & giảng viên Đại học Nghệ An.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isVerified && (
              <Link
                to={currentUser ? "/verification" : "/login"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nau-red hover:bg-nau-red-hover text-white text-xs font-bold shadow-md shadow-nau-red/25 transition-all transform active:scale-95"
              >
                <span>Xác thực Thẻ Sinh Viên</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              to="/create-product"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isVerified
                  ? 'bg-nau-red hover:bg-nau-red-hover text-white shadow-md shadow-nau-red/25 active:scale-95'
                  : 'bg-white dark:bg-nau-surface hover:bg-nau-blue-light/40 border border-nau-blue text-nau-blue dark:text-nau-blue-light'
              }`}
            >
              <span>Đăng bán đồ cũ ngay</span>
              {isVerified && <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </section>

      {/* Category Icons Bar - Phong cách Chợ Tốt chuẩn (Gọn gàng, Icon trên chữ dưới) */}
      <section className="bg-nau-surface dark:bg-nau-background rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-nau-border dark:border-nau-border shadow-xs space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs sm:text-sm font-bold text-nau-text dark:text-nau-text flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-nau-red" />
            <span>Khám Phá Danh Mục NAU</span>
          </h2>
          {filters.category !== 'all' && (
            <button
              onClick={() => handleCategorySelect('all')}
              className="text-[11px] font-semibold text-nau-red dark:text-nau-red-hover hover:underline cursor-pointer"
            >
              Xem tất cả
            </button>
          )}
        </div>

        {/* Scrollable category ribbon */}
        <div className="flex items-start gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1 px-1">
          {/* Item: Tất cả */}
          <button
            onClick={() => handleCategorySelect('all')}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all shrink-0 cursor-pointer min-w-[72px] sm:min-w-[82px] group ${
              filters.category === 'all' || !filters.category
                ? 'text-nau-red dark:text-nau-red-hover font-bold'
                : 'text-nau-text-secondary dark:text-nau-text-muted hover:text-nau-text'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              filters.category === 'all' || !filters.category
                ? 'bg-nau-red text-white shadow-md shadow-nau-red/25 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-red-50 group-hover:text-nau-red'
            }`}>
              <LayoutGrid className="w-6 h-6" />
            </div>
            <span className="text-[11px] sm:text-xs text-center leading-tight truncate w-full">
              Tất cả
            </span>
          </button>

          {INITIAL_CATEGORIES.map((cat) => {
            const IconComponent = typeof cat.icon === 'function' ? cat.icon : (iconMap[cat.icon] || Package);
            const isSelected = filters.category === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all shrink-0 cursor-pointer min-w-[72px] sm:min-w-[84px] group ${
                  isSelected
                    ? 'text-nau-red dark:text-nau-red-hover font-bold'
                    : 'text-nau-text-secondary dark:text-nau-text-muted hover:text-nau-text'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-nau-red text-white shadow-md shadow-nau-red/25 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-red-50 group-hover:text-nau-red'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-[11px] sm:text-xs text-center leading-tight truncate w-full">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Marketplace Section - Tối ưu trọn vẹn bề ngang chuẩn Chợ Tốt (Không bị thanh sidebar che khuất) */}
      <section id="marketplace-products" className="space-y-4">
        
        {/* Chợ Tốt Style Top Filters & Tabs Bar */}
        <div className="bg-nau-surface dark:bg-nau-background rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-nau-border/80 dark:border-nau-border shadow-xs space-y-3">
          
          {/* Row 1: Tabs phân loại Chợ Tốt */}
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-nau-border pb-2.5">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '', verifiedOnly: false }));
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Dành cho bạn
              </button>
              <button
                onClick={() => {
                  setActiveTab('newest');
                  setFilters(prev => ({ ...prev, sortBy: 'newest' }));
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'newest'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Mới nhất
              </button>
              <button
                onClick={() => {
                  setActiveTab('student_price');
                  setFilters(prev => ({ ...prev, maxPrice: '100000', minPrice: '' }));
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'student_price'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Giá sinh viên (&le; 100k)
              </button>
              <button
                onClick={() => {
                  setActiveTab('verified');
                  setFilters(prev => ({ ...prev, verifiedOnly: true }));
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'verified'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Đã xác thực SV NAU
              </button>
            </div>

            <div className="text-xs text-slate-500 hidden sm:block">
              Có <span className="font-bold text-nau-text dark:text-white">{products.length}</span> tin đăng
            </div>
          </div>

          {/* Row 2: Bộ lọc nhanh thả xuống (Dropdowns) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Chọn Khu vực NAU */}
              <select
                value={filters.location || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text focus:outline-none focus:ring-1 focus:ring-nau-red"
              >
                <option value="all">Khu vực: Tất cả</option>
                <option value="Cơ sở 1">Cơ sở 1 NAU (Hưng Dũng)</option>
                <option value="KTX">Ký Túc Xá NAU</option>
                <option value="Phong Định Cảng">Phong Định Cảng</option>
                <option value="Nguyễn Viết Xuân">Nguyễn Viết Xuân</option>
                <option value="Cổng trường">Cổng trường</option>
              </select>

              {/* Chọn Khoảng giá */}
              <select
                value={
                  filters.maxPrice === '100000' && !filters.minPrice
                    ? '<100k'
                    : filters.minPrice === '100000' && filters.maxPrice === '500000'
                    ? '100k-500k'
                    : filters.minPrice === '500000'
                    ? '>500k'
                    : 'all'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '<100k') setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '100000' }));
                  else if (val === '100k-500k') setFilters(prev => ({ ...prev, minPrice: '100000', maxPrice: '500000' }));
                  else if (val === '>500k') setFilters(prev => ({ ...prev, minPrice: '500000', maxPrice: '' }));
                  else setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text focus:outline-none focus:ring-1 focus:ring-nau-red"
              >
                <option value="all">Khoảng giá: Tất cả</option>
                <option value="<100k">Dưới 100.000đ</option>
                <option value="100k-500k">100.000đ - 500.000đ</option>
                <option value=">500k">Trên 500.000đ</option>
              </select>

              {/* Chọn Tình trạng */}
              <select
                value={filters.condition || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text focus:outline-none focus:ring-1 focus:ring-nau-red"
              >
                <option value="all">Tình trạng: Tất cả</option>
                <option value="Mới">Mới 100%</option>
                <option value="Như mới">Như mới (95-99%)</option>
                <option value="Rất tốt">Rất tốt (85-90%)</option>
                <option value="Đã sử dụng">Đã sử dụng</option>
              </select>

              {/* Nút Bộ lọc chi tiết */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border hover:border-nau-red text-nau-text-secondary hover:text-nau-red transition-colors"
                title="Mở thêm bộ lọc chi tiết"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Bộ lọc khác</span>
              </button>

              {/* Nút Đặt lại nếu đang có bộ lọc */}
              {(filters.category !== 'all' || filters.minPrice || filters.maxPrice || filters.condition !== 'all' || filters.location !== 'all' || filters.verifiedOnly || filters.search) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-nau-red dark:text-nau-red-hover hover:underline font-semibold ml-1 cursor-pointer"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Sắp xếp */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs text-nau-text-muted hidden sm:inline">Sắp xếp:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text focus:outline-none focus:ring-1 focus:ring-nau-red"
              >
                <option value="newest">Mới đăng nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="popular">Xem nhiều nhất</option>
              </select>
            </div>
          </div>

        </div>

        {/* Modal Bộ lọc chi tiết (Popup gọn gàng, không làm hẹp lưới sản phẩm) */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="relative min-h-screen p-4 flex items-center justify-center">
              <div className="w-full max-w-md bg-nau-surface dark:bg-nau-background rounded-3xl p-5 z-10 space-y-4 shadow-xl border border-nau-border dark:border-nau-border">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-nau-border">
                  <h3 className="font-bold text-sm text-nau-text dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-nau-red" />
                    <span>Bộ lọc sản phẩm chi tiết</span>
                  </h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ProductFilters
                  filters={filters}
                  onChange={setFilters}
                  onReset={handleResetFilters}
                  hideCategories={true}
                />
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-nau-red hover:bg-nau-red-hover text-white text-xs font-bold rounded-xl shadow-md shadow-nau-red/25 transition-colors"
                >
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lưới sản phẩm - Tràn viền rộng rãi 4-5 cột trên PC chuẩn Chợ Tốt */}
        <ProductGrid
          products={paginatedProducts}
          isLoading={isLoading}
          onResetFilters={handleResetFilters}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      </section>

    </div>
  );
};
