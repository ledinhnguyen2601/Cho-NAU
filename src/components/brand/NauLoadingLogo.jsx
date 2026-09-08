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
      {/* CSS cho 3 dấu chấm chuyển động tuần tự */}
      <style>{`
        @keyframes nau-dot-bounce {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
          40% { transform: scale(1.15); opacity: 1; }
        }
        .nau-dot-1 { animation: nau-dot-bounce 1.4s infinite ease-in-out both; }
        .nau-dot-2 { animation: nau-dot-bounce 1.4s infinite ease-in-out 0.2s both; }
        .nau-dot-3 { animation: nau-dot-bounce 1.4s infinite ease-in-out 0.4s both; }
      `}</style>

      {/* Hình tĩnh logo chuẩn xóa nền từ ảnh gốc thực tế (Tối ưu WebP siêu nhẹ cho Smartphone) */}
      <div className={`${currentSize.imgWidth} flex items-center justify-center`}>
        <picture className="w-full flex items-center justify-center">
          <source srcSet="/nau_logo_photo_sm.webp" type="image/webp" />
          <img
            src="/nau_logo_photo.png"
            alt="Logo Đại học Nghệ An (NAU)"
            className="w-full h-auto object-contain drop-shadow-sm"
            loading="eager"
            width="224"
            height="126"
          />
        </picture>
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
