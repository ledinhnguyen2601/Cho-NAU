// File: src/services/adminService.js
import { db, collection, getDocs, doc, updateDoc, query, where, getCountFromServer } from '../config/firebase';

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

/**
 * Get all users with search/filter
 */
export const getAllUsers = async () => {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching users:", e);
    return [];
  }
};

/**
 * Update user status (e.g., active, suspended)
 */
export const updateUserStatus = async (userId, newStatus) => {
  if (!db) return null;
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { status: newStatus });
    return { id: userId, status: newStatus };
  } catch (e) {
    console.error("Error updating user status:", e);
    return null;
  }
};

/**
 * Toggle user role between user and admin
 */
export const toggleUserRole = async (userId, currentRole) => {
  if (!db) return null;
  try {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
    return { id: userId, role: newRole };
  } catch (e) {
    console.error("Error toggling user role:", e);
    return null;
  }
};

/**
 * Get analytics time-series data for SaaS charts
 */
export const getAnalyticsData = () => {
  // Ideally this would aggregate real data over time. For now we return mock static data 
  // to prevent dashboard charts from breaking while backend aggregation is implemented.
  return {
    userGrowth: [
      { month: 'Tháng 3', users: 120, verified: 45 },
      { month: 'Tháng 4', users: 210, verified: 98 },
      { month: 'Tháng 5', users: 380, verified: 190 },
      { month: 'Tháng 6', users: 540, verified: 310 },
      { month: 'Tháng 7', users: 790, verified: 520 },
      { month: 'Tháng 8', users: 1120, verified: 840 },
    ],
    revenueByMonth: [
      { month: 'Tháng 3', revenue: 14500000, orders: 35 },
      { month: 'Tháng 4', revenue: 22800000, orders: 58 },
      { month: 'Tháng 5', revenue: 38200000, orders: 92 },
      { month: 'Tháng 6', revenue: 49000000, orders: 124 },
      { month: 'Tháng 7', revenue: 67500000, orders: 168 },
      { month: 'Tháng 8', revenue: 89200000, orders: 215 },
    ],
    categoryShare: [
      { name: 'Laptop & Máy tính', percentage: 35, color: '#1B4D89' },
      { name: 'Sách & Giáo trình', percentage: 25, color: '#C5221F' },
      { name: 'Điện thoại & Tablet', percentage: 18, color: '#F59E0B' },
      { name: 'Phụ kiện', percentage: 12, color: '#10B981' },
      { name: 'Xe cộ & Phòng trọ', percentage: 10, color: '#64748B' },
    ]
  };
};
