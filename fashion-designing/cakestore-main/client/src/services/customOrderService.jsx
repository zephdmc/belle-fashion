// services/customOrderService.js
import API from './api';
import { auth } from '../firebase/config';

export const createCustomOrder = async (orderData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        // Transform custom order data for API
        const customOrderPayload = {
            ...orderData,
            // Ensure arrays are properly formatted
            designFeatures: Array.isArray(orderData.designFeatures) ? orderData.designFeatures : [],
            embellishments: Array.isArray(orderData.embellishments) ? orderData.embellishments : [],
            referenceLinks: Array.isArray(orderData.referenceLinks) ? orderData.referenceLinks : [],
            // Ensure measurements and deliveryAddress are objects
            measurements: typeof orderData.measurements === 'string' 
                ? JSON.parse(orderData.measurements) 
                : orderData.measurements,
            deliveryAddress: typeof orderData.deliveryAddress === 'string'
                ? JSON.parse(orderData.deliveryAddress)
                : orderData.deliveryAddress,
            // Set default values
            materialQuality: orderData.materialQuality || 'standard',
            shippingMethod: orderData.shippingMethod || 'standard',
            status: orderData.status || 'consultation',
            priority: orderData.priority || 'normal'
        };

        const response = await API.post(
            '/api/custom-orders',
            customOrderPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Custom order creation error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message);
    }
};

export const getCustomOrderById = async (id) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get(`/api/custom-orders/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching custom order:', error.response?.data || error.message);
        throw error;
    }
};

export const getCustomOrdersByUser = async (filters = {}) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get(`/api/custom-orders/my-orders`, {
            params: filters,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        console.error('Error fetching user custom orders:', error.response?.data || error.message);
        throw error;
    }
};

// FIXED: Changed endpoint from '/api/custom-orders' to '/api/custom-orders/admin/all'
export const getAllCustomOrders = async (filters = {}) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get('/api/custom-orders/admin/all', {
            params: filters,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        console.error('Error fetching all custom orders:', error.response?.data || error.message);
        throw error;
    }
};

// FIXED: These admin routes need to point to the correct endpoints
export const updateCustomOrderStatus = async (orderId, status) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `/api/custom-orders/admin/${orderId}/status`,
            { status },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error updating custom order status:', error.response?.data || error.message);
        throw error;
    }
};

export const updateCustomOrder = async (orderId, updateData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `/api/custom-orders/admin/${orderId}`,
            updateData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error updating custom order:', error.response?.data || error.message);
        throw error;
    }
};

export const addFittingSession = async (orderId, sessionData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.post(
            `/api/custom-orders/admin/${orderId}/fitting`,
            sessionData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error adding fitting session:', error.response?.data || error.message);
        throw error;
    }
};

export const addTrackingInfo = async (orderId, trackingData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `/api/custom-orders/admin/${orderId}/tracking`,
            trackingData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error adding tracking information:', error.response?.data || error.message);
        throw error;
    }
};

export const calculatePriceEstimate = async (orderData) => {
    try {
        const response = await API.post(
            '/api/custom-orders/calculate-price',
            orderData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error('Error calculating price estimate:', error.response?.data || error.message);
        throw error;
    }
};

// FIXED: This route doesn't exist in your backend - you might need to create it
export const uploadDesignSketch = async (orderId, sketchFile) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const formData = new FormData();
        formData.append('sketch', sketchFile);

        const response = await API.post(
            `/api/custom-orders/admin/${orderId}/sketch`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error('Error uploading design sketch:', error.response?.data || error.message);
        throw error;
    }
};

// FIXED: This route doesn't exist - you might need to create it
export const getCustomOrderStats = async () => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get('/api/custom-orders/admin/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching custom order stats:', error.response?.data || error.message);
        throw error;
    }
};

// FIXED: This route doesn't exist in your backend
export const deleteCustomOrder = async (orderId) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.delete(`/api/custom-orders/admin/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        console.error('Error deleting custom order:', error.response?.data || error.message);
        throw error;
    }
};
