// File: src/components/common/BannedNoticeModal.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertOctagon, Mail, FileText } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const BannedNoticeModal = () => {
  const { bannedNotice, clearBannedNotice } = useAuth();

  if (!bannedNotice) return null;

  return (
    <Modal
      isOpen={Boolean(bannedNotice)}
      onClose={clearBannedNotice}
      title="THÔNG BÁO KHÓA & XÓA TÀI KHOẢN VĨNH VIỄN"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 py-2 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
          <AlertOctagon className="w-9 h-9 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-black text-red-600 dark:text-red-400 uppercase tracking-tight">
            Tài Khoản Đã Bị Xóa Khỏi Chợ NAU
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hệ thống đã loại bỏ tài khoản vĩnh viễn do tái phạm quy chế nghiêm trọng.
          </p>
        </div>

        {/* Ban Reason Box */}
        <div className="text-left bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-300">
            <FileText className="w-4 h-4 shrink-0" />
            <span>Lý do kỷ luật từ Ban Quản Trị:</span>
          </div>
          <p className="text-xs text-red-900 dark:text-red-200 font-medium leading-relaxed bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-red-100 dark:border-red-900/30">
            "{bannedNotice.banReason || 'Vi phạm nghiêm trọng quy chế mua bán an toàn'}"
          </p>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
            <span>Thời gian thi hành:</span>
            <span className="font-semibold">{formatDateTime(bannedNotice.bannedAt || new Date())}</span>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 text-left space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Lưu ý quan trọng:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
            <li>Mọi tin đăng của tài khoản đã được gỡ bỏ khỏi sàn giao dịch.</li>
            <li>Địa chỉ email này không thể đăng ký lại tài khoản mới trên hệ thống.</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <a
            href="mailto:admin@nau.edu.vn"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Khiếu nại qua email</span>
          </a>
          <Button
            variant="danger"
            size="sm"
            onClick={clearBannedNotice}
            className="w-full sm:w-auto"
          >
            Đã hiểu
          </Button>
        </div>
      </div>
    </Modal>
  );
};
