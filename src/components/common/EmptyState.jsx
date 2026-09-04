// File: src/components/common/EmptyState.jsx
import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Không tìm thấy dữ liệu',
  description = 'Hiện tại chưa có nội dung nào phù hợp với tìm kiếm của bạn.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-nau-border dark:border-nau-border bg-nau-surface/50 dark:bg-nau-background/50 backdrop-blur-sm ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-nau-primary-light dark:bg-nau-primary/20 flex items-center justify-center text-nau-primary dark:text-nau-primary mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-nau-text dark:text-nau-text mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-nau-text-muted dark:text-nau-text-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
