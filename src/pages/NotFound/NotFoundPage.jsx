// File: src/pages/NotFound/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-nau-primary-light dark:bg-nau-primary/20 text-nau-primary dark:text-nau-primary flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-nau-text dark:text-nau-text tracking-tight">
        404
      </h1>
      <h2 className="text-lg font-bold text-nau-text dark:text-nau-text">
        Không tìm thấy trang này
      </h2>
      <p className="text-xs text-nau-text-muted dark:text-nau-text-muted max-w-sm">
        Đường dẫn bạn truy cập không tồn tại hoặc sản phẩm đã bị xóa khỏi hệ thống Chợ NAU.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Về trang chủ Chợ NAU
          </Button>
        </Link>
      </div>
    </div>
  );
};
