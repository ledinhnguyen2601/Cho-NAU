// File: src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  facebookProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  fbSignOut, 
  onAuthStateChanged,
  doc, 
  getDoc, 
  setDoc,
  deleteDoc,
  onSnapshot,
  isFirebaseConfigured
} from '../config/firebase';

const ADMIN_EMAILS = [
  'tomvnj37@gmail.com',
  'admin@nau.edu.vn'
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannedNotice, setBannedNotice] = useState(null);
  const heartbeatTimerRef = useRef(null);

  // Helper to update user's online presence in Firestore
  const updateOnlinePresence = async (uid, isOnline) => {
    if (!db || !uid) return;
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        isOnline: Boolean(isOnline),
        lastActive: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Presence sync error:', e);
    }
  };

  // Firebase auth state observer & redirect handler
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      console.warn("Firebase is not configured.");
      setLoading(false);
      return;
    }

    // Process redirect result if returning from mobile redirect sign-in
    getRedirectResult(auth).then(async (result) => {
      if (result && result.user) {
        console.log('✅ Google redirect login successful:', result.user.email);
      }
    }).catch(err => {
      console.warn('Redirect result error (can be ignored if not redirecting):', err);
    });

    let unsubscribeSnapshot = null;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      // Clean up previous user's snapshot listener
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (fbUser) {
        const userEmail = (fbUser.email || '').toLowerCase();
        const isDefaultAdmin = ADMIN_EMAILS.includes(userEmail);

        // 1. Construct reliable base user from Firebase Auth immediately
        const baseUser = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Sinh viên NAU',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: isDefaultAdmin ? 'admin' : 'user',
          verificationStatus: isDefaultAdmin ? 'verified' : 'new',
          verificationDocument: null,
          faculty: 'Đại học Nghệ An',
          studentId: isDefaultAdmin ? 'ADMIN-NAU' : '',
          rating: 0.0,
          ratingCount: 0,
          status: 'active',
          phone: fbUser.phoneNumber || '',
          isOnline: true,
          lastActive: new Date().toISOString(),
          joinedDate: new Date().toISOString()
        };

        // 2. Safely check if user is in banned_users collection (isolated try/catch)
        try {
          const bannedDocRef = doc(db, 'banned_users', fbUser.uid);
          const bannedSnap = await getDoc(bannedDocRef);
          if (bannedSnap.exists()) {
            const bannedData = bannedSnap.data();
            setBannedNotice(bannedData);
            await fbSignOut(auth);
            setCurrentUser(null);
            setLoading(false);
            return;
          }
        } catch (banErr) {
          console.warn('Ban status check warning (bypassed if rules not yet deployed):', banErr);
        }

        // 3. Fetch or synchronize Firestore user profile (isolated try/catch)
        let finalUser = { ...baseUser };
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const firestoreData = userSnap.data();
            finalUser = {
              ...baseUser,
              ...firestoreData,
              id: fbUser.uid,
              // Admin whitelist guarantee
              role: isDefaultAdmin ? 'admin' : (firestoreData.role || 'user'),
              verificationStatus: isDefaultAdmin ? 'verified' : (firestoreData.verificationStatus || 'new'),
              isOnline: true,
              lastActive: new Date().toISOString()
            };

            // Non-blocking sync for admin privileges or online presence
            if (isDefaultAdmin && (firestoreData.role !== 'admin' || firestoreData.verificationStatus !== 'verified')) {
              setDoc(userDocRef, { role: 'admin', verificationStatus: 'verified' }, { merge: true }).catch(() => {});
            }
            setDoc(userDocRef, { isOnline: true, lastActive: finalUser.lastActive }, { merge: true }).catch(() => {});
          } else {
            // New user registration
            await setDoc(userDocRef, baseUser).catch((e) => {
              console.warn('Could not write initial user to Firestore:', e);
            });
          }

          // Real-time listener for profile changes (e.g. verification approval)
          unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const freshData = docSnap.data();
              setCurrentUser(prev => {
                if (!prev || prev.id !== fbUser.uid) return prev;
                return { 
                  ...prev, 
                  ...freshData, 
                  id: fbUser.uid,
                  role: isDefaultAdmin ? 'admin' : (freshData.role || prev.role)
                };
              });
            }
          }, (err) => {
            console.warn('User document snapshot listener error:', err);
          });

        } catch (err) {
          console.warn('Firestore user fetch error (using auth fallback):', err);
        }

        // 4. GUARANTEE that currentUser is set, never null for authenticated user
        setCurrentUser(finalUser);

        // Heartbeat interval every 60s
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = setInterval(() => {
          updateOnlinePresence(fbUser.uid, true);
        }, 60000);

      } else {
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Window offline presence cleanup
    const handleBeforeUnload = () => {
      if (auth.currentUser) {
        updateOnlinePresence(auth.currentUser.uid, false);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      unsubscribe();
    };
  }, []);

  // Direct Google Sign In via page redirect (100% bypasses popup blocker & cookie sandbox in Cốc Cốc & Safari)
  const signInWithGoogleRedirect = async () => {
    if (isFirebaseConfigured && auth) {
      await signInWithRedirect(auth, googleProvider);
    } else {
      throw new Error('Firebase chưa được cấu hình. Vui lòng kiểm tra file .env');
    }
  };

  // Sign in with Google (using popup for standard browsers, auto-redirect for Cốc Cốc & mobile)
  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      // If Cốc Cốc browser detected, automatically use direct redirect to bypass Cốc Cốc popup/cross-origin sandbox
      const isCocCoc = typeof navigator !== 'undefined' && /coc_coc|coccoc/i.test(navigator.userAgent);
      if (isCocCoc) {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }

      try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
      } catch (error) {
        console.warn('Google Sign In Error:', error);
        // If popup blocked or origin stripped by privacy shields (Cốc Cốc, Brave, Safari), automatically fallback to redirect!
        if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/popup-blocked') {
          try {
            await signInWithRedirect(auth, googleProvider);
            return null;
          } catch (redirectErr) {
            throw new Error(`Trình duyệt chặn kết nối. Vui lòng thử nút "Đăng nhập trực tiếp" hoặc tạm tắt khiên bảo vệ của trình duyệt.`);
          }
        }
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
          throw new Error('Đã đóng cửa sổ đăng nhập Google.');
        }
        if (error.code === 'auth/network-request-failed') {
          throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối Internet.');
        }
        throw error;
      }
    } else {
      throw new Error('Firebase chưa được cấu hình. Vui lòng kiểm tra file .env');
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        const result = await signInWithPopup(auth, facebookProvider);
        return result.user;
      } catch (error) {
        console.error('Facebook Sign In Error:', error);
        throw error;
      }
    } else {
      throw new Error('Firebase chưa được cấu hình. Vui lòng kiểm tra file .env');
    }
  };

  // Sign Out
  const logout = async () => {
    if (currentUser?.id) {
      await updateOnlinePresence(currentUser.id, false);
    }
    if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    setCurrentUser(null);
  };

  // Update profile
  const updateUserProfile = (updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      if (isFirebaseConfigured && db && prev.id) {
        try {
          const ref = doc(db, 'users', prev.id);
          setDoc(ref, updated, { merge: true });
        } catch (e) {
          console.warn('Firestore update error', e);
        }
      }
      return updated;
    });
  };

  const isAdmin = currentUser?.role === 'admin' || (Boolean(currentUser?.email) && ADMIN_EMAILS.includes(currentUser.email.toLowerCase()));
  const isVerified = currentUser?.verificationStatus === 'verified' || isAdmin;
  const isPending = !isAdmin && currentUser?.verificationStatus === 'pending_verification';
  const isSuspended = currentUser?.status === 'suspended';

  const value = {
    currentUser,
    loading,
    isVerified,
    isPending,
    isAdmin,
    isSuspended,
    bannedNotice,
    clearBannedNotice: () => setBannedNotice(null),
    signInWithGoogle,
    signInWithGoogleRedirect,
    signInWithFacebook,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
