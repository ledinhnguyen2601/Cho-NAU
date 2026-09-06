// File: src/components/common/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-8 text-center space-y-4 shadow-sm animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-nau-danger/20 text-nau-danger flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h2 className="text-lg font-black text-nau-text dark:text-nau-text">
              Đã xảy ra sự cố khi tải trang
            </h2>
            
            <p className="text-xs text-nau-text-muted dark:text-nau-text-muted leading-relaxed">
              Trang web gặp lỗi hiển thị ngoài dự kiến. Dữ liệu của bạn vẫn được lưu trữ an toàn trên hệ thống.
            </p>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-nau-surface text-[11px] text-slate-500 font-mono text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-nau-border dark:border-nau-border text-nau-text hover:bg-slate-50 dark:hover:bg-nau-surface transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Về trang chủ</span>
              </button>
              
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-nau-primary text-white hover:bg-nau-primary-hover shadow-sm transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tải lại trang</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
