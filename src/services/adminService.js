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
