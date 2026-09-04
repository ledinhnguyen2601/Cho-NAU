// File: src/components/product/ProductFilters.jsx
import React from 'react';
import { INITIAL_CATEGORIES } from '../../config/constants';
import { 
  Filter, 
  RotateCcw, 
  CheckCircle, 
  MapPin, 
  Tag, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const ProductFilters = ({
  filters,
  onChange,
  onReset
}) => {
  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-4 sm:p-5 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-nau-border">
        <div className="flex items-center gap-2 text-nau-text dark:text-nau-text font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-nau-red dark:text-nau-red-hover" />
          <span>Bộ Lọc Sản Phẩm</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-nau-text-muted hover:text-nau-red dark:hover:text-nau-red-hover transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider mb-2.5">
          Danh mục
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => updateFilter('category', 'all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              filters.category === 'all' || !filters.category
                ? 'bg-nau-red-light dark:bg-nau-red-dark/30 text-nau-red dark:text-nau-red-hover font-bold border-l-2 border-nau-red'
                : 'text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Tất cả danh mục</span>
          </button>
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                filters.category === cat.id
                  ? 'bg-nau-red-light dark:bg-nau-red-dark/30 text-nau-red dark:text-nau-red-hover font-bold border-l-2 border-nau-red'
                  : 'text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              <span className="text-[10px] text-slate-400 font-semibold">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider mb-2.5">
          Khoảng giá (VNĐ)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={filters.minPrice || ''}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400"
          />
          <input
            type="number"
            placeholder="Đến"
            value={filters.maxPrice || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400"
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider mb-2.5">
          Tình trạng
        </label>
        <select
          value={filters.condition || 'all'}
          onChange={(e) => updateFilter('condition', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text"
        >
          <option value="all">Tất cả tình trạng</option>
          <option value="Mới">Mới 100% / Chưa bóc seal</option>
          <option value="Như mới">Như mới (95% - 99%)</option>
          <option value="Rất tốt">Rất tốt (85% - 90%)</option>
          <option value="Đã sử dụng">Đã sử dụng bình thường</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider mb-2.5">
          Khu vực / Cơ sở NAU
        </label>
        <select
          value={filters.location || 'all'}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text"
        >
          <option value="all">Tất cả khu vực NAU</option>
          <option value="Cơ sở 1">Cơ sở 1 NAU (P. Hưng Dũng)</option>
          <option value="KTX">Khu Ký Túc Xá NAU</option>
          <option value="Phong Định Cảng">Đường Phong Định Cảng</option>
          <option value="Nguyễn Viết Xuân">Đường Nguyễn Viết Xuân</option>
          <option value="Cổng trường">Khu vực Cổng trường</option>
        </select>
      </div>

      {/* Status: In Stock vs Sold */}
      <div>
        <label className="block text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider mb-2.5">
          Trạng thái giao dịch
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => updateFilter('status', 'all')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              filters.status === 'all' || !filters.status
                ? 'bg-nau-red text-white border-nau-red shadow-xs'
                : 'border-nau-border dark:border-nau-border text-nau-text-secondary dark:text-nau-text-muted hover:border-nau-red/30'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => updateFilter('status', 'active')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              filters.status === 'active'
                ? 'bg-nau-red text-white border-nau-red shadow-xs'
                : 'border-nau-border dark:border-nau-border text-nau-text-secondary dark:text-nau-text-muted hover:border-nau-red/30'
            }`}
          >
            Còn hàng
          </button>
          <button
            onClick={() => updateFilter('status', 'sold')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              filters.status === 'sold'
                ? 'bg-nau-red text-white border-nau-red shadow-xs'
                : 'border-nau-border dark:border-nau-border text-nau-text-secondary dark:text-nau-text-muted hover:border-nau-red/30'
            }`}
          >
            Đã bán
          </button>
        </div>
      </div>

      {/* Verified Sellers Only Toggle */}
      <div className="pt-2 border-t border-slate-100 dark:border-nau-border">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.verifiedOnly)}
            onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
            className="w-4 h-4 rounded text-nau-red focus:ring-nau-red border-nau-border dark:border-nau-border accent-nau-red"
          />
          <div className="flex items-center gap-1.5 text-xs font-bold text-nau-text dark:text-nau-text">
            <CheckCircle className="w-3.5 h-3.5 text-nau-success" />
            <span>Chỉ xem người bán đã xác thực</span>
          </div>
        </label>
      </div>

    </div>
  );
};
