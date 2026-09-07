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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4.5">
        {Array.from({ length: 10 }).map((_, i) => (
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
      {/* Products Grid - 2 Cột trên Mobile, 4-5 Cột trên PC chuẩn Chợ Tốt */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4.5">
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
