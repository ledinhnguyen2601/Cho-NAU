// File: src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Overlay Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-slide-up ${
              t.type === 'success'
                ? 'bg-nau-success/10 dark:bg-nau-success/20 border-nau-success dark:border-nau-success/40 text-nau-success dark:text-nau-success'
                : t.type === 'error'
                ? 'bg-red-50/95 dark:bg-nau-danger/20 border-nau-danger/40 text-nau-danger dark:text-red-400'
                : t.type === 'warning'
                ? 'bg-nau-warning/10 dark:bg-nau-warning/20 border-nau-warning dark:border-nau-warning/40 text-nau-warning dark:text-nau-warning'
                : 'bg-nau-primary-light/95 dark:bg-nau-primary/20 border-nau-primary dark:border-nau-primary/40 text-nau-primary dark:text-nau-primary'
            }`}
          >
            <span className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-nau-success dark:text-nau-success" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-nau-danger dark:text-red-400" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-nau-warning dark:text-nau-warning" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-nau-primary dark:text-nau-primary" />}
            </span>
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-nau-text-secondary dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
