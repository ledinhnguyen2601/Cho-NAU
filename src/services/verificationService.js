// File: src/services/verificationService.js
import { 
  db, 
  doc, 
  setDoc,
  updateDoc, 
  getDocs, 
  collection, 
  query, 
  where,
  getDoc
} from '../config/firebase';

/**
 * Submit verification request for student card / CCCD
 */
export const submitVerification = async (userId, data) => {
  const { studentId, faculty, documentUrl, phone } = data;
  const updateData = {
    userId,
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
    await setDoc(userRef, {
      studentId,
      faculty,
      verificationDocument: documentUrl,
      verificationStatus: 'pending_verification',
      phone: phone || '',
      verificationSubmittedAt: updateData.verificationSubmittedAt
    }, { merge: true });

    // Also write to dedicated verifications collection for easy admin indexing
    const verifRef = doc(db, 'verifications', userId);
    await setDoc(verifRef, updateData, { merge: true });

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
    await setDoc(userRef, updateData, { merge: true });

    const verifRef = doc(db, 'verifications', userId);
    await setDoc(verifRef, updateData, { merge: true });

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
    await setDoc(userRef, updateData, { merge: true });

    const verifRef = doc(db, 'verifications', userId);
    await setDoc(verifRef, updateData, { merge: true });

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
    const qUsers = query(collection(db, 'users'), where('verificationStatus', '==', 'pending_verification'));
    const userSnap = await getDocs(qUsers);
    const usersList = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Also check verifications collection to merge
    try {
      const qVerif = query(collection(db, 'verifications'), where('verificationStatus', '==', 'pending_verification'));
      const verifSnap = await getDocs(qVerif);
      verifSnap.forEach(vDoc => {
        const vData = vDoc.data();
        const existingIdx = usersList.findIndex(u => u.id === vDoc.id);
        if (existingIdx >= 0) {
          usersList[existingIdx] = { ...usersList[existingIdx], ...vData };
        } else {
          usersList.push({ id: vDoc.id, ...vData });
        }
      });
    } catch(err) {}

    return usersList;
  } catch (e) {
    console.error('Firestore getPendingVerifications error:', e);
    return [];
  }
};

