// File: src/components/order/OrderCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { createRating } from '../../services/ratingService';
import { 
  Package, 
  MapPin, 
  User, 
  Star, 
  Calendar, 
  Check, 
  X, 
  RotateCw, 
  MessageSquare 
} from 'lucide-react';

export const OrderCard = ({
  order,
  currentUserId,
  onStatusUpdate
}) => {
  const toast = useToast();
  const isBuyer = order.buyerId === currentUserId;
  const isSeller = order.sellerId === currentUserId;

  // Rating Modal state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingRating(true);
    try {
      await createRating({
        sellerId: order.sellerId,
        reviewer: {
          id: order.buyerId,
          name: order.buyerName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
        },
        orderId: order.id,
        stars,
        comment
      });
      toast.success('Đã gửi đánh giá uy tín cho người bán thành công!');
      setIsRatingModalOpen(false);
    } catch (err) {
      toast.error('Không thể gửi đánh giá.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-4 sm:p-6 shadow-sm space-y-4">
      
      {/* Top row: Order ID, Date & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-nau-border">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-nau-text dark:text-nau-text">
            Mã đơn: {order.id}
          </span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1 text-nau-text-muted dark:text-nau-text-muted">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateTime(order.createdAt)}
          </span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Main product info */}
      <div className="flex items-start gap-4">
        <img
          src={order.productImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
          alt={order.productTitle}
          className="w-20 h-20 rounded-xl object-cover bg-slate-100 dark:bg-nau-surface border border-nau-border dark:border-nau-border shrink-0"
        />
        <div className="flex-1 min-w-0">
          <Link
            to={`/product/${order.productId}`}
            className="text-sm font-bold text-nau-text dark:text-nau-text hover:text-nau-primary dark:hover:text-nau-primary line-clamp-1 mb-1"
          >
            {order.productTitle}
          </Link>
          <div className="flex items-center gap-2 text-xs text-nau-text-muted dark:text-nau-text-muted mb-2">
            <span>Số lượng: x{order.quantity || 1}</span>
            <span>•</span>
            <span className="font-semibold text-nau-primary dark:text-nau-primary">
              {formatCurrency(order.unitPrice || order.totalPrice)}
            </span>
          </div>
          <div className="text-xs text-nau-text-secondary dark:text-nau-text-secondary flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{isBuyer ? `Người bán: ${order.sellerName}` : `Người mua: ${order.buyerName}`}</span>
          </div>
        </div>
      </div>

      {/* Delivery notes & Total */}
      <div className="bg-nau-background dark:bg-nau-surface/50 p-3 rounded-xl text-xs space-y-1">
        <div className="flex items-center gap-1.5 text-nau-text-secondary dark:text-nau-text-secondary">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span><strong>Địa điểm hẹn:</strong> {order.deliveryAddress || 'Khuôn viên Đại học Nghệ An'}</span>
        </div>
        {order.note && (
          <p className="text-nau-text-muted dark:text-nau-text-muted pl-5 italic">
            Ghi chú: "{order.note}"
          </p>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs">
          <span className="text-nau-text-muted dark:text-nau-text-muted">Tổng thanh toán: </span>
          <span className="text-base font-black text-nau-primary dark:text-nau-primary ml-1">
            {formatCurrency(order.totalPrice)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Seller Action Buttons */}
          {isSeller && order.status === 'pending' && (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onStatusUpdate(order.id, 'cancelled')}
              >
                Từ chối
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStatusUpdate(order.id, 'confirmed')}
              >
                Xác nhận đơn
              </Button>
            </>
          )}

          {isSeller && order.status === 'confirmed' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'completed')}
            >
              Hoàn tất giao dịch
            </Button>
          )}

          {/* Buyer Action Buttons */}
          {isBuyer && order.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'cancelled')}
            >
              Hủy đơn
            </Button>
          )}

          {isBuyer && order.status === 'confirmed' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'completed')}
            >
              Đã nhận đồ & Hoàn tất
            </Button>
          )}

          {/* Buyer Rating Button */}
          {isBuyer && order.status === 'completed' && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Star className="w-3.5 h-3.5 text-nau-warning fill-nau-warning" />}
              onClick={() => setIsRatingModalOpen(true)}
            >
              Đánh giá người bán
            </Button>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <Modal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        title="Đánh Giá Uy Tín Người Bán"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRatingSubmit} className="space-y-4">
          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
            Đánh giá của bạn sẽ giúp cộng đồng sinh viên NAU nhận biết những người bán uy tín và chất lượng.
          </p>

          <div className="flex flex-col items-center justify-center p-4 bg-nau-background dark:bg-nau-surface rounded-2xl">
            <span className="text-xs font-bold text-nau-text dark:text-nau-text-secondary mb-2">
              Mức độ hài lòng
            </span>
            <RatingStars
              rating={stars}
              size="lg"
              interactive={true}
              onChange={setStars}
            />
            <span className="text-xs font-semibold text-nau-warning mt-2">
              {stars === 5 ? '⭐⭐⭐⭐⭐ Tuyệt vời / Rất đúng mô tả' : stars === 4 ? '⭐⭐⭐⭐ Hài lòng' : stars === 3 ? '⭐⭐⭐ Bình thường' : 'Cần cải thiện'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-nau-text dark:text-nau-text-secondary mb-1.5">
              Nhận xét chi tiết
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Sản phẩm dùng tốt, người bán thân thiện và đúng giờ tại cổng NAU..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 focus:ring-2 focus:ring-nau-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-nau-border">
            <Button variant="outline" size="sm" onClick={() => setIsRatingModalOpen(false)}>
              Bỏ qua
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmittingRating}>
              Gửi đánh giá
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
