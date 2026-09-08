// File: src/components/chat/ConversationList.jsx
import React from 'react';
import { formatRelativeTime } from '../../utils/formatters';
import { MessageSquare, ShieldCheck, CheckCheck, Trash2 } from 'lucide-react';

export const ConversationList = ({
  conversations = [],
  activeId,
  onSelect,
  onDeleteConversation,
  currentUserId
}) => {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 dark:text-nau-text-muted">
        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
        <p className="text-xs font-semibold">Chưa có cuộc trò chuyện nào</p>
        <p className="text-[11px] mt-1">Khi bạn nhắn tin cho người bán hoặc có người liên hệ, hội thoại sẽ xuất hiện tại đây.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {conversations.map((conv) => {
        const isSelected = conv.id === activeId;
        const otherPartyName = conv.sellerId === currentUserId ? conv.buyerName : conv.sellerName;
        const hasUnread = !isSelected && conv.lastSenderId && conv.lastSenderId !== currentUserId && (conv.unreadCount || 0) > 0;

        return (
          <div
            key={conv.id}
            className={`group relative flex items-center transition-colors ${
              isSelected
                ? 'bg-nau-primary-light/80 dark:bg-nau-primary/20 border-l-4 border-nau-primary'
                : 'hover:bg-nau-background dark:hover:bg-slate-800/50'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(conv)}
              className="w-full flex items-start gap-3 p-3.5 sm:p-4 text-left min-w-0"
            >
              {/* Product Thumbnail with Online Status Badge */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-nau-surface shrink-0 border border-nau-border dark:border-nau-border">
                <img
                  src={conv.productImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                  alt={conv.productTitle}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" title="Sinh viên NAU" />
              </div>

              {/* Conversation Summary */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className={`text-xs truncate ${hasUnread ? 'font-black text-nau-red dark:text-red-400' : 'font-bold text-nau-text dark:text-nau-text'}`}>
                    {otherPartyName}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {formatRelativeTime(conv.lastMessageTime)}
                  </span>
                </div>

                <p className="text-[11px] font-medium text-nau-primary dark:text-nau-primary truncate mb-0.5">
                  {conv.productTitle}
                </p>

                <p className={`text-xs truncate ${hasUnread ? 'font-bold text-nau-text dark:text-white' : 'text-nau-text-muted dark:text-nau-text-muted'}`}>
                  {conv.lastMessage || 'Chưa có tin nhắn'}
                </p>
              </div>

              {/* Unread count badge */}
              {hasUnread && (
                <div className="shrink-0 flex items-center self-center ml-1">
                  <span className="bg-red-600 text-white text-[10px] font-black min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {conv.unreadCount > 99 ? '99+' : (conv.unreadCount || 1)}
                  </span>
                </div>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

