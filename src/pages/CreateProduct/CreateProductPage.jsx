// File: src/pages/CreateProduct/CreateProductPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createProduct } from '../../services/productService';
import { uploadProductImage, uploadProductVideo } from '../../services/storageService';
import { validateProductForm } from '../../utils/validators';
import { INITIAL_CATEGORIES } from '../../config/constants';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { 
  Upload, 
  X, 
  Plus, 
  ShieldAlert, 
  Sparkles, 
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Film,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CreateProductPage = () => {
  const { currentUser, isVerified } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    price: '',
    category: 'study',
    condition: 'Đã sử dụng - Rất tốt (90%)',
    location: 'Cơ sở 1 NAU (P. Hưng Dũng, TP. Vinh)',
    description: '',
    images: [],
    videoUrl: null,
    videoMeta: null
  });

  // Clear individual field error when user edits that field
  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const [formErrors, setFormErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Video upload state
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoError, setVideoError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // If not logged in
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border text-center space-y-4 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-nau-warning mx-auto" />
        <h2 className="text-lg font-bold text-nau-text dark:text-nau-text">
          Yêu cầu đăng nhập
        </h2>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
          Bạn cần đăng nhập tài khoản sinh viên NAU để đăng tin bán sản phẩm.
        </p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-nau-primary text-white text-xs font-bold rounded-xl">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // If not verified
  if (!isVerified) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border text-center space-y-4 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-nau-warning mx-auto" />
        <h2 className="text-lg font-bold text-nau-text dark:text-nau-text">
          Yêu Cầu Xác Thực Thẻ Sinh Viên
        </h2>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted leading-relaxed">
          Để bảo vệ cộng đồng sinh viên NAU khỏi các hành vi lừa đảo, bạn cần gửi ảnh Thẻ sinh viên hoặc CCCD để được cấp quyền đăng bán.
        </p>
        <Link to="/verification" className="inline-block px-6 py-2.5 bg-nau-primary hover:bg-nau-primary-hover text-white text-xs font-bold rounded-xl shadow-md shadow-nau-red/20">
          Tới trang xác thực danh tính →
        </Link>
      </div>
    );
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (form.images.length + files.length > 6) {
      toast.warning('Chỉ được tải lên tối đa 6 hình ảnh.');
      return;
    }

    setIsUploading(true);
    setFormErrors(prev => ({ ...prev, images: undefined }));
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadProductImage(file, (progress) => setUploadProgress(progress));
        uploadedUrls.push(url);
      }
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      toast.success(`Đã tải lên ${uploadedUrls.length} hình ảnh!`);
    } catch (err) {
      console.error('Image upload error details:', err);
      const errorMsg = err.code === 'storage/unauthorized'
        ? 'Không có quyền tải ảnh. Vui lòng đăng nhập lại.'
        : err.code === 'storage/canceled'
        ? 'Tải ảnh bị hủy.'
        : err.code === 'storage/unknown'
        ? 'Lỗi kết nối Firebase Storage. Vui lòng thử lại.'
        : err.message || 'Lỗi tải ảnh. Vui lòng thử lại.';
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset input file để có thể chọn lại cùng file
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVideoUploading(true);
    setVideoError(null);
    try {
      const { url, meta } = await uploadProductVideo(file, (progress) => setVideoUploadProgress(progress));
      setForm(prev => ({
        ...prev,
        videoUrl: url,
        videoMeta: meta
      }));
      toast.success(`Đã tải lên video thực tế (${meta.formattedDuration})!`);
    } catch (err) {
      console.error('Video upload error:', err);
      const msg = err.message || 'Lỗi tải video. Vui lòng kiểm tra thời lượng (< 3 phút) và định dạng.';
      setVideoError(msg);
      toast.error(msg);
    } finally {
      setIsVideoUploading(false);
      setVideoUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleRemoveVideo = () => {
    setForm(prev => ({
      ...prev,
      videoUrl: null,
      videoMeta: null
    }));
    setVideoError(null);
    toast.info('Đã gỡ video sản phẩm.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateProductForm(form);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      // Hiển thị lỗi cụ thể đầu tiên thay vì thông báo chung chung
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError || 'Vui lòng kiểm tra lại các trường thông tin bắt buộc.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCategory = INITIAL_CATEGORIES.find(c => c.id === form.category);
      const newProd = await createProduct({
        ...form,
        price: Number(form.price),
        categoryName: selectedCategory?.name || 'Đồ cũ sinh viên',
        videoUrl: form.videoUrl || null
      }, currentUser);

      toast.success('Đăng tin bán sản phẩm thành công!');
      navigate(`/product/${newProd.id}`);
    } catch (err) {
      console.error('Submit product error details:', err);
      let errorMsg = 'Không thể tạo sản phẩm. Vui lòng thử lại.';
      if (err.code === 'permission-denied') {
        errorMsg = 'Quyền đăng bài bị từ chối: Tài khoản cần hoàn tất xác thực Thẻ sinh viên trước khi đăng bán.';
      } else if (err.message && err.message.toLowerCase().includes('exceed')) {
        errorMsg = 'Dung lượng dữ liệu quá lớn. Vui lòng chọn ảnh dung lượng nhẹ hơn.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Back button & Page Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-nau-text-muted hover:text-nau-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Hủy & Quay lại</span>
        </button>
        <span className="text-xs font-bold text-nau-success dark:text-nau-success bg-nau-success/10 dark:bg-nau-success/20 px-2.5 py-1 rounded-full border border-nau-success/30 dark:border-nau-success/40">
          ✓ Quyền đăng tin đã xác thực
        </span>
      </div>

      <div className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 sm:p-8 shadow-sm">
        
        <div className="mb-6 pb-4 border-b border-slate-100 dark:border-nau-border">
          <h1 className="text-xl font-black text-nau-text dark:text-nau-text">
            Đăng Tin Chuyển Nhượng / Bán Đồ Cũ
          </h1>
          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
            Thông tin càng chi tiết sẽ giúp bạn thanh lý đồ nhanh chóng cho các bạn sinh viên khác.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Images Upload Section - Phong cách Chợ Tốt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-nau-text dark:text-nau-text uppercase tracking-wider">
                Hình ảnh sản phẩm <span className="text-nau-red">* (Tối đa 6 ảnh)</span>
              </label>
              <span className="text-xs font-bold text-nau-blue dark:text-blue-400">{form.images.length}/6 ảnh</span>
            </div>

            {/* Upload Zone */}
            {form.images.length < 6 && (
              <label className="block bg-blue-50/40 hover:bg-blue-100/40 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 border-2 border-dashed border-blue-300 dark:border-blue-700/60 rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all group shadow-inner">
                <div className="w-14 h-14 rounded-2xl bg-nau-blue text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-105 transition-transform">
                  <Upload className="w-7 h-7 stroke-[2.5]" />
                </div>
                <p className="text-sm font-black text-slate-800 dark:text-slate-100 mt-2.5">
                  Thêm ảnh sản phẩm
                </p>
                <p className="text-xs text-nau-text-secondary dark:text-slate-400 mt-0.5 font-medium">
                  Chụp góc rõ nét để sinh viên khác dễ dàng liên hệ mua
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}

            {/* Images Grid preview */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-nau-blue/50 dark:border-blue-500 group shadow-xs">
                    <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-nau-danger transition-colors cursor-pointer"
                      title="Xóa ảnh này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-slate-950/70 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                      Ảnh {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="space-y-1 pt-2">
                <div className="w-full bg-slate-100 dark:bg-nau-surface h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="bg-nau-blue h-full transition-all duration-300"
                  />
                </div>
                <p className="text-[11px] text-nau-blue dark:text-blue-400 font-bold text-center">
                  Đang xử lý tải ảnh lên ({uploadProgress}%)...
                </p>
              </div>
            )}

            {formErrors.images && (
              <p className="text-xs text-nau-danger font-semibold">{formErrors.images}</p>
            )}
          </div>

          {/* Video thực tế sản phẩm (Tùy chọn - Giúp tăng độ tin cậy) */}
          <div className="space-y-3 p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-nau-red/10 text-nau-red flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <label className="block text-xs font-black text-nau-text dark:text-nau-text uppercase tracking-wider">
                    Video thực tế sản phẩm <span className="text-slate-400 font-normal lowercase">(Tùy chọn)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tối đa 3 phút • Tối đa 1080p Full HD • Giúp người mua tin tưởng hơn 80%
                  </p>
                </div>
              </div>
              {form.videoUrl && (
                <span className="flex items-center gap-1 text-xs font-bold text-nau-success bg-nau-success/10 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã có video
                </span>
              )}
            </div>

            {/* Video Preview If Uploaded */}
            {form.videoUrl ? (
              <div className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden bg-black max-h-[280px] flex items-center justify-center border border-slate-700">
                  <video
                    src={form.videoUrl}
                    controls
                    className="max-h-[280px] w-auto max-w-full rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-nau-red transition-colors shadow-md cursor-pointer"
                    title="Xóa video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {form.videoMeta && (
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-lg border border-white/10">
                      Thời lượng: {form.videoMeta.formattedDuration}
                    </span>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="text-xs font-bold text-nau-red hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Gỡ bỏ video này để tải video khác
                  </button>
                </div>
              </div>
            ) : (
              /* Video Upload Trigger */
              <label className="block border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-nau-red/60 dark:hover:border-nau-red/60 rounded-2xl p-5 text-center cursor-pointer transition-all bg-white dark:bg-slate-900/60 hover:bg-red-50/20 group">
                <div className="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-950/40 text-nau-red flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-2">
                  Tải lên video quay cận cảnh sản phẩm
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Định dạng MP4, WebM, MOV (Tối đa 3 phút, dưới 100MB)
                </p>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/ogg"
                  onChange={handleVideoUpload}
                  className="hidden"
                  disabled={isVideoUploading}
                />
              </label>
            )}

            {/* Video Progress Bar */}
            {isVideoUploading && (
              <div className="space-y-1 pt-1">
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${videoUploadProgress}%` }}
                    className="bg-nau-red h-full transition-all duration-300"
                  />
                </div>
                <p className="text-[11px] text-nau-red font-bold text-center">
                  Đang kiểm tra và tải video lên ({videoUploadProgress}%)...
                </p>
              </div>
            )}

            {videoError && (
              <div className="flex items-center gap-1.5 text-xs text-nau-red font-semibold bg-red-50 dark:bg-red-950/20 p-2.5 rounded-xl border border-red-200 dark:border-red-800/40">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{videoError}</span>
              </div>
            )}
          </div>

          {/* Product Title */}
          <Input
            label="Tiêu đề tin đăng"
            required
            placeholder="Ví dụ: Giáo trình Đại số K62, Laptop Dell Vostro i5, Xe đạp Asama..."
            value={form.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            error={formErrors.title}
          />

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-nau-text dark:text-nau-text mb-1.5">
                Danh mục sản phẩm <span className="text-nau-red">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text"
              >
                {INITIAL_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-nau-text dark:text-nau-text mb-1.5">
                Tình trạng sản phẩm <span className="text-nau-red">*</span>
              </label>
              <select
                value={form.condition}
                onChange={(e) => handleFieldChange('condition', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text"
              >
                <option value="Mới 100% (Chưa qua sử dụng)">Mới 100% (Chưa qua sử dụng)</option>
                <option value="Đã sử dụng - Như mới (98%)">Đã sử dụng - Như mới (98%)</option>
                <option value="Đã sử dụng - Rất tốt (90%)">Đã sử dụng - Rất tốt (90%)</option>
                <option value="Đã sử dụng - Bình thường">Đã sử dụng - Bình thường</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <Input
            label="Giá bán (VNĐ)"
            type="number"
            required
            placeholder="Ví dụ: 150000"
            value={form.price}
            onChange={(e) => handleFieldChange('price', e.target.value)}
            error={formErrors.price}
          />

          {/* Location */}
          <Input
            label="Địa điểm xem đồ / Giao dịch tại NAU"
            required
            placeholder="Ví dụ: Cơ sở 1 NAU, KTX Nữ B, Cổng sau đường Nguyễn Viết Xuân..."
            value={form.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            error={formErrors.location}
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-nau-text dark:text-nau-text mb-1.5">
              Mô tả chi tiết <span className="text-nau-red">*</span>
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Nêu rõ tình trạng hoạt động, lý do bán, phụ kiện đi kèm, thời gian xem đồ phù hợp..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 focus:ring-2 focus:ring-nau-primary"
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-nau-danger font-semibold">{formErrors.description}</p>
            )}
          </div>

          {/* Submit CTA - Chuẩn Chợ Tốt */}
          <div className="pt-4 border-t border-slate-100 dark:border-nau-border flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => navigate(-1)}
              className="order-2 sm:order-1"
            >
              Hủy bỏ
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="order-1 sm:order-2 w-full sm:w-auto px-8 py-3.5 bg-nau-red hover:bg-nau-red-hover text-white font-bold text-sm rounded-2xl shadow-lg shadow-nau-red/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải tin đăng...</span>
                </>
              ) : (
                <span>ĐĂNG TIN NGAY</span>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
