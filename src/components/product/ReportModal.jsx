// File: src/components/product/ReportModal.jsx
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { createReport } from '../../services/reportService';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const ReportModal = ({
  isOpen,
  onClose,
  targetType = 'product', // 'product' | 'user'
  targetId,
  targetTitle
}) => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [reason, setReason] = useState('scam');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để gửi báo cáo.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      toast.warning('Vui lòng cung cấp chi tiết lý do báo cáo (ít nhất 10 ký tự).');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport({
        reporterId: currentUser.id,
        reporterName: currentUser.name,
        targetType,
        targetId,
        targetTitle,
        reason,
        description: description.trim()
      });

      toast.success('Báo cáo vi phạm đã được gửi tới Ban Quản Trị NAU để xử lý.');
      onClose();
      setDescription('');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Báo Cáo Vi Phạm / Nghi Vấn Gian Lận"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-red-50 dark:bg-nau-danger/20 border border-nau-danger/30 dark:border-nau-danger/40 flex items-start gap-2.5 text-xs text-nau-danger dark:text-red-400">
          <ShieldAlert className="w-4 h-4 text-nau-danger shrink-0 mt-0.5" />
          <p>
            Chợ NAU áp dụng chính sách <strong>Zero-Fraud</strong>. Mọi hành vi lừa đảo cọc, bán hàng giả mạo hoặc quấy rối sẽ bị khóa tài khoản vĩnh viễn và báo cáo lên Đoàn trường/Phòng CTSV.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-nau-text dark:text-nau-text-secondary mb-1.5">
            Đối tượng báo cáo
          </label>
          <p className="text-sm font-semibold text-nau-text dark:text-nau-text bg-slate-100 dark:bg-nau-surface p-2.5 rounded-xl truncate">
            {targetTitle}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-nau-text dark:text-nau-text-secondary mb-1.5">
            Lý do vi phạm
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text"
          >
            <option value="scam">Nghi vấn lừa đảo / Yêu cầu cọc tiền trước</option>
            <option value="fake_item">Hàng giả, hàng nhái hoặc sai mô tả</option>
            <option value="prohibited">Sản phẩm bị cấm / Tài liệu vi phạm quy định</option>
            <option value="harassment">Ngôn từ không chuẩn mực / Quấy rối</option>
            <option value="other">Lý do khác</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-nau-text dark:text-nau-text-secondary mb-1.5">
            Mô tả chi tiết bằng chứng <span className="text-nau-red">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Vui lòng nêu rõ nội dung trao đổi, hành vi khả nghi hoặc cung cấp số điện thoại/Zalo liên quan..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nau-primary"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-nau-border">
          <Button variant="outline" size="sm" onClick={onClose} type="button">
            Hủy bỏ
          </Button>
          <Button variant="danger" size="sm" type="submit" isLoading={isSubmitting}>
            Gửi báo cáo
          </Button>
        </div>
      </form>
    </Modal>
  );
};
