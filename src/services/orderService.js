// File: src/services/orderService.js
import { 
  db, 
  collection, 
  doc, 
  getDoc,
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where,
  or,
  serverTimestamp,
  writeBatch
} from '../config/firebase';
import { sendEmailNotification } from './emailNotificationService';

/**
 * Check if a product is available for ordering
 */
export const checkProductAvailability = async (productId) => {
  if (!db || !productId) return { available: false, reason: 'Dữ liệu không hợp lệ' };
  
  try {
    const prodRef = doc(db, 'products', productId);
    const prodSnap = await getDoc(prodRef);
    if (!prodSnap.exists()) {
      return { available: false, reason: 'Sản phẩm không còn tồn tại trên sàn' };
    }
    
    const prod = prodSnap.data();
    if (prod.status === 'sold') {
      return { available: false, reason: 'Sản phẩm này đã được bán thành công', product: prod };
    }
    if (prod.status === 'delivering' || prod.status === 'reserved') {
      return { available: false, reason: 'Sản phẩm đang trong quá trình giao dịch với người khác', product: prod };
    }
    if (prod.status === 'hidden') {
      return { available: false, reason: 'Tin đăng này đã bị ẩn bởi người bán', product: prod };
    }

    // Check if there is already any confirmed order for this product
    const confirmedQuery = query(
      collection(db, 'orders'),
      where('productId', '==', productId),
      where('status', '==', 'confirmed')
    );
    const confirmedSnap = await getDocs(confirmedQuery);
    if (!confirmedSnap.empty) {
      return { available: false, reason: 'Sản phẩm này đã được xác nhận giao cho người mua khác', product: prod };
    }

    return { available: true, product: prod };
  } catch (e) {
    console.error('Error checking product availability:', e);
    return { available: false, reason: 'Không thể kiểm tra trạng thái sản phẩm' };
  }
};

/**
 * Create a new Order with strict concurrency & availability checks
 */
export const createOrder = async (orderData) => {
  if (!db) throw new Error("Firebase chưa được cấu hình");
  
  // 1. Guard against non-available products
  const avail = await checkProductAvailability(orderData.productId);
  if (!avail.available) {
    throw new Error(avail.reason || 'Sản phẩm hiện không khả dụng để đặt mua');
  }

  const newOrder = {
    ...orderData,
    status: 'pending', // pending | confirmed | completed | cancelled
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'orders'), newOrder);

    // Notify seller via offline email if offline
    if (orderData.sellerId) {
      const sellerDoc = await getDoc(doc(db, 'users', orderData.sellerId));
      if (sellerDoc.exists()) {
        const sellerData = sellerDoc.data();
        if (sellerData.email && !sellerData.isOnline) {
          sendEmailNotification({
            toEmail: sellerData.email,
            toName: sellerData.name,
            subject: `[Chợ NAU] Bạn có đơn đặt hàng mới cho "${orderData.productTitle}"`,
            type: 'order_update',
            data: {
              senderName: orderData.buyerName,
              messageText: `Sinh viên ${orderData.buyerName} đã đặt mua "${orderData.productTitle}". Vui lòng vào Chợ NAU để xác nhận địa điểm và giao dịch.`,
              actionUrl: `${window.location.origin}/orders`
            }
          }).catch(() => {});
        }
      }
    }

    return { id: docRef.id, ...newOrder };
  } catch (e) {
    console.error('Firestore createOrder error:', e);
    throw e;
  }
};

/**
 * Update order status with atomic concurrency protection & automatic competing order rejection
 * Prevents selling 1 single item to multiple buyers!
 */
