// File: src/services/adminService.js
import { db, collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where, getCountFromServer } from '../config/firebase';

/**
 * Get comprehensive stats for Admin Dashboard
 */
export const getAdminStats = async () => {
  if (!db) {
    return {
      totalUsers: 0, verifiedUsers: 0, pendingVerifications: 0,
      totalProducts: 0, activeProducts: 0, soldProducts: 0,
      totalOrders: 0, completedOrders: 0, totalRevenue: 0, pendingReports: 0
    };
  }

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(d => d.data());
    
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = productsSnapshot.docs.map(d => d.data());
    
    // Fallbacks for missing collections
    let orders = [];
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      orders = ordersSnapshot.docs.map(d => d.data());
    } catch(e) {}
    
    let reports = [];
    try {
      const reportsSnapshot = await getDocs(collection(db, 'reports'));
      reports = reportsSnapshot.docs.map(d => d.data());
    } catch(e) {}

    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.verificationStatus === 'verified').length;
    const pendingVerifications = users.filter(u => u.verificationStatus === 'pending_verification').length;
    
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const soldProducts = products.filter(p => p.status === 'sold').length;

    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const pendingReports = reports.filter(r => r.status === 'pending').length;

    return {
      totalUsers,
      verifiedUsers,
      pendingVerifications,
      totalProducts,
      activeProducts,
      soldProducts,
      totalOrders,
      completedOrders,
      totalRevenue,
      pendingReports
    };
  } catch (e) {
    console.error("Admin stats fetch error:", e);
    return {
      totalUsers: 0, verifiedUsers: 0, pendingVerifications: 0,
      totalProducts: 0, activeProducts: 0, soldProducts: 0,
      totalOrders: 0, completedOrders: 0, totalRevenue: 0, pendingReports: 0
    };
  }
};

const ADMIN_EMAILS = [
  'tomvnj37@gmail.com',
  'admin@nau.edu.vn'
];

/**
 * Helper to get local user overrides
 */
export const getUserOverrides = () => {
  try {
    const raw = localStorage.getItem('nau_user_overrides');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    let cleaned = false;
    // Strip any stale verificationStatus so it never overrides Firestore truth
    Object.keys(parsed).forEach(uid => {
      if (parsed[uid] && parsed[uid].verificationStatus) {
        delete parsed[uid].verificationStatus;
        cleaned = true;
      }
    });
    if (cleaned) {
      localStorage.setItem('nau_user_overrides', JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return {};
  }
};

/**
 * Helper to save a single user override (status, role only - NEVER verificationStatus)
 */
export const saveUserOverride = (userId, fields) => {
  try {
    const current = getUserOverrides();
    // Strictly omit verificationStatus: verification state must strictly reside in Firestore
    const { verificationStatus, ...safeFields } = fields || {};
    current[userId] = { ...(current[userId] || {}), ...safeFields, updatedAt: new Date().toISOString() };
    localStorage.setItem('nau_user_overrides', JSON.stringify(current));
    return current[userId];
  } catch (e) {
    return fields;
  }
};

/**
 * Get all users with search/filter, admin normalization, and local overrides
 */
export const getAllUsers = async () => {
  const overrides = getUserOverrides();
  let usersList = [];

  if (db) {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn("Error fetching users from Firestore:", e);
    }
  }

  // Normalize admin accounts and apply local overrides (but NOT for verificationStatus)
  return usersList.map(u => {
    const email = (u.email || '').toLowerCase();
    const isSuperAdmin = ADMIN_EMAILS.includes(email);
    const userOverride = overrides[u.id] || {};

    return {
      ...u,
      role: isSuperAdmin ? 'admin' : (userOverride.role || u.role || 'user'),
      // verificationStatus must come from Firestore only — never localStorage
      // This prevents admin from "seeing" users as verified when they haven't submitted verification
      verificationStatus: isSuperAdmin ? 'verified' : (u.verificationStatus || 'new'),
      status: userOverride.status || u.status || 'active',
      studentId: isSuperAdmin ? (u.studentId || 'ADMIN-NAU') : (u.studentId || ''),
      faculty: isSuperAdmin ? (u.faculty || 'Đại học Nghệ An') : (u.faculty || 'Đại học Nghệ An'),
      isOnline: u.isOnline === true || (u.lastActive && (Date.now() - new Date(u.lastActive).getTime()) < 5 * 60 * 1000)
    };
  });
};

/**
 * Update user status (e.g., active, suspended)
 */
export const updateUserStatus = async (userId, newStatus) => {
  saveUserOverride(userId, { status: newStatus });
  if (db) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { status: newStatus }, { merge: true });
    } catch (e) {
      console.warn("Firestore updateUserStatus sync warning:", e);
    }
  }
  return { id: userId, status: newStatus };
};

