// server/models/Order.js
const { v4: uuidv4 } = require('uuid');

class Order {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.orderNumber = data.orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        this.userId = data.userId;
        this.userEmail = data.userEmail || '';
        this.userName = data.userName || '';
        
        // Order Items
        this.items = data.items || []; // Array of product items
        this.customOrders = data.customOrders || []; // Array of custom order references
        
        // Shipping Information
        this.shippingAddress = data.shippingAddress || {};
        this.billingAddress = data.billingAddress || {};
        this.shippingMethod = data.shippingMethod || 'standard'; // standard, express, overnight
        this.shippingCarrier = data.shippingCarrier || ''; // DHL, FedEx, GIG, etc.
        this.trackingNumber = data.trackingNumber || '';
        this.deliveryInstructions = data.deliveryInstructions || '';
        
        // Payment Information
        this.paymentMethod = data.paymentMethod || ''; // card, bank_transfer, paypal, paystack
        this.paymentResult = data.paymentResult || {};
        this.paymentStatus = data.paymentStatus || 'pending'; // pending, paid, failed, refunded
        this.transactionId = data.transactionId || '';
        
        // Pricing Breakdown
        this.itemsPrice = data.itemsPrice || 0;
        this.customOrdersPrice = data.customOrdersPrice || 0;
        this.taxPrice = data.taxPrice || 0;
        this.shippingPrice = data.shippingPrice || 0;
        this.discountAmount = data.discountAmount || 0;
        this.promoCode = data.promoCode || '';
        this.totalPrice = data.totalPrice || 0;
        
        // Order Status & Timeline
        this.status = data.status || 'pending'; // pending, confirmed, processing, ready_to_ship, shipped, delivered, cancelled, returned
        this.orderType = data.orderType || 'standard'; // standard, custom, mixed
        this.priority = data.priority || 'normal'; // low, normal, high
        
        // Dates
        this.createdAt = data.createdAt || new Date().toISOString();
        this.confirmedAt = data.confirmedAt || null;
        this.paidAt = data.paidAt || null;
        this.processingAt = data.processingAt || null;
        this.shippedAt = data.shippedAt || null;
        this.deliveredAt = data.deliveredAt || null;
        this.cancelledAt = data.cancelledAt || null;
        this.estimatedDeliveryDate = data.estimatedDeliveryDate || null;
        
        // Customer Communication
        this.customerNotes = data.customerNotes || '';
        this.internalNotes = data.internalNotes || ''; // For admin/staff
        this.notificationPreferences = data.notificationPreferences || {
            email: true,
            sms: true
        };
        
        // Returns & Exchanges
        this.returnRequested = data.returnRequested || false;
        this.returnReason = data.returnReason || '';
        this.returnStatus = data.returnStatus || ''; // requested, approved, rejected, completed
        this.exchangeRequested = data.exchangeRequested || false;
        
        // Fashion-specific Fields
        this.urgency = data.urgency || 'standard'; // For custom orders with event dates
        this.fittingRequired = data.fittingRequired || false;
        this.fittingScheduled = data.fittingScheduled || false;
        
