// File: src/components/admin/ReportModerationTable.jsx
import React, { useState } from 'react';
import { formatDateTime } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Search,
  MessageSquare
} from 'lucide-react';

export const ReportModerationTable = ({
  reports = [],
  onUpdateStatus
}) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState('resolved');
  const [adminNote, setAdminNote] = useState('');

  const handleOpenAction = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status === 'pending' ? 'investigating' : 'resolved');
    setAdminNote(report.adminNote || '');
  };

  const handleSaveAction = (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    onUpdateStatus(selectedReport.id, newStatus, adminNote);
    setSelectedReport(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-nau-warning/10 text-nau-warning dark:bg-nau-warning/20 dark:text-nau-warning border border-nau-warning/30 dark:border-nau-warning/40">
            Chờ xử lý
          </span>
        );
      case 'investigating':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-nau-primary-light text-nau-primary-hover dark:bg-nau-primary/20 dark:text-nau-primary border border-nau-primary/30 dark:border-nau-primary/40">
            Đang điều tra
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-nau-success/10 text-nau-success dark:bg-nau-success/20 dark:text-nau-success border border-nau-success/30 dark:border-nau-success/40">
            Đã xử lý
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-nau-text dark:bg-nau-surface dark:text-nau-text-secondary">
            Bác bỏ
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <>
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nau-background dark:bg-nau-surface/60 text-nau-text-muted dark:text-nau-text-muted font-bold uppercase tracking-wider border-b border-slate-100 dark:border-nau-border">
              <tr>
                <th className="px-4 py-3.5">Mã & Ngày báo</th>
                <th className="px-4 py-3.5">Người báo cáo</th>
                <th className="px-4 py-3.5">Đối tượng bị tố cáo</th>
                <th className="px-4 py-3.5">Lý do</th>
                <th className="px-4 py-3.5">Nội dung chi tiết</th>
                <th className="px-4 py-3.5">Trạng thái</th>
                <th className="px-4 py-3.5 text-right">Xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-nau-text dark:text-nau-text-secondary">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-nau-background/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-nau-text dark:text-nau-text">
                      {r.id}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatDateTime(r.createdAt)}
                    </p>
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-nau-text dark:text-nau-text">
                    {r.reporterName}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-bold text-nau-danger dark:text-red-400">
                      {r.targetTitle}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      ({r.targetType === 'product' ? 'Sản phẩm' : 'Người dùng'})
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-medium">
                    <span className="px-2 py-0.5 rounded-lg bg-red-50 text-nau-danger dark:bg-nau-danger/20 dark:text-red-400 border border-nau-danger/30 dark:border-nau-danger/40 text-[11px]">
                      {r.reason === 'scam' ? 'Nghi vấn lừa đảo' : r.reason === 'fake_item' ? 'Hàng giả/sai mô tả' : 'Vi phạm quy định'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 max-w-xs truncate text-nau-text-secondary dark:text-nau-text-secondary">
                    {r.description}
                  </td>

                  <td className="px-4 py-3.5">
                    {getStatusBadge(r.status)}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAction(r)}
                    >
                      Xử lý
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        title={`Xử Lý Báo Cáo - ${selectedReport?.id}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveAction} className="space-y-4">
          <div className="bg-nau-background dark:bg-nau-surface p-3 rounded-xl text-xs space-y-1.5">
            <p><strong>Người báo cáo:</strong> {selectedReport?.reporterName}</p>
            <p><strong>Đối tượng:</strong> {selectedReport?.targetTitle}</p>
            <p><strong>Nội dung:</strong> {selectedReport?.description}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-nau-text dark:text-nau-text-secondary mb-1.5">
              Cập nhật trạng thái
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text"
            >
              <option value="investigating">Đang điều tra / Thu thập thêm bằng chứng</option>
              <option value="resolved">Đã giải quyết (Đã cảnh cáo / Khóa tài khoản)</option>
              <option value="rejected">Bác bỏ (Báo cáo không có căn cứ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-nau-text dark:text-nau-text-secondary mb-1.5">
              Ghi chú của Quản trị viên
            </label>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Ghi chú biện pháp xử lý hoặc liên hệ các bên..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-nau-border">
            <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
              Đóng
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Lưu kết quả xử lý
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
