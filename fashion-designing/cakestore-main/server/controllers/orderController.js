const { db } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/Order');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
    try {
        console.log('Raw request body:', JSON.stringify(req.body, null, 2));

        const {
            userId,
            userEmail,
            userName,
            items,
            customOrders,
            shippingAddress,
            billingAddress,
            paymentMethod,
            paymentResult,
            itemsPrice,
            customOrdersPrice,
            shippingPrice,
            taxPrice,
            discountAmount,
            promoCode,
            totalPrice,
            shippingMethod,
            deliveryInstructions,
            customerNotes
        } = req.body;

        // Enhanced validation with detailed errors
        if (!userId) throw new Error('User ID is required');
        if ((!items || items.length === 0) && (!customOrders || customOrders.length === 0)) {
            throw new Error('No order items or custom orders provided');
        }
        if (!shippingAddress) throw new Error('Shipping address is required');
        if (!paymentMethod) throw new Error('Payment method is required');
        if (!paymentResult?.id) throw new Error('Payment verification is required');

        // Validate standard items
        if (items && items.length > 0) {
            items.forEach(item => {
                if (!item.productId) throw new Error(`Item missing productId: ${JSON.stringify(item)}`);
                if (!item.quantity) throw new Error(`Item missing quantity: ${JSON.stringify(item)}`);
                if (!item.size) throw new Error(`Item missing size: ${JSON.stringify(item)}`);
                if (!item.color) throw new Error(`Item missing color: ${JSON.stringify(item)}`);
            });
        }

        // Validate custom orders
        if (customOrders && customOrders.length > 0) {
            for (const customOrderId of customOrders) {
                const customOrderRef = await db.collection('customOrders').doc(customOrderId).get();
                if (!customOrderRef.exists) {
                    throw new Error(`Custom order not found: ${customOrderId}`);
                }
                const customOrder = customOrderRef.data();
                if (customOrder.userId !== userId) {
                    throw new Error(`Custom order does not belong to user: ${customOrderId}`);
                }
            }
        }

        // Convert and validate numeric fields
        const numericItems = items ? items.map(item => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (isNaN(price)) throw new Error(`Invalid price for item ${item.productId}`);
            if (isNaN(quantity)) throw new Error(`Invalid quantity for item ${item.productId}`);

            return {
                ...item,
                price,
                quantity
            };
        }) : [];

        const numericPrices = {
            itemsPrice: validateNumber(itemsPrice, 'itemsPrice'),
            customOrdersPrice: validateNumber(customOrdersPrice || 0, 'customOrdersPrice'),
            shippingPrice: validateNumber(shippingPrice, 'shippingPrice'),
            taxPrice: validateNumber(taxPrice, 'taxPrice'),
            discountAmount: validateNumber(discountAmount || 0, 'discountAmount'),
            totalPrice: validateNumber(totalPrice, 'totalPrice')
        };

        function validateNumber(value, fieldName) {
            const num = Number(value);
            if (isNaN(num)) throw new Error(`Invalid ${fieldName}: ${value}`);
            return num;
        }

        // Determine order type
        let orderType = 'standard';
        if (customOrders && customOrders.length > 0) {
            orderType = items && items.length > 0 ? 'mixed' : 'custom';
        }

        // Calculate estimated delivery date
        const estimatedDeliveryDate = calculateEstimatedDelivery(orderType, shippingMethod);

        const orderData = {
            id: uuidv4(),
            orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            userId,
            userEmail: userEmail || '',
            userName: userName || '',
            items: numericItems,
            customOrders: customOrders || [],
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            paymentResult: {
                ...paymentResult,
                amount: validateNumber(paymentResult.amount, 'payment amount')
            },
            paymentStatus: 'paid',
            shippingMethod: shippingMethod || 'standard',
            deliveryInstructions: deliveryInstructions || '',
            ...numericPrices,
            promoCode: promoCode || '',
            orderType,
            status: 'confirmed',
            priority: orderType === 'custom' ? 'high' : 'normal',
            isPaid: true,
            paidAt: paymentResult.verifiedAt || new Date().toISOString(),
            isDelivered: false,
            deliveredAt: null,
            estimatedDeliveryDate,
            customerNotes: customerNotes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('Processed order data:', JSON.stringify(orderData, null, 2));

        // Firestore transaction with detailed error handling
        await db.runTransaction(async (transaction) => {
            try {
                // Step 1: Prepare references
                const orderRef = db.collection('orders').doc(orderData.id);
                const userRef = db.collection('users').doc(userId);
                
                // Step 2: Perform all reads first
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists) {
                    throw new Error(`User not found: ${userId}`);
                }

                // Step 3: Validate product stock for standard items
                if (numericItems.length > 0) {
                    const productRefs = numericItems.map(item =>
                        db.collection('products').doc(item.productId)
                    );

                    const productDocs = await Promise.all(productRefs.map(ref => transaction.get(ref)));

                    productDocs.forEach((doc, index) => {
                        const item = numericItems[index];
                        if (!doc.exists) {
                            throw new Error(`Product not found: ${item.productId}`);
                        }
                        const currentStock = doc.data().countInStock || 0;
                        if (currentStock < item.quantity) {
                            throw new Error(`Insufficient stock for product ${item.productId}. Available: ${currentStock}, Requested: ${item.quantity}`);
                        }
                    });

                    // Update product stock
                    productRefs.forEach((ref, index) => {
                        const item = numericItems[index];
                        transaction.update(ref, {
                            countInStock: admin.firestore.FieldValue.increment(-item.quantity),
                            updatedAt: new Date().toISOString()
                        });
                    });
                }

                // Step 4: Update custom orders status
                if (customOrders && customOrders.length > 0) {
                    for (const customOrderId of customOrders) {
                        const customOrderRef = db.collection('customOrders').doc(customOrderId);
                        transaction.update(customOrderRef, {
                            status: 'confirmed',
                            updatedAt: new Date().toISOString()
                        });
                    }
                }

                // Step 5: All writes come after reads
                transaction.set(orderRef, orderData);

                transaction.update(userRef, {
                    orders: admin.firestore.FieldValue.arrayUnion(orderData.id),
                    updatedAt: new Date().toISOString()
                });

            } catch (transactionError) {
                console.error('Transaction error details:', {
                    message: transactionError.message,
                    stack: transactionError.stack,
                    items: numericItems.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity
                    })),
                    customOrders
                });
                throw transactionError;
            }
        });

        // Email sending (non-blocking but with better error handling)
        try {
            await sendEmail({
                email: userEmail || shippingAddress.email,
                subject: `Your Zeph Fashion Order #${orderData.orderNumber}`,
                template: 'order-confirmation',
                context: {
                    orderNumber: orderData.orderNumber,
                    totalPrice: orderData.totalPrice,
                    items: numericItems,
                    customOrders: customOrders || [],
                    shippingAddress,
                    estimatedDeliveryDate,
                    orderType
                }
            });
            console.log('Order confirmation email sent successfully');
        } catch (emailError) {
            console.error('Email sending failed:', {
                error: emailError.message,
                stack: emailError.stack,
                recipient: userEmail || shippingAddress.email
            });
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: orderData
        });

    } catch (error) {
        console.error('Complete order creation failure:', {
            timestamp: new Date().toISOString(),
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                requestBody: req.body
            }
        });

        res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? {
                stack: error.stack,
                validationErrors: error.errors
            } : undefined
        });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const orderRef = await db.collection('orders').doc(req.params.id).get();

    if (!orderRef.exists) {
        return next(new ErrorResponse('Order not found', 404));
    }

    const order = Order.fromFirestore(orderRef.id, orderRef.data());

    // Verify ownership or admin status
    if (order.userId !== req.user.uid && req.user.role !== 'admin' && req.user.role !== 'designer') {
        return next(new ErrorResponse('Not authorized to access this order', 401));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
        return next(new ErrorResponse('Order not found', 404));
    }

    const order = Order.fromFirestore(orderSnap.id, orderSnap.data());

    if (order.userId !== req.user.uid && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to update this order', 401));
    }

    await orderRef.update({
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentStatus: 'paid',
        paymentResult: {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        },
        status: 'confirmed',
        confirmedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    res.status(200).json({
        success: true,
        message: 'Order payment confirmed',
        data: { id: req.params.id }
    });
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
        return next(new ErrorResponse('Order not found', 404));
    }

    await orderRef.update({
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
        status: 'delivered',
        updatedAt: new Date().toISOString()
    });

    res.status(200).json({
        success: true,
        message: 'Order marked as delivered',
        data: { id: req.params.id }
    });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'returned'];

    if (!validStatuses.includes(status)) {
        return next(new ErrorResponse('Invalid status', 400));
    }

    const orderRef = db.collection('orders').doc(req.params.id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
        return next(new ErrorResponse('Order not found', 404));
    }

    const order = Order.fromFirestore(orderSnap.id, orderSnap.data());
    order.updateStatus(status);

    await orderRef.update(order.toFirestore());

    res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        data: { id: req.params.id, status }
    });
});

