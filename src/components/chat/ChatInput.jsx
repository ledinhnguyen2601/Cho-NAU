// File: src/components/chat/ChatInput.jsx
import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');

  const quickTemplates = [
    'Sản phẩm này còn hàng không bạn?',
    'Có thể bớt chút tiền xăng xe cho sinh viên được không ạ?',
    'Giao trực tiếp tại cổng KTX NAU được không bạn?',
    'Mình muốn qua xem máy vào chiều nay lúc 16h.'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleTemplateClick = (tmpl) => {
    if (disabled) return;
    onSendMessage(tmpl);
  };

  return (
    <div className="p-3 sm:p-4 bg-nau-surface dark:bg-nau-background border-t border-nau-border dark:border-nau-border space-y-2.5">
      {/* Quick response chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {quickTemplates.map((tmpl, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => handleTemplateClick(tmpl)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-nau-primary-light hover:text-nau-primary dark:bg-nau-surface dark:hover:bg-nau-primary/20 dark:hover:text-nau-primary text-nau-text-secondary dark:text-nau-text-secondary font-medium whitespace-nowrap transition-colors border border-nau-border/60 dark:border-nau-border/60 disabled:opacity-50"
          >
            {tmpl}
          </button>
        ))}
      </div>

      {/* Message input form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            disabled 
              ? 'Xác thực tài khoản để bắt đầu nhắn tin...' 
              : 'Nhập tin nhắn trao đổi mua bán đồ cũ...'
          }
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nau-primary disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="p-2.5 rounded-xl bg-nau-primary hover:bg-nau-primary-hover text-white shadow-md shadow-nau-red/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
