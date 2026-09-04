// File: src/components/common/Badge.jsx
import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info' | 'verified'
  size = 'md', // 'sm' | 'md'
  className = '',
  icon
}) => {
  const base = 'inline-flex items-center font-medium rounded-full border transition-colors';

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const variants = {
    default: 'bg-nau-background text-nau-text border-nau-border dark:bg-nau-surface dark:text-nau-text-secondary dark:border-nau-border',
    brand: 'bg-nau-red-light text-nau-red border-nau-red/30 dark:bg-nau-red-dark/30 dark:text-nau-red-hover dark:border-nau-red/40 font-semibold',
    success: 'bg-nau-success/10 text-nau-success border-nau-success/20 dark:bg-nau-success/20 dark:text-nau-success dark:border-nau-success/30',
    warning: 'bg-nau-warning/10 text-nau-warning border-nau-warning/20 dark:bg-nau-warning/20 dark:text-nau-warning dark:border-nau-warning/30',
    danger: 'bg-nau-danger/10 text-nau-danger border-nau-danger/20 dark:bg-nau-danger/20 dark:text-nau-danger dark:border-nau-danger/30',
    info: 'bg-nau-blue-light text-nau-blue border-nau-blue/20 dark:bg-nau-blue/20 dark:text-nau-blue dark:border-nau-blue/30',
    verified: 'bg-nau-blue-light text-nau-blue border-nau-blue/30 dark:bg-nau-blue/20 dark:text-nau-blue dark:border-nau-blue/40 font-semibold',
  };

  return (
    <span className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
