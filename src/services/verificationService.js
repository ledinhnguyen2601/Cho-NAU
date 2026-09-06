import { 
  auth,
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
 * Only users can submit their own verification.
 */
export const submitVerification = async (userId, data) => {
  const actualUid = auth?.currentUser?.uid || userId;
  if (!actualUid) throw new Error("Chưa xác định được tài khoản người dùng.");

  const { name, studentId, faculty, documentUrl, phone } = data;
  if (!documentUrl) {
    throw new Error("Vui lòng đính kèm ảnh Thẻ sinh viên hoặc CCCD.");
  }

  const updateData = {
    userId: actualUid,
    ...(name ? { name } : {}),
    studentId: (studentId || '').trim(),
    faculty: (faculty || 'Đại học Nghệ An').trim(),
    verificationDocument: documentUrl,
    verificationStatus: 'pending_verification',
    phone: (phone || '').trim(),
    verificationSubmittedAt: new Date().toISOString()
  };

  if (!db) throw new Error("Cơ sở dữ liệu chưa được kết nối.");

  try {
    const userRef = doc(db, 'users', actualUid);
    await setDoc(userRef, updateData, { merge: true });

    // Also write to dedicated verifications collection for easy admin indexing
    const verifRef = doc(db, 'verifications', actualUid);
    await setDoc(verifRef, updateData, { merge: true });

    return updateData;
  } catch (e) {
    console.error('Firestore submitVerification error:', e);
    throw new Error(`Lỗi lưu hồ sơ lên hệ thống: ${e.message}`);
  }
};

/**
 * Admin approve verification request
 * STRICT RULE: Only users who have actually submitted verification ('pending_verification')
 * can be approved. Bypassing or "duyệt vượt quyền" is strictly blocked.
 */
export const approveVerification = async (userId) => {
  if (!db) throw new Error("Cơ sở dữ liệu chưa được kết nối.");

  // Pre-check: Ensure user has actually submitted verification
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    throw new Error("Không tìm thấy thông tin người dùng trên hệ thống.");
  }

  const userData = userSnap.data();
  if (userData.verificationStatus !== 'pending_verification') {
    throw new Error("Người dùng chưa gửi hồ sơ xác thực. Chỉ có thể duyệt khi người dùng đã gửi yêu cầu!");
  }

  const updateData = {
    verificationStatus: 'verified',
    verifiedAt: new Date().toISOString(),
    verificationRejectionReason: null
  };

  try {
    await setDoc(userRef, updateData, { merge: true });

    const verifRef = doc(db, 'verifications', userId);
    await setDoc(verifRef, updateData, { merge: true });

    return { id: userId, ...userData, ...updateData };
  } catch (e) {
    console.error('Firestore approveVerification error:', e);
    throw new Error(`Lỗi cập nhật trạng thái duyệt trên Firebase: ${e.message}`);
  }
};

/**
 * Admin reject verification request with reason
 */
export const rejectVerification = async (userId, reason) => {
  if (!db) throw new Error("Cơ sở dữ liệu chưa được kết nối.");

  const userRef = doc(db, 'users', userId);
  const updateData = {
    verificationStatus: 'rejected',
    verificationRejectionReason: reason || 'Hình ảnh thẻ sinh viên hoặc CCCD không rõ nét, vui lòng chụp lại.'
  };

  try {
    await setDoc(userRef, updateData, { merge: true });

    const verifRef = doc(db, 'verifications', userId);
    await setDoc(verifRef, updateData, { merge: true });

    return { id: userId, ...updateData };
  } catch (e) {
    console.error('Firestore rejectVerification error:', e);
    throw new Error(`Lỗi cập nhật từ chối trên Firebase: ${e.message}`);
  }
};

/**
 * Get all users with pending verification
 * Returns only genuine pending verification submissions from Firestore.
 */
export const getPendingVerifications = async () => {
  if (!db) return [];

  try {
    const qUsers = query(collection(db, 'users'), where('verificationStatus', '==', 'pending_verification'));
    const userSnap = await getDocs(qUsers);
    return userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.warn('Firestore getPendingVerifications warning:', e);
    return [];
  }
};
