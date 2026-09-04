// File: src/pages/Chat/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  getUserConversations, 
  getConversationById, 
  sendMessage, 
  markMessagesAsRead, 
  markAllConversationsAsRead,
  deleteConversation,
  subscribeToMessages 
} from '../../services/chatService';
import { ConversationList } from '../../components/chat/ConversationList';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { 
  MessageSquare, 
  Search, 
  ArrowLeft,
  CheckCheck,
  Trash2
} from 'lucide-react';

export const ChatPage = () => {
  const { currentUser, isVerified } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetConvId = searchParams.get('convId');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadConversations = async () => {
    if (!currentUser) return;
    try {
      const list = await getUserConversations(currentUser.id);
      setConversations(list);

      if (targetConvId) {
        const found = list.find(c => c.id === targetConvId);
        if (found) {
          if (!activeConversation || activeConversation.id !== found.id) {
            setActiveConversation(found);
            markMessagesAsRead(found.id, currentUser.id);
          }
        } else {
          const single = await getConversationById(targetConvId);
          if (single) {
            setActiveConversation(single);
            setConversations(prev => [single, ...prev.filter(c => c.id !== single.id)]);
          }
        }
      } else if (list.length > 0 && !activeConversation && window.innerWidth >= 768) {
        setActiveConversation(list[0]);
        markMessagesAsRead(list[0].id, currentUser.id);
      }
    } catch (err) {
      console.error('Load conversations error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUser, targetConvId]);

  // Real-time listener for the active conversation's messages
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (activeConversation?.id) {
      unsubscribe = subscribeToMessages(activeConversation.id, (newMessages) => {
        setActiveConversation(prev => {
          if (!prev) return null;
          return { ...prev, messages: newMessages };
        });
        
        // Also update the lastMessage in the conversations list visually
        if (newMessages.length > 0) {
          const lastMsg = newMessages[newMessages.length - 1];
          setConversations(prevConvs => prevConvs.map(c => {
            if (c.id === activeConversation.id) {
              return {
                ...c,
                lastMessage: lastMsg.text,
                lastMessageTime: lastMsg.timestamp?.toDate ? lastMsg.timestamp.toDate().toISOString() : new Date().toISOString()
              };
            }
            return c;
          }));
        }
      });
    }

    return () => unsubscribe();
  }, [activeConversation?.id]);

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
    markMessagesAsRead(conv.id, currentUser.id);
    setSearchParams({ convId: conv.id });
  };

  const handleSendMessage = async (text) => {
    if (!activeConversation) return;
    try {
      await sendMessage(activeConversation.id, currentUser.id, text, currentUser.name);
    } catch (err) {
      toast.error('Không thể gửi tin nhắn.');
    }
  };

  const handleMarkAllRead = async () => {
    if (!currentUser?.id) return;
    try {
      await markAllConversationsAsRead(currentUser.id);
      setConversations(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
      toast.success('Đã đánh dấu đọc tất cả tin nhắn!');
    } catch (e) {
      toast.error('Không thể cập nhật trạng thái tin nhắn.');
    }
  };

  const handleDeleteConversation = async (convId) => {
    try {
      await deleteConversation(convId);
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (activeConversation?.id === convId) {
        setActiveConversation(null);
        setSearchParams({});
      }
      toast.success('Đã xóa cuộc trò chuyện thành công.');
    } catch (e) {
      toast.error('Lỗi khi xóa cuộc trò chuyện.');
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border text-center space-y-4 shadow-sm">
        <MessageSquare className="w-12 h-12 text-nau-primary mx-auto" />
        <h2 className="text-lg font-bold text-nau-text dark:text-nau-text">
          Đăng nhập để xem tin nhắn
        </h2>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted">
          Hệ thống tin nhắn giao dịch dành riêng cho thành viên Đại học Nghệ An.
        </p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-nau-primary text-white text-xs font-bold rounded-xl">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const filteredConversations = conversations.filter(c => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.productTitle && c.productTitle.toLowerCase().includes(q)) ||
      (c.buyerName && c.buyerName.toLowerCase().includes(q)) ||
      (c.sellerName && c.sellerName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px] bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border shadow-sm overflow-hidden flex animate-fade-in">
      
      {/* Left Column: Conversations List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-nau-border dark:border-nau-border flex flex-col shrink-0 ${
          activeConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search & Actions Header */}
        <div className="p-3.5 border-b border-slate-100 dark:border-nau-border space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-nau-text dark:text-nau-text flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-nau-primary" />
              <span>Tin Nhắn Giao Dịch</span>
            </h2>
            
            {/* Mark all as read button */}
            {conversations.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-nau-primary hover:text-nau-primary-hover transition-colors px-2 py-1 rounded-lg hover:bg-nau-primary/10"
                title="Đánh dấu tất cả là đã đọc"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đọc tất cả</span>
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên bạn bè hoặc sản phẩm..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={filteredConversations}
            activeId={activeConversation?.id}
            onSelect={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            currentUserId={currentUser.id}
          />
        </div>
      </div>

      {/* Right Column: Chat Window */}
      <div
        className={`flex-1 flex flex-col h-full ${
          !activeConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        <ChatWindow
          conversation={activeConversation}
          currentUserId={currentUser.id}
          isUserVerified={isVerified}
          onSendMessage={handleSendMessage}
          onDeleteConversation={handleDeleteConversation}
          onBack={() => {
            setActiveConversation(null);
            setSearchParams({});
          }}
        />
      </div>

    </div>
  );
};

