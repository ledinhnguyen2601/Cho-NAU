// File: src/pages/Admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getAnalyticsData, getAllUsers } from '../../services/adminService';
import { approveVerification, rejectVerification } from '../../services/verificationService';
import { StatCard } from '../../components/admin/StatCard';
import { ChartOverview } from '../../components/admin/ChartOverview';
import { VerificationModerationTable } from '../../components/admin/VerificationModerationTable';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  ShieldCheck, 
  Package, 
  ShoppingCart, 
  Coins, 
  AlertTriangle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const s = await getAdminStats();
      const a = getAnalyticsData();
      const u = await getAllUsers();
      setStats(s);
      setAnalytics(a);
      setUsers(u);
    } catch (err) {
      console.error('Fetch admin dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await approveVerification(userId);
      toast.success('Đã duyệt xác thực thẻ sinh viên thành công!');
      loadData();
    } catch (e) {
      toast.error('Lỗi khi duyệt thẻ.');
    }
  };

  const handleReject = async (userId, reason) => {
    try {
      await rejectVerification(userId, reason);
      toast.warning('Đã từ chối hồ sơ xác thực.');
      loadData();
    } catch (e) {
      toast.error('Lỗi khi từ chối.');
    }
  };

  if (isLoading || !stats || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nau-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-nau-text dark:text-nau-text">
            Trung Tâm Điều Hành Chợ NAU
          </h1>
          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
            Tổng quan hiệu suất hoạt động, kiểm duyệt sinh viên và theo dõi khối lượng giao dịch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/verifications"
            className="flex items-center gap-2 px-3.5 py-2 bg-nau-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-nau-primary-hover transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Duyệt Thẻ Sinh Viên ({stats.pendingVerifications})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Tổng Sinh Viên"
          value={stats.totalUsers}
          subtitle="Tài khoản đăng ký"
          icon={Users}
          trend="+18%"
          color="red"
        />
        <StatCard
          title="Đã Xác Thực"
          value={stats.verifiedUsers}
          subtitle={`${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% tổng số`}
          icon={ShieldCheck}
          trend="+24%"
          color="emerald"
        />
        <StatCard
          title="Sản Phẩm Đăng"
          value={stats.totalProducts}
          subtitle={`${stats.activeProducts} tin đang bán`}
          icon={Package}
          trend="+12%"
          color="blue"
        />
        <StatCard
          title="Tổng Đơn Hàng"
          value={stats.totalOrders}
          subtitle={`${stats.completedOrders} đơn hoàn tất`}
          icon={ShoppingCart}
          trend="+15%"
          color="blue"
        />
        <StatCard
          title="Giá Trị Giao Dịch"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Giao dịch thành công"
          icon={Coins}
          trend="+32%"
          color="emerald"
        />
        <StatCard
          title="Báo Cáo Vi Phạm"
          value={stats.pendingReports}
          subtitle="Cần kiểm tra"
          icon={AlertTriangle}
          trendType="down"
          color="rose"
        />
      </div>

      {/* SaaS Analytics Charts */}
      <ChartOverview analyticsData={analytics} />

      {/* Quick Pending Verifications Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-nau-text dark:text-nau-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-nau-warning" />
            <span>Hồ Sơ Thẻ Sinh Viên Chờ Phê Duyệt ({stats.pendingVerifications})</span>
          </h2>
          <Link
            to="/admin/verifications"
            className="text-xs font-bold text-nau-primary dark:text-nau-primary hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <VerificationModerationTable
          users={users}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

    </div>
  );
};
