// server/controllers/customOrderController.js
const { db, storage } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const CustomOrder = require('../models/CustomOrder');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { v4: uuidv4 } = require('uuid');

// Helper function to calculate required by date
const calculateRequiredByDate = (eventDate, productionTime = '2-3 weeks') => {
    if (!eventDate) return new Date().toISOString().split('T')[0];
    
    const event = new Date(eventDate);
    const requiredBy = new Date(event);
    
    if (productionTime.includes('1-2')) {
        requiredBy.setDate(event.getDate() - 10);
    } else if (productionTime.includes('2-3')) {
        requiredBy.setDate(event.getDate() - 7);
    } else if (productionTime.includes('3-4')) {
        requiredBy.setDate(event.getDate() - 5);
    } else {
        requiredBy.setDate(event.getDate() - 7);
    }
    
    return requiredBy.toISOString().split('T')[0];
};

// Helper function to calculate price estimate
function calculatePriceEstimate(orderData) {
    let basePrice = 0;
    
    // Base price by design type
    const designTypePrices = {
        'dress': 15000,
        'gown': 30000,
        'suit': 20000,
        'blouse': 8000,
        'skirt': 6000,
        'pants': 7000,
        'jacket': 12000
    };
    
    basePrice = designTypePrices[orderData.designType] || 10000;
    
    // Fabric quality multiplier
    const qualityMultipliers = {
        'standard': 1,
        'premium': 1.5,
        'luxury': 2.5
    };
    
    basePrice *= qualityMultipliers[orderData.materialQuality] || 1;
    
    // Add cost for design features
    if (orderData.designFeatures && orderData.designFeatures.length > 0) {
        basePrice += orderData.designFeatures.length * 2000;
    }
    
    // Add cost for embellishments
    if (orderData.embellishments && orderData.embellishments.length > 0) {
        basePrice += orderData.embellishments.length * 3500;
    }
    
    return Math.round(basePrice);
}




// Add to your orderController.js

// @desc    Get all orders with pagination
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrdersWithPagination = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
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

    // Get total count for pagination
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Apply pagination
    const snapshot = await query.limit(limit).offset(skip).get();
    const orders = [];

    snapshot.forEach(doc => {
        orders.push(Order.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: orders.length,
        total,
        page,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
        data: orders
    });
});



