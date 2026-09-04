// File: src/services/chatService.js
import { 
  db, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  isFirebaseConfigured 
} from '../config/firebase';

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
  // IMPORTANT: Fix undefined fields by providing fallbacks
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
export const sendMessage = async (conversationId, senderId, text) => {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase không khả dụng');
  if (!text || !text.trim()) return null;

  const newMessage = {
    senderId,
    text: text.trim(),
    timestamp: serverTimestamp(),
    read: false
  };

  const convRef = doc(db, 'conversations', conversationId);
  await updateDoc(convRef, {
    lastMessage: text.trim(),
    lastMessageTime: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await addDoc(collection(db, `conversations/${conversationId}/messages`), newMessage);
  return newMessage;
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (userId) => {
  if (!isFirebaseConfigured || !db) return [];
  
  // We need two queries because Firestore doesn't support OR across different fields easily without composite indexes or multiple queries
  const qBuyer = query(collection(db, 'conversations'), where('buyerId', '==', userId));
  const qSeller = query(collection(db, 'conversations'), where('sellerId', '==', userId));
  
  const [buyerSnap, sellerSnap] = await Promise.all([getDocs(qBuyer), getDocs(qSeller)]);
  
  const conversations = [];
  buyerSnap.forEach(doc => conversations.push({ id: doc.id, ...doc.data() }));
  sellerSnap.forEach(doc => conversations.push({ id: doc.id, ...doc.data() }));
  
  // Sort by updatedAt descending
  return conversations.sort((a, b) => {
    const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : new Date(a.lastMessageTime).getTime();
    const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : new Date(b.lastMessageTime).getTime();
    return timeB - timeA;
  });
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
  if (!isFirebaseConfigured || !db) return;
  
  const messagesRef = collection(db, `conversations/${conversationId}/messages`);
  const q = query(messagesRef, where('read', '==', false), where('senderId', '!=', currentUserId));
  
  const snapshot = await getDocs(q);
  const updates = snapshot.docs.map(messageDoc => 
    updateDoc(doc(db, `conversations/${conversationId}/messages`, messageDoc.id), { read: true })
  );
  
  await Promise.all(updates);
  await updateDoc(doc(db, 'conversations', conversationId), { unreadCount: 0 });
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
