// File: src/components/admin/ProductModerationTable.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Button } from '../common/Button';
import { 
  Eye, 
  Trash2, 
  CheckCircle, 
  ExternalLink,
  MapPin
} from 'lucide-react';

export const ProductModerationTable = ({
  products = [],
  onDeleteProduct,
  onToggleStatus
}) => {
  return (
    <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-nau-background dark:bg-nau-surface/60 text-nau-text-muted dark:text-nau-text-muted font-bold uppercase tracking-wider border-b border-slate-100 dark:border-nau-border">
            <tr>
              <th className="px-4 py-3.5">Sản phẩm</th>
              <th className="px-4 py-3.5">Người đăng</th>
              <th className="px-4 py-3.5">Danh mục</th>
              <th className="px-4 py-3.5">Giá bán</th>
              <th className="px-4 py-3.5">Trạng thái</th>
              <th className="px-4 py-3.5">Ngày đăng</th>
              <th className="px-4 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-nau-text dark:text-nau-text-secondary">
            {products.map((p) => {
              const isSold = p.status === 'sold';

              return (
                <tr key={p.id} className="hover:bg-nau-background/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Product Info */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                        alt={p.title}
                        className="w-10 h-10 rounded-xl object-cover border border-nau-border dark:border-nau-border shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <Link
                          to={`/product/${p.id}`}
                          className="font-bold text-nau-text dark:text-nau-text hover:text-nau-primary dark:hover:text-nau-primary line-clamp-1"
                        >
                          {p.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {p.location}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Seller */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 font-semibold text-nau-text dark:text-nau-text">
                      <span>{p.sellerName}</span>
                      {p.sellerVerified && (
                        <CheckCircle className="w-3.5 h-3.5 text-nau-success shrink-0" />
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-nau-surface text-nau-text-secondary dark:text-nau-text-muted font-semibold text-[11px]">
                      {p.categoryName || p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-nau-primary dark:text-nau-primary">
                      {formatCurrency(p.price)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      isSold
                        ? 'bg-slate-100 text-nau-text-secondary dark:bg-nau-surface dark:text-nau-text-muted'
                        : 'bg-nau-success text-nau-success dark:bg-nau-success/20 dark:text-nau-success'
                    }`}>
                      {isSold ? 'Đã bán' : 'Đang bán'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                    {formatDateTime(p.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/product/${p.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-nau-border dark:border-nau-border hover:bg-slate-100 dark:hover:bg-slate-800 text-nau-text-secondary dark:text-nau-text-secondary"
                        title="Xem trang sản phẩm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDeleteProduct(p.id)}
                        title="Xóa tin đăng vi phạm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
