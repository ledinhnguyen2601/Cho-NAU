import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus, toggleUserRole, sendUserWarning, banAndDeleteUser } from '../../services/adminService';
import { approveVerification, rejectVerification } from '../../services/verificationService';
import { UserModerationTable } from '../../components/admin/UserModerationTable';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Filter } from 'lucide-react';

export const AdminUsersPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId, newStatus) => {
    await updateUserStatus(userId, newStatus);
    toast.success(newStatus === 'suspended' ? 'Đã khóa tài khoản thành công.' : 'Đã mở khóa tài khoản.');
    loadUsers();
  };

  const handleToggleRole = async (userId, currentRole) => {
    try {
      await toggleUserRole(userId, currentRole);
      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
        }
        return u;
      }));
      toast.success('Đã cập nhật quyền người dùng');
    } catch (e) {
      toast.error('Cập nhật quyền thất bại');
    }
  };

  const handleApproveVerification = async (userId) => {
    try {
      await approveVerification(userId);
      toast.success('Đã duyệt Thẻ sinh viên cho người dùng này!');
      loadUsers();
    } catch (e) {
      toast.error(e.message || 'Không thể phê duyệt thẻ sinh viên.');
    }
  };

  const handleRejectVerification = async (userId, reason) => {
    try {
      await rejectVerification(userId, reason);
      toast.warning('Đã từ chối hồ sơ xác thực.');
      loadUsers();
    } catch (e) {
      toast.error(e.message || 'Không thể từ chối hồ sơ.');
    }
  };

  const handleSendWarning = async (userId, reason, message) => {
    try {
      await sendUserWarning(userId, reason, message);
      toast.success('Đã gửi cảnh báo chính thức cho người dùng thành công.');
      loadUsers();
    } catch (e) {
      toast.error('Lỗi khi gửi cảnh báo: ' + (e.message || ''));
    }
  };

  const handleBanUser = async (userId, banReason) => {
    try {
      await banAndDeleteUser(userId, banReason);
      toast.success('Đã BAN VĨNH VIỄN và XÓA HẲN tài khoản khỏi database thành công!');
      loadUsers();
    } catch (e) {
      toast.error('Lỗi khi ban tài khoản: ' + (e.message || ''));
    }
  };

  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.studentId && u.studentId.toLowerCase().includes(q))
    );
    const matchVerif = verificationFilter === 'all' || u.verificationStatus === verificationFilter;
    return matchSearch && matchVerif;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
            <Users className="w-6 h-6 text-nau-primary" />
            <span>Quản Lý Người Dùng & Sinh Viên ({users.length})</span>
          </h1>
          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
            Tra cứu thông tin, phân quyền Quản trị viên và khóa các tài khoản có dấu hiệu vi phạm
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc mã số sinh viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="verified">Đã xác thực thẻ SV</option>
            <option value="pending_verification">Đang chờ duyệt thẻ</option>
            <option value="new">Tài khoản mới</option>
            <option value="rejected">Bị từ chối</option>
          </select>
        </div>
      </div>

      <UserModerationTable
        users={filteredUsers}
        onToggleStatus={handleToggleStatus}
        onToggleRole={handleToggleRole}
        onApproveVerification={handleApproveVerification}
        onRejectVerification={handleRejectVerification}
        onSendWarning={handleSendWarning}
        onBanUser={handleBanUser}
      />
    </div>
  );
};
