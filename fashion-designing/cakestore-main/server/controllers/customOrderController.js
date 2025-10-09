// server/controllers/customOrderController.js
const { db, storage } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const CustomOrder = require('../models/CustomOrder');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { v4: uuidv4 } = require('uuid');

// @desc    Create custom fashion order
// @route   POST /api/custom-orders
// @access  Private
exports.createCustomOrder = asyncHandler(async (req, res, next) => {
    try {
        const {
            userId,
            userEmail,
            userName,
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
            referenceLinks
        } = req.body;

        // Validate required fields
        if (!userId) throw new Error('User ID is required');
        if (!userEmail) throw new Error('User email is required');
        if (!designType) throw new Error('Design type is required');
        if (!occasion) throw new Error('Occasion is required');
        if (!fabricType) throw new Error('Fabric type is required');
        if (!measurements) throw new Error('Measurements are required');
        if (!eventDate) throw new Error('Event date is required');

        let inspirationImages = [];

        // Handle multiple image uploads
        if (req.files && req.files.inspirationImages) {
            const imageFiles = Array.isArray(req.files.inspirationImages) 
                ? req.files.inspirationImages 
                : [req.files.inspirationImages];

            for (const imageFile of imageFiles) {
                const imageRef = ref(storage, `custom-fashion-orders/${Date.now()}_${uuidv4()}_${imageFile.name}`);
                const snapshot = await uploadBytes(imageRef, imageFile.data);
                const imageUrl = await getDownloadURL(snapshot.ref);
                inspirationImages.push(imageUrl);
            }
        }

        // Calculate base price estimate
        const basePrice = calculatePriceEstimate({
            designType,
            fabricType,
            materialQuality,
            designFeatures,
            embellishments
        });

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
            measurements: typeof measurements === 'string' ? JSON.parse(measurements) : measurements,
            designFeatures: Array.isArray(designFeatures) ? designFeatures : [designFeatures],
            embellishments: Array.isArray(embellishments) ? embellishments : [embellishments],
            specialRequests: specialRequests || '',
            eventDate,
            deliveryAddress: typeof deliveryAddress === 'string' ? JSON.parse(deliveryAddress) : deliveryAddress,
            shippingMethod: shippingMethod || 'standard',
            inspirationImages,
            referenceLinks: Array.isArray(referenceLinks) ? referenceLinks : [referenceLinks],
            basePrice,
            status: 'consultation'
        };

        const customOrder = new CustomOrder(customOrderData);
        customOrder.calculateRequiredByDate(); // Set required by date based on event date
        
        const customOrderRef = db.collection('customOrders').doc(customOrder.id);
        await customOrderRef.set(customOrder.toFirestore());

        res.status(201).json({
            success: true,
            message: 'Custom fashion order created successfully',
            data: customOrder
        });

    } catch (error) {
        console.error('Custom fashion order creation failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
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
        const validStatuses = ['consultation', 'design', 'measurement', 'production', 'fitting', 'ready', 'shipped', 'delivered', 'cancelled'];

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

        const order = CustomOrder.fromFirestore(orderSnap.id, orderSnap.data());
        order.updateStatus(status);

        await orderRef.update(order.toFirestore());

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
            return res.status(401).json({
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
        
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                order[field] = req.body[field];
            }
        });

        order.updatedAt = new Date().toISOString();
        
        // Recalculate total if cost components changed
        if (req.body.fabricCost || req.body.laborCost || req.body.shippingCost) {
            order.calculateTotalPrice();
        }

        await orderRef.update(order.toFirestore());

        res.status(200).json({
            success: true,
            message: 'Custom order updated successfully',
            data: order
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
        
        order.addFittingSession({
            notes,
            measurements,
            photos: photos || [],
            nextSessionDate
        });

        await orderRef.update(order.toFirestore());

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

// Helper function to calculate price estimate
function calculatePriceEstimate(orderData) {
    let basePrice = 0;
    
    // Base price by design type
    const designTypePrices = {
        'dress': 150,
        'gown': 300,
        'suit': 200,
        'blouse': 80,
        'skirt': 60,
        'pants': 70,
        'jacket': 120
    };
    
    basePrice = designTypePrices[orderData.designType] || 100;
    
    // Fabric quality multiplier
    const qualityMultipliers = {
        'standard': 1,
        'premium': 1.5,
        'luxury': 2.5
    };
    
    basePrice *= qualityMultipliers[orderData.materialQuality] || 1;
    
    // Add cost for design features
    if (orderData.designFeatures && orderData.designFeatures.length > 0) {
        basePrice += orderData.designFeatures.length * 20;
    }
    
    // Add cost for embellishments
    if (orderData.embellishments && orderData.embellishments.length > 0) {
        basePrice += orderData.embellishments.length * 35;
    }
    
    return Math.round(basePrice);
}