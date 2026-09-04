// File: src/components/admin/ChartOverview.jsx
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, Users, PieChart, BarChart3 } from 'lucide-react';

export const ChartOverview = ({ analyticsData }) => {
  const { userGrowth = [], revenueByMonth = [], categoryShare = [] } = analyticsData;

  const maxRevenue = Math.max(...revenueByMonth.map(r => r.revenue), 100000000);
  const maxUsers = Math.max(...userGrowth.map(u => u.users), 1200);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Chart 1: Revenue & Transaction Volume (2 Columns) */}
      <div className="lg:col-span-2 bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-nau-text dark:text-nau-text flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-nau-primary" />
              Tổng Giá Trị Giao Dịch Sinh Viên (GMV)
            </h3>
            <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
              Khối lượng mua bán và số đơn hoàn tất theo các tháng gần nhất
            </p>
          </div>
          <span className="px-2.5 py-1 bg-nau-success/10 dark:bg-nau-success/20 text-nau-success dark:text-nau-success rounded-full text-xs font-bold border border-nau-success/30 dark:border-nau-success/40 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +32.4%
          </span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 border-b border-slate-100 dark:border-nau-border">
          {revenueByMonth.map((item, idx) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-semibold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  {formatCurrency(item.revenue)} ({item.orders} đơn)
                </div>

                {/* Animated Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-nau-red to-nau-red/80 group-hover:from-nau-red group-hover:to-red-400 transition-all duration-500 shadow-sm"
                />

                {/* X-axis Label */}
                <span className="text-[11px] font-semibold text-nau-text-muted dark:text-nau-text-muted mt-2 truncate max-w-[60px]">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-nau-text-muted dark:text-nau-text-muted pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-md bg-nau-primary" />
              <span>Giá trị giao dịch (VND)</span>
            </div>
          </div>
          <span className="font-semibold">Miễn phí 100% phí sàn cho sinh viên</span>
        </div>
      </div>

      {/* Chart 2: Category Distribution Share */}
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-nau-text dark:text-nau-text flex items-center gap-2">
              <PieChart className="w-4 h-4 text-nau-primary" />
              Cơ Cấu Danh Mục
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Tỷ trọng</span>
          </div>

          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mb-6">
            Mặt hàng sinh viên NAU có nhu cầu trao đổi cao nhất
          </p>

          {/* Category Progress Bars */}
          <div className="space-y-4">
            {categoryShare.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-nau-text dark:text-nau-text-secondary">{cat.name}</span>
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
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-nau-border mt-6 text-xs text-nau-text-muted">
          <p className="font-semibold text-nau-primary dark:text-nau-primary">
            💡 Gợi ý: Sách & Laptop là 2 nhóm có lượt giao dịch nhanh nhất (trung bình dưới 48h).
          </p>
        </div>
      </div>

    </div>
  );
};
