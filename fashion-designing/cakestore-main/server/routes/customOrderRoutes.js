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

// Public routes
router.route('/calculate-price')
    .post(calculatePriceEstimate);

// Customer routes
router.route('/')
    .post(protect, upload.array('inspirationImages', 5), createCustomOrder); // Allow multiple images

router.route('/my-orders')
    .get(protect, getMyCustomOrders);

router.route('/:id')
    .get(protect, getCustomOrderById);

// Admin/Designer routes
router.route('/admin/all')
    .get(protect, authorize('admin', 'designer'), getAllCustomOrders);

router.route('/admin/:id')
    .put(protect, authorize('admin', 'designer'), updateCustomOrder);

router.route('/admin/:id/status')
    .put(protect, authorize('admin', 'designer'), updateCustomOrderStatus);

router.route('/admin/:id/fitting')
    .post(protect, authorize('admin', 'designer'), addFittingSession);

router.route('/admin/:id/tracking')
    .put(protect, authorize('admin', 'designer'), addTrackingInfo);

// Optional: Routes for specific status filters
router.route('/admin/status/:status')
    .get(protect, authorize('admin', 'designer'), getAllCustomOrders);

module.exports = router;