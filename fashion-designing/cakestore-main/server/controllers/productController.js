const { db } = require('../config/firebaseConfig');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');
const admin = require('firebase-admin');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    let query = db.collection('products');

    // Filter by category
    if (req.query.category) {
        query = query.where('category', '==', req.query.category);
    }

    // Filter by subcategory
    if (req.query.subcategory) {
        query = query.where('subcategory', '==', req.query.subcategory);
    }

    // Filter by collection
    if (req.query.collection) {
        query = query.where('collection', '==', req.query.collection);
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        query = query.where('price', '>=', minPrice).where('price', '<=', maxPrice);
    }

    // Filter by size
    if (req.query.size) {
        query = query.where('sizes', 'array-contains', req.query.size);
    }

    // Filter by color
    if (req.query.color) {
        query = query.where('colors', 'array-contains', req.query.color);
    }

    // Filter by occasion
    if (req.query.occasion) {
        query = query.where('occasion', 'array-contains', req.query.occasion);
    }

    // Filter by style
    if (req.query.style) {
        query = query.where('styleTags', 'array-contains', req.query.style);
    }

    // Filter by material
    if (req.query.material) {
        query = query.where('material', '==', req.query.material);
    }

    // Filter by fit type
    if (req.query.fitType) {
        query = query.where('fitType', '==', req.query.fitType);
    }

    // Filter by featured products
    if (req.query.featured === 'true') {
        query = query.where('isFeatured', '==', true);
    }

    // Filter by new arrivals
    if (req.query.newArrivals === 'true') {
        query = query.where('isNewArrival', '==', true);
    }

    // Filter by bestsellers
    if (req.query.bestsellers === 'true') {
        query = query.where('isBestseller', '==', true);
    }

    // Filter by sale items
    if (req.query.onSale === 'true') {
        query = query.where('isOnSale', '==', true);
    }

    // Filter by customizable
    if (req.query.customizable !== undefined) {
        const isCustomizable = req.query.customizable === 'true';
        query = query.where('isCustomizable', '==', isCustomizable);
    }

    // Search by name or description
    if (req.query.search) {
        query = query.where('name', '>=', req.query.search)
            .where('name', '<=', req.query.search + '\uf8ff');
    }

    // Sorting
    if (req.query.sort) {
        switch (req.query.sort) {
            case 'price_asc':
                query = query.orderBy('price', 'asc');
                break;
            case 'price_desc':
                query = query.orderBy('price', 'desc');
                break;
            case 'newest':
                query = query.orderBy('createdAt', 'desc');
                break;
            case 'popular':
                query = query.orderBy('rating', 'desc');
                break;
            case 'name':
                query = query.orderBy('name', 'asc');
                break;
            default:
                query = query.orderBy('createdAt', 'desc');
        }
    } else {
        query = query.orderBy('createdAt', 'desc');
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startAt = (page - 1) * limit;

    const snapshot = await query.limit(limit).offset(startAt).get();
    const totalSnapshot = await query.get();
    const totalProducts = totalSnapshot.size;

    const products = [];
    snapshot.forEach(doc => {
        products.push(Product.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: products.length,
        total: totalProducts,
        page,
        pages: Math.ceil(totalProducts / limit),
        data: products
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const productId = req.params.id;
    const productRef = db.collection('products').doc(productId);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    const product = Product.fromFirestore(productSnap.id, productSnap.data());

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        console.log('Incoming product data:', req.body);

        // Validate required fields
        const requiredFields = ['name', 'price', 'description', 'category'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate sizes and colors arrays
        if (!req.body.sizes || req.body.sizes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one size is required'
            });
        }

        if (!req.body.colors || req.body.colors.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one color is required'
            });
        }

        // Create a new Product instance from the request body
        const newProduct = new Product(req.body);

        // Calculate discounted price if applicable
        if (newProduct.discountPercentage > 0) {
            newProduct.calculateDiscountedPrice();
        }

        // Get the Firestore-ready object from the model
        const productData = newProduct.toFirestore();

        // Add metadata fields for Firestore
        const productRef = await admin.firestore().collection('products').add({
            ...productData,
            createdBy: req.user?.uid || 'system',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const productDoc = await productRef.get();

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            id: productRef.id,
            data: { id: productRef.id, ...productDoc.data() }
        });

    } catch (error) {
        console.error('Product Creation Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during product creation'
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const productRef = db.collection('products').doc(req.params.id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    // Prepare the update object
    let updates = { ...req.body };

    // Helper function to convert string to array if needed
    const formatArrayField = (field) => {
        if (updates[field] && typeof updates[field] === 'string') {
            updates[field] = updates[field].split(',').map(item => item.trim());
        }
    };

    // Apply formatting to all array-based fields
    const arrayFields = [
        'images', 'sizes', 'colors', 'occasion', 'styleTags', 'features',
        'tags', 'seoKeywords', 'reviews', 'customerImages'
    ];
    
    arrayFields.forEach(field => formatArrayField(field));

    // Handle size chart if provided as string
    if (updates.sizeChart && typeof updates.sizeChart === 'string') {
        try {
            updates.sizeChart = JSON.parse(updates.sizeChart);
        } catch (error) {
            return next(new ErrorResponse('Invalid size chart format', 400));
        }
    }

    // Handle color hex if provided as string
    if (updates.colorHex && typeof updates.colorHex === 'string') {
        try {
            updates.colorHex = JSON.parse(updates.colorHex);
        } catch (error) {
            return next(new ErrorResponse('Invalid color hex format', 400));
        }
    }

    // Recalculate price if discount percentage changed
    if (updates.discountPercentage !== undefined) {
        const currentProduct = Product.fromFirestore(productSnap.id, productSnap.data());
        currentProduct.discountPercentage = updates.discountPercentage;
        currentProduct.calculateDiscountedPrice();
        updates.price = currentProduct.price;
    }

    // Use serverTimestamp for accuracy
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await productRef.update(updates);

    const updatedProduct = await productRef.get();

    res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: Product.fromFirestore(updatedProduct.id, updatedProduct.data())
    });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const productRef = db.collection('products').doc(req.params.id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    await productRef.delete();

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: {}
    });
});

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addProductReview = asyncHandler(async (req, res, next) => {
    const { rating, comment, images } = req.body;
    const userId = req.user.uid;
    const userName = req.user.name || 'Anonymous';

    if (!rating || rating < 1 || rating > 5) {
        return next(new ErrorResponse('Please provide a rating between 1 and 5', 400));
    }

    const productRef = db.collection('products').doc(req.params.id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    const product = Product.fromFirestore(productSnap.id, productSnap.data());

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(review => review.userId === userId);
    if (existingReview) {
        return next(new ErrorResponse('You have already reviewed this product', 400));
    }

    const newReview = {
        userId,
        userName,
        rating: parseInt(rating),
        comment: comment || '',
        images: images || [],
        createdAt: new Date().toISOString(),
        helpful: 0
    };

    product.addReview(newReview);

    await productRef.update({
        reviews: product.reviews,
        rating: product.rating,
        reviewCount: product.reviewCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: newReview
    });
});

// @desc    Add customer image to product
// @route   POST /api/products/:id/customer-images
// @access  Private
exports.addCustomerImage = asyncHandler(async (req, res, next) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return next(new ErrorResponse('Image URL is required', 400));
    }

    const productRef = db.collection('products').doc(req.params.id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
        return next(new ErrorResponse('Product not found', 404));
    }

    const product = Product.fromFirestore(productSnap.id, productSnap.data());
    product.addCustomerImage(imageUrl);

    await productRef.update({
        customerImages: product.customerImages,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
        success: true,
        message: 'Customer image added successfully',
        data: { imageUrl }
    });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
    const snapshot = await db.collection('products')
        .where('isFeatured', '==', true)
        .where('status', '==', 'active')
        .limit(8)
        .get();

    const products = [];
    snapshot.forEach(doc => {
        products.push(Product.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivals = asyncHandler(async (req, res, next) => {
    const snapshot = await db.collection('products')
        .where('isNewArrival', '==', true)
        .where('status', '==', 'active')
        .orderBy('createdAt', 'desc')
        .limit(12)
        .get();

    const products = [];
    snapshot.forEach(doc => {
        products.push(Product.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc    Get products by collection
// @route   GET /api/products/collection/:collectionName
// @access  Public
exports.getProductsByCollection = asyncHandler(async (req, res, next) => {
    const snapshot = await db.collection('products')
        .where('collection', '==', req.params.collectionName)
        .where('status', '==', 'active')
        .orderBy('createdAt', 'desc')
        .get();

    const products = [];
    snapshot.forEach(doc => {
        products.push(Product.fromFirestore(doc.id, doc.data()));
    });

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});