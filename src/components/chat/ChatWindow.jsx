// File: src/components/chat/ChatWindow.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { 
  ShieldCheck, 
  ExternalLink, 
  ShoppingBag, 
  AlertTriangle, 
  ShieldAlert,
  ArrowLeft,
  Trash2
} from 'lucide-react';

export const ChatWindow = ({
  conversation,
  currentUserId,
  isUserVerified,
  onSendMessage,
  onDeleteConversation,
  onBack
}) => {
  const messagesContainerRef = useRef(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  // Instant scroll to bottom when switching conversations
  useEffect(() => {
    scrollToBottom(false);
  }, [conversation?.id]);

  // Smooth scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom(true);
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center p-8 text-center bg-nau-background dark:bg-nau-background/50">
        <p className="text-sm font-semibold text-nau-text-muted dark:text-nau-text-muted">
          Chọn một cuộc trò chuyện từ danh sách bên trái để xem nội dung trao đổi.
        </p>
      </div>
    );
  }

  const otherPartyName = conversation.sellerId === currentUserId ? conversation.buyerName : conversation.sellerName;
  const isSeller = conversation.sellerId === currentUserId;

  const handleDeleteConfirm = async () => {
    if (!onDeleteConversation) return;
    setIsDeleting(true);
    try {
      await onDeleteConversation(conversation.id);
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col h-full bg-nau-background/50 dark:bg-nau-background/50 overflow-hidden">
      
      {/* Top Header: Partner info + Product Quick Card + Delete Conversation */}
      <div className="p-2.5 sm:p-3.5 bg-nau-surface dark:bg-nau-background border-b border-nau-border dark:border-nau-border shadow-xs shrink-0 min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          
          {/* Left: Back button + User Info */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden p-1.5 -ml-1 rounded-lg text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                title="Quay lại danh sách"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-nau-text dark:text-nau-text truncate">
                  {otherPartyName}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Đang trực tuyến" />
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 font-semibold rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {isSeller ? 'Người mua' : 'Người bán'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-nau-text-muted dark:text-nau-text-muted truncate">
                Đại học Nghệ An
              </p>
            </div>
          </div>

          {/* Right: Product Card + Trash */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {conversation.productId && (
              <Link
                to={`/product/${conversation.productId}`}
                className="flex items-center gap-1.5 bg-nau-background dark:bg-nau-surface p-1 sm:p-1.5 rounded-xl border border-nau-border dark:border-nau-border hover:border-nau-primary transition-colors max-w-[130px] sm:max-w-[200px]"
                title="Xem tin đăng này"
              >
                <img
                  src={conversation.productImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                  alt={conversation.productTitle}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 pr-1 hidden xs:block sm:block">
                  <p className="text-[10px] sm:text-xs font-bold text-nau-text dark:text-nau-text truncate">
                    {conversation.productTitle}
                  </p>
                  <p className="text-[10px] sm:text-xs font-black text-nau-primary dark:text-nau-primary truncate">
                    {formatCurrency(conversation.productPrice)}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </Link>
            )}

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors shrink-0"
              title="Xóa cuộc trò chuyện này"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Verification Guard Banner */}
      {!isUserVerified && (
        <div className="m-2.5 p-2.5 rounded-xl bg-nau-warning/10 dark:bg-nau-warning/20 border border-nau-warning dark:border-nau-warning/40 text-nau-warning dark:text-nau-warning text-xs flex items-center justify-between gap-2 shadow-xs shrink-0 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldAlert className="w-4 h-4 text-nau-warning shrink-0" />
            <span className="truncate">Cần xác thực thẻ SV để gửi tin nhắn.</span>
          </div>
          <Link
            to="/verification"
            className="px-2 py-1 bg-nau-warning hover:bg-nau-warning text-white font-bold rounded-lg text-[11px] whitespace-nowrap shadow-xs shrink-0"
          >
            Xác thực ngay
          </Link>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-4 space-y-1 overscroll-contain"
      >
        {conversation.messages === undefined ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-5 h-5 border-2 border-nau-primary border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs font-medium">Đang đồng bộ tin nhắn...</p>
          </div>
        ) : conversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 max-w-sm mx-auto">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Bắt đầu cuộc trò chuyện với người bán.</p>
            <p className="text-[11px] text-slate-400 mt-1">Lưu ý: Không chuyển tiền cọc qua tài khoản cá nhân khi chưa gặp mặt xem đồ.</p>
          </div>
        ) : (
          (conversation.messages || []).map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMe={msg.senderId === currentUserId}
            />
          ))
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        disabled={!isUserVerified}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xóa Cuộc Trò Chuyện"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
            Bạn có chắc chắn muốn xóa toàn bộ lịch sử tin nhắn của cuộc trò chuyện với <strong>{otherPartyName}</strong>? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-nau-border">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeleteConfirm}
            >
              Xóa cuộc trò chuyện
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

