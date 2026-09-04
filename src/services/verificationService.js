// File: src/services/verificationService.js
import { 
  db, 
  doc, 
  updateDoc, 
  getDocs, 
  collection, 
  query, 
  where
} from '../config/firebase';

/**
 * Submit verification request for student card / CCCD
 */
export const submitVerification = async (userId, data) => {
  const { studentId, faculty, documentUrl, phone } = data;
  const updateData = {
    studentId,
    faculty,
    verificationDocument: documentUrl,
    verificationStatus: 'pending_verification',
    phone: phone || '',
    verificationSubmittedAt: new Date().toISOString()
  };

  if (!db) throw new Error("Firebase chưa được cấu hình");
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updateData);
    return updateData;
  } catch (e) {
    console.error('Firestore submitVerification error:', e);
    throw e;
  }
};

/**
 * Admin approve verification request
 */
export const approveVerification = async (userId) => {
  const updateData = {
    verificationStatus: 'verified',
    verifiedAt: new Date().toISOString(),
    verificationRejectionReason: null
  };

  if (!db) throw new Error("Firebase chưa được cấu hình");
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updateData);
    return updateData;
  } catch (e) {
    console.error('Firestore approveVerification error:', e);
    throw e;
  }
};

/**
 * Admin reject verification request with reason
 */
export const rejectVerification = async (userId, reason) => {
  const updateData = {
    verificationStatus: 'rejected',
    verificationRejectionReason: reason || 'Hình ảnh thẻ sinh viên hoặc CCCD không rõ nét, vui lòng chụp lại.'
  };

  if (!db) throw new Error("Firebase chưa được cấu hình");
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updateData);
    return updateData;
  } catch (e) {
    console.error('Firestore rejectVerification error:', e);
    throw e;
  }
};

/**
 * Get all users with pending verification
 */
export const getPendingVerifications = async () => {
  if (!db) return [];
  try {
    const q = query(collection(db, 'users'), where('verificationStatus', '==', 'pending_verification'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Firestore getPendingVerifications error:', e);
    return [];
  }
};
