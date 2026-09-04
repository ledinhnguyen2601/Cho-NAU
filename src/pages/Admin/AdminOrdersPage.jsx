// File: src/pages/Admin/AdminOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../../services/orderService';
import { OrderModerationTable } from '../../components/admin/OrderModerationTable';
import { ShoppingCart, Search, Filter } from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || (
      o.id.toLowerCase().includes(q) ||
      o.productTitle.toLowerCase().includes(q) ||
      o.buyerName.toLowerCase().includes(q) ||
      o.sellerName.toLowerCase().includes(q)
    );
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-nau-primary" />
          <span>Giám Sát Toàn Bộ Đơn Hàng ({orders.length})</span>
        </h1>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
          Theo dõi dòng tiền trao đổi, lịch trình giao nhận và giải quyết khiếu nại phát sinh
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Tìm theo mã đơn hàng, tên sản phẩm, người mua/bán..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn tất thành công</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <OrderModerationTable orders={filteredOrders} />
    </div>
  );
};
