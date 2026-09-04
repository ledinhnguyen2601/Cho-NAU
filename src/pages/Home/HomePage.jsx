// File: src/pages/Home/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  const itemsPerPage = 8;

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
    <div className="space-y-8 animate-fade-in">
      
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
            <Link
              to="/verification"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nau-red hover:bg-nau-red-hover text-white text-xs font-bold shadow-md shadow-nau-red/25 transition-all transform active:scale-95"
            >
              <span>Xác thực Thẻ Sinh Viên</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/create-product"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-nau-surface hover:bg-nau-blue-light/40 border border-nau-blue text-nau-blue dark:text-nau-blue-light text-xs font-bold transition-all shadow-xs"
            >
              <span>Đăng bán đồ cũ ngay</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Icons Bar */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-nau-text dark:text-nau-text flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-nau-red" />
            <span>Danh Mục Sản Phẩm</span>
          </h2>
          <button
            onClick={() => {
              handleCategorySelect('all');
              const el = document.getElementById('marketplace-products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-nau-red dark:text-nau-red-hover hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Tất cả danh mục</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Card: Tất cả sản phẩm */}
          <button
            onClick={() => handleCategorySelect('all')}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group cursor-pointer ${
              filters.category === 'all' || !filters.category
                ? 'bg-nau-red text-white border-nau-red shadow-md shadow-nau-red/20'
                : 'bg-nau-surface dark:bg-nau-background border-nau-border/80 dark:border-nau-border text-nau-text dark:text-nau-text-secondary hover:border-nau-red/40 hover:shadow-xs'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                filters.category === 'all' || !filters.category
                  ? 'bg-white/20 text-white'
                  : 'bg-nau-red-light dark:bg-nau-red-dark/20 text-nau-red dark:text-nau-red-hover group-hover:bg-nau-red group-hover:text-white'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate leading-tight">
                Tất cả sản phẩm
              </p>
              <p className={`text-[10px] ${filters.category === 'all' || !filters.category ? 'text-white/80' : 'text-slate-400'}`}>
                Toàn bộ tin đăng
              </p>
            </div>
          </button>

          {INITIAL_CATEGORIES.map((cat) => {
            const IconComponent = typeof cat.icon === 'function' ? cat.icon : (iconMap[cat.icon] || Package);
            const isSelected = filters.category === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group cursor-pointer ${
                  isSelected
                    ? 'bg-nau-red text-white border-nau-red shadow-md shadow-nau-red/20'
                    : 'bg-nau-surface dark:bg-nau-background border-nau-border/80 dark:border-nau-border text-nau-text dark:text-nau-text-secondary hover:border-nau-red/40 hover:shadow-xs'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-nau-red-light dark:bg-nau-red-dark/20 text-nau-red dark:text-nau-red-hover group-hover:bg-nau-red group-hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate leading-tight">
                    {cat.name}
                  </p>
                  <p className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    Danh mục NAU
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Marketplace Content: Filter Sidebar + Products Grid */}
      <section id="marketplace-products" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between bg-nau-surface dark:bg-nau-background p-3 rounded-2xl border border-nau-border dark:border-nau-border">
          <span className="text-xs font-bold text-nau-text dark:text-nau-text-secondary">
            {products.length} sản phẩm phù hợp
          </span>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-nau-red text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Lọc sản phẩm</span>
          </button>
        </div>

        {/* Mobile Filter Modal Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="relative min-h-screen p-4 flex items-center justify-center">
              <div className="w-full max-w-md bg-nau-surface dark:bg-nau-background rounded-2xl p-4 z-10 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-nau-border">
                  <h3 className="font-bold text-sm">Bộ lọc tìm kiếm</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ProductFilters
                  filters={filters}
                  onChange={setFilters}
                  onReset={handleResetFilters}
                />
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-nau-red text-white text-xs font-bold rounded-xl shadow-md shadow-nau-red/25"
                >
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid & Sorting Bar */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Bar: Results Count & Sort Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-nau-surface dark:bg-nau-background p-3.5 rounded-2xl border border-nau-border/80 dark:border-nau-border shadow-sm">
            <div className="text-xs font-semibold text-nau-text-secondary dark:text-nau-text-muted">
              Hiển thị <span className="font-bold text-nau-text dark:text-nau-text">{products.length}</span> tin đăng đồ cũ sinh viên
              {filters.search && <span className="italic"> cho từ khóa "{filters.search}"</span>}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-nau-text-muted hidden sm:inline">Sắp xếp:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text focus:outline-none focus:border-nau-red focus:ring-2 focus:ring-nau-red/20"
              >
                <option value="newest">Mới đăng nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="popular">Xem nhiều nhất</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={paginatedProducts}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </section>

    </div>
  );
};
