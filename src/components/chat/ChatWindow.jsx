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
  const messagesEndRef = useRef(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-nau-background dark:bg-nau-background/50">
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
    <div className="flex-1 flex flex-col h-full bg-nau-background/50 dark:bg-nau-background/50 overflow-hidden">
      
      {/* Top Header: Partner info + Product Quick Card + Delete Conversation */}
      <div className="p-3 sm:p-4 bg-nau-surface dark:bg-nau-background border-b border-nau-border dark:border-nau-border shadow-sm shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden p-1.5 rounded-lg text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-nau-text dark:text-nau-text">
                  {otherPartyName}
                </h3>
                {/* Green online presence indicator */}
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Đang trực tuyến" />
                <span className="text-[10px] px-2 py-0.5 bg-nau-success/10 text-nau-success dark:bg-nau-success/20 dark:text-nau-success font-semibold rounded-full border border-nau-success/30 dark:border-nau-success/40">
                  {isSeller ? 'Người mua' : 'Người bán'}
                </span>
              </div>
              <p className="text-[11px] text-nau-text-muted dark:text-nau-text-muted">
                Giao dịch an toàn trực tiếp trong khuôn viên Đại học Nghệ An
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Product Header Card */}
            <div className="flex items-center gap-2.5 bg-nau-background dark:bg-nau-surface p-1.5 sm:p-2 rounded-xl border border-nau-border dark:border-nau-border max-w-xs sm:max-w-sm">
              <img
                src={conversation.productImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                alt={conversation.productTitle}
                className="w-9 h-9 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 pr-1 hidden sm:block">
                <p className="text-xs font-bold text-nau-text dark:text-nau-text truncate">
                  {conversation.productTitle}
                </p>
                <p className="text-xs font-black text-nau-primary dark:text-nau-primary">
                  {formatCurrency(conversation.productPrice)}
                </p>
              </div>
              <Link
                to={`/product/${conversation.productId}`}
                className="p-1.5 text-nau-text-muted hover:text-nau-primary dark:text-nau-text-muted dark:hover:text-nau-primary"
                title="Xem trang chi tiết sản phẩm"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Delete Conversation Button */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 text-slate-400 hover:text-nau-danger hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              title="Xóa cuộc trò chuyện này"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Verification Guard Banner */}
      {!isUserVerified && (
        <div className="m-3 p-3 rounded-xl bg-nau-warning/10 dark:bg-nau-warning/20 border border-nau-warning dark:border-nau-warning/40 text-nau-warning dark:text-nau-warning text-xs flex items-center justify-between gap-2 shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-nau-warning shrink-0" />
            <span>Bạn cần xác thực danh tính sinh viên NAU để gửi tin nhắn trao đổi.</span>
          </div>
          <Link
            to="/verification"
            className="px-2.5 py-1 bg-nau-warning hover:bg-nau-warning text-white font-bold rounded-lg text-xs whitespace-nowrap shadow-sm"
          >
            Xác thực ngay
          </Link>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {conversation.messages === undefined ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-5 h-5 border-2 border-nau-primary border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs font-medium">Đang đồng bộ tin nhắn...</p>
          </div>
        ) : conversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <p className="text-xs font-medium">Bắt đầu cuộc trò chuyện với người bán.</p>
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
        <div ref={messagesEndRef} />
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

