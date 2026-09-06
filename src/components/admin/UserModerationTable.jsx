// File: src/components/admin/UserModerationTable.jsx
import React, { useState } from 'react';
import { getVerificationBadgeInfo, formatDateTime } from '../../utils/formatters';
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
  X
} from 'lucide-react';

export const UserModerationTable = ({
  users = [],
  onToggleStatus,
  onToggleRole,
  onApproveVerification,
  onRejectVerification
}) => {
  const [selectedDocUser, setSelectedDocUser] = useState(null);

  return (
    <>
      <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nau-background dark:bg-nau-surface/60 text-nau-text-muted dark:text-nau-text-muted font-bold uppercase tracking-wider border-b border-slate-100 dark:border-nau-border">
              <tr>
                <th className="px-4 py-3.5">Sinh viên / Người dùng</th>
                <th className="px-4 py-3.5">Khoa & Mã SV</th>
                <th className="px-4 py-3.5">Trạng thái xác thực</th>
                <th className="px-4 py-3.5">Điểm uy tín</th>
                <th className="px-4 py-3.5">Vai trò</th>
                <th className="px-4 py-3.5">Tình trạng</th>
                <th className="px-4 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-nau-text dark:text-nau-text-secondary">
              {users.map((u) => {
                const badgeInfo = getVerificationBadgeInfo(u.verificationStatus);
                const isSuspended = u.status === 'suspended';
                
                // Check if user is online or active within 5 minutes
                const isOnline = u.isOnline === true || (
                  u.lastActive && (Date.now() - new Date(u.lastActive).getTime()) < 5 * 60 * 1000
                );

                return (
                  <tr key={u.id} className="hover:bg-nau-background/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* User Profile + Online indicator */}
                    <td className="px-4 py-3.5">
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
                            <p className="font-bold text-nau-text dark:text-nau-text truncate">
                              {u.name}
                            </p>
                            {isOnline && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                • Online
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Faculty & ID */}
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-nau-text dark:text-nau-text">
                        {u.studentId || 'Chưa cập nhật'}
                      </p>
                      <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted truncate max-w-[150px]">
                        {u.faculty || 'Đại học Nghệ An'}
                      </p>
                    </td>

                    {/* Verification Status + Quick Preview */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border}`}>
                          {badgeInfo.label}
                        </span>
                        {u.verificationDocument && (
                          <button
                            type="button"
                            onClick={() => setSelectedDocUser(u)}
                            className="p-1 rounded-lg text-nau-primary hover:bg-nau-primary/10 transition-colors"
                            title="Xem ảnh thẻ SV / CCCD"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 font-bold text-nau-warning">
                        <Star className="w-3.5 h-3.5 fill-nau-warning" />
                        <span>{u.rating || 5.0}</span>
                        <span className="text-slate-400 font-normal">({u.ratingCount || 0})</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                        u.role === 'admin' 
                          ? 'bg-nau-red-light dark:bg-nau-red/20 text-nau-red dark:text-red-400 border border-nau-red/20' 
                          : 'bg-slate-100 dark:bg-nau-surface text-nau-text-secondary dark:text-nau-text-muted'
                      }`}>
                        {u.role === 'admin' ? 'Super Admin' : 'Sinh viên'}
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSuspended
                          ? 'bg-red-50 text-nau-danger border border-red-200 dark:bg-nau-danger/20 dark:text-red-400'
                          : 'bg-emerald-50 text-nau-success border border-emerald-200 dark:bg-nau-success/20 dark:text-emerald-400'
                      }`}>
                        {isSuspended ? 'Bị khóa' : 'Hoạt động'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Only users with pending verification can be reviewed */}
                        {u.verificationStatus === 'pending_verification' && (
                          <Button
                            variant="warning"
                            size="sm"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => setSelectedDocUser(u)}
                            title="Xem giấy tờ và xét duyệt"
                          >
                            Xem & Duyệt
                          </Button>
                        )}
                        <Button
                          variant={isSuspended ? 'success' : 'danger'}
                          size="sm"
                          leftIcon={isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          onClick={() => onToggleStatus(u.id, isSuspended ? 'active' : 'suspended')}
                        >
                          {isSuspended ? 'Mở khóa' : 'Khóa'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleRole(u.id, u.role)}
                          title="Đổi quyền Admin / Sinh viên"
                        >
                          <Shield className="w-3.5 h-3.5" />
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

      {/* Document Review & Approval Modal */}
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

