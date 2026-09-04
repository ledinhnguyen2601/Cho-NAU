// File: src/components/admin/VerificationModerationTable.jsx
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatDateTime } from '../../utils/formatters';
import { 
  Check, 
  X, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  GraduationCap,
  Eye
} from 'lucide-react';

export const VerificationModerationTable = ({
  users = [],
  onApprove,
  onReject
}) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectingUser, setRejectingUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    onReject(rejectingUser.id, rejectionReason.trim());
    setRejectingUser(null);
    setRejectionReason('');
  };

  const pendingUsers = users.filter(u => u.verificationStatus === 'pending_verification');

  if (pendingUsers.length === 0) {
    return (
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-8 text-center shadow-sm">
        <ShieldCheck className="w-12 h-12 text-nau-success mx-auto mb-2" />
        <h4 className="text-base font-bold text-nau-text dark:text-nau-text">
          Không có hồ sơ nào đang chờ duyệt
        </h4>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
          Tất cả yêu cầu xác thực thẻ sinh viên & CCCD đã được xử lý hoàn tất.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nau-background dark:bg-nau-surface/60 text-nau-text-muted dark:text-nau-text-muted font-bold uppercase tracking-wider border-b border-slate-100 dark:border-nau-border">
              <tr>
                <th className="px-4 py-3.5">Sinh viên</th>
                <th className="px-4 py-3.5">Mã SV & Khoa</th>
                <th className="px-4 py-3.5">Tài liệu xác thực (Thẻ SV / CCCD)</th>
                <th className="px-4 py-3.5">Ngày gửi</th>
                <th className="px-4 py-3.5 text-right">Quyết định kiểm duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-nau-text dark:text-nau-text-secondary">
              {pendingUsers.map((u) => (
                <tr key={u.id} className="hover:bg-nau-background/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* User info */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-nau-border dark:border-nau-border shrink-0"
                      />
                      <div>
                        <p className="font-bold text-nau-text dark:text-nau-text">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Student ID & Faculty */}
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-nau-text dark:text-nau-text">
                      {u.studentId || 'Chưa cung cấp'}
                    </p>
                    <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted">
                      {u.faculty || 'Đại học Nghệ An'}
                    </p>
                  </td>

                  {/* Document preview link */}
                  <td className="px-4 py-3.5">
                    {u.verificationDocument ? (
                      <button
                        type="button"
                        onClick={() => setSelectedDoc(u)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-nau-primary-light hover:bg-nau-primary dark:bg-nau-primary/20 dark:hover:bg-nau-primary/60 text-nau-primary dark:text-nau-primary font-semibold transition-colors border border-nau-primary dark:border-nau-primary"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem ảnh Thẻ SV / CCCD</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 italic">Không có ảnh đính kèm</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                    {formatDateTime(u.verificationSubmittedAt || u.joinedDate)}
                  </td>

                  {/* Actions: Approve / Reject */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<X className="w-3.5 h-3.5" />}
                        onClick={() => setRejectingUser(u)}
                      >
                        Từ chối
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                        onClick={() => onApprove(u.id)}
                      >
                        Duyệt Thẻ SV
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <Modal
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        title={`Ảnh Xác Thực Thẻ SV - ${selectedDoc?.name || ''}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-nau-border dark:border-nau-border bg-slate-100 dark:bg-nau-background max-h-[70vh] flex items-center justify-center p-2">
            <img
              src={selectedDoc?.verificationDocument}
              alt="Tài liệu xác thực"
              className="max-h-[65vh] w-auto object-contain rounded-xl"
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <div>
              <p><strong>Mã SV:</strong> {selectedDoc?.studentId}</p>
              <p><strong>Khoa:</strong> {selectedDoc?.faculty}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setRejectingUser(selectedDoc);
                  setSelectedDoc(null);
                }}
              >
                Từ chối
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  onApprove(selectedDoc.id);
                  setSelectedDoc(null);
                }}
              >
                Duyệt ngay
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={Boolean(rejectingUser)}
        onClose={() => setRejectingUser(null)}
        title={`Từ Chối Xác Thực - ${rejectingUser?.name || ''}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
            Vui lòng nêu rõ lý do từ chối để sinh viên có thể điều chỉnh và gửi lại hồ sơ chính xác.
          </p>

          <div>
            <label className="block text-xs font-bold text-nau-text dark:text-nau-text-secondary mb-1.5">
              Lý do từ chối <span className="text-nau-red">*</span>
            </label>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text mb-2"
            >
              <option value="">-- Chọn lý do mẫu --</option>
              <option value="Ảnh thẻ sinh viên bị mờ, không đọc rõ họ tên và mã số.">Ảnh thẻ sinh viên bị mờ, không đọc rõ họ tên và mã số.</option>
              <option value="Mã số sinh viên không khớp với hệ thống đào tạo NAU.">Mã số sinh viên không khớp với hệ thống đào tạo NAU.</option>
              <option value="Ảnh chụp không phải thẻ sinh viên NAU hoặc CCCD hợp lệ.">Ảnh chụp không phải thẻ sinh viên NAU hoặc CCCD hợp lệ.</option>
              <option value="Thẻ sinh viên đã hết hạn đào tạo.">Thẻ sinh viên đã hết hạn đào tạo.</option>
            </select>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Hoặc nhập lý do cụ thể khác..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 focus:ring-2 focus:ring-nau-primary"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-nau-border">
            <Button variant="outline" size="sm" onClick={() => setRejectingUser(null)}>
              Hủy bỏ
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Xác nhận từ chối
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
