// File: src/components/common/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-nau-red hover:bg-nau-red-hover text-white shadow-md shadow-nau-red/25 focus:ring-nau-red',
    secondary: 'bg-nau-surface hover:bg-nau-background text-nau-text dark:bg-nau-surface dark:hover:bg-slate-800 dark:text-nau-text border border-nau-border hover:border-nau-red/50 focus:ring-nau-red/40',
    outline: 'border border-nau-border dark:border-nau-border hover:border-nau-red/60 hover:bg-nau-red-light/50 dark:hover:bg-nau-red-dark/20 text-nau-text dark:text-nau-text hover:text-nau-red dark:hover:text-nau-red-hover focus:ring-nau-red/40',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-nau-text dark:text-nau-text-secondary hover:text-nau-red focus:ring-slate-400',
    danger: 'bg-nau-danger hover:bg-nau-danger/90 text-white shadow-md shadow-nau-danger/20 focus:ring-nau-danger',
    success: 'bg-nau-success hover:bg-nau-success/90 text-white shadow-md shadow-nau-success/20 focus:ring-nau-success',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
