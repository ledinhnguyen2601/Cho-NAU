// File: src/utils/validators.js

/**
 * Validates email address format
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates Vietnamese phone number
 */
export const isValidPhone = (phone) => {
  const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return re.test(String(phone).replace(/\s/g, ''));
};

/**
 * Validates Product Form inputs
 */
export const validateProductForm = (values) => {
  const errors = {};

  if (!values.title || values.title.trim().length < 5) {
    errors.title = 'Tiêu đề sản phẩm phải có ít nhất 5 ký tự.';
  } else if (values.title.length > 120) {
    errors.title = 'Tiêu đề không được vượt quá 120 ký tự.';
  }

  if (values.price === undefined || values.price === '' || isNaN(values.price)) {
    errors.price = 'Vui lòng nhập giá bán hợp lệ.';
  } else if (Number(values.price) < 0) {
    errors.price = 'Giá bán không thể là số âm.';
  }

  if (!values.category) {
    errors.category = 'Vui lòng chọn danh mục sản phẩm.';
  }

  if (!values.condition) {
    errors.condition = 'Vui lòng chọn tình trạng sản phẩm.';
  }

  if (!values.description || values.description.trim().length < 15) {
    errors.description = 'Mô tả chi tiết phải có ít nhất 15 ký tự để người mua nắm rõ.';
  }

  if (!values.location || values.location.trim().length < 3) {
    errors.location = 'Vui lòng cung cấp địa điểm giao dịch (ví dụ: KTX NAU, Cổng 1).';
  }

  if (!values.images || values.images.length === 0) {
    errors.images = 'Cần tải lên ít nhất 1 hình ảnh thật của sản phẩm.';
  } else if (values.images.length > 6) {
    errors.images = 'Tối đa được tải lên 6 hình ảnh.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validates image file before upload
 */
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File ${file.name} không đúng định dạng (chỉ chấp nhận JPG, PNG, WEBP).`
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File ${file.name} vượt quá dung lượng cho phép (tối đa 5MB).`
    };
  }

  return { isValid: true };
};
