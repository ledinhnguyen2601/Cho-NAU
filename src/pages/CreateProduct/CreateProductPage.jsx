// File: src/pages/CreateProduct/CreateProductPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createProduct } from '../../services/productService';
import { uploadProductImage } from '../../services/storageService';
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
  Image as ImageIcon
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
    images: []
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
        categoryName: selectedCategory?.name || 'Đồ cũ sinh viên'
      }, currentUser);

      toast.success('Đăng tin bán sản phẩm thành công!');
      navigate(`/product/${newProd.id}`);
    } catch (err) {
      toast.error('Không thể tạo sản phẩm. Vui lòng thử lại.');
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
          
          {/* Images Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider">
              Hình ảnh thực tế sản phẩm <span className="text-nau-red">* (1 - 6 ảnh)</span>
            </label>

            {/* Images Grid preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-nau-border dark:border-nau-border group">
                  <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-nau-danger transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {form.images.length < 6 && (
                <label className="aspect-[4/3] rounded-2xl border-2 border-dashed border-nau-border dark:border-nau-border hover:border-nau-primary bg-nau-background dark:bg-nau-surface/50 flex flex-col items-center justify-center p-3 cursor-pointer transition-colors text-slate-400 hover:text-nau-primary">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[11px] font-bold text-center">Tải ảnh lên</span>
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
            </div>

            {isUploading && (
              <div className="w-full bg-slate-100 dark:bg-nau-surface h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="bg-nau-primary h-full transition-all duration-300"
                />
              </div>
            )}

            {formErrors.images && (
              <p className="text-xs text-nau-danger font-semibold">{formErrors.images}</p>
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

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-nau-border flex justify-end gap-3">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSubmitting}
            >
              Đăng Tin Bán Ngay
            </Button>
          </div>

        </form>

      </div>

    </div>
  );
};
