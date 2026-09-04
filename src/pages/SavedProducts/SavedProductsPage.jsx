// File: src/pages/SavedProducts/SavedProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSavedProductIds, getProducts } from '../../services/productService';
import { ProductGrid } from '../../components/product/ProductGrid';
import { EmptyState } from '../../components/common/EmptyState';
import { Bookmark, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedProductsPage = () => {
  const { currentUser } = useAuth();
  const [savedProducts, setSavedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSaved = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const savedIds = await getSavedProductIds(currentUser.id);
        const all = await getProducts();
        const filtered = all.filter(p => savedIds.includes(p.id));
        setSavedProducts(filtered);
      } catch (err) {
        console.error('Load saved error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSaved();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border text-center space-y-4">
        <Bookmark className="w-12 h-12 text-nau-primary mx-auto" />
        <h2 className="text-lg font-bold">Vui lòng đăng nhập</h2>
        <p className="text-xs text-nau-text-muted">Đăng nhập để xem danh sách tin đăng đã lưu.</p>
        <Link to="/login" className="inline-block px-5 py-2.5 bg-nau-primary text-white text-xs font-bold rounded-xl">
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-nau-red fill-nau-red" />
          <span>Tin Đăng Đã Lưu ({savedProducts.length})</span>
        </h1>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
          Các sản phẩm bạn đang quan tâm theo dõi trên Chợ NAU
        </p>
      </div>

      <ProductGrid
        products={savedProducts}
        isLoading={isLoading}
        onResetFilters={() => window.location.href = '/'}
      />
    </div>
  );
};