// @desc    Add tracking information
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
exports.addTrackingInfo = asyncHandler(async (req, res, next) => {
    const { courier, trackingNumber } = req.body;

    if (!courier || !trackingNumber) {
        return next(new ErrorResponse('Courier and tracking number are required', 400));
    }

    const orderRef = db.collection('orders').doc(req.params.id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
        return next(new ErrorResponse('Order not found', 404));
    }

    const order = Order.fromFirestore(orderSnap.id, orderSnap.data());
    order.addTrackingInfo(courier, trackingNumber);

    await orderRef.update(order.toFirestore());

    res.status(200).json({
        success: true,
        message: 'Tracking information added successfully',
        data: { courier, trackingNumber }
    });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    const { status, orderType } = req.query;
    
    let query = db.collection('orders').where('userId', '==', req.user.uid);
    
    // Apply filters if provided
    if (status && status !== 'all') {
        query = query.where('status', '==', status);
    }
    
    if (orderType && orderType !== 'all') {
        query = query.where('orderType', '==', orderType);
    }
    
    query = query.orderBy('createdAt', 'desc');
    
    const snapshot = await query.get();
    const orders = [];
    
    snapshot.forEach(doc => {
        orders.push(Order.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
    const { status, orderType, priority } = req.query;
    
    let query = db.collection('orders').orderBy('createdAt', 'desc');
    
    // Apply filters if provided
    if (status && status !== 'all') {
        query = query.where('status', '==', status);
    }
    
    if (orderType && orderType !== 'all') {
        query = query.where('orderType', '==', orderType);
    }
    
    if (priority && priority !== 'all') {
        query = query.where('priority', '==', priority);
    }

    const snapshot = await query.get();
    const orders = [];

    snapshot.forEach(doc => {
        orders.push(Order.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Request return for order
// @route   POST /api/orders/:id/return
// @access  Private
exports.requestReturn = asyncHandler(async (req, res, next) => {
    const { reason } = req.body;

    if (!reason) {
        return next(new ErrorResponse('Return reason is required', 400));
    }

    const orderRef = db.collection('orders').doc(req.params.id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
        return next(new ErrorResponse('Order not found', 404));
    }

    const order = Order.fromFirestore(orderSnap.id, orderSnap.data());

    // Verify ownership
    if (order.userId !== req.user.uid) {
        return next(new ErrorResponse('Not authorized to return this order', 401));
    }

    order.requestReturn(reason);

    await orderRef.update(order.toFirestore());

    res.status(200).json({
        success: true,
        message: 'Return request submitted successfully',
        data: { returnStatus: order.returnStatus }
    });
});

// Helper function to calculate estimated delivery
function calculateEstimatedDelivery(orderType, shippingMethod) {
    const baseDays = shippingMethod === 'express' ? 2 : 
                    shippingMethod === 'overnight' ? 1 : 5;
    
    // Custom orders take longer
    const customDays = orderType === 'custom' || orderType === 'mixed' ? 14 : 0;
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + baseDays + customDays);
    
    return deliveryDate.toISOString().split('T')[0];
}