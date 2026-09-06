// File: src/services/storageService.js
import { storage, ref, uploadBytes, getDownloadURL, isFirebaseConfigured } from '../config/firebase';
import { validateImageFile } from '../utils/validators';

/**
 * Wrap a promise with a timeout to prevent hanging when Firebase Storage bucket is 404 or unconfigured.
 */
const withTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firebase Storage timeout')), ms)
    )
  ]);
};

/**
 * Compress image using HTML5 canvas before converting to base64.
 * Resizes down to maxDimension (default 800px) and compresses to JPEG (quality 0.65).
 * Output file size is typically 30KB - 70KB, keeping Firestore docs far below 1MB.
 */
export const compressImage = (file, maxDimension = 800, quality = 0.65) => {
  return new Promise((resolve, reject) => {
    // If it's already a string (base64 or URL), return as-is
    if (typeof file === 'string') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Scale down proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
          } else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Fill white background for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed JPEG data URL
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error('Không thể đọc định dạng hình ảnh'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
    reader.readAsDataURL(file);
  });
};

/**
 * Upload single image:
 * 1. Tries Firebase Storage first (timeout 5s).
 * 2. If Firebase Storage fails (404 bucket, CORS, rules, or offline),
 *    automatically compresses image to ~40KB JPEG and returns data URL.
 * App NEVER fails to upload images.
 */
export const uploadProductImage = async (file, onProgress) => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Try Firebase Storage first with 5s timeout
  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      if (onProgress) onProgress(20);
      const snapshot = await withTimeout(uploadBytes(storageRef, file), 5000);
      if (onProgress) onProgress(70);
      const downloadURL = await withTimeout(getDownloadURL(snapshot.ref), 5000);
      if (onProgress) onProgress(100);
      return downloadURL;
    } catch (error) {
      console.warn('Firebase Storage upload unavailable (will use compressed base64 fallback):', error.code || error.message);
      // Fall through to compressed base64 fallback
    }
  }

  // Fallback: compress to lightweight JPEG base64 (30-60KB)
  if (onProgress) onProgress(40);
  const compressed = await compressImage(file, 800, 0.65);
  if (onProgress) onProgress(100);
  return compressed;
};

/**
 * Upload student verification document (Student Card / CCCD).
 * Uses higher resolution (1000px max, quality 0.70) so text is clearly readable,
 * while still staying well under 100KB.
 */
export const uploadVerificationDocument = async (file, onProgress) => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Try Firebase Storage first with 5s timeout
  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = `verifications/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      if (onProgress) onProgress(30);
      const snapshot = await withTimeout(uploadBytes(storageRef, file), 5000);
      if (onProgress) onProgress(70);
      const downloadURL = await withTimeout(getDownloadURL(snapshot.ref), 5000);
      if (onProgress) onProgress(100);
      return downloadURL;
    } catch (error) {
      console.warn('Firebase Storage verification upload unavailable (will use compressed base64 fallback):', error.code || error.message);
      // Fall through to compressed base64 fallback
    }
  }

  // Fallback: compress for Firestore storage
  if (onProgress) onProgress(40);
  const compressed = await compressImage(file, 1000, 0.70);
  if (onProgress) onProgress(100);
  return compressed;
};
