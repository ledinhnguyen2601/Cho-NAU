// File: src/components/product/ImageGallery.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export const ImageGallery = ({ images = [], title = 'Hình ảnh sản phẩm' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'];

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image View */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-nau-surface border border-nau-border dark:border-nau-border shadow-sm group">
        <img
          src={displayImages[selectedIndex]}
          alt={`${title} - ảnh ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-nau-surface/80 dark:bg-nau-background/80 backdrop-blur-md text-nau-text dark:text-nau-text hover:bg-nau-surface dark:hover:bg-slate-900 shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-nau-surface/80 dark:bg-nau-background/80 backdrop-blur-md text-nau-text dark:text-nau-text hover:bg-nau-surface dark:hover:bg-slate-900 shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold">
          {selectedIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnail Slider */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square w-16 sm:w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedIndex === idx
                  ? 'border-nau-primary ring-2 ring-nau-primary/30'
                  : 'border-nau-border dark:border-nau-border opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
