// File: src/components/order/OrderStatusBadge.jsx
import React from 'react';
import { Clock, CheckCircle2, CheckCheck, XCircle } from 'lucide-react';

export const OrderStatusBadge = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-nau-warning/10 dark:bg-nau-warning/20 text-nau-warning dark:text-nau-warning border border-nau-warning/30 dark:border-nau-warning/40">
          <Clock className="w-3.5 h-3.5" />
          <span>Chờ xác nhận</span>
        </span>
      );
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-nau-primary-light dark:bg-nau-primary/20 text-nau-primary-hover dark:text-nau-primary border border-nau-primary/30 dark:border-nau-primary/40">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Đã xác nhận / Đang giao</span>
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-nau-success/10 dark:bg-nau-success/20 text-nau-success dark:text-nau-success border border-nau-success/30 dark:border-nau-success/40">
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Giao dịch thành công</span>
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-nau-danger/20 text-nau-danger dark:text-red-400 border border-nau-danger/30 dark:border-nau-danger/40">
          <XCircle className="w-3.5 h-3.5" />
          <span>Đã hủy đơn</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-nau-text">
          {status}
        </span>
      );
  }
};
