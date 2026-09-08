// File: src/config/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  or,
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getCountFromServer,
  runTransaction,
  writeBatch
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  uploadString,
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

const cleanVal = (val, fallback = '') => {
  if (!val) return fallback;
  const cleaned = String(val).replace(/^["']|["']$/g, '').trim();
  return cleaned || fallback;
};

const firebaseConfig = {
  apiKey: cleanVal(import.meta.env.VITE_FIREBASE_API_KEY, 'AIzaSyDaniB9O6p8gAMElUHibh7W1g6RsjWuTT4'),
  authDomain: cleanVal(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 'cho-46dd0.firebaseapp.com'),
  projectId: cleanVal(import.meta.env.VITE_FIREBASE_PROJECT_ID, 'cho-46dd0'),
  storageBucket: cleanVal(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 'cho-46dd0.firebasestorage.app'),
  messagingSenderId: cleanVal(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, '327803265432'),
  appId: cleanVal(import.meta.env.VITE_FIREBASE_APP_ID, '1:327803265432:web:c5ed2547158a550d0d4bed')
};

// Check if valid Firebase configuration is present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'your_api_key_here'
);

let app;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // Explicitly enforce local storage persistence to prevent missing initial state errors on mobile / partition
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn('Firebase setPersistence warning:', err);
    });
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ Firebase SDK initialized successfully for Chợ NAU');
  } catch (error) {
    console.warn('⚠️ Firebase initialization error:', error);
  }
} else {
  console.info('ℹ️ Chợ NAU running in Hybrid Local/Seed Mode. Configure .env with your Firebase keys to connect to cloud backend.');
}

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const facebookProvider = new FacebookAuthProvider();

export { 
  app, 
  auth, 
  db, 
  storage,
  // Auth exports
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  fbSignOut,
  onAuthStateChanged,
  // Firestore exports
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  or,
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getCountFromServer,
  runTransaction,
  writeBatch,
  // Storage exports
  ref, 
  uploadBytes, 
  uploadString,
  getDownloadURL, 
  deleteObject 
};
