// File: src/services/productService.js
import { 
  auth,
  db, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  isFirebaseConfigured,
  arrayUnion,
  arrayRemove
} from '../config/firebase';
import { parseDate } from '../utils/formatters';

/**
 * Get all products with filtering, searching, and sorting
 */
export const getProducts = async (filters = {}) => {
  if (!isFirebaseConfigured || !db) return [];
  
  const {
    category,
    search,
    minPrice,
    maxPrice,
    condition,
    location,
    verifiedOnly,
    status = 'all', // 'all' | 'active' | 'sold'
    sortBy = 'newest' // 'newest' | 'price_asc' | 'price_desc' | 'popular'
  } = filters;

  try {
    let q = collection(db, 'products');
    const queryConstraints = [];

    if (status !== 'all') {
      queryConstraints.push(where('status', '==', status));
    }

    if (category && category !== 'all') {
      queryConstraints.push(where('category', '==', category));
    }

    const qBuilt = query(q, ...queryConstraints);
    const snapshot = await getDocs(qBuilt);
    
    let list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return applyClientFilters(list, filters);
  } catch (e) {
    console.error('Firestore getProducts error:', e);
    return [];
  }
};

const applyClientFilters = (products, filters) => {
  let list = [...products];

  // Always exclude hidden products from public marketplace
  if (filters.status !== 'hidden') {
    list = list.filter(p => p.status !== 'hidden');
  }

  // Search filter
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
      (p.sellerName && p.sellerName.toLowerCase().includes(q))
    );
  }

  // Price Range
  if (filters.minPrice !== undefined && filters.minPrice !== '') {
    list = list.filter(p => p.price >= Number(filters.minPrice));
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
    list = list.filter(p => p.price <= Number(filters.maxPrice));
  }

  // Condition filter
  if (filters.condition && filters.condition !== 'all') {
    list = list.filter(p => p.condition && p.condition.includes(filters.condition));
  }

  // Location filter
  if (filters.location && filters.location !== 'all') {
    list = list.filter(p => p.location && p.location.toLowerCase().includes(filters.location.toLowerCase()));
  }

  // Verified seller only
  if (filters.verifiedOnly) {
    list = list.filter(p => p.sellerVerified === true);
  }

  // Sorting
  switch (filters.sortBy) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
      break;
    case 'newest':
    default:
      // Active products come first, then sold products; sorted by date descending
      list.sort((a, b) => {
        if (a.status === 'active' && b.status === 'sold') return -1;
        if (a.status === 'sold' && b.status === 'active') return 1;
        const timeA = parseDate(a.createdAt)?.getTime() || 0;
        const timeB = parseDate(b.createdAt)?.getTime() || 0;
        return timeB - timeA;
      });
      break;
  }

  return list;
};

/**
 * Get product detail by ID
 */
export const getProductById = async (id) => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const docRef = doc(db, 'products', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (e) {
    console.error('Firestore getProductById error:', e);
  }
  return null;
};

/**
 * Create a new product
 */
export const createProduct = async (productData, currentUser) => {
  if (!isFirebaseConfigured || !db) throw new Error("Firebase chưa được cấu hình");

  const uid = auth?.currentUser?.uid || currentUser?.id;
  if (!uid) throw new Error("Bạn cần đăng nhập để đăng sản phẩm");

  // Filter out any undefined fields to prevent Firestore serialization crashes
  const cleanData = {};
  Object.keys(productData).forEach(key => {
    if (productData[key] !== undefined) {
      cleanData[key] = productData[key];
    }
  });

  const newProduct = {
    ...cleanData,
    sellerId: uid,
    sellerName: currentUser?.name || auth?.currentUser?.displayName || 'Sinh viên NAU',
    sellerAvatar: currentUser?.avatar || auth?.currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    sellerRating: (currentUser?.ratingCount > 0) ? Number(currentUser?.rating || 0) : 0.0,
    sellerRatingCount: Number(currentUser?.ratingCount || 0),
    sellerVerified: currentUser?.verificationStatus === 'verified' || currentUser?.role === 'admin',
    price: Number(cleanData.price || 0),
    status: 'active',
    views: 0,
    saves: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'products'), newProduct);
    return { id: docRef.id, ...newProduct };
  } catch (e) {
    console.error('Firestore createProduct error:', e);
    throw e;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (id, updatedFields) => {
  if (!isFirebaseConfigured || !db) throw new Error("Firebase chưa được cấu hình");
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...updatedFields,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (e) {
    console.error('Firestore updateProduct error:', e);
    throw e;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id) => {
  if (!isFirebaseConfigured || !db) throw new Error("Firebase chưa được cấu hình");
  try {
    await deleteDoc(doc(db, 'products', id));
    return true;
  } catch (e) {
    console.error('Firestore deleteProduct error:', e);
    throw e;
  }
};

/**
 * Toggle save / bookmark product
 */
export const toggleSaveProduct = async (userId, productId) => {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const savedProducts = userSnap.data().savedProducts || [];
      if (savedProducts.includes(productId)) {
        await updateDoc(userRef, { savedProducts: arrayRemove(productId) });
        return false;
      } else {
        await updateDoc(userRef, { savedProducts: arrayUnion(productId) });
        return true;
      }
    }
  } catch (err) {
    console.error("Error toggling saved product", err);
  }
  return false;
};

/**
 * Get user saved product IDs
 */
export const getSavedProductIds = async (userId) => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const userSnap = await getDoc(doc(db, 'users', userId));
    if (userSnap.exists()) {
      return userSnap.data().savedProducts || [];
    }
  } catch (err) {
    console.error("Error fetching saved product ids", err);
  }
  return [];
};

/**
 * Get user's own listings
 */
export const getUserProducts = async (userId) => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const q = query(collection(db, 'products'), where('sellerId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Error fetching user products", e);
    return [];
  }
};

/**
 * Toggle hide / show product (for user when product is sold or temporarily hidden)
 */
export const toggleHideProduct = async (id, isHidden) => {
  const newStatus = isHidden ? 'hidden' : 'active';
  return updateProduct(id, { status: newStatus });
};

/**
 * Mark product as sold
 */
export const markProductAsSold = async (id) => {
  return updateProduct(id, { status: 'sold' });
};