export const updateOrderStatus = async (orderId, newStatus, currentUserId = null) => {
  if (!db) throw new Error("Firebase chưa được cấu hình");

  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) {
      throw new Error('Đơn hàng không tồn tại');
    }
    const orderData = orderSnap.data();

    // 1. WHEN SELLER CONFIRMS THE ORDER:
    if (newStatus === 'confirmed') {
      // Security: if currentUserId is provided, verify it's the seller
      if (currentUserId && orderData.sellerId !== currentUserId) {
        throw new Error('Chỉ người bán mới có quyền xác nhận đơn hàng này.');
      }

      // Check if product is already locked by another confirmed order
      const otherConfirmedQuery = query(
        collection(db, 'orders'),
        where('productId', '==', orderData.productId),
        where('status', '==', 'confirmed')
      );
      const otherConfirmedSnap = await getDocs(otherConfirmedQuery);
      const otherConfirmed = otherConfirmedSnap.docs.filter(d => d.id !== orderId);

      if (otherConfirmed.length > 0) {
        throw new Error('LỖI CHẶN BÁN TRÙNG: Sản phẩm này đã được bạn xác nhận giao cho người mua khác! Không thể giao cho 2 người cùng lúc.');
      }

      // Check product status in products collection
      const prodRef = doc(db, 'products', orderData.productId);
      const prodSnap = await getDoc(prodRef);
      if (prodSnap.exists()) {
        const pData = prodSnap.data();
        if (pData.status === 'sold') {
          throw new Error('Sản phẩm này đã được đánh dấu là đã bán.');
        }
      }

      // Safe to confirm: update order, lock product as 'delivering', and auto-cancel competing orders
      const batch = writeBatch(db);

      // A. Confirm this order
      batch.update(orderRef, {
        status: 'confirmed',
        confirmedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // B. Update product status to 'delivering' so no one else can order or checkout
      if (prodSnap.exists()) {
        batch.update(prodRef, {
          status: 'delivering',
          deliveringTo: orderData.buyerName,
          activeOrderId: orderId,
          updatedAt: serverTimestamp()
        });
      }

      // C. Automatically cancel any other PENDING orders for this same product
      const pendingOthersQuery = query(
        collection(db, 'orders'),
        where('productId', '==', orderData.productId),
        where('status', '==', 'pending')
      );
      const pendingOthersSnap = await getDocs(pendingOthersQuery);
      
      const cancelledBuyerIds = [];
      pendingOthersSnap.docs.forEach(otherDoc => {
        if (otherDoc.id !== orderId) {
          batch.update(otherDoc.ref, {
            status: 'cancelled',
            cancelledReason: 'Sản phẩm đã được người bán chốt bán cho người mua khác.',
            updatedAt: serverTimestamp()
          });
          const oData = otherDoc.data();
          if (oData.buyerId) cancelledBuyerIds.push({ buyerId: oData.buyerId, buyerName: oData.buyerName });
        }
      });

      await batch.commit();

      // Notify cancelled buyers via email
      cancelledBuyerIds.forEach(async ({ buyerId, buyerName }) => {
        try {
          const uDoc = await getDoc(doc(db, 'users', buyerId));
          if (uDoc.exists() && uDoc.data().email) {
            sendEmailNotification({
              toEmail: uDoc.data().email,
              toName: buyerName,
              subject: `[Chợ NAU] Thông báo đơn hàng "${orderData.productTitle}"`,
              type: 'order_update',
              data: {
                senderName: 'Hệ thống Chợ NAU',
                messageText: `Đơn hàng mua "${orderData.productTitle}" của bạn đã được hủy do người bán đã chốt giao dịch cho người mua trước đó. Bạn hãy tiếp tục khám phá các sản phẩm khác trên sàn nhé!`,
                actionUrl: `${window.location.origin}/orders`
              }
            }).catch(() => {});
          }
        } catch (e) {}
      });

      return { id: orderId, status: 'confirmed' };
    }

    // 2. WHEN ORDER IS COMPLETED (Giao dịch thành công):
    if (newStatus === 'completed') {
      const batch = writeBatch(db);

      batch.update(orderRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const prodRef = doc(db, 'products', orderData.productId);
      batch.update(prodRef, {
        status: 'sold',
        soldAt: serverTimestamp(),
        soldTo: orderData.buyerName,
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      return { id: orderId, status: 'completed' };
    }

    // 3. WHEN ORDER IS CANCELLED:
    if (newStatus === 'cancelled') {
      const batch = writeBatch(db);

      batch.update(orderRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // If this order was the one holding the product in 'delivering' status, revert product to 'active'
      const prodRef = doc(db, 'products', orderData.productId);
      const prodSnap = await getDoc(prodRef);
      if (prodSnap.exists()) {
        const prodData = prodSnap.data();
        if (prodData.status === 'delivering' || prodData.activeOrderId === orderId) {
          batch.update(prodRef, {
            status: 'active',
            deliveringTo: null,
            activeOrderId: null,
            updatedAt: serverTimestamp()
          });
        }
      }

      await batch.commit();
      return { id: orderId, status: 'cancelled' };
    }

    // Fallback for generic updates
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
  if (!db || !userId) return [];
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
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sort by createdAt descending
    return orders.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
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

