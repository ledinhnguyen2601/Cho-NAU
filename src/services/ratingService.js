// File: src/services/ratingService.js
import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp
} from '../config/firebase';

/**
 * Submit rating and review for a seller after transaction
 */
export const createRating = async ({ sellerId, reviewer, orderId, stars, comment }) => {
  if (!db) throw new Error("Firebase chưa được cấu hình");

  const newRating = {
    sellerId,
    reviewerId: reviewer.id,
    reviewerName: reviewer.name,
    reviewerAvatar: reviewer.avatar,
    orderId: orderId || null,
    stars: Number(stars),
    comment: comment ? comment.trim() : '',
    createdAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'ratings'), newRating);
    return { id: docRef.id, ...newRating };
  } catch (e) {
    console.error('Firestore createRating error:', e);
    throw e;
  }
};

/**
 * Get all ratings received by a seller
 */
export const getUserRatings = async (sellerId) => {
  if (!db) return [];
  try {
    const q = query(collection(db, 'ratings'), where('sellerId', '==', sellerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Firestore getUserRatings error:', e);
    return [];
  }
};

/**
 * Calculate average rating and count for a seller
 */
export const calculateSellerRating = (ratings) => {
  if (!ratings || ratings.length === 0) {
    return { average: 0.0, count: 0 };
  }
  const sum = ratings.reduce((acc, curr) => acc + curr.stars, 0);
  const average = Number((sum / ratings.length).toFixed(1));
  return { average, count: ratings.length };
};
