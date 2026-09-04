// File: src/pages/Admin/AdminVerificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/adminService';
import { approveVerification, rejectVerification } from '../../services/verificationService';
import { VerificationModerationTable } from '../../components/admin/VerificationModerationTable';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const AdminVerificationsPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
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
    loadData();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await approveVerification(userId);
      toast.success('Đã phê duyệt Thẻ sinh viên NAU thành công!');
      loadData();
    } catch (e) {
      toast.error('Lỗi khi duyệt.');
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

  const pendingCount = users.filter(u => u.verificationStatus === 'pending_verification').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-nau-warning" />
          <span>Kiểm Duyệt Thẻ Sinh Viên & CCCD ({pendingCount})</span>
        </h1>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
          Đối chiếu thông tin sinh viên, khoa viện và ảnh chụp giấy tờ trước khi cấp quyền giao dịch
        </p>
      </div>

      <VerificationModerationTable
        users={users}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
