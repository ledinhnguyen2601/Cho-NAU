import React, { useState } from 'react';
import { getVerificationBadgeInfo, formatDateTime, parseDate } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { 
  UserCheck, 
  Lock, 
  Unlock, 
  Shield, 
  Star, 
  Mail, 
  Phone,
  GraduationCap,
  ShieldCheck,
  Eye,
  Check,
  X,
  AlertTriangle,
  ShieldAlert,
  History,
  Trash2
} from 'lucide-react';

export const UserModerationTable = ({
  users = [],
  onToggleStatus,
  onToggleRole,
  onApproveVerification,
  onRejectVerification,
  onSendWarning,
  onBanUser
}) => {
  const [selectedDocUser, setSelectedDocUser] = useState(null);

  // Warning Modal State
  const [warningUser, setWarningUser] = useState(null);
  const [warningReason, setWarningReason] = useState('Vi phạm quy chế giao dịch');
  const [warningMessage, setWarningMessage] = useState('');
  const [isSendingWarning, setIsSendingWarning] = useState(false);

  // Ban & Hard Delete Modal State
  const [banUser, setBanUser] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [isBanning, setIsBanning] = useState(false);

  // Warning History Modal State
  const [historyUser, setHistoryUser] = useState(null);

  // Submit warning
  const handleSubmitWarning = async (e) => {
    e.preventDefault();
    if (!warningUser) return;
    setIsSendingWarning(true);
    try {
      if (onSendWarning) {
        await onSendWarning(warningUser.id, warningReason, warningMessage);
      }
      setWarningUser(null);
      setWarningMessage('');
    } finally {
      setIsSendingWarning(false);
    }
  };

  // Submit Ban & Hard Delete
  const handleSubmitBan = async (e) => {
    e.preventDefault();
    if (!banUser || !banReason.trim()) return;
    setIsBanning(true);
    try {
      if (onBanUser) {
        await onBanUser(banUser.id, banReason.trim());
      }
      setBanUser(null);
      setBanReason('');
    } finally {
      setIsBanning(false);
    }
  };

  return (
    <>
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nau-background dark:bg-nau-surface/60 text-nau-text-muted dark:text-nau-text-muted font-bold uppercase tracking-wider border-b border-slate-100 dark:border-nau-border">
              <tr>
                <th className="px-3.5 py-3.5">Sinh viên / Người dùng</th>
                <th className="px-3 py-3.5">Khoa & Mã SV</th>
                <th className="px-3 py-3.5">Xác thực</th>
                <th className="px-3 py-3.5">Uy tín</th>
                <th className="px-3 py-3.5">Vai trò</th>
                <th className="px-3 py-3.5">Cảnh báo vi phạm</th>
                <th className="px-3 py-3.5">Tình trạng</th>
                <th className="px-3.5 py-3.5 text-right">Thao tác Quản trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-nau-text dark:text-nau-text-secondary">
              {users.map((u) => {
                const badgeInfo = getVerificationBadgeInfo(u.verificationStatus);
                const isSuspended = u.status === 'suspended';
                const warningCount = u.warningCount || 0;
                const canBan = warningCount >= 1;
                
                // Check if user is online or active within 5 minutes
                const isOnline = u.isOnline === true || (
                  u.lastActive && (Date.now() - (parseDate(u.lastActive)?.getTime() || 0)) < 5 * 60 * 1000
                );

                return (
                  <tr key={u.id} className="hover:bg-nau-background/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* User Profile + Online indicator */}
                    <td className="px-3.5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover border border-nau-border dark:border-nau-border"
                          />
                          {isOnline ? (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Đang online" />
                          ) : (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-white dark:ring-slate-900" title="Offline" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-nau-text dark:text-nau-text truncate max-w-[140px]">
                              {u.name}
                            </p>
                            {isOnline && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                • Online
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px] flex items-center gap-1">
                            <Mail className="w-3 h-3 shrink-0" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Faculty & ID */}
                    <td className="px-3 py-3.5">
                      <p className="font-semibold text-nau-text dark:text-nau-text">
                        {u.studentId || 'Chưa cập nhật'}
                      </p>
                      <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted truncate max-w-[130px]">
                        {u.faculty || 'Đại học Nghệ An'}
                      </p>
                    </td>

                    {/* Verification Status */}
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border}`}>
                          {badgeInfo.label}
                        </span>
                        {u.verificationDocument && (
                          <button
                            type="button"
                            onClick={() => setSelectedDocUser(u)}
                            className="p-1 rounded-lg text-nau-primary hover:bg-nau-primary/10 transition-colors cursor-pointer"
                            title="Xem ảnh thẻ SV / CCCD"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1 font-bold text-nau-warning">
                        <Star className="w-3.5 h-3.5 fill-nau-warning" />
                        <span>{u.rating || 5.0}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-3 py-3.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        u.role === 'admin' 
                          ? 'bg-nau-red-light dark:bg-nau-red/20 text-nau-red dark:text-red-400 border border-nau-red/20' 
                          : 'bg-slate-100 dark:bg-nau-surface text-nau-text-secondary dark:text-nau-text-muted'
                      }`}>
                        {u.role === 'admin' ? 'Super Admin' : 'Sinh viên'}
                      </span>
                    </td>

                    {/* Warning Status (Hệ thống Cảnh báo vi phạm 2 tầng) */}
                    <td className="px-3 py-3.5">
                      {warningCount === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Chưa vi phạm (0)
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            warningCount === 1
                              ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/60 dark:text-red-300 animate-pulse'
                          }`}>
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{warningCount} lần vi phạm</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setHistoryUser(u)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            title="Xem lịch sử cảnh báo"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Account Status */}
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSuspended
                          ? 'bg-red-50 text-nau-danger border border-red-200 dark:bg-nau-danger/20 dark:text-red-400'
                          : 'bg-emerald-50 text-nau-success border border-emerald-200 dark:bg-nau-success/20 dark:text-emerald-400'
                      }`}>
                        {isSuspended ? 'Tạm khóa' : 'Hoạt động'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3.5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* 1. Review student card */}
                        {u.verificationStatus === 'pending_verification' && (
                          <Button
                            variant="warning"
                            size="sm"
                            leftIcon={<Eye className="w-3 h-3" />}
                            onClick={() => setSelectedDocUser(u)}
                            title="Xem giấy tờ và xét duyệt"
                          >
                            Duyệt
                          </Button>
                        )}

                        {/* 2. Cảnh báo vi phạm (Lần 1 & tiếp theo) */}
                        {u.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              setWarningUser(u);
                              setWarningReason('Vi phạm quy chế giao dịch');
                              setWarningMessage(`Cảnh báo vi phạm lần ${warningCount + 1}: Vui lòng tuân thủ quy chế mua bán trung thực trên Chợ NAU.`);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                            title="Gửi cảnh báo chính thức cho người dùng"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Cảnh báo</span>
                          </button>
                        )}

                        {/* 3. Ban & Xóa vĩnh viễn khỏi Database (Chỉ mở khóa từ lần vi phạm thứ 2) */}
                        {u.role !== 'admin' && (
                          canBan ? (
                            <button
                              type="button"
                              onClick={() => {
                                setBanUser(u);
                                setBanReason(`Tài khoản tái phạm hành vi vi phạm quy chế giao dịch (đã nhận ${warningCount} lần cảnh báo trước đó). Quyết định xóa vĩnh viễn tài khoản khỏi Chợ NAU.`);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-sm transition-all active:scale-95 cursor-pointer animate-pulse"
                              title="Ban vĩnh viễn và xóa hoàn toàn khỏi Database"
                            >
                              <ShieldAlert className="w-3 h-3" />
                              <span>Ban & Xóa DB</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 font-semibold text-[11px] cursor-not-allowed"
                              title="Chỉ mở khóa quyền Ban khi người dùng tái phạm từ lần thứ 2 (cần gửi ít nhất 1 cảnh báo trước)"
                            >
                              <ShieldAlert className="w-3 h-3" />
                              <span className="hidden xl:inline">Ban (khóa)</span>
                            </button>
                          )
                        )}

                        {/* 4. Khóa / Mở khóa tạm thời */}
                        <Button
                          variant={isSuspended ? 'success' : 'outline'}
                          size="sm"
                          onClick={() => onToggleStatus(u.id, isSuspended ? 'active' : 'suspended')}
                          title={isSuspended ? 'Mở khóa tài khoản' : 'Tạm khóa tài khoản'}
                        >
                          {isSuspended ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        </Button>

                        {/* 5. Phân quyền Admin */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleRole(u.id, u.role)}
                          title="Đổi vai trò Admin / Sinh viên"
                        >
                          <Shield className="w-3 h-3" />
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

      {/* Modal 1: Gửi Cảnh Báo Cho Người Dùng (Do Admin tự soạn) */}
      <Modal
        isOpen={Boolean(warningUser)}
        onClose={() => setWarningUser(null)}
        title={`Gửi Cảnh Báo Vi Phạm - ${warningUser?.name || ''}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitWarning} className="space-y-4 text-xs">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Quy trình xử lý vi phạm bậc 1:
              </p>
              <p className="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                Người dùng hiện đã có <strong>{warningUser?.warningCount || 0}</strong> lần cảnh báo. Sau lần cảnh báo này, từ lần thứ 2 trở đi hệ thống sẽ mở quyền <strong>Ban vĩnh viễn & Xóa tài khoản</strong>.
              </p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Phân loại hành vi vi phạm:
            </label>
            <select
              value={warningReason}
              onChange={(e) => setWarningReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text"
            >
              <option value="Vi phạm quy chế giao dịch">Vi phạm quy chế mua bán / giao dịch</option>
              <option value="Bị báo cáo gian lận / lừa đảo tiền cọc">Bị báo cáo gian lận / lừa đảo cọc</option>
              <option value="Đăng bán hàng giả / sai sự thật">Đăng bán hàng giả / sai sự thật</option>
              <option value="Spam tin đăng hoặc đăng tin không phù hợp">Spam tin đăng / nội dung không phù hợp</option>
              <option value="Cung cấp sai thông tin thẻ sinh viên">Cung cấp sai thông tin thẻ sinh viên</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nội dung cảnh báo chi tiết (Admin tự biên soạn):
            </label>
            <textarea
              rows={4}
              required
              value={warningMessage}
              onChange={(e) => setWarningMessage(e.target.value)}
              placeholder="Nhập nội dung cảnh báo chi tiết gửi tới người dùng này..."
              className="w-full px-3 py-2 rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-nau-border">
            <Button variant="outline" size="sm" onClick={() => setWarningUser(null)} type="button">
              Hủy
            </Button>
            <Button variant="warning" size="sm" type="submit" isLoading={isSendingWarning}>
              Xác nhận gửi cảnh báo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: BAN VĨNH VIỄN & XÓA KHỎI DATABASE (Admin tự soạn lý do) */}
      <Modal
        isOpen={Boolean(banUser)}
        onClose={() => setBanUser(null)}
        title={`BAN VĨNH VIỄN & XÓA KHỎI DATABASE - ${banUser?.name || ''}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmitBan} className="space-y-4 text-xs">
          <div className="bg-red-50 dark:bg-red-950/40 p-3.5 rounded-2xl border border-red-200 dark:border-red-900/60 space-y-2">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <span>CẢNH BÁO NGUY HIỂM: HÀNH ĐỘNG KHÔNG THỂ HOÀN TÁC!</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-red-800 dark:text-red-300">
              <li>Tài khoản của <strong>{banUser?.name}</strong> ({banUser?.email}) sẽ bị <strong>XÓA HẲN</strong> ra khỏi collection <code>users</code> trong Database thay vì chỉ khóa tạm.</li>
              <li>Toàn bộ tin đăng của tài khoản sẽ tự động ẩn khỏi sàn Chợ NAU.</li>
              <li>Hồ sơ cấm được ghi vào <code>banned_users</code> để chặn đăng ký lại vĩnh viễn.</li>
              <li>Khi người này cố gắng đăng nhập, hệ thống sẽ hiện thông báo kèm <strong>Nội dung lý do Ban</strong> do Admin soạn dưới đây.</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-1">
            <p><strong>Số lần vi phạm trước đó:</strong> <span className="text-red-600 font-bold">{banUser?.warningCount || 0} lần</span> (Đủ điều kiện Ban)</p>
            <p><strong>Mã SV:</strong> {banUser?.studentId || 'Chưa có'}</p>
            <p><strong>Email:</strong> {banUser?.email}</p>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Nội dung lý do Ban tài khoản (Admin tự biên soạn - Bắt buộc):
            </label>
            <textarea
              rows={4}
              required
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Nhập lý do cụ thể dẫn đến quyết định Ban vĩnh viễn và xóa tài khoản..."
              className="w-full px-3 py-2 rounded-xl border border-red-300 dark:border-red-800 bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-nau-border">
            <Button variant="outline" size="sm" onClick={() => setBanUser(null)} type="button">
              Hủy bỏ
            </Button>
            <Button variant="danger" size="sm" type="submit" isLoading={isBanning}>
              Xác nhận Ban & Xóa vĩnh viễn
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Xem Lịch Sử Cảnh Báo */}
      <Modal
        isOpen={Boolean(historyUser)}
        onClose={() => setHistoryUser(null)}
        title={`Lịch Sử Cảnh Báo - ${historyUser?.name || ''}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            Tổng số lần vi phạm đã ghi nhận: <strong>{historyUser?.warningCount || 0}</strong>
          </p>

          {!historyUser?.warnings || historyUser.warnings.length === 0 ? (
            <p className="p-4 text-center text-slate-400">Chưa có chi tiết văn bản cảnh báo.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {historyUser.warnings.map((w, idx) => (
                <div key={w.id || idx} className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                    <span>Lần {historyUser.warnings.length - idx}: {w.reason}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{formatDateTime(w.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic">"{w.message}"</p>
                  <p className="text-[10px] text-slate-400">Admin xử lý: {w.adminEmail || 'admin@nau.edu.vn'}</p>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setHistoryUser(null)}>
              Đóng
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal 4: Document Review & Approval Modal */}
      <Modal
        isOpen={Boolean(selectedDocUser)}
        onClose={() => setSelectedDocUser(null)}
        title={`Xét Duyệt Thẻ Sinh Viên - ${selectedDocUser?.name || ''}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-nau-border dark:border-nau-border bg-slate-100 dark:bg-nau-background max-h-[70vh] flex items-center justify-center p-2">
            {selectedDocUser?.verificationDocument ? (
              <img
                src={selectedDocUser.verificationDocument}
                alt="Tài liệu xác thực"
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            ) : (
              <p className="text-xs text-slate-400 p-8">Người dùng chưa đính kèm ảnh giấy tờ.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs border-t border-slate-100 dark:border-nau-border pt-3">
            <div>
              <p><strong>Mã SV:</strong> {selectedDocUser?.studentId || 'Chưa cung cấp'}</p>
              <p><strong>Khoa:</strong> {selectedDocUser?.faculty || 'Đại học Nghệ An'}</p>
              <p><strong>Email:</strong> {selectedDocUser?.email}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              {onRejectVerification && (
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<X className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const reason = window.prompt('Nhập lý do từ chối hồ sơ xác thực:', 'Ảnh chụp mờ hoặc thông tin không trùng khớp');
                    if (reason) {
                      onRejectVerification(selectedDocUser.id, reason);
                      setSelectedDocUser(null);
                    }
                  }}
                >
                  Từ chối
                </Button>
              )}
              {onApproveVerification && selectedDocUser?.verificationStatus === 'pending_verification' && (
                <Button
                  variant="success"
                  size="sm"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                  onClick={() => {
                    onApproveVerification(selectedDocUser.id);
                    setSelectedDocUser(null);
                  }}
                >
                  Duyệt Thẻ SV
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
