// server/routes/orderRoutes.js
const express = require('express');
const {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    addTrackingInfo,
    requestReturn
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Customer routes

router.route('/')
    .post(protect, createOrder)
    .get(protect, authorize('admin', 'designer'), getOrdersWithPagination); // ADD THIS LINE

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);

router.route('/:id/return')
    .post(protect, requestReturn);

// Admin/Designer routes
router.route('/admin/all')
    .get(protect, authorize('admin', 'designer'), getOrders);

router.route('/admin/:id/status')
    .put(protect, authorize('admin', 'designer'), updateOrderStatus);

router.route('/admin/:id/deliver')
    .put(protect, authorize('admin', 'designer'), updateOrderToDelivered);

router.route('/admin/:id/tracking')
    .put(protect, authorize('admin', 'designer'), addTrackingInfo);

// Optional: Filtered order routes for admin
router.route('/admin/status/:status')
    .get(protect, authorize('admin', 'designer'), getOrders);

router.route('/admin/type/:orderType')
    .get(protect, authorize('admin', 'designer'), getOrders);

// Public route for order tracking (by order number)
router.route('/track/:orderNumber')
    .get(async (req, res) => {
        try {
            // This would be handled by a separate controller function
            // For now, it's a placeholder for public order tracking
            res.status(200).json({
                success: true,
                message: 'Order tracking endpoint - implement tracking logic here'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error tracking order'
            });
        }
    });

module.exports = router;
