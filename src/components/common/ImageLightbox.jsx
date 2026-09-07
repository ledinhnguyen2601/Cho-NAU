// File: src/components/common/ImageLightbox.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

/**
 * ImageLightbox - Trình xem ảnh phóng to toàn màn hình chuẩn sàn thương mại điện tử (Chợ Tốt / Shopee)
 * - Giữ trọn 100% tỷ lệ gốc của ảnh (dọc 9:16, ngang 16:9, vuông 1:1), không bao giờ cắt xén
 * - Hỗ trợ phím tắt bàn phím: Escape (Đóng), ArrowLeft (Ảnh trước), ArrowRight (Ảnh sau)
 * - Hỗ trợ cử chỉ vuốt chạm (touch swipe) trên điện thoại di động
 * - Hiển thị dải ảnh thu nhỏ (thumbnails) phía dưới để chuyển đổi nhanh
 */
export const ImageLightbox = ({
  isOpen,
  onClose,
  images = [],
  currentIndex,
  initialIndex = 0,
  onIndexChange,
  title = 'Hình ảnh sản phẩm'
}) => {
  const [internalIndex, setInternalIndex] = useState(initialIndex || 0);

  // Synchronize initial or external index when modal opens
  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex !== undefined ? currentIndex : (initialIndex || 0));
    }
  }, [isOpen, currentIndex, initialIndex]);

  const activeIndex = currentIndex !== undefined ? currentIndex : internalIndex;

  const handleIndexChange = useCallback((newIdx) => {
    setInternalIndex(newIdx);
    if (onIndexChange) onIndexChange(newIdx);
  }, [onIndexChange]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    const prevIdx = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    handleIndexChange(prevIdx);
  }, [activeIndex, images.length, handleIndexChange]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    const nextIdx = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    handleIndexChange(nextIdx);
  }, [activeIndex, images.length, handleIndexChange]);

  // Keyboard controls hook - MUST BE DECLARED BEFORE EARLY RETURNS
  useEffect(() => {
    if (!isOpen || images.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, images.length, onClose, handlePrev, handleNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Early return ONLY AFTER all hooks are called
  if (!isOpen || images.length === 0) return null;

  const currentImage = images[activeIndex] || images[0];

  // Touch swipe support for mobile
  let touchStartX = 0;
  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (diff > 50) handlePrev();
    else if (diff < -50) handleNext();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-fade-in"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white text-xs font-semibold truncate max-w-[70vw]">
          <span>{title}</span>
          <span className="ml-2 text-white/60">({activeIndex + 1}/{images.length})</span>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          title="Đóng xem ảnh (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Center Stage */}
      <div 
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrow Left */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            type="button"
            className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-lg"
            title="Ảnh trước (Mũi tên trái)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* High-Fidelity Uncropped Image Display */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            src={currentImage}
            alt={`${title} - ảnh ${activeIndex + 1}`}
            className="max-h-[72vh] sm:max-h-[78vh] max-w-[94vw] object-contain rounded-lg shadow-2xl transition-all duration-200"
          />
        </div>

        {/* Navigation Arrow Right */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            type="button"
            className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-lg"
            title="Ảnh kế tiếp (Mũi tên phải)"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div 
          className="py-3 px-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center gap-2 overflow-x-auto z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleIndexChange(idx)}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                activeIndex === idx
                  ? 'border-nau-primary ring-2 ring-nau-primary scale-105'
                  : 'border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
