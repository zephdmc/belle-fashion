// server/routes/customOrderRoutes.js
const express = require('express');
const {
    createCustomOrder,
    getMyCustomOrders,
    getAllCustomOrders,
    updateCustomOrderStatus,
    getCustomOrderById,
    updateCustomOrder,
    addFittingSession,
    addTrackingInfo,
    calculatePriceEstimate
} = require('../controllers/customOrderController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// ===== PUBLIC ROUTES =====
router.route('/calculate-price')
    .post(calculatePriceEstimate);

// ===== CUSTOMER ROUTES =====
// Create custom order
router.post('/', protect, upload.array('inspirationImages', 5), createCustomOrder);

// Get current user's custom orders
router.get('/my-orders', protect, getMyCustomOrders);

// Get specific custom order by ID
router.get('/:id', protect, getCustomOrderById);

// ===== ADMIN/DESIGNER ROUTES =====
// Get ALL custom orders with optional filtering (admin only)
router.get('/', protect, authorize('admin', 'designer'), getAllCustomOrders);

// Alternative admin route if needed
router.get('/admin/all', protect, authorize('admin', 'designer'), getAllCustomOrders);

// Update custom order (admin only)
router.put('/:id', protect, authorize('admin', 'designer'), updateCustomOrder);

// Update order status (admin only)
router.put('/:id/status', protect, authorize('admin', 'designer'), updateCustomOrderStatus);

// Add fitting session (admin only)
router.post('/:id/fitting', protect, authorize('admin', 'designer'), addFittingSession);

// Add tracking info (admin only)
router.put('/:id/tracking', protect, authorize('admin', 'designer'), addTrackingInfo);

module.exports = router;
