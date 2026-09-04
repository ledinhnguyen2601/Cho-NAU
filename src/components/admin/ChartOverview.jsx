// File: src/components/admin/ChartOverview.jsx
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, BarChart3, Inbox } from 'lucide-react';

export const ChartOverview = ({ analyticsData = {} }) => {
  const { revenueByMonth = [], categoryShare = [], hasOrdersData = false, totalProducts = 0 } = analyticsData;

  const maxRevenue = Math.max(...revenueByMonth.map(r => r.revenue || 0), 1000000);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Chart 1: Revenue & Transaction Volume (2 Columns) */}
      <div className="lg:col-span-2 bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-nau-text dark:text-nau-text flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-nau-red" />
              Tổng Giá Trị Giao Dịch Sinh Viên (GMV)
            </h3>
            <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
              Khối lượng mua bán và số đơn hoàn tất theo các tháng thực tế
            </p>
          </div>
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            Dữ liệu thời gian thực
          </span>
        </div>

        {/* Real Bar Chart or Honest Zero State */}
        {!hasOrdersData ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-b border-slate-100 dark:border-nau-border bg-slate-50/50 dark:bg-slate-900/30 rounded-xl">
            <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-bold text-nau-text dark:text-nau-text">
              Chưa phát sinh giao dịch nào
            </p>
            <p className="text-xs text-nau-text-muted dark:text-nau-text-muted max-w-sm mt-1">
              Doanh thu GMV thực tế hiện tại là 0 đ. Biểu đồ sẽ tự động ghi nhận các cột tăng trưởng ngay khi sinh viên hoàn tất đơn hàng đầu tiên.
            </p>
          </div>
        ) : (
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 border-b border-slate-100 dark:border-nau-border">
            {revenueByMonth.map((item, idx) => {
              const heightPercent = maxRevenue > 0 ? Math.round((item.revenue / maxRevenue) * 100) : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-semibold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    {formatCurrency(item.revenue)} ({item.orders} đơn)
                  </div>

                  {/* Animated Bar */}
                  <div
                    style={{ height: `${Math.max(heightPercent, item.revenue > 0 ? 8 : 2)}%` }}
                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 shadow-sm ${
                      item.revenue > 0 
                        ? 'bg-gradient-to-t from-nau-red to-nau-red/80 group-hover:from-nau-red group-hover:to-red-400' 
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />

                  {/* X-axis Label */}
                  <span className="text-[11px] font-semibold text-nau-text-muted dark:text-nau-text-muted mt-2 truncate max-w-[60px]">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-nau-text-muted dark:text-nau-text-muted pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-md bg-nau-red" />
              <span>Giá trị giao dịch (VND)</span>
            </div>
          </div>
          <span className="font-semibold text-nau-blue">Miễn phí 100% phí sàn cho sinh viên NAU</span>
        </div>
      </div>

      {/* Chart 2: Category Distribution Share */}
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-nau-text dark:text-nau-text flex items-center gap-2">
              <PieChart className="w-4 h-4 text-nau-blue" />
              Cơ Cấu Danh Mục
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Tỷ trọng</span>
          </div>

          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mb-6">
            Mặt hàng sinh viên NAU đăng bán thực tế trong hệ thống
          </p>

          {/* Real Category Progress Bars or Zero State */}
          {categoryShare.length === 0 ? (
            <div className="py-12 text-center text-xs text-nau-text-muted dark:text-nau-text-muted space-y-2">
              <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="font-bold text-nau-text dark:text-nau-text">Chưa có sản phẩm đăng bán</p>
              <p>Tỷ trọng danh mục sẽ tự động tính toán khi có bài đăng đầu tiên.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryShare.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-nau-text dark:text-nau-text-secondary">{cat.name} ({cat.count} tin)</span>
                    <span className="text-nau-text dark:text-nau-text font-bold">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-nau-surface overflow-hidden">
                    <div
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color
                      }}
                      className="h-full rounded-full transition-all duration-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-nau-border mt-6 text-xs text-nau-text-muted">
          <p className="font-semibold text-nau-blue dark:text-nau-blue-light">
            💡 Tự động cập nhật theo các bài đăng thực tế của sinh viên.
          </p>
        </div>
      </div>

    </div>
  );
};
