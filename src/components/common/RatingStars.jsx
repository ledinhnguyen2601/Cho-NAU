// File: src/components/common/RatingStars.jsx
import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 0,
  maxStars = 5,
  size = 'md', // 'sm' | 'md' | 'lg'
  interactive = false,
  onChange,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5`}
          >
            <Star
              className={`${sizeMap[size]} ${
                isFilled
                  ? 'fill-nau-warning text-nau-warning drop-shadow-sm'
                  : 'text-slate-300 dark:text-nau-text-secondary'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