        // Admin Fields
        this.assignedStaff = data.assignedStaff || ''; // Staff member handling the order
        this.requiresAttention = data.requiresAttention || false;
    }

    toFirestore() {
        return {
            orderNumber: this.orderNumber,
            userId: this.userId,
            userEmail: this.userEmail,
            userName: this.userName,
            
            // Order Items
            items: this.items,
            customOrders: this.customOrders,
            
            // Shipping Information
            shippingAddress: this.shippingAddress,
            billingAddress: this.billingAddress,
            shippingMethod: this.shippingMethod,
            shippingCarrier: this.shippingCarrier,
            trackingNumber: this.trackingNumber,
            deliveryInstructions: this.deliveryInstructions,
            
            // Payment Information
            paymentMethod: this.paymentMethod,
            paymentResult: this.paymentResult,
            paymentStatus: this.paymentStatus,
            transactionId: this.transactionId,
            
            // Pricing Breakdown
            itemsPrice: this.itemsPrice,
            customOrdersPrice: this.customOrdersPrice,
            taxPrice: this.taxPrice,
            shippingPrice: this.shippingPrice,
            discountAmount: this.discountAmount,
            promoCode: this.promoCode,
            totalPrice: this.totalPrice,
            
            // Order Status & Timeline
            status: this.status,
            orderType: this.orderType,
            priority: this.priority,
            
            // Dates
            createdAt: this.createdAt,
            confirmedAt: this.confirmedAt,
            paidAt: this.paidAt,
            processingAt: this.processingAt,
            shippedAt: this.shippedAt,
            deliveredAt: this.deliveredAt,
            cancelledAt: this.cancelledAt,
            estimatedDeliveryDate: this.estimatedDeliveryDate,
            
            // Customer Communication
            customerNotes: this.customerNotes,
            internalNotes: this.internalNotes,
            notificationPreferences: this.notificationPreferences,
            
            // Returns & Exchanges
            returnRequested: this.returnRequested,
            returnReason: this.returnReason,
            returnStatus: this.returnStatus,
            exchangeRequested: this.exchangeRequested,
            
            // Fashion-specific Fields
            urgency: this.urgency,
            fittingRequired: this.fittingRequired,
            fittingScheduled: this.fittingScheduled,
            
            // Admin Fields
            assignedStaff: this.assignedStaff,
            requiresAttention: this.requiresAttention
        };
    }

    static fromFirestore(id, data) {
        return new Order({ id, ...data });
    }

    // Helper methods
    calculateTotalPrice() {
        const subtotal = this.itemsPrice + this.customOrdersPrice;
        this.totalPrice = subtotal + this.taxPrice + this.shippingPrice - this.discountAmount;
        return this.totalPrice;
    }

    updateStatus(newStatus) {
        this.status = newStatus;
        this.updatedAt = new Date().toISOString();
        
        // Set appropriate timestamps
        const now = new Date().toISOString();
        switch(newStatus) {
            case 'confirmed':
                this.confirmedAt = this.confirmedAt || now;
                break;
            case 'processing':
                this.processingAt = this.processingAt || now;
                break;
            case 'ready_to_ship':
                // Custom orders might be ready to ship
                break;
            case 'shipped':
                this.shippedAt = this.shippedAt || now;
                break;
            case 'delivered':
                this.deliveredAt = this.deliveredAt || now;
                break;
            case 'cancelled':
                this.cancelledAt = this.cancelledAt || now;
                break;
        }
    }

    addTrackingInfo(carrier, trackingNumber) {
        this.shippingCarrier = carrier;
        this.trackingNumber = trackingNumber;
        this.status = 'shipped';
        this.shippedAt = this.shippedAt || new Date().toISOString();
    }

    addCustomOrder(customOrderId, customOrderPrice) {
        this.customOrders.push(customOrderId);
        this.customOrdersPrice += customOrderPrice;
        this.orderType = this.items.length > 0 ? 'mixed' : 'custom';
        this.calculateTotalPrice();
    }

    addItem(item) {
        this.items.push(item);
        this.itemsPrice += item.price * item.quantity;
        this.orderType = this.customOrders.length > 0 ? 'mixed' : 'standard';
        this.calculateTotalPrice();
    }

    requestReturn(reason) {
        this.returnRequested = true;
        this.returnReason = reason;
        this.returnStatus = 'requested';
    }

    isUrgent() {
        return this.priority === 'high' || this.urgency === 'rush';
    }

    getEstimatedDelivery() {
        // Calculate based on shipping method and order type
        const baseDays = this.shippingMethod === 'express' ? 2 : 
                        this.shippingMethod === 'overnight' ? 1 : 5;
        
        // Custom orders take longer
        const customDays = this.customOrders.length > 0 ? 14 : 0;
        
        return baseDays + customDays;
    }
}

module.exports = Order;