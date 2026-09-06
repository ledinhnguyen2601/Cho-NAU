// File: src/pages/Verification/VerificationPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { submitVerification } from '../../services/verificationService';
import { uploadVerificationDocument } from '../../services/storageService';
import { validateImageFile } from '../../utils/validators';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { NAU_FACULTIES } from '../../config/constants';
import { 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Upload, 
  CheckCircle2, 
  FileCheck, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  X
} from 'lucide-react';

export const VerificationPage = () => {
  const { currentUser, isVerified, isPending, updateUserProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const isExistingInList = currentUser?.faculty && NAU_FACULTIES.includes(currentUser.faculty);
  const [name, setName] = useState(currentUser?.name || '');
  const [studentId, setStudentId] = useState(currentUser?.studentId || '');
  const [faculty, setFaculty] = useState(
    currentUser?.faculty 
      ? (isExistingInList ? currentUser.faculty : 'Khác (Tự nhập tay)')
      : (NAU_FACULTIES[0] || 'Khoa Công Nghệ Thông Tin')
  );
  const [customFaculty, setCustomFaculty] = useState(
    currentUser?.faculty && !isExistingInList ? currentUser.faculty : ''
  );
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState(currentUser?.verificationDocument || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border text-center space-y-4 shadow-sm">
        <AlertCircle className="w-12 h-12 text-nau-primary mx-auto" />
        <h2 className="text-lg font-bold text-nau-text dark:text-nau-text">
          Vui lòng đăng nhập
        </h2>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
          Bạn cần đăng nhập trước khi tiến hành xác thực tài khoản sinh viên.
        </p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-nau-primary text-white text-xs font-bold rounded-xl">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // Handle File selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setDocFile(file);
    const reader = new FileReader();
    reader.onload = () => setDocPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Vui lòng nhập Họ và tên.');
      return;
    }
    if (!studentId.trim()) {
      toast.warning('Vui lòng nhập Mã số sinh viên NAU.');
      return;
    }
    if (!docPreview && !docFile) {
      toast.warning('Vui lòng tải lên ảnh Thẻ sinh viên hoặc CCCD.');
      return;
    }

    if (faculty === 'Khác (Tự nhập tay)' && !customFaculty.trim()) {
      toast.error('Vui lòng nhập tên Khoa / Ngành của bạn!');
      return;
    }

    const finalFaculty = faculty === 'Khác (Tự nhập tay)'
      ? customFaculty.trim()
      : faculty;

    setIsSubmitting(true);
    try {
      let finalDocUrl = docPreview;
      if (docFile) {
        finalDocUrl = await uploadVerificationDocument(docFile, (p) => setUploadProgress(p));
      }

      await submitVerification(currentUser.id, {
        name: name.trim(),
        studentId: studentId.trim(),
        faculty: finalFaculty,
        phone: phone.trim(),
        documentUrl: finalDocUrl
      });

      updateUserProfile({
        name: name.trim(),
        studentId: studentId.trim(),
        faculty: finalFaculty,
        phone: phone.trim(),
        verificationDocument: finalDocUrl,
        verificationStatus: 'pending_verification'
      });

      toast.success('Hồ sơ xác thực đã được gửi thành công! Ban Quản Trị sẽ duyệt trong vòng 2-4 giờ.');
    } catch (err) {
      console.error('Verification submission error:', err);
      const msg = err.message || 'Không thể gửi hồ sơ xác thực. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-nau-primary-light dark:bg-nau-primary/20 text-nau-primary dark:text-nau-primary flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-nau-text dark:text-nau-text">
          Xác Thực Danh Tính Sinh Viên NAU
        </h1>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted max-w-md mx-auto">
          Xác thực thẻ sinh viên giúp nhận huy hiệu <strong>✓ Đã xác thực</strong>, mở khóa toàn quyền Đăng tin bán và Chat giao dịch.
        </p>
      </div>

      {/* Case 1: Already Verified */}
      {isVerified && (
        <div className="bg-nau-success/10 dark:bg-nau-success/20 border border-nau-success dark:border-nau-success/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <CheckCircle2 className="w-14 h-14 text-nau-success dark:text-nau-success mx-auto" />
          <h3 className="text-lg font-bold text-nau-success dark:text-nau-success">
            Tài Khoản Đã Được Xác Thực Thành Công!
          </h3>
          <p className="text-xs text-nau-success dark:text-nau-success max-w-md mx-auto leading-relaxed">
            Xin chúc mừng <strong>{currentUser.name}</strong>! Bạn là thành viên chính thức được chứng nhận của Đại học Nghệ An. Bạn có thể đăng bán và nhắn tin mua hàng an toàn.
          </p>

          <div className="p-4 bg-nau-surface dark:bg-nau-background rounded-2xl max-w-sm mx-auto text-left text-xs space-y-1.5 border border-nau-success/30 dark:border-nau-success/40">
            <p><strong>Mã SV:</strong> {currentUser.studentId || 'NAU2100882'}</p>
            <p><strong>Khoa:</strong> {currentUser.faculty || 'Công Nghệ Thông Tin'}</p>
            <p><strong>Huy hiệu:</strong> <span className="text-nau-success font-bold">✓ Sinh viên Đã xác thực</span></p>
          </div>

          <div className="pt-2">
            <Link
              to="/create-product"
              className="inline-flex items-center gap-2 px-6 py-3 bg-nau-success hover:bg-nau-success text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20"
            >
              <span>Đăng tin bán sản phẩm ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Case 2: Pending Approval */}
      {isPending && !isVerified && (
        <div className="bg-nau-warning/10 dark:bg-nau-warning/20 border border-nau-warning dark:border-nau-warning/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <Clock className="w-14 h-14 text-nau-warning dark:text-nau-warning mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-nau-warning dark:text-nau-warning">
            Hồ Sơ Của Bạn Đang Được Ban Quản Trị Xét Duyệt
          </h3>
          <p className="text-xs text-nau-warning dark:text-nau-warning max-w-md mx-auto leading-relaxed">
            Hồ sơ xác thực thẻ sinh viên của bạn đã được tiếp nhận. Đội ngũ kiểm duyệt NAU sẽ đối chiếu thông tin và phê duyệt trong thời gian sớm nhất (khoảng 2–4 giờ).
          </p>

          {currentUser.verificationDocument && (
            <div className="max-w-xs mx-auto rounded-2xl overflow-hidden border border-nau-warning/30 dark:border-nau-warning/40 shadow-sm">
              <img src={currentUser.verificationDocument} alt="Tài liệu đã gửi" className="w-full h-auto" />
            </div>
          )}

          <div className="pt-2">
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-nau-warning hover:bg-nau-warning text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Về trang chủ xem sản phẩm
            </Link>
          </div>
        </div>
      )}

      {/* Case 3: New or Rejected - Show Form */}
      {!isVerified && !isPending && (
        <div className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 sm:p-8 shadow-sm">
          
          {currentUser.verificationStatus === 'rejected' && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-nau-danger/20 border border-nau-danger/30 dark:border-nau-danger/40 text-xs text-nau-danger dark:text-nau-danger space-y-1">
              <p className="font-bold">✕ Hồ sơ trước đó bị từ chối:</p>
              <p>{currentUser.verificationRejectionReason || 'Ảnh chụp không rõ nét. Vui lòng chụp lại ảnh thẻ rõ ràng hơn.'}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Họ và tên sinh viên"
              required
              placeholder="Nhập họ và tên thật của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mã số sinh viên (MSSV)"
                required
                placeholder="Ví dụ: NAU2100882"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />

              <Input
                label="Số điện thoại liên hệ"
                placeholder="Ví dụ: 0988 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-nau-text dark:text-nau-text mb-1.5">
                Khoa / Viện đào tạo <span className="text-nau-red">*</span>
              </label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text"
              >
                {NAU_FACULTIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              {faculty === 'Khác (Tự nhập tay)' && (
                <div className="mt-3 animate-fade-in">
                  <Input
                    label="Tên Khoa / Ngành / Viện của bạn"
                    required
                    placeholder="Ví dụ: Khoa Kinh Tế - Lớp K62 QTKD..."
                    value={customFaculty}
                    onChange={(e) => setCustomFaculty(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Document upload box */}
            <div>
              <label className="block text-xs font-bold text-nau-text dark:text-nau-text mb-1.5">
                Ảnh Thẻ sinh viên NAU hoặc CCCD (Mặt trước) <span className="text-nau-red">*</span>
              </label>

              {docPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-nau-border dark:border-nau-border bg-slate-100 dark:bg-nau-surface p-2">
                  <img src={docPreview} alt="Xem trước tài liệu" className="w-full max-h-56 object-contain rounded-xl" />
                  <button
                    type="button"
                    onClick={() => {
                      setDocPreview(null);
                      setDocFile(null);
                    }}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-nau-danger transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-nau-border dark:border-nau-border hover:border-nau-primary bg-nau-background dark:bg-nau-surface/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-nau-text-muted hover:text-nau-primary">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold">Bấm để tải ảnh hoặc kéo thả vào đây</span>
                  <span className="text-[11px] text-slate-400 mt-1">Chấp nhận JPG, PNG, WEBP (Tối đa 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="pt-3">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
              >
                Gửi Hồ Sơ Xét Duyệt
              </Button>
            </div>
          </form>

        </div>
      )}

    </div>
  );
};