// @desc    Create custom fashion order
// @route   POST /api/custom-orders
// @access  Private
exports.createCustomOrder = asyncHandler(async (req, res, next) => {
    try {
        console.log('Received custom order request body:', JSON.stringify(req.body, null, 2));
        
        const {
            designType,
            occasion,
            styleDescription,
            fabricType,
            fabricColor,
            materialQuality,
            measurements,
            designFeatures,
            embellishments,
            specialRequests,
            eventDate,
            deliveryAddress,
            shippingMethod,
            referenceLinks,
            inspirationImages: frontendImages, // This will be files, not in body
            price, // From frontend calculation
            productionTime // From frontend
        } = req.body;

        // Use user from auth middleware instead of body
        const userId = req.user.uid;
        const userEmail = req.user.email;
        const userName = req.user.displayName || '';

        // Validate required fields
        if (!designType) throw new Error('Design type is required');
        if (!occasion) throw new Error('Occasion is required');
        if (!fabricType) throw new Error('Fabric type is required');
        if (!measurements) throw new Error('Measurements are required');
        if (!eventDate) throw new Error('Event date is required');

        let inspirationImageUrls = [];

        // Handle multiple image uploads from form data
        if (req.files && req.files.length > 0) {
            for (const imageFile of req.files) {
                const imageRef = ref(storage, `custom-fashion-orders/${Date.now()}_${uuidv4()}_${imageFile.originalname}`);
                const snapshot = await uploadBytes(imageRef, imageFile.buffer);
                const imageUrl = await getDownloadURL(snapshot.ref);
                inspirationImageUrls.push(imageUrl);
            }
        }

        // Calculate required by date
        const requiredByDate = calculateRequiredByDate(eventDate, productionTime);

        // Parse measurements and deliveryAddress if they are strings
        const parsedMeasurements = typeof measurements === 'string' 
            ? JSON.parse(measurements) 
            : measurements;

        const parsedDeliveryAddress = typeof deliveryAddress === 'string'
            ? JSON.parse(deliveryAddress)
            : deliveryAddress;

        // Create custom order data
        const customOrderData = {
            userId,
            userEmail,
            userName,
            designType,
            occasion,
            styleDescription: styleDescription || '',
            fabricType,
            fabricColor: fabricColor || '',
            materialQuality: materialQuality || 'standard',
            measurements: parsedMeasurements,
            designFeatures: Array.isArray(designFeatures) ? designFeatures : (designFeatures ? [designFeatures] : []),
            embellishments: Array.isArray(embellishments) ? embellishments : (embellishments ? [embellishments] : []),
            specialRequests: specialRequests || '',
            eventDate,
            requiredByDate,
            deliveryAddress: parsedDeliveryAddress,
            shippingMethod: shippingMethod || 'standard',
            inspirationImages: inspirationImageUrls,
            referenceLinks: Array.isArray(referenceLinks) ? referenceLinks : (referenceLinks ? [referenceLinks] : []),
            basePrice: price || 0,
            totalPrice: price || 0,
            finalPrice: price || 0,
            productionTime: productionTime || '2-3 weeks',
            status: 'consultation',
            priority: 'normal'
        };

        console.log('Creating custom order with data:', JSON.stringify(customOrderData, null, 2));

        // Create CustomOrder instance
        const customOrder = new CustomOrder(customOrderData);
        
        // Convert to Firestore format
        const firestoreData = customOrder.toFirestore();
        
        console.log('Firestore data to save:', JSON.stringify(firestoreData, null, 2));

        // Save to Firestore
        const customOrderRef = db.collection('customOrders').doc(customOrder.id);
        await customOrderRef.set(firestoreData);

        console.log('Custom order created successfully with ID:', customOrder.id);

        res.status(201).json({
            success: true,
            message: 'Custom fashion order created successfully',
            data: {
                id: customOrder.id,
                ...customOrder
            }
        });

    } catch (error) {
        console.error('Custom fashion order creation failed:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create custom order'
        });
    }
});