/**
 * Toggle user role between user and admin
 */
export const toggleUserRole = async (userId, currentRole) => {
  const newRole = currentRole === 'admin' ? 'user' : 'admin';
  saveUserOverride(userId, { role: newRole });
  if (db) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { role: newRole }, { merge: true });
    } catch (e) {
      console.warn("Firestore toggleUserRole sync warning:", e);
    }
  }
  return { id: userId, role: newRole };
};

const DEFAULT_SETTINGS = {
  siteName: 'Chợ NAU',
  siteSlogan: 'Nền Tảng TMĐT Đồ Cũ Sinh Viên Đại Học Nghệ An',
  supportEmail: 'support.chonau@nau.edu.vn',
  supportHotline: '(0238) 3888 999',
  maxImagesPerProduct: 6,
  requireVerificationToPost: true,
  requireVerificationToChat: true,
  platformFeeRate: 0,
  autoExpireDays: 45,
  notifyEmailOnNewMessage: true,
  notifyEmailOnOrderUpdate: true,
  notifyEmailOnVerification: true
};

/**
 * Get system configuration settings
 */
export const getSystemSettings = async () => {
  // Try localStorage first for instantaneous load
  let cached = null;
  try {
    const raw = localStorage.getItem('nau_system_settings');
    if (raw) cached = JSON.parse(raw);
  } catch (e) {}

  if (!db) return cached || DEFAULT_SETTINGS;

  try {
    const docRef = doc(db, 'settings', 'global_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = { ...DEFAULT_SETTINGS, ...snap.data() };
      localStorage.setItem('nau_system_settings', JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn("Could not fetch settings from Firestore:", e);
  }

  return cached || DEFAULT_SETTINGS;
};

/**
 * Save system configuration settings
 */
export const saveSystemSettings = async (settings) => {
  const merged = { ...DEFAULT_SETTINGS, ...settings, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem('nau_system_settings', JSON.stringify(merged));
  } catch (e) {}

  if (!db) return merged;

  try {
    const docRef = doc(db, 'settings', 'global_config');
    await setDoc(docRef, merged, { merge: true });
    return merged;
  } catch (e) {
    console.warn("Firestore settings cloud sync notice (saved locally in browser):", e);
    // Settings are successfully persisted in localStorage
    return merged;
  }
};

/**
 * Get real analytics time-series and category data from Firestore
 */
export const getAnalyticsData = async () => {
  if (!db) {
    return {
      revenueByMonth: [],
      categoryShare: [],
      hasOrdersData: false,
      totalProducts: 0
    };
  }

  try {
    const [ordersSnap, productsSnap] = await Promise.all([
      getDocs(collection(db, 'orders')).catch(() => ({ docs: [] })),
      getDocs(collection(db, 'products')).catch(() => ({ docs: [] }))
    ]);

    const orders = ordersSnap.docs ? ordersSnap.docs.map(d => d.data()) : [];
    const products = productsSnap.docs ? productsSnap.docs.map(d => d.data()) : [];

    // Group real completed orders by month (last 6 months)
    const now = new Date();
    const monthsMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `Tháng ${d.getMonth() + 1}`;
      monthsMap[key] = { month: key, revenue: 0, orders: 0 };
    }

    let hasOrdersData = false;
    orders.forEach(order => {
      if (order.status === 'completed' && order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const key = `Tháng ${orderDate.getMonth() + 1}`;
        if (monthsMap[key]) {
          monthsMap[key].revenue += Number(order.totalPrice || 0);
          monthsMap[key].orders += 1;
          hasOrdersData = true;
        }
      }
    });

    const revenueByMonth = Object.values(monthsMap);

    // Compute real category distribution from products
    const totalProducts = products.length;
    let categoryShare = [];
    if (totalProducts > 0) {
      const catCount = {};
      products.forEach(p => {
        const cat = p.categoryName || p.category || 'Khác';
        catCount[cat] = (catCount[cat] || 0) + 1;
      });

      const colors = ['#C5221F', '#1B4D89', '#F59E0B', '#10B981', '#6366F1', '#EC4899', '#64748B'];
      let colorIdx = 0;
      categoryShare = Object.entries(catCount).map(([name, count]) => {
        const percentage = Math.round((count / totalProducts) * 100);
        const color = colors[colorIdx % colors.length];
        colorIdx++;
        return { name, count, percentage, color };
      });
    }

    return {
      revenueByMonth,
      categoryShare,
      hasOrdersData,
      totalProducts
    };
  } catch (error) {
    console.error("Error computing real analytics:", error);
    return {
      revenueByMonth: [],
      categoryShare: [],
      hasOrdersData: false,
      totalProducts: 0
    };
  }
};
