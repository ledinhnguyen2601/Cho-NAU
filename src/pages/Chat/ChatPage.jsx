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
  getMessagesOnce,
  subscribeToMessages,
  subscribeToUserConversations
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
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [filterTag, setFilterTag] = useState('all'); // 'all' | 'unread' | 'trading'
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe in real-time to user's conversations
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToUserConversations(currentUser.id, (list) => {
      setConversations(list);
      setIsLoading(false);

      if (targetConvId) {
        const found = list.find(c => c.id === targetConvId);
        if (found) {
          setActiveConversation(prev => (prev?.id === found.id ? { ...found, ...prev } : found));
          markMessagesAsRead(found.id, currentUser.id);
        } else {
          getConversationById(targetConvId).then(single => {
            if (single) {
              setActiveConversation(single);
              setConversations(prev => [single, ...prev.filter(c => c.id !== single.id)]);
            }
          });
        }
      } else if (list.length > 0 && !activeConversation && window.innerWidth >= 768) {
        setActiveConversation(list[0]);
        markMessagesAsRead(list[0].id, currentUser.id);
      }
    });

    return () => unsubscribe();
  }, [currentUser?.id, targetConvId]);

  // Real-time listener for the active conversation's messages
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (activeConversation?.id) {
      setIsLoadingMessages(true);

      // 1. Eager fetch immediately to prevent endless sync spinner
      getMessagesOnce(activeConversation.id).then((initialMsgs) => {
        setMessages(initialMsgs);
        setIsLoadingMessages(false);
      }).catch(() => {
        setIsLoadingMessages(false);
      });

      // 2. Realtime listener
      unsubscribe = subscribeToMessages(activeConversation.id, (newMessages) => {
        setMessages(newMessages);
        setIsLoadingMessages(false);
        
        if (newMessages.length > 0) {
          const lastMsg = newMessages[newMessages.length - 1];
          
          // If active chat received an incoming message from the other person, mark as read immediately
          if (lastMsg.senderId !== currentUser?.id) {
            markMessagesAsRead(activeConversation.id, currentUser?.id);
          }

          // Auto push this conversation to the very top (index 0)
          setConversations(prevConvs => {
            const currentItem = prevConvs.find(c => c.id === activeConversation.id) || activeConversation;
            const updatedItem = {
              ...currentItem,
              lastMessage: lastMsg.text,
              lastMessageTime: lastMsg.timestamp?.toDate ? lastMsg.timestamp.toDate().toISOString() : new Date().toISOString(),
              unreadCount: 0
            };
            return [updatedItem, ...prevConvs.filter(c => c.id !== activeConversation.id)];
          });
        }
      });
    } else {
      setMessages([]);
      setIsLoadingMessages(false);
    }

    return () => unsubscribe();
  }, [activeConversation?.id]);

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv);
    // Optimistically zero out unreadCount on local state so badge disappears instantly
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
    markMessagesAsRead(conv.id, currentUser.id);
    setSearchParams({ convId: conv.id });
  };

  const handleSendMessage = async (text) => {
    if (!activeConversation || !currentUser) return;
    const cleanText = text.trim();
    if (!cleanText) return;

    // Optimistically reorder: move active conversation to index 0 immediately
    setConversations(prev => {
      const current = prev.find(c => c.id === activeConversation.id) || activeConversation;
      const updated = {
        ...current,
        lastMessage: cleanText,
        lastMessageTime: new Date().toISOString(),
        lastSenderId: currentUser.id,
        unreadCount: 0
      };
      return [updated, ...prev.filter(c => c.id !== activeConversation.id)];
    });

    try {
      await sendMessage(activeConversation.id, currentUser.id, cleanText, currentUser.name);
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
    // 1. Text filter
    const q = searchFilter.toLowerCase().trim();
    const matchText = !q || (
      (c.productTitle && c.productTitle.toLowerCase().includes(q)) ||
      (c.buyerName && c.buyerName.toLowerCase().includes(q)) ||
      (c.sellerName && c.sellerName.toLowerCase().includes(q))
    );

    // 2. Chip filter
    let matchChip = true;
    if (filterTag === 'unread') {
      matchChip = c.lastSenderId && c.lastSenderId !== currentUser.id && (c.unreadCount || 0) > 0;
    } else if (filterTag === 'trading') {
      matchChip = c.productTitle !== undefined;
    }

    return matchText && matchChip;
  });

  return (
    <div className="h-[calc(100dvh-175px)] sm:h-[calc(100vh-145px)] min-h-[450px] max-h-[820px] bg-nau-surface dark:bg-nau-background rounded-2xl sm:rounded-3xl border border-nau-border dark:border-nau-border shadow-sm overflow-hidden flex min-w-0 animate-fade-in">
      
      {/* Left Column: Conversations List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-nau-border dark:border-nau-border flex flex-col shrink-0 min-w-0 ${
          activeConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search & Actions Header (Phong cách Chợ Tốt) */}
        <div className="p-3 sm:p-3.5 border-b border-slate-100 dark:border-nau-border space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-nau-text dark:text-nau-text flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-nau-primary" />
              <span>Chat & Liên Hệ</span>
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

          {/* Search bar phong cách Chợ Tốt */}
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập 3 ký tự để tìm kiếm..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-nau-border dark:border-nau-border bg-nau-background dark:bg-nau-background text-nau-text dark:text-nau-text placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-nau-red"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Quick Filter Chips (Chợ Tốt Style) */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <button
              type="button"
              onClick={() => setFilterTag('all')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filterTag === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterTag('unread')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filterTag === 'unread'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Chưa đọc
            </button>
            <button
              type="button"
              onClick={() => setFilterTag('trading')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filterTag === 'trading'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Đang trao đổi
            </button>
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
        className={`flex-1 min-w-0 flex flex-col h-full ${
          !activeConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
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

