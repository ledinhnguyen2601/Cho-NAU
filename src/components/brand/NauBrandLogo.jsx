// File: src/components/brand/NauBrandLogo.jsx
import React from 'react';

/**
 * NauBrandLogo - Logo chuẩn thực tế Trường Đại học Nghệ An (NAU)
 * Sử dụng hình ảnh gốc thực tế để đảm bảo không bị sai lệch hình dáng cánh sen và khối chữ
 */
export const NauBrandLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  showShadow = false
}) => {
  const sizeMap = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  };

  const heightClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/nau_logo_photo_sm.webp"
        alt="Logo Đại học Nghệ An (NAU)"
        className={`${heightClass} w-auto object-contain ${showShadow ? 'drop-shadow-md' : ''}`}
        loading="eager"
        decoding="async"
        width="160"
        height="90"
      />
    </div>
  );
};

export default NauBrandLogo;
