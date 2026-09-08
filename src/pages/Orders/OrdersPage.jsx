// File: src/pages/Orders/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getUserOrders, updateOrderStatus } from '../../services/orderService';
import { OrderCard } from '../../components/order/OrderCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { 
  Package, 
  ShoppingBag, 
  Store, 
  Clock, 
  CheckCheck, 
  Filter 
} from 'lucide-react';

export const OrdersPage = () => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'buyer' | 'seller'
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadOrders = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const data = await getUserOrders(currentUser.id, activeTab);
      setOrders(data);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentUser, activeTab]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border text-center space-y-4 shadow-sm">
        <Package className="w-12 h-12 text-nau-primary mx-auto" />
        <h2 className="text-lg font-bold text-nau-text dark:text-nau-text">
          Vui lòng đăng nhập
        </h2>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
          Bạn cần đăng nhập để quản lý các đơn hàng mua và bán.
        </p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-nau-primary text-white text-xs font-bold rounded-xl">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, currentUser.id);
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      loadOrders();
    } catch (err) {
      toast.error(err.message || 'Không thể cập nhật trạng thái đơn hàng.');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
          <Package className="w-6 h-6 text-nau-primary" />
          <span>Quản Lý Đơn Hàng Giao Dịch</span>
        </h1>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
          Theo dõi lịch trình trao đổi, xác nhận đơn và đánh giá người bán sau khi nhận đồ
        </p>
      </div>

      {/* Tabs & Status Filter */}
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Main Tab */}
        <div className="flex gap-1 bg-slate-100 dark:bg-nau-surface p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-nau-surface dark:bg-nau-background text-nau-primary shadow-sm'
                : 'text-nau-text-secondary dark:text-nau-text-muted'
            }`}
          >
            Tất cả đơn ({orders.length})
          </button>
          <button
            onClick={() => { setActiveTab('buyer'); setCurrentPage(1); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'buyer'
                ? 'bg-nau-surface dark:bg-nau-background text-nau-primary shadow-sm'
                : 'text-nau-text-secondary dark:text-nau-text-muted'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Đơn mua</span>
          </button>
          <button
            onClick={() => { setActiveTab('seller'); setCurrentPage(1); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'seller'
                ? 'bg-nau-surface dark:bg-nau-background text-nau-primary shadow-sm'
                : 'text-nau-text-secondary dark:text-nau-text-muted'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Đơn bán</span>
          </button>
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận / Đang giao</option>
            <option value="completed">Giao dịch thành công</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-200 dark:bg-nau-surface animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Chưa có đơn hàng nào"
          description="Hiện tại bạn chưa có giao dịch nào ở mục này. Hãy tìm kiếm đồ cũ cần mua trên sàn nhé!"
          actionLabel="Xem sản phẩm đang bán"
          onAction={() => window.location.href = '/'}
        />
      ) : (
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              currentUserId={currentUser.id}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="pt-4"
            />
          )}
        </div>
      )}

    </div>
  );
};
