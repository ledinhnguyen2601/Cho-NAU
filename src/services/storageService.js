// File: src/services/storageService.js
import { storage, ref, uploadBytes, getDownloadURL, isFirebaseConfigured } from '../config/firebase';
import { validateImageFile } from '../utils/validators';

/**
 * Upload single image to Firebase Storage or generate base64 URL
 */
export const uploadProductImage = async (file, onProgress) => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      if (onProgress) onProgress(30);
      const snapshot = await uploadBytes(storageRef, file);
      if (onProgress) onProgress(70);
      const downloadURL = await getDownloadURL(snapshot.ref);
      if (onProgress) onProgress(100);
      return downloadURL;
    } catch (error) {
      console.error('Firebase Storage Upload Error:', error);
      throw error;
    }
  }

  // Fallback to local FileReader preview if storage is not connected
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
 * Upload student verification document (Student Card or CCCD)
 */
export const uploadVerificationDocument = async (file, onProgress) => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `verifications/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      if (onProgress) onProgress(40);
      const snapshot = await uploadBytes(storageRef, file);
      if (onProgress) onProgress(80);
      const downloadURL = await getDownloadURL(snapshot.ref);
      if (onProgress) onProgress(100);
      return downloadURL;
    } catch (error) {
      console.error('Upload verification doc error:', error);
      throw error;
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (onProgress) onProgress(100);
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error('Không thể đọc file tài liệu'));
    reader.readAsDataURL(file);
  });
};
