// File: src/pages/Admin/AdminSettingsPage.jsx
import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  Settings, 
  ShieldCheck, 
  Globe, 
  Tag, 
  Sliders, 
  Bell, 
  Save 
} from 'lucide-react';

export const AdminSettingsPage = () => {
  const toast = useToast();

  const [settings, setSettings] = useState({
    siteName: 'Chợ NAU',
    siteSlogan: 'Nền Tảng TMĐT Đồ Cũ Sinh Viên Đại Học Nghệ An',
    supportEmail: 'support.chonau@nau.edu.vn',
    supportHotline: '(0238) 3888 999',
    maxImagesPerProduct: 6,
    requireVerificationToPost: true,
    requireVerificationToChat: true,
    platformFeeRate: 0, // 0% for students
    autoExpireDays: 45
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Đã lưu cấu hình hệ thống Chợ NAU thành công!');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
          <Settings className="w-6 h-6 text-nau-primary" />
          <span>Cấu Hình & Thiết Lập Hệ Thống</span>
        </h1>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
          Quản lý thông số sàn, quy tắc kiểm duyệt và chính sách an toàn cho sinh viên NAU
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: General Website Settings */}
        <div className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-nau-text dark:text-nau-text flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-nau-border">
            <Globe className="w-4 h-4 text-nau-primary" />
            <span>Thông Tin Chung & Liên Hệ Trường NAU</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tên sàn thương mại điện tử"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />

            <Input
              label="Khẩu hiệu / Slogan"
              value={settings.siteSlogan}
              onChange={(e) => setSettings({ ...settings, siteSlogan: e.target.value })}
            />

            <Input
              label="Email tiếp nhận hỗ trợ sinh viên"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />

            <Input
              label="Hotline Ban Quản Trị / CLB"
              value={settings.supportHotline}
              onChange={(e) => setSettings({ ...settings, supportHotline: e.target.value })}
            />
          </div>
        </div>

        {/* Section 2: Marketplace & Moderation Rules */}
        <div className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-nau-text dark:text-nau-text flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-nau-border">
            <ShieldCheck className="w-4 h-4 text-nau-success" />
            <span>Quy Tắc Kiểm Duyệt & Bảo Mật Sinh Viên</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-surface/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-nau-text dark:text-nau-text">
                  Bắt buộc xác thực Thẻ sinh viên khi ĐĂNG BÁN
                </p>
                <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted">
                  Chỉ sinh viên đã được duyệt thẻ mới được quyền đăng bài lên sàn
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireVerificationToPost}
                onChange={(e) => setSettings({ ...settings, requireVerificationToPost: e.target.checked })}
                className="w-5 h-5 rounded text-nau-primary focus:ring-nau-primary border-nau-border"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-surface/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-nau-text dark:text-nau-text">
                  Bắt buộc xác thực Thẻ sinh viên khi CHAT TRAO ĐỔI
                </p>
                <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted">
                  Ngăn chặn người lạ từ bên ngoài nhắn tin lừa đảo sinh viên trong trường
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireVerificationToChat}
                onChange={(e) => setSettings({ ...settings, requireVerificationToChat: e.target.checked })}
                className="w-5 h-5 rounded text-nau-primary focus:ring-nau-primary border-nau-border"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Số lượng ảnh tối đa mỗi tin đăng"
              type="number"
              value={settings.maxImagesPerProduct}
              onChange={(e) => setSettings({ ...settings, maxImagesPerProduct: Number(e.target.value) })}
            />

            <Input
              label="Phí sàn giao dịch (%)"
              type="number"
              value={settings.platformFeeRate}
              disabled
              helperText="Miễn phí 100% vĩnh viễn cho cộng đồng sinh viên NAU"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Lưu Toàn Bộ Cấu Hình
          </Button>
        </div>

      </form>
    </div>
  );
};
