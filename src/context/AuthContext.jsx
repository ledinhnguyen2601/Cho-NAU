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
        try {
          const userEmail = (fbUser.email || '').toLowerCase();
          const isDefaultAdmin = ADMIN_EMAILS.includes(userEmail);

          // Fetch user profile from Firestore
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          let userData;
          if (userSnap.exists()) {
            userData = userSnap.data();
            // Automatically upgrade white-listed admin to 'admin' and 'verified'
            if (isDefaultAdmin && (userData.role !== 'admin' || userData.verificationStatus !== 'verified')) {
              userData.role = 'admin';
              userData.verificationStatus = 'verified';
              try {
                await setDoc(userDocRef, { role: 'admin', verificationStatus: 'verified' }, { merge: true });
              } catch (e) {
                console.warn('Could not sync admin role to Firestore:', e);
              }
            }
            // Mark online
            userData.isOnline = true;
            userData.lastActive = new Date().toISOString();
            await setDoc(userDocRef, { isOnline: true, lastActive: userData.lastActive }, { merge: true }).catch(() => {});
            setCurrentUser({ id: fbUser.uid, ...userData });
          } else {
            // New user registration in Firestore
            const newUser = {
              id: fbUser.uid,
              name: fbUser.displayName || 'Sinh viên NAU',
              email: fbUser.email,
              avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              role: isDefaultAdmin ? 'admin' : 'user',
              verificationStatus: isDefaultAdmin ? 'verified' : 'new', // new | pending_verification | verified | rejected | suspended
              verificationDocument: null,
              faculty: 'Đại học Nghệ An',
              studentId: isDefaultAdmin ? 'ADMIN-NAU' : '',
              rating: 5.0,
              ratingCount: 0,
              status: 'active',
              phone: fbUser.phoneNumber || '',
              isOnline: true,
              lastActive: new Date().toISOString(),
              joinedDate: new Date().toISOString()
            };
            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
          }

          // Real-time listener: sync changes made by admin (verification approval/rejection)
          // This ensures user sees status change without refreshing the page
          unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const freshData = docSnap.data();
              setCurrentUser(prev => {
                if (!prev || prev.id !== fbUser.uid) return prev;
                return { ...prev, ...freshData, id: fbUser.uid };
              });
            }
          }, (err) => {
            console.warn('User document snapshot listener error:', err);
          });

          // Heartbeat interval every 60s
          if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
          heartbeatTimerRef.current = setInterval(() => {
            updateOnlinePresence(fbUser.uid, true);
          }, 60000);

        } catch (err) {
          console.error('Error fetching Firestore user:', err);
        }
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

  // Sign in with Google (using popup to avoid cross-origin partitioned sessionStorage error)
  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
      } catch (error) {
        console.warn('Google Sign In Error:', error);
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
          throw new Error('Đã đóng cửa sổ đăng nhập Google.');
        }
        if (error.code === 'auth/popup-blocked') {
          throw new Error('Trình duyệt đã chặn cửa sổ Popup. Vui lòng cho phép mở Popup trong cài đặt trình duyệt để đăng nhập.');
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
    signInWithGoogle,
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
