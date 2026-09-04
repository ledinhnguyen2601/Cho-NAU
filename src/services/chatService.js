// File: src/services/chatService.js
import { 
  db, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  isFirebaseConfigured 
} from '../config/firebase';
import { notifyOfflineReceiver } from './emailNotificationService';

/**
 * Create or retrieve an existing conversation for a product between buyer & seller
 */
export const createOrGetConversation = async ({ product, buyer, seller }) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase chưa được cấu hình. Không thể dùng chức năng Chat.');
  }

  // Check if conversation already exists
  const q1 = query(
    collection(db, 'conversations'),
    where('productId', '==', product.id),
    where('buyerId', '==', buyer.id),
    where('sellerId', '==', seller.id)
  );

  const snapshot = await getDocs(q1);
  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0];
    return { id: existingDoc.id, ...existingDoc.data() };
  }

  // If not exists, create new
  const newConv = {
    productId: product.id || '',
    productTitle: product.title || 'Sản phẩm',
    productPrice: product.price || 0,
    productImage: product.images?.[0] || '',
    sellerId: seller.id || product.sellerId || '',
    sellerName: seller.name || product.sellerName || 'Người bán',
    buyerId: buyer.id || '',
    buyerName: buyer.name || 'Người mua',
    lastMessage: 'Cuộc trò chuyện mới được tạo',
    lastMessageTime: new Date().toISOString(),
    lastSenderId: '',
    unreadCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'conversations'), newConv);
  return { id: docRef.id, ...newConv };
};

/**
 * Send a message inside a conversation
 */
export const sendMessage = async (conversationId, senderId, text, senderName = 'Người dùng') => {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase không khả dụng');
  if (!text || !text.trim()) return null;

  const cleanText = text.trim();
  const newMessage = {
    senderId,
    text: cleanText,
    timestamp: serverTimestamp(),
    read: false
  };

  const convRef = doc(db, 'conversations', conversationId);
  const convSnap = await getDoc(convRef);
  let receiverId = null;

  if (convSnap.exists()) {
    const data = convSnap.data();
    receiverId = data.buyerId === senderId ? data.sellerId : data.buyerId;
    const currentUnread = (data.lastSenderId === senderId ? (data.unreadCount || 0) : 0) + 1;

    await updateDoc(convRef, {
      lastMessage: cleanText,
      lastMessageTime: serverTimestamp(),
      lastSenderId: senderId,
      unreadCount: currentUnread,
      updatedAt: serverTimestamp()
    });
  } else {
    await updateDoc(convRef, {
      lastMessage: cleanText,
      lastMessageTime: serverTimestamp(),
      lastSenderId: senderId,
      updatedAt: serverTimestamp()
    });
  }

  await addDoc(collection(db, `conversations/${conversationId}/messages`), newMessage);

  // Send offline email notification if receiver is not active
  if (receiverId) {
    notifyOfflineReceiver({
      receiverId,
      senderName,
      messageText: cleanText,
      conversationId
    }).catch(() => {});
  }

  return newMessage;
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (userId) => {
  if (!isFirebaseConfigured || !db || !userId) return [];
  
  try {
    const qBuyer = query(collection(db, 'conversations'), where('buyerId', '==', userId));
    const qSeller = query(collection(db, 'conversations'), where('sellerId', '==', userId));
    
    const [buyerSnap, sellerSnap] = await Promise.all([getDocs(qBuyer), getDocs(qSeller)]);
    
    const conversations = [];
    buyerSnap.forEach(doc => conversations.push({ id: doc.id, ...doc.data() }));
    sellerSnap.forEach(doc => {
      // Avoid duplicate if buyer and seller were same test account
      if (!conversations.some(c => c.id === doc.id)) {
        conversations.push({ id: doc.id, ...doc.data() });
      }
    });
    
    // Sort by updatedAt descending
    return conversations.sort((a, b) => {
      const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : new Date(a.lastMessageTime || 0).getTime();
      const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : new Date(b.lastMessageTime || 0).getTime();
      return timeB - timeA;
    });
  } catch (err) {
    console.error('Error fetching conversations:', err);
    return [];
  }
};

/**
 * Get total unread conversations count for a user
 */
export const getUnreadConversationsCount = async (userId) => {
  if (!isFirebaseConfigured || !db || !userId) return 0;
  try {
    const list = await getUserConversations(userId);
    // Count conversations where user was not the last sender and unreadCount > 0
    let count = 0;
    list.forEach(c => {
      if (c.lastSenderId && c.lastSenderId !== userId && (c.unreadCount || 0) > 0) {
        count += (c.unreadCount || 1);
      }
    });
    return count;
  } catch (err) {
    return 0;
  }
};

/**
 * Get specific conversation by ID
 */
export const getConversationById = async (conversationId) => {
  if (!isFirebaseConfigured || !db) return null;
  const docRef = doc(db, 'conversations', conversationId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
};

/**
 * Mark messages in conversation as read
 */
export const markMessagesAsRead = async (conversationId, currentUserId) => {
  if (!isFirebaseConfigured || !db || !conversationId) return;
  
  try {
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(messagesRef, where('read', '==', false), where('senderId', '!=', currentUserId));
    
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map(messageDoc => 
      updateDoc(doc(db, `conversations/${conversationId}/messages`, messageDoc.id), { read: true })
    );
    
    await Promise.all(updates);
    await updateDoc(doc(db, 'conversations', conversationId), { unreadCount: 0 });
  } catch (e) {
    console.warn('markMessagesAsRead error:', e);
  }
};

/**
 * Mark all user conversations as read
 */
export const markAllConversationsAsRead = async (userId) => {
  if (!isFirebaseConfigured || !db || !userId) return;
  try {
    const list = await getUserConversations(userId);
    const promises = list.map(c => markMessagesAsRead(c.id, userId));
    await Promise.all(promises);
    return true;
  } catch (e) {
    console.error('markAllConversationsAsRead error:', e);
    throw e;
  }
};

/**
 * Delete a conversation and all its messages
 */
export const deleteConversation = async (conversationId) => {
  if (!isFirebaseConfigured || !db || !conversationId) return;
  try {
    // Delete subcollection messages first
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const snap = await getDocs(messagesRef);
    const deleteMessagePromises = snap.docs.map(mDoc => deleteDoc(mDoc.ref));
    await Promise.all(deleteMessagePromises);

    // Delete parent conversation doc
    await deleteDoc(doc(db, 'conversations', conversationId));
    return true;
  } catch (e) {
    console.error('deleteConversation error:', e);
    throw e;
  }
};

/**
 * Listen to messages in a conversation
 */
export const subscribeToMessages = (conversationId, callback) => {
  if (!isFirebaseConfigured || !db) return () => {};
  
  const q = query(
    collection(db, `conversations/${conversationId}/messages`),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

