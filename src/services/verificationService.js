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
import { saveUserOverride, getUserOverrides } from './adminService';

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

  saveUserOverride(userId, updateData);

  if (db) {
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
    } catch (e) {
      console.warn('Firestore submitVerification cloud sync notice:', e);
    }
  }
  return updateData;
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

  saveUserOverride(userId, updateData);

  if (db) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, updateData, { merge: true });

      const verifRef = doc(db, 'verifications', userId);
      await setDoc(verifRef, updateData, { merge: true });
    } catch (e) {
      console.warn('Firestore approveVerification cloud sync notice:', e);
    }
  }
  return updateData;
};

/**
 * Admin reject verification request with reason
 */
export const rejectVerification = async (userId, reason) => {
  const updateData = {
    verificationStatus: 'rejected',
    verificationRejectionReason: reason || 'Hình ảnh thẻ sinh viên hoặc CCCD không rõ nét, vui lòng chụp lại.'
  };

  saveUserOverride(userId, updateData);

  if (db) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, updateData, { merge: true });

      const verifRef = doc(db, 'verifications', userId);
      await setDoc(verifRef, updateData, { merge: true });
    } catch (e) {
      console.warn('Firestore rejectVerification cloud sync notice:', e);
    }
  }
  return updateData;
};

/**
 * Get all users with pending verification
 */
export const getPendingVerifications = async () => {
  const overrides = getUserOverrides();
  let usersList = [];

  if (db) {
    try {
      const qUsers = query(collection(db, 'users'), where('verificationStatus', '==', 'pending_verification'));
      const userSnap = await getDocs(qUsers);
      usersList = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
    } catch (e) {
      console.warn('Firestore getPendingVerifications warning:', e);
    }
  }

  // Merge with overrides
  Object.keys(overrides).forEach(userId => {
    const o = overrides[userId];
    const existingIdx = usersList.findIndex(u => u.id === userId);
    if (o.verificationStatus === 'pending_verification') {
      if (existingIdx >= 0) {
        usersList[existingIdx] = { ...usersList[existingIdx], ...o };
      } else {
        usersList.push({ id: userId, ...o });
      }
    } else if (o.verificationStatus && o.verificationStatus !== 'pending_verification') {
      // If no longer pending in overrides, remove from pending list
      if (existingIdx >= 0) {
        usersList.splice(existingIdx, 1);
      }
    }
  });

  return usersList;
};

