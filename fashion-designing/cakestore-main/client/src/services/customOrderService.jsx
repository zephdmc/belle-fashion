// services/customOrderService.js
import { db, storage } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  limit,
  startAfter,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const createCustomOrder = async (orderData, currentUser) => {
  try {
    let inspirationImages = [];
    
    // Handle multiple inspiration images upload
    if (orderData.inspirationImages && orderData.inspirationImages.length > 0) {
      for (const imageFile of orderData.inspirationImages) {
        const imageRef = ref(storage, `custom-fashion-orders/${Date.now()}_${currentUser.uid}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);
        inspirationImages.push(imageUrl);
      }
    }
    
    const { inspirationImages: imagesToRemove, ...orderDataWithoutFiles } = orderData;
    
    // Calculate required by date based on event date
    let requiredByDate = null;
    if (orderData.eventDate) {
      const eventDate = new Date(orderData.eventDate);
      eventDate.setDate(eventDate.getDate() - 7); // Set required date 1 week before event
      requiredByDate = eventDate.toISOString().split('T')[0];
    }
    
    const docRef = await addDoc(collection(db, "customOrders"), {
      ...orderDataWithoutFiles,
      inspirationImages,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName || '',
      status: 'consultation',
      priority: orderData.priority || 'normal',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      requiredByDate,
      fittingSessions: [],
      assignedDesigner: '',
      notes: '',
      trackingNumber: '',
      courier: '',
      basePrice: orderData.basePrice || 0,
      fabricCost: orderData.fabricCost || 0,
      laborCost: orderData.laborCost || 0,
      shippingCost: orderData.shippingCost || 0,
      totalPrice: orderData.totalPrice || 0,
      depositPaid: 0,
      finalPrice: orderData.finalPrice || 0
    });
    
    return { 
      id: docRef.id, 
      ...orderDataWithoutFiles, 
      inspirationImages,
      requiredByDate,
      status: 'consultation'
    };
  } catch (error) {
    console.error("Error adding custom fashion order: ", error);
    throw error;
  }
};

// FIXED: Make userId parameter required and add validation
export const getCustomOrdersByUser = async (userId, statusFilter = '') => {
  try {
    // Validate userId
    if (!userId) {
      console.error('User ID is required for getCustomOrdersByUser');
      return []; // Return empty array instead of throwing error
    }

    let q;
    if (statusFilter && statusFilter !== 'all') {
      q = query(
        collection(db, "customOrders"),
        where("userId", "==", userId),
        where("status", "==", statusFilter),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "customOrders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error("Error getting custom orders: ", error);
    // Return empty array instead of throwing to prevent breaking the app
    return [];
  }
};

export const getAllCustomOrders = async (filters = {}) => {
  try {
    let q = query(collection(db, "customOrders"), orderBy("createdAt", "desc"));
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      q = query(q, where("status", "==", filters.status));
    }
    
    if (filters.designer) {
      q = query(q, where("assignedDesigner", "==", filters.designer));
    }
    
    if (filters.priority && filters.priority !== 'all') {
      q = query(q, where("priority", "==", filters.priority));
    }
    
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error("Error getting all custom orders: ", error);
    throw error;
  }
};

export const getCustomOrderById = async (orderId) => {
  try {
    const docRef = doc(db, "customOrders", orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        id: docSnap.id, 
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
      };
    } else {
      throw new Error('Custom order not found');
    }
  } catch (error) {
    console.error("Error getting custom order: ", error);
    throw error;
  }
};

export const updateCustomOrderStatus = async (orderId, status) => {
  try {
    await updateDoc(doc(db, "customOrders", orderId), { 
      status,
      updatedAt: serverTimestamp()
    });
    
    return { id: orderId, status };
  } catch (error) {
    console.error("Error updating custom order status: ", error);
    throw error;
  }
};

export const updateCustomOrder = async (orderId, updateData) => {
  try {
    const allowedUpdates = [
      'fabricCost', 'laborCost', 'shippingCost', 'totalPrice', 'finalPrice',
      'assignedDesigner', 'priority', 'notes', 'sketchUrl', 'nextFittingDate',
      'basePrice', 'depositPaid', 'designType', 'fabricType', 'materialQuality'
    ];
    
    const updates = {
      updatedAt: serverTimestamp()
    };
    
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });
    
    // Recalculate total if cost components changed
    if (updateData.fabricCost !== undefined || updateData.laborCost !== undefined || updateData.shippingCost !== undefined) {
      const orderDoc = await getDoc(doc(db, "customOrders", orderId));
      if (orderDoc.exists()) {
        const orderData = orderDoc.data();
        const fabricCost = updateData.fabricCost !== undefined ? updateData.fabricCost : orderData.fabricCost;
        const laborCost = updateData.laborCost !== undefined ? updateData.laborCost : orderData.laborCost;
        const shippingCost = updateData.shippingCost !== undefined ? updateData.shippingCost : orderData.shippingCost;
        const basePrice = updateData.basePrice !== undefined ? updateData.basePrice : orderData.basePrice;
        
        updates.totalPrice = basePrice + fabricCost + laborCost + shippingCost;
        updates.finalPrice = updates.totalPrice - (updateData.depositPaid !== undefined ? updateData.depositPaid : orderData.depositPaid);
      }
    }
    
    await updateDoc(doc(db, "customOrders", orderId), updates);
    
    return { id: orderId, ...updates };
  } catch (error) {
    console.error("Error updating custom order: ", error);
    throw error;
  }
};

export const addFittingSession = async (orderId, sessionData) => {
  try {
    const orderRef = doc(db, "customOrders", orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      throw new Error('Custom order not found');
    }
    
    const orderData = orderSnap.data();
    const fittingSessions = orderData.fittingSessions || [];
    
    const newSession = {
      ...sessionData,
      date: serverTimestamp(),
      sessionNumber: fittingSessions.length + 1
    };
    
    await updateDoc(orderRef, {
      fittingSessions: [...fittingSessions, newSession],
      updatedAt: serverTimestamp(),
      nextFittingDate: sessionData.nextSessionDate || null
    });
    
    return newSession;
  } catch (error) {
    console.error("Error adding fitting session: ", error);
    throw error;
  }
};

export const addTrackingInfo = async (orderId, trackingData) => {
  try {
    await updateDoc(doc(db, "customOrders", orderId), {
      ...trackingData,
      status: 'shipped',
      shippedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { id: orderId, ...trackingData, status: 'shipped' };
  } catch (error) {
    console.error("Error adding tracking information: ", error);
    throw error;
  }
};

export const uploadDesignSketch = async (orderId, sketchFile, currentUser) => {
  try {
    const sketchRef = ref(storage, `design-sketches/${orderId}/${Date.now()}_${sketchFile.name}`);
    const snapshot = await uploadBytes(sketchRef, sketchFile);
    const sketchUrl = await getDownloadURL(snapshot.ref);
    
    await updateDoc(doc(db, "customOrders", orderId), {
      sketchUrl,
      updatedAt: serverTimestamp()
    });
    
    return { sketchUrl };
  } catch (error) {
    console.error("Error uploading design sketch: ", error);
    throw error;
  }
};

export const calculatePriceEstimate = async (orderData) => {
  try {
    // This is a simplified price calculation - you might want to make this more sophisticated
    let basePrice = 15000; // Base price for custom fashion
    
    // Design type multiplier
    const designTypePrices = {
      'dress': 1,
      'gown': 2,
      'suit': 1.8,
      'blouse': 0.8,
      'skirt': 0.6,
      'pants': 0.7,
      'jacket': 1.2
    };
    
    if (orderData.designType && designTypePrices[orderData.designType]) {
      basePrice *= designTypePrices[orderData.designType];
    }
    
    // Fabric quality multiplier
    const qualityMultipliers = {
      'standard': 1,
      'premium': 1.5,
      'luxury': 2.5
    };
    
    if (orderData.materialQuality && qualityMultipliers[orderData.materialQuality]) {
      basePrice *= qualityMultipliers[orderData.materialQuality];
    }
    
    // Add cost for design features
    if (orderData.designFeatures && orderData.designFeatures.length > 0) {
      basePrice += orderData.designFeatures.length * 2000;
    }
    
    // Add cost for embellishments
    if (orderData.embellishments && orderData.embellishments.length > 0) {
      basePrice += orderData.embellishments.length * 3500;
    }
    
    return Math.round(basePrice);
  } catch (error) {
    console.error("Error calculating price estimate: ", error);
    throw error;
  }
};

export const getCustomOrderStats = async () => {
  try {
    const ordersSnapshot = await getDocs(collection(db, "customOrders"));
    const orders = ordersSnapshot.docs.map(doc => doc.data());
    
    const stats = {
      total: orders.length,
      byStatus: {},
      byDesignType: {},
      totalRevenue: 0,
      averageOrderValue: 0
    };
    
    orders.forEach(order => {
      // Count by status
      stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
      
      // Count by design type
      if (order.designType) {
        stats.byDesignType[order.designType] = (stats.byDesignType[order.designType] || 0) + 1;
      }
      
      // Calculate revenue
      if (order.totalPrice) {
        stats.totalRevenue += order.totalPrice;
      }
    });
    
    stats.averageOrderValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;
    
    return stats;
  } catch (error) {
    console.error("Error getting custom order stats: ", error);
    throw error;
  }
};

export const deleteCustomOrder = async (orderId) => {
  try {
    // First, check if order exists
    const orderDoc = await getDoc(doc(db, "customOrders", orderId));
    if (!orderDoc.exists()) {
      throw new Error('Custom order not found');
    }
    
    // Delete associated images from storage (optional)
    const orderData = orderDoc.data();
    if (orderData.inspirationImages && orderData.inspirationImages.length > 0) {
      // You might want to implement image deletion logic here
      console.log('Note: Inspiration images should be deleted from storage');
    }
    
    // Delete the document
    await deleteDoc(doc(db, "customOrders", orderId));
    
    return { success: true, message: 'Custom order deleted successfully' };
  } catch (error) {
    console.error("Error deleting custom order: ", error);
    throw error;
  }
};
