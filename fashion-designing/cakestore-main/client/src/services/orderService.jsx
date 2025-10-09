import API from './api';
import { auth } from '../firebase/config';

export const createOrder = async (orderData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        // Transform order data for fashion store
        const fashionOrderData = {
            ...orderData,
            // Ensure arrays are properly formatted
            items: Array.isArray(orderData.items) ? orderData.items : [],
            customOrders: Array.isArray(orderData.customOrders) ? orderData.customOrders : [],
            // Ensure numbers are properly formatted
            itemsPrice: parseFloat(orderData.itemsPrice) || 0,
            customOrdersPrice: parseFloat(orderData.customOrdersPrice) || 0,
            taxPrice: parseFloat(orderData.taxPrice) || 0,
            shippingPrice: parseFloat(orderData.shippingPrice) || 0,
            discountAmount: parseFloat(orderData.discountAmount) || 0,
            totalPrice: parseFloat(orderData.totalPrice) || 0,
            // Set default values for fashion-specific fields
            orderType: orderData.orderType || 'standard',
            priority: orderData.priority || 'normal',
            urgency: orderData.urgency || 'standard',
            fittingRequired: orderData.fittingRequired || false,
            notificationPreferences: orderData.notificationPreferences || {
                email: true,
                sms: true
            }
        };

        const response = await API.post(
            '/api/orders',
            fashionOrderData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Order creation error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message);
    }
};

export const getOrderById = async (id) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get(`/api/orders/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching order:', error.response?.data || error.message);
        throw error;
    }
};

export const getOrdersByUser = async (filters = {}) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get(`api/orders/myorders`, {
            params: filters,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        console.error('Error fetching user orders:', error.response?.data || error.message);
        throw error;
    }
};

export const getAllOrders = async (filters = {}) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        // Transform fashion-specific filters
        const fashionFilters = {
            ...filters,
            status: filters.status === 'all' ? '' : filters.status,
            orderType: filters.orderType === 'all' ? '' : filters.orderType,
            page: filters.page || 1,
            limit: filters.limit || 20
        };

        const response = await API.get('api/orders', {
            params: fashionFilters,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        console.error('Error fetching all orders:', error.response?.data || error.message);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `api/orders/${orderId}/status`,
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
        console.error('Error updating order status:', error.response?.data || error.message);
        throw error;
    }
};

export const updateOrderToDelivered = async (orderId) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `api/orders/${orderId}/deliver`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error updating order to delivered:', error.response?.data || error.message);
        throw error;
    }
};

export const updatePaymentStatus = async (orderId, paymentStatus, transactionId = '') => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `api/orders/${orderId}/payment`,
            { paymentStatus, transactionId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error updating payment status:', error.response?.data || error.message);
        throw error;
    }
};

export const addTrackingInfo = async (orderId, trackingData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `api/orders/${orderId}/tracking`,
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
        console.error('Error adding tracking info:', error.response?.data || error.message);
        throw error;
    }
};

export const trackOrder = async (trackingNumber) => {
    try {
        const response = await API.get(`api/orders/track/${trackingNumber}`);
        return response.data;

    } catch (error) {
        console.error('Error tracking order:', error.response?.data || error.message);
        throw error;
    }
};

export const cancelOrder = async (orderId, reason = '') => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `api/orders/${orderId}/cancel`,
            { reason },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error cancelling order:', error.response?.data || error.message);
        throw error;
    }
};

export const requestReturn = async (orderId, returnData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.post(
            `api/orders/${orderId}/return`,
            returnData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error requesting return:', error.response?.data || error.message);
        throw error;
    }
};

export const updateOrder = async (orderId, updateData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `api/orders/${orderId}`,
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
        console.error('Error updating order:', error.response?.data || error.message);
        throw error;
    }
};

export const getOrderStats = async (timeframe = 'month') => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get('api/orders/stats', {
            params: { timeframe },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching order stats:', error.response?.data || error.message);
        throw error;
    }
};

export const getOrdersByStatus = async (status, limit = 50) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get('api/orders', {
            params: { status, limit },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        console.error('Error fetching orders by status:', error.response?.data || error.message);
        throw error;
    }
};

export const assignOrderToStaff = async (orderId, staffId) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(
            `api/orders/${orderId}/assign`,
            { assignedStaff: staffId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error assigning order to staff:', error.response?.data || error.message);
        throw error;
    }
};

export const addOrderNote = async (orderId, note, isInternal = false) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.post(
            `api/orders/${orderId}/notes`,
            { note, isInternal },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error adding order note:', error.response?.data || error.message);
        throw error;
    }
};

export const scheduleFitting = async (orderId, fittingData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.post(
            `api/orders/${orderId}/fitting`,
            fittingData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Error scheduling fitting:', error.response?.data || error.message);
        throw error;
    }
};