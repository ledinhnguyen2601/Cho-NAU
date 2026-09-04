// File: src/components/common/Select.jsx
import React, { forwardRef } from 'react';

export const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  className = '',
  id,
  required = false,
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-nau-text dark:text-nau-text mb-1.5"
        >
          {label} {required && <span className="text-nau-red">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`block w-full rounded-xl border bg-nau-surface dark:bg-nau-background text-nau-text dark:text-nau-text focus:outline-none focus:ring-2 focus:ring-nau-primary/20 transition-colors text-sm px-3.5 py-2.5 ${
          error
            ? 'border-nau-danger dark:border-nau-danger focus:border-nau-danger focus:ring-nau-danger/20'
            : 'border-nau-border dark:border-nau-border focus:border-nau-primary'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-nau-danger font-medium">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-nau-text-muted dark:text-nau-text-muted">{helperText}</p>
      )}
    </div>
  );
});
Select.displayName = 'Select';
