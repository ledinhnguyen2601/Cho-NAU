// File: src/services/orderService.js
import { 
  db, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where,
  or,
  serverTimestamp 
} from '../config/firebase';

/**
 * Create a new Order
 */
export const createOrder = async (orderData) => {
  if (!db) throw new Error("Firebase chưa được cấu hình");
  
  const newOrder = {
    ...orderData,
    status: 'pending', // pending | confirmed | completed | cancelled
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'orders'), newOrder);
    return { id: docRef.id, ...newOrder };
  } catch (e) {
    console.error('Firestore createOrder error:', e);
    throw e;
  }
};

/**
 * Update order status (pending, confirmed, completed, cancelled)
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  if (!db) throw new Error("Firebase chưa được cấu hình");

  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    return { id: orderId, status: newStatus };
  } catch (e) {
    console.error('Firestore updateOrderStatus error:', e);
    throw e;
  }
};

/**
 * Get orders for a specific user (as buyer or seller)
 */
export const getUserOrders = async (userId, type = 'all') => {
  if (!db) return [];
  try {
    let q;
    if (type === 'buyer') {
      q = query(collection(db, 'orders'), where('buyerId', '==', userId));
    } else if (type === 'seller') {
      q = query(collection(db, 'orders'), where('sellerId', '==', userId));
    } else {
      q = query(collection(db, 'orders'), or(
        where('buyerId', '==', userId),
        where('sellerId', '==', userId)
      ));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Firestore getUserOrders error:', e);
    return [];
  }
};

/**
 * Get all orders for Admin
 */
export const getAllOrders = async () => {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Firestore getAllOrders error:', e);
    return [];
  }
};
