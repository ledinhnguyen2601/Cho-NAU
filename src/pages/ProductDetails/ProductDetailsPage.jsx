// File: src/pages/ProductDetails/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getProducts, toggleSaveProduct, getSavedProductIds } from '../../services/productService';
import { createOrGetConversation } from '../../services/chatService';
import { getUserRatings } from '../../services/ratingService';
import { NauLoadingLogo } from '../../components/brand/NauLoadingLogo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ImageGallery } from '../../components/product/ImageGallery';
import { ReportModal } from '../../components/product/ReportModal';
import { ProductCard } from '../../components/product/ProductCard';
import { RatingStars } from '../../components/common/RatingStars';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatRelativeTime, formatDateTime } from '../../utils/formatters';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ShoppingCart, 
  Bookmark, 
  Share2, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft, 
  Sparkles,
  User,
  Building2,
  Calendar
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isVerified } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [sellerRatings, setSellerRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getProductById(id);
        if (!data) {
          toast.error('Không tìm thấy sản phẩm này.');
          navigate('/');
          return;
        }
        setProduct(data);

        // Load seller ratings safely
        if (data.sellerId) {
          try {
            const ratings = await getUserRatings(data.sellerId);
            setSellerRatings(Array.isArray(ratings) ? ratings : []);
          } catch(e) {
            setSellerRatings([]);
          }
        }

        // Load related products safely
        try {
          const all = await getProducts({ category: data.category, status: 'active' });
          setRelatedProducts(Array.isArray(all) ? all.filter(p => p.id !== data.id).slice(0, 4) : []);
        } catch(e) {
          setRelatedProducts([]);
        }

        // Check if saved safely
        if (currentUser?.id) {
          try {
            const savedIds = await getSavedProductIds(currentUser.id);
            setIsSaved(Array.isArray(savedIds) && savedIds.includes(data.id));
          } catch(e) {
            setIsSaved(false);
          }
        }
      } catch (err) {
        console.error('Load product details error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [id, currentUser]);

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <NauLoadingLogo size="md" text="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  const isSold = product.status === 'sold';
  const isMyProduct = currentUser?.id === product.sellerId;

  const handleToggleSave = async () => {
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để lưu sản phẩm.');
      navigate('/login');
      return;
    }
    const saved = await toggleSaveProduct(currentUser.id, product.id);
    setIsSaved(saved);
    toast.success(saved ? 'Đã lưu sản phẩm vào danh sách yêu thích!' : 'Đã bỏ lưu sản phẩm.');
  };

  const handleAddToCart = () => {
    if (isSold) return;
    addToCart(product, 1);
    toast.success(`Đã thêm "${product.title}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (isSold) return;
    addToCart(product, 1);
    navigate('/cart');
  };

  const handleStartChat = async () => {
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để trao đổi với người bán.');
      navigate('/login');
      return;
    }
    if (!isVerified) {
      toast.warning('Bạn cần xác thực danh tính sinh viên NAU trước khi gửi tin nhắn.');
      navigate('/verification');
      return;
    }
    if (isMyProduct) {
      toast.info('Đây là sản phẩm do chính bạn đăng bán.');
      return;
    }

    try {
      const conv = await createOrGetConversation({
        product,
        buyer: currentUser,
        seller: {
          id: product.sellerId,
          name: product.sellerName
        }
      });
      navigate(`/chat?convId=${conv.id}`);
    } catch (err) {
      toast.error('Không thể khởi tạo cuộc trò chuyện.');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép liên kết sản phẩm vào clipboard!');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-nau-text-secondary dark:text-nau-text-muted hover:text-nau-primary dark:hover:text-nau-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text-secondary dark:text-nau-text-muted hover:text-nau-primary transition-colors shadow-sm"
            title="Chia sẻ sản phẩm"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleSave}
            className="p-2 rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text-secondary dark:text-nau-text-muted hover:text-nau-red transition-colors shadow-sm"
            title={isSaved ? 'Bỏ lưu' : 'Lưu tin'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-nau-red text-nau-red' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Image Gallery (7 cols) */}
        <div className="lg:col-span-7">
          <ImageGallery images={product.images} title={product.title} videoUrl={product.videoUrl} />
        </div>

        {/* Right Col: Details & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Top category & condition */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-nau-red-light dark:bg-nau-red-dark/30 text-nau-red dark:text-nau-red-hover text-xs font-bold border border-nau-red/20">
              {product.categoryName || 'Đồ cũ sinh viên'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-nau-surface text-nau-text dark:text-nau-text-secondary text-xs font-semibold">
              {product.condition}
            </span>
            {isSold && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-black uppercase">
                SẢN PHẨM ĐÃ BÁN
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-black text-nau-text dark:text-nau-text leading-snug">
            {product.title}
          </h1>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-nau-red-light/60 dark:bg-nau-red-dark/20 border border-nau-red/30 dark:border-nau-red/30 flex items-baseline justify-between shadow-xs">
            <div>
              <span className="text-xs text-nau-text-muted dark:text-nau-text-muted block mb-0.5">Giá bán chuyển nhượng:</span>
              <span className="text-2xl sm:text-3xl font-black text-nau-red dark:text-nau-red-hover">
                {formatCurrency(product.price)}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-right">
                <span className="text-xs text-slate-400 line-through block">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-[11px] font-bold text-nau-success dark:text-nau-success">
                  Tiết kiệm {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Location & Time */}
          <div className="space-y-2 text-xs text-nau-text-secondary dark:text-nau-text-muted py-1 border-y border-slate-100 dark:border-nau-border">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-nau-red shrink-0" />
              <span><strong>Địa điểm xem đồ:</strong> {product.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Đăng {formatRelativeTime(product.createdAt)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          {!isSold ? (
            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={<MessageSquare className="w-5 h-5" />}
                onClick={handleStartChat}
              >
                Chat Trao Đổi Với Người Bán
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<ShoppingCart className="w-4 h-4" />}
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  variant="success"
                  size="md"
                  onClick={handleBuyNow}
                >
                  Đặt Mua Ngay
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-nau-surface/80 text-center text-nau-text-muted dark:text-nau-text-muted text-xs font-semibold">
              Sản phẩm này đã được giao dịch thành công hoặc người bán đã đóng tin.
            </div>
          )}

          {/* Seller Card */}
          <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Thông tin người bán
              </span>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs font-semibold text-nau-danger hover:underline flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Báo cáo tin</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={product.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={product.sellerName}
                className="w-12 h-12 rounded-full object-cover border border-nau-border dark:border-nau-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-nau-text dark:text-nau-text truncate">
                    {product.sellerName}
                  </h4>
                  {product.sellerVerified && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-nau-success/10 text-nau-success dark:bg-nau-success/20 dark:text-nau-success border border-nau-success/30 dark:border-nau-success/40">
                      <CheckCircle className="w-3 h-3" />
                      Đã xác thực
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-nau-warning font-bold mt-0.5">
                  <RatingStars rating={product.sellerRatingCount > 0 ? (product.sellerRating || 0) : 0} size="sm" />
                  <span>{product.sellerRatingCount > 0 ? (product.sellerRating || 0) : 0}</span>
                  <span className="text-slate-400 font-normal">
                    ({product.sellerRatingCount || 0} {product.sellerRatingCount > 0 ? 'đánh giá' : 'lượt đánh giá - Mới tham gia'})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-nau-border text-[11px] text-nau-text-muted flex items-center justify-between">
              <span>Thành viên Đại học Nghệ An</span>
              <Link to={`/profile?userId=${product.sellerId}`} className="text-nau-red dark:text-nau-red-hover font-bold hover:underline">
                Xem trang uy tín →
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Description Section */}
      <section className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-nau-text dark:text-nau-text pb-3 border-b border-slate-100 dark:border-nau-border">
          Mô tả chi tiết sản phẩm
        </h2>
        <div className="text-sm text-nau-text dark:text-nau-text-secondary leading-relaxed whitespace-pre-line">
          {product.description}
        </div>
      </section>

      {/* Seller Reviews List */}
      {sellerRatings.length > 0 && (
        <section className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-nau-text dark:text-nau-text pb-3 border-b border-slate-100 dark:border-nau-border flex items-center gap-2">
            <span>Đánh giá từ sinh viên đã giao dịch</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-nau-surface text-nau-text-secondary dark:text-nau-text-muted">
              {sellerRatings.length}
            </span>
          </h2>

          <div className="space-y-3">
            {sellerRatings.map((rate) => (
              <div key={rate.id} className="p-3.5 rounded-2xl bg-nau-background dark:bg-nau-surface/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rate.reviewerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-nau-text dark:text-nau-text">
                      {rate.reviewerName}
                    </span>
                  </div>
                  <RatingStars rating={rate.stars} size="sm" />
                </div>
                <p className="text-xs text-nau-text-secondary dark:text-nau-text-secondary pl-8">
                  "{rate.comment}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-nau-text dark:text-nau-text">
            Sản phẩm tương tự cùng chuyên mục
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="product"
        targetId={product.id}
        targetTitle={product.title}
      />

    </div>
  );
};
