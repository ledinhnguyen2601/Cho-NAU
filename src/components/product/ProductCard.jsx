// File: src/components/product/ProductCard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { toggleSaveProduct, getSavedProductIds } from '../../services/productService';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { 
  Bookmark, 
  ShoppingCart, 
  MapPin, 
  CheckCircle, 
  Star, 
  Eye, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { currentUser, isVerified } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const isSold = product.status === 'sold';
  
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    if (!currentUser) {
      setIsSaved(false);
      return;
    }
    const checkSaved = async () => {
      const savedIds = await getSavedProductIds(currentUser.id);
      setIsSaved(savedIds.includes(product.id));
    };
    checkSaved();
  }, [currentUser, product.id]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để lưu tin đăng.');
      navigate('/login');
      return;
    }
    const saved = await toggleSaveProduct(currentUser.id, product.id);
    setIsSaved(saved);
    toast.success(saved ? 'Đã lưu sản phẩm vào danh sách yêu thích!' : 'Đã bỏ lưu sản phẩm.');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSold) return;
    addToCart(product, 1);
    toast.success(`Đã thêm "${product.title}" vào giỏ hàng!`);
  };

  return (
    <div
      className={`group relative bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border/90 dark:border-nau-border/90 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col h-full ${
        isSold ? 'opacity-75 grayscale-[20%]' : ''
      }`}
    >
      {/* Product Image Thumbnail */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-nau-surface">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-white/20 text-white text-xs font-black tracking-wider uppercase shadow-lg">
              ĐÃ BÁN
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-lg bg-nau-warning text-nau-text text-[10px] font-extrabold flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-slate-900" />
              Nổi bật
            </span>
          )}
          <span className="px-2 py-0.5 rounded-lg bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-semibold">
            {product.categoryName || 'Sản phẩm'}
          </span>
        </div>

        {/* Save / Bookmark Button */}
        <button
          onClick={handleToggleSave}
          type="button"
          className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-nau-surface/80 dark:bg-nau-background/80 backdrop-blur-md text-nau-text dark:text-nau-text-secondary hover:text-nau-red dark:hover:text-nau-red-hover transition-colors shadow-md"
          title={isSaved ? 'Bỏ lưu tin' : 'Lưu tin này'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-nau-red text-nau-red' : ''}`} />
        </button>
      </Link>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Original Price */}
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-base sm:text-lg font-black text-nau-red dark:text-nau-red-hover">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-nau-red dark:group-hover:text-nau-red-hover transition-colors mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-nau-text dark:text-nau-text line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Condition Tag & Location on separate row below title */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-nau-text-muted dark:text-nau-text-muted">
            {product.condition && (
              <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-nau-surface text-[10px] font-medium text-slate-600 dark:text-slate-300">
                {product.condition}
              </span>
            )}
            <div className="flex items-center gap-0.5 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
          </div>
        </div>

        {/* Footer: Seller info & Actions */}
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-nau-border flex items-center justify-between gap-2">
          {/* Seller */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={product.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
              alt={product.sellerName}
              className="w-6 h-6 rounded-full object-cover border border-nau-border dark:border-nau-border shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-semibold text-nau-text dark:text-nau-text truncate">
                  {product.sellerName}
                </span>
                {product.sellerVerified && (
                  <CheckCircle className="w-3 h-3 text-nau-success shrink-0" title="Sinh viên đã xác thực" />
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-nau-warning font-medium">
                <Star className="w-2.5 h-2.5 fill-nau-warning text-nau-warning" />
                <span>{product.sellerRating || 5.0}</span>
                <span className="text-slate-400">({product.sellerRatingCount || 0})</span>
              </div>
            </div>
          </div>

          {/* Action Button: Quick Add to Cart */}
          {!isSold ? (
            <button
              onClick={handleAddToCart}
              type="button"
              className="p-2 rounded-xl bg-nau-red-light hover:bg-nau-red text-nau-red hover:text-white dark:bg-nau-surface dark:hover:bg-nau-red dark:text-nau-red dark:hover:text-white transition-all shadow-xs active:scale-95 shrink-0"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-nau-surface px-2 py-1 rounded-lg">
              Đã giao dịch
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
