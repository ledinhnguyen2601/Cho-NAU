// File: src/components/common/ThemeToggle.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl border border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text-secondary dark:text-nau-text-secondary hover:text-nau-primary dark:hover:text-nau-primary hover:bg-nau-background dark:hover:bg-slate-800/80 transition-all duration-200 shadow-sm ${className}`}
      title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-nau-warning animate-fade-in" />
      ) : (
        <Moon className="w-5 h-5 text-nau-text animate-fade-in" />
      )}
    </button>
  );
};
