// File: src/components/brand/NauLoadingLogo.jsx
import React from 'react';

/**
 * NauLoadingLogo - Component hiển thị Logo tĩnh chuẩn theo ảnh gốc thực tế
 * Kèm dòng chữ "Đang tải trang..." và 3 dấu chấm chuyển động tuần tự bên dưới
 */
export const NauLoadingLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'fullscreen'
  text = 'Đang tải trang...',
  className = ''
}) => {
  const sizeMap = {
    sm: { imgWidth: 'w-28 sm:w-32', fontSize: 'text-[11px]' },
    md: { imgWidth: 'w-48 sm:w-56', fontSize: 'text-xs' },
    lg: { imgWidth: 'w-64 sm:w-80', fontSize: 'text-sm' },
    fullscreen: { imgWidth: 'w-56 sm:w-72', fontSize: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
      {/* Hình tĩnh logo chuẩn xóa nền từ ảnh gốc thực tế (WebP siêu nhẹ) */}
      <div className={`${currentSize.imgWidth} flex items-center justify-center`}>
        <img
          src="/nau_logo_photo_sm.webp"
          alt="Logo Đại học Nghệ An (NAU)"
          className="w-full h-auto object-contain drop-shadow-sm"
          loading="eager"
          decoding="async"
          width="224"
          height="126"
        />
      </div>

      {/* Dòng chữ đang tải kèm 3 dấu chấm chuyển động tuần tự phía dưới */}
      {text && (
        <div className={`flex items-center justify-center gap-1.5 mt-3.5 text-slate-600 dark:text-slate-300 font-semibold tracking-wide ${currentSize.fontSize}`}>
          <span>{text}</span>
          <div className="flex items-center gap-1 ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-nau-red nau-dot-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-nau-blue nau-dot-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-nau-red nau-dot-3" />
          </div>
        </div>
      )}
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};

export default NauLoadingLogo;
