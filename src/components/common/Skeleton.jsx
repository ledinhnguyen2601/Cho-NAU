// File: src/components/common/Skeleton.jsx
import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-nau-surface ${className}`}
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-3 shadow-sm overflow-hidden flex flex-col h-full">
      <Skeleton className="w-full aspect-[4/3] rounded-xl mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2 mb-3" />
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100 dark:border-nau-border">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
};
