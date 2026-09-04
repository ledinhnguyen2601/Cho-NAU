// File: src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  facebookProvider, 
  signInWithPopup, 
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

  // Firebase auth state observer if configured
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      console.warn("Firebase is not configured.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userEmail = (fbUser.email || '').toLowerCase();
          const isDefaultAdmin = ADMIN_EMAILS.includes(userEmail);

          // Fetch user profile from Firestore
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            // Automatically upgrade white-listed admin to 'admin' and 'verified'
            if (isDefaultAdmin && (data.role !== 'admin' || data.verificationStatus !== 'verified')) {
              data.role = 'admin';
              data.verificationStatus = 'verified';
              try {
                await setDoc(userDocRef, { role: 'admin', verificationStatus: 'verified' }, { merge: true });
              } catch (e) {
                console.warn('Could not sync admin role to Firestore:', e);
              }
            }
            setCurrentUser({ id: fbUser.uid, ...data });
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
              joinedDate: new Date().toISOString()
            };
            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
          }
        } catch (err) {
          console.error('Error fetching Firestore user:', err);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
      } catch (error) {
        console.error('Google Sign In Error:', error);
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
