// File: src/services/reportService.js
import { 
  db, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  serverTimestamp
} from '../config/firebase';

/**
 * Submit report for fake/scam product or fraudulent user
 */
export const createReport = async (reportData) => {
  if (!db) throw new Error("Firebase chưa được cấu hình");
  const newReport = {
    ...reportData,
    status: 'pending', // pending | investigating | resolved | rejected
    adminNote: '',
    createdAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'reports'), newReport);
    return { id: docRef.id, ...newReport };
  } catch (e) {
    console.error('Firestore createReport error:', e);
    throw e;
  }
};

/**
 * Get all reports for Admin moderation
 */
export const getAllReports = async () => {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, 'reports'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Firestore getAllReports error:', e);
    return [];
  }
};

/**
 * Admin update report status and resolution note
 */
export const updateReportStatus = async (reportId, status, adminNote = '') => {
  if (!db) throw new Error("Firebase chưa được cấu hình");
  try {
    const repRef = doc(db, 'reports', reportId);
    const updateData = { status, adminNote, resolvedAt: serverTimestamp() };
    await updateDoc(repRef, updateData);
    return { id: reportId, ...updateData };
  } catch (e) {
    console.error('Firestore updateReportStatus error:', e);
    throw e;
  }
};
