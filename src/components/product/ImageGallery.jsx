// File: src/components/product/ImageGallery.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Play, Film, Sparkles } from 'lucide-react';
import { ImageLightbox } from '../common/ImageLightbox';
import { VideoPlayer } from '../common/VideoPlayer';

export const ImageGallery = ({ images = [], title = 'Hình ảnh sản phẩm', videoUrl = null }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(videoUrl ? 'all' : 'images'); // 'all' | 'video'

  const displayImages = images && images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'];

  const hasVideo = Boolean(videoUrl);

  const handlePrev = (e) => {
    e.stopPropagation();
    if (activeTab === 'video') return;
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (activeTab === 'video') return;
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3 select-none">
      
      {/* Video & Image Switcher Tabs (If video exists) */}
      {hasVideo && (
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'images'
                ? 'bg-nau-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-nau-primary'
            }`}
          >
            <span>Ảnh chụp ({displayImages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-nau-red text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-nau-red'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Video thực tế HD</span>
          </button>
        </div>
      )}

      {/* Main View Area */}
      {activeTab === 'video' && hasVideo ? (
        <div className="w-full">
          <VideoPlayer src={videoUrl} title={title} />
        </div>
      ) : (
        /* Main Image View - Tối ưu chống bóp/mất góc ảnh (blurred backdrop + object-contain) */
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full h-[360px] sm:h-[480px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex items-center justify-center cursor-zoom-in group"
        >
          {/* Lớp 1: Nền mờ nghệ thuật để lấp đầy khung viền mà không để lại viền đen thô kệch */}
          <img
            src={displayImages[selectedIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none transition-all duration-500"
            aria-hidden="true"
          />

          {/* Lớp 2: Ảnh sản phẩm nguyên bản 100% tỷ lệ gốc (object-contain), không bị cắt xén góc nào */}
          <img
            src={displayImages[selectedIndex]}
            alt={`${title} - ảnh ${selectedIndex + 1}`}
            className="relative max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02] z-10 drop-shadow-xl"
          />

          {/* Nút phóng to toàn màn hình */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/75 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-bold shadow-md opacity-90 group-hover:opacity-100 transition-all cursor-pointer"
            title="Xem ảnh toàn màn hình tỷ lệ gốc"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phóng to</span>
          </button>

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md text-white shadow-lg transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Ảnh trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md text-white shadow-lg transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Ảnh sau"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Badge đếm số ảnh */}
          <div className="absolute bottom-3 right-3 z-20 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow-sm">
            {selectedIndex + 1} / {displayImages.length}
          </div>

          {/* Tip hướng dẫn click */}
          <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-xl bg-slate-900/60 backdrop-blur-md text-slate-300 text-[11px] font-medium hidden sm:flex items-center gap-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Click để xem ảnh tỷ lệ chuẩn</span>
          </div>
        </div>
      )}

      {/* Thumbnail Slider & Video selector */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {/* Video Thumbnail Button (nếu có video) */}
        {hasVideo && (
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`relative aspect-square w-16 sm:w-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 flex flex-col items-center justify-center bg-slate-900 text-white ${
              activeTab === 'video'
                ? 'border-nau-red ring-2 ring-nau-red/40 scale-105'
                : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-nau-red flex items-center justify-center shadow-md">
              <Play className="w-3.5 h-3.5 text-white fill-current ml-0.5" />
            </div>
            <span className="text-[10px] font-bold text-white mt-1">Video HD</span>
          </button>
        )}

        {/* Danh sách thumbnails ảnh */}
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setActiveTab('images');
              setSelectedIndex(idx);
            }}
            className={`relative aspect-square w-16 sm:w-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-950 ${
              activeTab === 'images' && selectedIndex === idx
                ? 'border-nau-primary ring-2 ring-nau-primary/40 scale-105'
                : 'border-slate-200 dark:border-slate-700/60 opacity-65 hover:opacity-100'
            }`}
          >
            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            {displayImages.length > 1 && (
              <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white/90 bg-slate-950/70 px-1 rounded">
                #{idx + 1}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal Xem Ảnh Toàn Màn Hình Tỷ Lệ Gốc Chuẩn */}
      <ImageLightbox
        images={displayImages}
        initialIndex={selectedIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={title}
      />
    </div>
  );
};
