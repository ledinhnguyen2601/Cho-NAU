// File: src/pages/Cart/CartPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createOrder } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  PackageOpen,
  Building2,
  Check
} from 'lucide-react';

export const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItemsCount } = useCart();
  const { currentUser, isVerified } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('Khuôn viên Cơ sở 1 - Đại học Nghệ An (TP. Vinh)');
  const [note, setNote] = useState('Giao trực tiếp và kiểm tra đồ tại sảnh');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 animate-fade-in">
        <EmptyState
          icon={ShoppingCart}
          title="Giỏ hàng của bạn đang trống"
          description="Hãy khám phá các đồ dùng học tập, laptop và giáo trình cũ đang được sinh viên NAU thanh lý giá tốt!"
          actionLabel="Khám phá chợ ngay"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để tiến hành đặt hàng.');
      navigate('/login');
      return;
    }

    if (!isVerified) {
      toast.warning('Bạn cần xác thực danh tính sinh viên NAU trước khi đặt mua hàng.');
      navigate('/verification');
      return;
    }

    setIsCheckingOut(true);
    try {
      // Create orders for each distinct item in cart
      for (const item of items) {
        await createOrder({
          buyerId: currentUser.id,
          buyerName: currentUser.name,
          sellerId: item.product.sellerId,
          sellerName: item.product.sellerName,
          productId: item.product.id,
          productTitle: item.product.title,
          productImage: item.product.images?.[0] || '',
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
          deliveryAddress,
          note
        });
      }

      clearCart();
      toast.success('Đặt hàng thành công! Người bán sẽ nhận được thông báo để xác nhận giao dịch.');
      navigate('/orders');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tạo đơn hàng.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Page Title */}
      <div className="flex items-center justify-between pb-4 border-b border-nau-border dark:border-nau-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-nau-primary" />
            <span>Giỏ Hàng Giao Dịch ({totalItemsCount} món đồ)</span>
          </h1>
          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
            Giao nhận trực tiếp an toàn trong khuôn viên Đại học Nghệ An
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-nau-danger transition-colors"
        >
          Xóa toàn bộ giỏ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Cart Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-4 shadow-sm flex items-start sm:items-center gap-4"
            >
              {/* Product Image */}
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'}
                alt={product.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 dark:bg-nau-surface shrink-0 border border-nau-border dark:border-nau-border"
              />

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${product.id}`}
                  className="font-bold text-xs sm:text-sm text-nau-text dark:text-nau-text hover:text-nau-primary dark:hover:text-nau-primary line-clamp-1 mb-1"
                >
                  {product.title}
                </Link>

                <p className="text-xs font-semibold text-nau-primary dark:text-nau-primary mb-1">
                  {formatCurrency(product.price)}
                </p>

                <p className="text-[11px] text-slate-400 truncate">
                  Người bán: {product.sellerName}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center border border-nau-border dark:border-nau-border rounded-xl overflow-hidden bg-nau-background dark:bg-nau-surface">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1.5 text-nau-text-muted hover:text-nau-text dark:hover:text-slate-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 text-xs font-bold text-nau-text dark:text-nau-text">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1.5 text-nau-text-muted hover:text-nau-text dark:hover:text-slate-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-slate-400 hover:text-nau-danger transition-colors"
                  title="Xóa khỏi giỏ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Checkout Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleCheckout}
            className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 shadow-sm space-y-4"
          >
            <h3 className="font-bold text-sm text-nau-text dark:text-nau-text uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-nau-border">
              Thông Tin Nhận Đồ & Thanh Toán
            </h3>

            <Input
              label="Địa điểm hẹn giao dịch tại NAU"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Ví dụ: Cổng 1, Thư viện NAU, Phòng 302 KTX..."
            />

            <div>
              <label className="block text-xs font-bold text-nau-text dark:text-nau-text mb-1.5">
                Ghi chú cho người bán
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Khung giờ rảnh hoặc dặn dò khi xem đồ..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text"
              />
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-slate-100 dark:border-nau-border space-y-2 text-xs">
              <div className="flex justify-between text-nau-text-secondary dark:text-nau-text-muted">
                <span>Tổng tiền hàng:</span>
                <span className="font-semibold text-nau-text dark:text-nau-text">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-nau-text-secondary dark:text-nau-text-muted">
                <span>Phí dịch vụ sàn NAU:</span>
                <span className="font-bold text-nau-success dark:text-nau-success">Miễn phí (0 ₫)</span>
              </div>
              <div className="flex justify-between text-sm font-black text-nau-text dark:text-nau-text pt-2 border-t border-slate-100 dark:border-nau-border">
                <span>Tổng cộng thanh toán:</span>
                <span className="text-lg text-nau-primary dark:text-nau-primary">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {/* Verification Guard Alert */}
            {currentUser && !isVerified && (
              <div className="p-3 rounded-xl bg-nau-warning/10 dark:bg-nau-warning/20 border border-nau-warning/30 dark:border-nau-warning/40 text-[11px] text-nau-warning dark:text-nau-warning flex items-center justify-between gap-2">
                <span>Bạn cần xác thực Thẻ sinh viên trước khi đặt hàng.</span>
                <Link to="/verification" className="font-bold text-nau-warning underline shrink-0">
                  Xác thực ngay
                </Link>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isCheckingOut}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Tiến Hành Đặt Mua
            </Button>
          </form>
        </div>

      </div>

    </div>
  );
};
