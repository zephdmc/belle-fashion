// server/routes/productRoutes.js
const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductReview,
    addCustomerImage,
    getFeaturedProducts,
    getNewArrivals,
    getProductsByCollection
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Public routes
router.route('/')
    .get(getProducts);

router.route('/featured')
    .get(getFeaturedProducts);

router.route('/new-arrivals')
    .get(getNewArrivals);

router.route('/collection/:collectionName')
    .get(getProductsByCollection);

router.route('/:id')
    .get(getProduct);

// Customer routes (authenticated)
router.route('/:id/reviews')
    .post(protect, addProductReview);

router.route('/:id/customer-images')
    .post(protect, upload.single('customerImage'), addCustomerImage);

// Admin routes
router.route('/')
    .post(protect, authorize('admin'), upload.array('images', 8), createProduct);

router.route('/:id')
    .put(protect, authorize('admin'), upload.array('images', 8), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

// Optional: Admin bulk operations
router.route('/admin/bulk/status')
    .put(protect, authorize('admin'), async (req, res) => {
        // Handle bulk status updates
        res.status(200).json({
            success: true,
            message: 'Bulk status update endpoint'
        });
    });

// Optional: Product analytics
router.route('/admin/analytics/popular')
    .get(protect, authorize('admin'), async (req, res) => {
        // Return popular products analytics
        res.status(200).json({
            success: true,
            message: 'Product analytics endpoint'
        });
    });

module.exports = router;