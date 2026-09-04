// File: src/components/admin/OrderModerationTable.jsx
import React from 'react';
import { OrderStatusBadge } from '../order/OrderStatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { MapPin, User, Package } from 'lucide-react';

export const OrderModerationTable = ({ orders = [] }) => {
  return (
    <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-nau-background dark:bg-nau-surface/60 text-nau-text-muted dark:text-nau-text-muted font-bold uppercase tracking-wider border-b border-slate-100 dark:border-nau-border">
            <tr>
              <th className="px-4 py-3.5">Mã đơn & Ngày tạo</th>
              <th className="px-4 py-3.5">Sản phẩm</th>
              <th className="px-4 py-3.5">Người mua</th>
              <th className="px-4 py-3.5">Người bán</th>
              <th className="px-4 py-3.5">Tổng tiền</th>
              <th className="px-4 py-3.5">Địa điểm hẹn giao</th>
              <th className="px-4 py-3.5">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-nau-text dark:text-nau-text-secondary">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-nau-background/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5">
                  <p className="font-bold text-nau-text dark:text-nau-text">
                    {o.id}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatDateTime(o.createdAt)}
                  </p>
                </td>

                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={o.productImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80'}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover border border-nau-border dark:border-nau-border shrink-0"
                    />
                    <span className="font-semibold text-nau-text dark:text-nau-text truncate max-w-[160px]">
                      {o.productTitle}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3.5 font-medium text-nau-text dark:text-nau-text">
                  {o.buyerName}
                </td>

                <td className="px-4 py-3.5 font-medium text-nau-text dark:text-nau-text">
                  {o.sellerName}
                </td>

                <td className="px-4 py-3.5 font-bold text-nau-primary dark:text-nau-primary">
                  {formatCurrency(o.totalPrice)}
                </td>

                <td className="px-4 py-3.5 text-nau-text-muted dark:text-nau-text-muted max-w-[150px] truncate">
                  {o.deliveryAddress || 'Đại học Nghệ An'}
                </td>

                <td className="px-4 py-3.5">
                  <OrderStatusBadge status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
