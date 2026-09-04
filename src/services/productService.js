// File: src/services/productService.js
import { 
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
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
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

  const newProduct = {
    ...productData,
    sellerId: currentUser.id,
    sellerName: currentUser.name,
    sellerAvatar: currentUser.avatar,
    sellerRating: currentUser.rating || 5.0,
    sellerRatingCount: currentUser.ratingCount || 0,
    sellerVerified: currentUser.verificationStatus === 'verified',
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
