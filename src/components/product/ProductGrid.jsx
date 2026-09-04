// File: src/components/product/ProductGrid.jsx
import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Pagination } from '../common/Pagination';
import { PackageSearch } from 'lucide-react';

export const ProductGrid = ({
  products = [],
  isLoading = false,
  onResetFilters,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Không tìm thấy sản phẩm nào"
        description="Hãy thử thay đổi từ khóa tìm kiếm hoặc làm mới bộ lọc để xem các đồ dùng sinh viên khác nhé!"
        actionLabel="Xóa bộ lọc & Xem tất cả"
        onAction={onResetFilters}
        className="my-8"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="pt-4"
        />
      )}
    </div>
  );
};
