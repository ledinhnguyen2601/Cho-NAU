// File: src/components/common/Input.jsx
import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  type = 'text',
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-nau-text dark:text-nau-text mb-1.5"
        >
          {label} {required && <span className="text-nau-red">*</span>}
        </label>
      )}
      <div className="relative rounded-xl">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-nau-text-muted">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`block w-full rounded-xl border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nau-red/20 transition-colors text-sm ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${rightIcon ? 'pr-10' : 'pr-3.5'} py-2.5 ${
            error
              ? 'border-nau-danger dark:border-nau-danger focus:border-nau-danger focus:ring-nau-danger/20'
              : 'border-nau-border dark:border-nau-border focus:border-nau-red'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-nau-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-nau-danger font-medium">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-nau-text-muted dark:text-nau-text-muted">{helperText}</p>
      )}
    </div>
  );
});
Input.displayName = 'Input';
