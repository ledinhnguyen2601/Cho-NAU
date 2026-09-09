// File: src/pages/Admin/AdminSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { getSystemSettings, saveSystemSettings } from '../../services/adminService';
import { NauLoadingLogo } from '../../components/brand/NauLoadingLogo';
import { 
  Settings, 
  ShieldCheck, 
  Globe, 
  Tag, 
  Sliders, 
  Bell, 
  Save,
  Mail,
  CheckCircle2,
  RefreshCw
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
    platformFeeRate: 0,
    autoExpireDays: 45,
    notifyEmailOnNewMessage: true,
    notifyEmailOnOrderUpdate: true,
    notifyEmailOnVerification: true,
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const data = await getSystemSettings();
        if (data) {
          setSettings(prev => ({ ...prev, ...data }));
          if (data.supportEmail) setTestEmailAddress(data.supportEmail);
        }
      } catch (e) {
        console.error('Error loading settings:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSystemSettings(settings);
      toast.success('Đã lưu cấu hình hệ thống Chợ NAU thành công lên máy chủ!');
    } catch (err) {
      toast.error('Lỗi khi lưu cấu hình. Đã lưu tạm vào bộ nhớ trình duyệt.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    const targetEmail = testEmailAddress || settings.supportEmail;
    if (!targetEmail) {
      toast.warning('Vui lòng nhập địa chỉ email nhận thư kiểm tra.');
      return;
    }

    const sId = settings.emailjsServiceId || import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const tId = settings.emailjsTemplateId || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const pKey = settings.emailjsPublicKey || import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!sId || !tId || !pKey) {
      toast.warning('Vui lòng nhập đầy đủ Service ID, Template ID và Public Key của EmailJS trước khi gửi thử.');
      return;
    }

    setIsSendingTestEmail(true);
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: sId,
          template_id: tId,
          user_id: pKey,
          template_params: {
            to_email: targetEmail,
            email: targetEmail,
            user_email: targetEmail,
            recipient: targetEmail,
            reply_to: targetEmail,
            to_name: 'Quản trị viên NAU',
            name: 'Quản trị viên NAU',
            subject: '[Chợ NAU] Thư kiểm tra kết nối hệ thống tự động',
            sender_name: 'Hệ thống Chợ NAU',
            message_text: 'Xin chào! Đây là email kiểm tra tự động từ Chợ NAU. Cấu hình EmailJS của bạn đã hoạt động chính xác 100%!',
            message: 'Xin chào! Đây là email kiểm tra tự động từ Chợ NAU. Cấu hình EmailJS của bạn đã hoạt động chính xác 100%!',
            action_url: window.location.origin,
            platform_name: 'Chợ NAU - Sàn Đồ Cũ Sinh Viên NAU'
          }
        })
      });

      if (response.ok) {
        toast.success(`Đã gửi email kiểm tra thành công tới ${targetEmail}!`);
      } else {
        const errorText = await response.text();
        if (errorText.includes('recipients address is empty')) {
          toast.error('Lỗi EmailJS (422): Bạn chưa điền {{to_email}} vào ô "To Email" trong mẫu Template trên trang EmailJS.com!');
        } else {
          toast.error(`EmailJS báo lỗi (${response.status}): ${errorText}`);
        }
      }
    } catch (err) {
      toast.error('Không thể kết nối tới máy chủ EmailJS: ' + err.message);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-6">
        <NauLoadingLogo size="md" text="Đang tải cấu hình hệ thống..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
            <Settings className="w-6 h-6 text-nau-primary" />
            <span>Cấu Hình & Thiết Lập Hệ Thống</span>
          </h1>
          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
            Quản lý thông số sàn, quy tắc kiểm duyệt, thông báo email và chính sách an toàn cho sinh viên NAU
          </p>
        </div>
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

        {/* Section 3: Email Notification Configuration */}
        <div className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-nau-text dark:text-nau-text flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-nau-border">
            <Mail className="w-4 h-4 text-nau-blue" />
            <span>Cấu Hình Thông Báo Qua Email Khi Sinh Viên Không Trực Tuyến</span>
          </h2>

          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
            Tự động gửi email thông báo trực tiếp đến hộp thư sinh viên khi họ không online trên website:
          </p>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-surface/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-nau-text dark:text-nau-text">
                  Gửi email khi có Tin nhắn mới (người nhận đang offline)
                </p>
                <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted">
                  Báo cho người mua/bán biết có người nhắn tin hỏi mua sản phẩm
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyEmailOnNewMessage !== false}
                onChange={(e) => setSettings({ ...settings, notifyEmailOnNewMessage: e.target.checked })}
                className="w-5 h-5 rounded text-nau-primary focus:ring-nau-primary border-nau-border"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-surface/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-nau-text dark:text-nau-text">
                  Gửi email khi có Đơn hàng mới hoặc Cập nhật trạng thái đơn
                </p>
                <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted">
                  Thông báo xác nhận đơn, giao dịch hoàn tất hoặc hủy đơn
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyEmailOnOrderUpdate !== false}
                onChange={(e) => setSettings({ ...settings, notifyEmailOnOrderUpdate: e.target.checked })}
                className="w-5 h-5 rounded text-nau-primary focus:ring-nau-primary border-nau-border"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-surface/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-nau-text dark:text-nau-text">
                  Gửi email khi Hồ sơ xác thực thẻ SV được Phê duyệt / Từ chối
                </p>
                <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted">
                  Báo ngay cho sinh viên kết quả kiểm duyệt thẻ sinh viên NAU
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyEmailOnVerification !== false}
                onChange={(e) => setSettings({ ...settings, notifyEmailOnVerification: e.target.checked })}
                className="w-5 h-5 rounded text-nau-primary focus:ring-nau-primary border-nau-border"
              />
            </label>
          </div>

          {/* EmailJS Credentials & Test Tool */}
          <div className="pt-4 border-t border-slate-100 dark:border-nau-border space-y-4">
            <h3 className="text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider">
              Khóa Kết Nối Dịch Vụ Email Tự Động (EmailJS)
            </h3>
            <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted">
              Đăng ký tài khoản miễn phí tại <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" className="text-nau-primary underline font-bold">EmailJS.com</a> (miễn phí 200 email/tháng). Nhập các khóa dưới đây để kích hoạt gửi email tự động khi sinh viên offline:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="EmailJS Service ID"
                placeholder="service_xxxxx"
                value={settings.emailjsServiceId || ''}
                onChange={(e) => setSettings({ ...settings, emailjsServiceId: e.target.value.trim() })}
              />

              <Input
                label="EmailJS Template ID"
                placeholder="template_xxxxx"
                value={settings.emailjsTemplateId || ''}
                onChange={(e) => setSettings({ ...settings, emailjsTemplateId: e.target.value.trim() })}
              />

              <Input
                label="EmailJS Public Key (User ID)"
                placeholder="public_key_xxxxx"
                value={settings.emailjsPublicKey || ''}
                onChange={(e) => setSettings({ ...settings, emailjsPublicKey: e.target.value.trim() })}
              />
            </div>

            {/* Test Email Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-nau-surface/60 border border-slate-200 dark:border-nau-border flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
              <div className="w-full sm:w-80">
                <Input
                  label="Email nhận thử nghiệm"
                  type="email"
                  placeholder="admin@nau.edu.vn"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value.trim())}
                  helperText="Nhập email của bạn để kiểm tra tính năng gửi thư tự động"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSendTestEmail}
                isLoading={isSendingTestEmail}
                leftIcon={<Mail className="w-3.5 h-3.5 text-nau-primary" />}
                className="w-full sm:w-auto shrink-0 mb-1"
              >
                Gửi Thử Email Kiểm Tra
              </Button>
            </div>
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

