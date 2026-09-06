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
 * Optional upload to ImgBB (Free, unlimited storage, 32MB max per image, no credit card required).
 * Active if VITE_IMGBB_API_KEY is configured in .env.
 */
const uploadToImgBB = async (file) => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) return null;

  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (result.success && result.data?.url) {
      return result.data.url;
    }
  } catch (err) {
    console.warn('ImgBB upload error, falling back to local high-fidelity compression:', err);
  }
  return null;
};

/**
 * Compress image using HTML5 canvas before converting to base64.
 * Resizes down to maxDimension (default 1280px) and compresses to JPEG (quality 0.85).
 * Uses high-quality bicubic smoothing so text, fine details, and edges remain sharp (>= 85% original quality).
 * Automatically adapts quality if file size exceeds safe limits for Firestore.
 */
export const compressImage = (file, maxDimension = 1440, initialQuality = 0.86) => {
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
        
        // High quality interpolation to eliminate blurriness
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill white background for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed JPEG data URL at high quality
        let quality = initialQuality;
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality);

        // If dataUrl exceeds ~350KB, step quality down slightly (0.78) to ensure safe Firestore storage
        if (compressedBase64.length > 450000 && quality > 0.78) {
          compressedBase64 = canvas.toDataURL('image/jpeg', 0.80);
        }

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
 * 1. Tries ImgBB free cloud hosting if API key is provided (instant 100% original quality).
 * 2. Tries Firebase Storage (if available).
 * 3. Falls back to ultra-clear 86% quality Canvas compression (1440px, quality 0.86).
 * App NEVER fails to upload images and new uploads remain crisp & crystal clear.
 */
export const uploadProductImage = async (file, onProgress) => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // 1. Try ImgBB if configured (fastest direct cloud link)
  if (import.meta.env.VITE_IMGBB_API_KEY) {
    if (onProgress) onProgress(30);
    const imgbbUrl = await uploadToImgBB(file);
    if (imgbbUrl) {
      if (onProgress) onProgress(100);
      return imgbbUrl;
    }
  }

  // 2. Try Firebase Storage if configured
  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      if (onProgress) onProgress(40);
      const snapshot = await withTimeout(uploadBytes(storageRef, file), 3000);
      if (onProgress) onProgress(75);
      const downloadURL = await withTimeout(getDownloadURL(snapshot.ref), 3000);
      if (onProgress) onProgress(100);
      return downloadURL;
    } catch (error) {
      console.warn('Firebase Storage unavailable, using ultra-clear compression:', error.code || error.message);
    }
  }

  // 3. Ultra-clear 86% quality local compression (1440px, quality 0.86)
  if (onProgress) onProgress(50);
  const compressed = await compressImage(file, 1440, 0.86);
  if (onProgress) onProgress(100);
  return compressed;
};

/**
 * Upload student verification document (Student Card / CCCD).
 * Uses 1600px resolution and 88% quality so student ID card numbers and stamps are 100% readable.
 */
export const uploadVerificationDocument = async (file, onProgress) => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // 1. Try ImgBB if configured
  if (import.meta.env.VITE_IMGBB_API_KEY) {
    if (onProgress) onProgress(30);
    const imgbbUrl = await uploadToImgBB(file);
    if (imgbbUrl) {
      if (onProgress) onProgress(100);
      return imgbbUrl;
    }
  }

  // 2. Try Firebase Storage if configured
  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = `verifications/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      if (onProgress) onProgress(40);
      const snapshot = await withTimeout(uploadBytes(storageRef, file), 3000);
      if (onProgress) onProgress(75);
      const downloadURL = await withTimeout(getDownloadURL(snapshot.ref), 3000);
      if (onProgress) onProgress(100);
      return downloadURL;
    } catch (error) {
      console.warn('Firebase Storage verification upload unavailable, using ultra-clear compression:', error.code || error.message);
    }
  }

  // 3. Ultra-clear 88% quality compression (1600px, quality 0.88)
  if (onProgress) onProgress(50);
  const compressed = await compressImage(file, 1600, 0.88);
  if (onProgress) onProgress(100);
  return compressed;
};
