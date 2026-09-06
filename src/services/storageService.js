// File: src/services/storageService.js
import { storage, ref, uploadBytes, getDownloadURL, isFirebaseConfigured } from '../config/firebase';
import { validateImageFile } from '../utils/validators';

/**
 * Wrap a promise with a timeout to prevent hanging forever
 */
const withTimeout = (promise, ms = 15000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Upload timeout - kết nối Firebase Storage quá chậm.')), ms)
    )
  ]);
};

/**
 * Fallback: convert file to base64 data URL (works without Firebase Storage)
 */
const fileToBase64 = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (onProgress) onProgress(100);
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
    reader.readAsDataURL(file);
  });
};

/**
 * Upload single image to Firebase Storage with automatic fallback to base64
 * If Firebase Storage fails for ANY reason (CORS, rules, network), 
 * automatically falls back to base64 data URL so the app always works.
 */
export const uploadProductImage = async (file, onProgress) => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Try Firebase Storage first
  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      if (onProgress) onProgress(20);
      const snapshot = await withTimeout(uploadBytes(storageRef, file), 20000);
      if (onProgress) onProgress(70);
      const downloadURL = await withTimeout(getDownloadURL(snapshot.ref), 10000);
      if (onProgress) onProgress(100);
      return downloadURL;
    } catch (error) {
      console.warn('Firebase Storage upload failed, falling back to base64:', error.code || error.message);
      // Fall through to base64 fallback — do NOT throw
    }
  }

  // Fallback: always works, stores image as base64 data URL
  if (onProgress) onProgress(50);
  return fileToBase64(file, onProgress);
};

/**
 * Upload student verification document (Student Card or CCCD)
 * Same fallback strategy as product images.
 */
export const uploadVerificationDocument = async (file, onProgress) => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Try Firebase Storage first
  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `verifications/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      if (onProgress) onProgress(30);
      const snapshot = await withTimeout(uploadBytes(storageRef, file), 20000);
      if (onProgress) onProgress(70);
      const downloadURL = await withTimeout(getDownloadURL(snapshot.ref), 10000);
      if (onProgress) onProgress(100);
      return downloadURL;
    } catch (error) {
      console.warn('Firebase Storage verification upload failed, falling back to base64:', error.code || error.message);
      // Fall through to base64 fallback
    }
  }

  // Fallback: always works
  if (onProgress) onProgress(50);
  return fileToBase64(file, onProgress);
};
