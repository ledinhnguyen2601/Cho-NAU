// File: src/pages/Admin/AdminProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, updateProduct } from '../../services/productService';
import { ProductModerationTable } from '../../components/admin/ProductModerationTable';
import { useToast } from '../../context/ToastContext';
import { Package, Search, Filter } from 'lucide-react';

export const AdminProductsPage = () => {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin đăng này vĩnh viễn khỏi hệ thống?')) {
      await deleteProduct(productId);
      toast.success('Đã xóa sản phẩm thành công.');
      loadProducts();
    }
  };

  const handleToggleStatus = async (productId, status) => {
    await updateProduct(productId, { status });
    toast.success('Đã cập nhật trạng thái tin đăng.');
    loadProducts();
  };

  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || (
      p.title.toLowerCase().includes(q) ||
      p.sellerName.toLowerCase().includes(q)
    );
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
          <Package className="w-6 h-6 text-nau-primary" />
          <span>Kiểm Duyệt Sản Phẩm & Tin Đăng ({products.length})</span>
        </h1>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
          Giám sát nội dung, gỡ bỏ hàng cấm hoặc sản phẩm vi phạm quy định cộng đồng NAU
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề sản phẩm hoặc tên người bán..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="sach-giao-trinh">Sách / Giáo trình</option>
            <option value="laptop">Laptop & Máy tính</option>
            <option value="dien-thoai">Điện thoại</option>
            <option value="xe-phuong-tien">Xe đạp / Xe máy</option>
            <option value="phong-tro">Phòng trọ</option>
          </select>
        </div>
      </div>

      <ProductModerationTable
        products={filteredProducts}
        onDeleteProduct={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};
