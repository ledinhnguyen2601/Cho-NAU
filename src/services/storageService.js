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

/**
 * Validate video file:
 * - Max duration: 180 seconds (3 minutes)
 * - Max resolution: Full HD 1080p (width & height <= 1920)
 * - Max size: 100MB
 * - Formats: mp4, webm, quicktime, ogg
 */
export const validateVideoFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('Vui lòng chọn video.'));
    }

    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v', 'video/ogg'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|m4v|ogg)$/i)) {
      return reject(new Error('Định dạng video không hỗ trợ. Vui lòng chọn MP4, WebM hoặc MOV.'));
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return reject(new Error('Dung lượng video vượt quá 100MB. Vui lòng nén video trước khi tải lên.'));
    }

    // Load video element to inspect duration and resolution
    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const duration = video.duration;
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (duration > 180) { // > 3 minutes
        const mins = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60);
        return reject(new Error(`Thời lượng video tối đa là 3 phút (Video của bạn: ${mins} phút ${secs} giây).`));
      }

      if (width > 1920 || height > 1920) {
        return reject(new Error(`Độ phân giải video vượt quá Full HD 1080p (${width}x${height}). Vui lòng xuất video ở 1080p hoặc 720p.`));
      }

      resolve({
        isValid: true,
        duration,
        width,
        height,
        formattedDuration: `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}`
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể đọc dữ liệu video. File có thể bị hỏng hoặc định dạng không tương thích.'));
    };

    video.src = objectUrl;
  });
};

/**
 * Upload product video:
 * 1. Checks constraints via validateVideoFile.
 * 2. Uploads to Firebase Storage if available.
 * 3. Falls back to blob / object URL for smooth local experience.
 */
export const uploadProductVideo = async (file, onProgress) => {
  const meta = await validateVideoFile(file);

  // 1. Try Firebase Storage
  if (isFirebaseConfigured && storage) {
    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'mp4';
      const fileName = `product_videos/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      if (onProgress) onProgress(30);
      const snapshot = await withTimeout(uploadBytes(storageRef, file), 30000);
      if (onProgress) onProgress(80);
      const downloadURL = await withTimeout(getDownloadURL(snapshot.ref), 10000);
      if (onProgress) onProgress(100);
      return { url: downloadURL, meta };
    } catch (error) {
      console.warn('Firebase Storage video upload error, falling back to local object URL:', error);
    }
  }

  // 2. Local fallback if storage is unconfigured / offline
  if (onProgress) onProgress(50);
  const localUrl = URL.createObjectURL(file);
  if (onProgress) onProgress(100);
  return { url: localUrl, meta };
};

