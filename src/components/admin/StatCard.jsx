// File: src/components/admin/StatCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'up', // 'up' | 'down'
  color = 'red' // 'red' | 'blue' | 'emerald' | 'amber' | 'rose'
}) => {
  const colorMap = {
    red: 'bg-nau-red-light text-nau-red dark:bg-nau-red-dark/30 dark:text-nau-red-hover border-nau-red/30 dark:border-nau-red/40',
    blue: 'bg-nau-blue-light text-nau-blue dark:bg-nau-blue/20 dark:text-nau-blue-light border-nau-blue/30 dark:border-nau-blue/40',
    emerald: 'bg-nau-success/10 text-nau-success dark:bg-nau-success/20 dark:text-nau-success border-nau-success/30 dark:border-nau-success/40',
    amber: 'bg-nau-warning/10 text-nau-warning dark:bg-nau-warning/20 dark:text-nau-warning border-nau-warning/30 dark:border-nau-warning/40',
    rose: 'bg-nau-danger/10 text-nau-danger dark:bg-nau-danger/20 dark:text-nau-danger border-nau-danger/30 dark:border-nau-danger/40',
    // Fallbacks
    purple: 'bg-nau-blue-light text-nau-blue dark:bg-nau-blue/20 dark:text-nau-blue-light border-nau-blue/30 dark:border-nau-blue/40',
  };

  return (
    <div className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-nau-text-muted dark:text-nau-text-muted uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.red}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-black text-nau-text dark:text-nau-text tracking-tight">
          {value}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-nau-text-muted dark:text-nau-text-muted truncate">
          {subtitle}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-bold ${
              trendType === 'up' ? 'text-nau-success' : 'text-nau-danger'
            }`}
          >
            {trendType === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