// @desc    Get custom orders by user
// @route   GET /api/custom-orders/my-orders
// @access  Private
exports.getMyCustomOrders = asyncHandler(async (req, res, next) => {
    try {
        const snapshot = await db.collection('customOrders')
            .where('userId', '==', req.user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const orders = [];
        snapshot.forEach(doc => {
            orders.push(CustomOrder.fromFirestore(doc.id, doc.data()));
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching custom orders:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Get all custom orders (Admin/Designer)
// @route   GET /api/custom-orders
// @access  Private/Admin
exports.getAllCustomOrders = asyncHandler(async (req, res, next) => {
    try {
        const { status, designer, priority } = req.query;
        
        let query = db.collection('customOrders').orderBy('createdAt', 'desc');
        
        // Filter by status
        if (status && status !== 'all') {
            query = query.where('status', '==', status);
        }
        
        // Filter by assigned designer
        if (designer) {
            query = query.where('assignedDesigner', '==', designer);
        }
        
        // Filter by priority
        if (priority) {
            query = query.where('priority', '==', priority);
        }

        const snapshot = await query.get();
        const orders = [];
        snapshot.forEach(doc => {
            orders.push(CustomOrder.fromFirestore(doc.id, doc.data()));
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching all custom orders:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Update custom order status
// @route   PUT /api/custom-orders/:id/status
// @access  Private/Admin
exports.updateCustomOrderStatus = asyncHandler(async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['consultation', 'confirmed', 'design', 'measurement', 'production', 'fitting', 'ready', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const orderRef = db.collection('customOrders').doc(req.params.id);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
            return res.status(404).json({
                success: false,
                error: 'Custom order not found'
            });
        }

        await orderRef.update({
            status: status,
            updatedAt: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: { id: req.params.id, status }
        });
    } catch (error) {
        console.error('Error updating custom order status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Get custom order by ID
// @route   GET /api/custom-orders/:id
// @access  Private
exports.getCustomOrderById = asyncHandler(async (req, res, next) => {
    try {
        const orderRef = await db.collection('customOrders').doc(req.params.id).get();

        if (!orderRef.exists) {
            return res.status(404).json({
                success: false,
                error: 'Custom order not found'
            });
        }

        const order = CustomOrder.fromFirestore(orderRef.id, orderRef.data());

        // Verify ownership or admin/designer status
        if (order.userId !== req.user.uid && req.user.role !== 'admin' && req.user.role !== 'designer') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching custom order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Update custom order details (Admin/Designer)
// @route   PUT /api/custom-orders/:id
// @access  Private/Admin
exports.updateCustomOrder = asyncHandler(async (req, res, next) => {
    try {
        const orderRef = db.collection('customOrders').doc(req.params.id);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
            return res.status(404).json({
                success: false,
                error: 'Custom order not found'
            });
        }

        const order = CustomOrder.fromFirestore(orderSnap.id, orderSnap.data());
        
        // Update allowed fields
        const allowedUpdates = [
            'fabricCost', 'laborCost', 'shippingCost', 'totalPrice', 'finalPrice',
            'assignedDesigner', 'priority', 'notes', 'sketchUrl', 'nextFittingDate'
        ];
        
        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        updates.updatedAt = new Date().toISOString();
        
        // Recalculate total if cost components changed
        if (req.body.fabricCost || req.body.laborCost || req.body.shippingCost) {
            updates.totalPrice = (updates.fabricCost || order.fabricCost) + 
                               (updates.laborCost || order.laborCost) + 
                               (updates.shippingCost || order.shippingCost);
            updates.finalPrice = updates.totalPrice;
        }

        await orderRef.update(updates);

        res.status(200).json({
            success: true,
            message: 'Custom order updated successfully',
            data: { id: req.params.id, ...updates }
        });
    } catch (error) {
        console.error('Error updating custom order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Add fitting session to custom order
// @route   POST /api/custom-orders/:id/fitting
// @access  Private/Admin
exports.addFittingSession = asyncHandler(async (req, res, next) => {
    try {
        const { notes, measurements, photos, nextSessionDate } = req.body;

        const orderRef = db.collection('customOrders').doc(req.params.id);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
            return res.status(404).json({
                success: false,
                error: 'Custom order not found'
            });
        }

        const order = CustomOrder.fromFirestore(orderSnap.id, orderSnap.data());
        
        // Initialize fittingSessions array if it doesn't exist
        if (!order.fittingSessions) {
            order.fittingSessions = [];
        }
        
        order.fittingSessions.push({
            date: new Date().toISOString(),
            notes: notes || '',
            measurements: measurements || {},
            photos: photos || [],
            nextSessionDate: nextSessionDate || null
        });

        order.updatedAt = new Date().toISOString();

        await orderRef.update({
            fittingSessions: order.fittingSessions,
            updatedAt: order.updatedAt
        });

        res.status(200).json({
            success: true,
            message: 'Fitting session added successfully',
            data: order.fittingSessions
        });
    } catch (error) {
        console.error('Error adding fitting session:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Add tracking information to custom order
// @route   PUT /api/custom-orders/:id/tracking
// @access  Private/Admin
exports.addTrackingInfo = asyncHandler(async (req, res, next) => {
    try {
        const { courier, trackingNumber } = req.body;

        if (!courier || !trackingNumber) {
            return res.status(400).json({
                success: false,
                error: 'Courier and tracking number are required'
            });
        }

        const orderRef = db.collection('customOrders').doc(req.params.id);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
            return res.status(404).json({
                success: false,
                error: 'Custom order not found'
            });
        }

        await orderRef.update({
            courier,
            trackingNumber,
            status: 'shipped',
            shippedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: 'Tracking information added successfully',
            data: { courier, trackingNumber }
        });
    } catch (error) {
        console.error('Error adding tracking information:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Calculate price estimate for custom order
// @route   POST /api/custom-orders/calculate-price
// @access  Public
exports.calculatePriceEstimate = asyncHandler(async (req, res, next) => {
    try {
        const { designType, fabricType, materialQuality, designFeatures, embellishments } = req.body;
        
        const price = calculatePriceEstimate({
            designType,
            fabricType,
            materialQuality,
            designFeatures,
            embellishments
        });

        res.status(200).json({
            success: true,
            data: { estimatedPrice: price }
        });
    } catch (error) {
        console.error('Error calculating price estimate:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
