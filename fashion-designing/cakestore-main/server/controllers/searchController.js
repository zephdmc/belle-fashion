// controllers/searchController.js
const { db } = require('../config/firebaseConfig');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const getSuggestions = asyncHandler(async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchTerm = q.toLowerCase().trim();

        // Search in multiple fields for better suggestions
        const productsRef = db.collection('products');
        
        // Query for name matches
        const nameSnapshot = await productsRef
            .where('name', '>=', searchTerm)
            .where('name', '<=', searchTerm + '\uf8ff')
            .where('status', '==', 'active')
            .limit(8)
            .get();

        // Query for category matches
        const categorySnapshot = await productsRef
            .where('category', '>=', searchTerm)
            .where('category', '<=', searchTerm + '\uf8ff')
            .where('status', '==', 'active')
            .limit(5)
            .get();

        // Query for style tags matches
        const styleSnapshot = await productsRef
            .where('styleTags', 'array-contains', searchTerm)
            .where('status', '==', 'active')
            .limit(5)
            .get();

        // Query for occasion matches
        const occasionSnapshot = await productsRef
            .where('occasion', 'array-contains', searchTerm)
            .where('status', '==', 'active')
            .limit(5)
            .get();

        // Combine results and remove duplicates
        const suggestionsMap = new Map();

        [nameSnapshot, categorySnapshot, styleSnapshot, occasionSnapshot].forEach(snapshot => {
            snapshot.forEach(doc => {
                if (!suggestionsMap.has(doc.id)) {
                    const product = Product.fromFirestore(doc.id, doc.data());
                    suggestionsMap.set(doc.id, {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        images: product.images,
                        category: product.category,
                        type: 'product'
                    });
                }
            });
        });

        // Also get popular search categories based on the query
        const categories = await getMatchingCategories(searchTerm);
        const styles = await getMatchingStyles(searchTerm);
        const occasions = await getMatchingOccasions(searchTerm);

        const suggestions = Array.from(suggestionsMap.values());
        
        // Add category and style suggestions
        if (categories.length > 0) {
            suggestions.unshift(...categories.map(cat => ({
                ...cat,
                type: 'category'
            })));
        }

        if (styles.length > 0) {
            suggestions.unshift(...styles.map(style => ({
                ...style,
                type: 'style'
            })));
        }

        if (occasions.length > 0) {
            suggestions.unshift(...occasions.map(occasion => ({
                ...occasion,
                type: 'occasion'
            })));
        }

        res.status(200).json({
            success: true,
            data: suggestions.slice(0, 10), // Limit to 10 total suggestions
            metadata: {
                categories: categories.length,
                styles: styles.length,
                products: suggestions.filter(s => s.type === 'product').length
            }
        });
    } catch (error) {
        console.error('Error in getSuggestions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching suggestions',
            error: error.message
        });
    }
});

const searchProducts = asyncHandler(async (req, res) => {
    try {
        const { q, category, size, color, minPrice, maxPrice, occasion, style, sort, page = 1, limit = 12 } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchTerm = q.toLowerCase().trim();
        let query = db.collection('products').where('status', '==', 'active');

        // Build complex search query
        const searchQueries = [];

        // Primary search fields
        searchQueries.push(
            query.where('name', '>=', searchTerm)
                .where('name', '<=', searchTerm + '\uf8ff')
                .get()
        );

        searchQueries.push(
            query.where('description', '>=', searchTerm)
                .where('description', '<=', searchTerm + '\uf8ff')
                .get()
        );

        searchQueries.push(
            query.where('category', '>=', searchTerm)
                .where('category', '<=', searchTerm + '\uf8ff')
                .get()
        );

        searchQueries.push(
            query.where('designer', '>=', searchTerm)
                .where('designer', '<=', searchTerm + '\uf8ff')
                .get()
        );

        // Array contains queries
        searchQueries.push(
            query.where('styleTags', 'array-contains', searchTerm).get()
        );

        searchQueries.push(
            query.where('occasion', 'array-contains', searchTerm).get()
        );

        searchQueries.push(
            query.where('tags', 'array-contains', searchTerm).get()
        );

        // Execute all search queries
        const results = await Promise.all(searchQueries);
        
        // Combine and deduplicate results
        const productsMap = new Map();
        results.forEach(snapshot => {
            snapshot.forEach(doc => {
                if (!productsMap.has(doc.id)) {
                    productsMap.set(doc.id, Product.fromFirestore(doc.id, doc.data()));
                }
            });
        });

        let products = Array.from(productsMap.values());

        // Apply filters
        if (category) {
            products = products.filter(product => 
                product.category.toLowerCase().includes(category.toLowerCase()) ||
                product.subcategory?.toLowerCase().includes(category.toLowerCase())
            );
        }

        if (size) {
            products = products.filter(product => 
                product.sizes?.includes(size)
            );
        }

        if (color) {
            products = products.filter(product => 
                product.colors?.includes(color)
            );
        }

        if (occasion) {
            products = products.filter(product => 
                product.occasion?.includes(occasion)
            );
        }

        if (style) {
            products = products.filter(product => 
                product.styleTags?.includes(style)
            );
        }

        // Price filter
        if (minPrice || maxPrice) {
            const min = parseFloat(minPrice) || 0;
            const max = parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER;
            products = products.filter(product => 
                product.price >= min && product.price <= max
            );
        }

        // Sort results
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'newest':
                    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'popular':
                    products.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
                    break;
                case 'name':
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
                    // Default: relevance (keep search order)
                    break;
            }
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Get search analytics (popular categories, styles, etc. from results)
        const searchAnalytics = analyzeSearchResults(products, searchTerm);

        res.status(200).json({
            success: true,
            count: paginatedProducts.length,
            total: products.length,
            page: parseInt(page),
            pages: Math.ceil(products.length / limit),
            data: paginatedProducts,
            analytics: searchAnalytics,
            filters: {
                availableCategories: getUniqueValues(products, 'category'),
                availableSizes: getUniqueValues(products, 'sizes'),
                availableColors: getUniqueValues(products, 'colors'),
                availableOccasions: getUniqueValues(products, 'occasion'),
                availableStyles: getUniqueValues(products, 'styleTags'),
                priceRange: {
                    min: Math.min(...products.map(p => p.price)),
                    max: Math.max(...products.map(p => p.price))
                }
            }
        });
    } catch (error) {
        console.error('Error in searchProducts:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during search',
            error: error.message
        });
    }
});

// @desc    Advanced product search with filters
// @route   GET /api/search/advanced
// @access  Public
const advancedSearch = asyncHandler(async (req, res) => {
    try {
        const { 
            categories, sizes, colors, occasions, styles, materials, 
            minPrice, maxPrice, fitType, isNew, isFeatured, isOnSale,
            sort, page = 1, limit = 12 
        } = req.query;

        let query = db.collection('products').where('status', '==', 'active');

        // Apply filters
        if (categories) {
            const categoryList = Array.isArray(categories) ? categories : [categories];
            query = query.where('category', 'in', categoryList);
        }

        if (sizes) {
            const sizeList = Array.isArray(sizes) ? sizes : [sizes];
            query = query.where('sizes', 'array-contains-any', sizeList);
        }

        if (colors) {
            const colorList = Array.isArray(colors) ? colors : [colors];
            query = query.where('colors', 'array-contains-any', colorList);
        }

        if (occasions) {
            const occasionList = Array.isArray(occasions) ? occasions : [occasions];
            query = query.where('occasion', 'array-contains-any', occasionList);
        }

        if (styles) {
            const styleList = Array.isArray(styles) ? styles : [styles];
            query = query.where('styleTags', 'array-contains-any', styleList);
        }

        if (materials) {
            query = query.where('material', '==', materials);
        }

        if (fitType) {
            query = query.where('fitType', '==', fitType);
        }

        if (isNew === 'true') {
            query = query.where('isNewArrival', '==', true);
        }

        if (isFeatured === 'true') {
            query = query.where('isFeatured', '==', true);
        }

        if (isOnSale === 'true') {
            query = query.where('isOnSale', '==', true);
        }

        // Price range
        if (minPrice || maxPrice) {
            const min = parseFloat(minPrice) || 0;
            const max = parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER;
            query = query.where('price', '>=', min).where('price', '<=', max);
        }

        // Sorting
        if (sort) {
            switch (sort) {
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
                default:
                    query = query.orderBy('createdAt', 'desc');
            }
        } else {
            query = query.orderBy('createdAt', 'desc');
        }

        // Pagination
        const startAt = (page - 1) * limit;
        const snapshot = await query.limit(parseInt(limit)).offset(startAt).get();
        const totalSnapshot = await query.get();
        
        const products = [];
        snapshot.forEach(doc => {
            products.push(Product.fromFirestore(doc.id, doc.data()));
        });

        res.status(200).json({
            success: true,
            count: products.length,
            total: totalSnapshot.size,
            page: parseInt(page),
            pages: Math.ceil(totalSnapshot.size / limit),
            data: products
        });
    } catch (error) {
        console.error('Error in advancedSearch:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during advanced search',
            error: error.message
        });
    }
});

// Helper functions
async function getMatchingCategories(searchTerm) {
    const categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Suits', 'Gowns'];
    return categories
        .filter(cat => cat.toLowerCase().includes(searchTerm))
        .map(cat => ({
            name: cat,
            displayName: `Shop ${cat}`,
            image: `/categories/${cat.toLowerCase()}.jpg`
        }));
}

async function getMatchingStyles(searchTerm) {
    const styles = ['Vintage', 'Modern', 'Bohemian', 'Classic', 'Trendy', 'Elegant', 'Casual'];
    return styles
        .filter(style => style.toLowerCase().includes(searchTerm))
        .map(style => ({
            name: style,
            displayName: `${style} Style`,
            image: `/styles/${style.toLowerCase()}.jpg`
        }));
}

async function getMatchingOccasions(searchTerm) {
    const occasions = ['Wedding', 'Party', 'Casual', 'Formal', 'Business', 'Beach', 'Evening'];
    return occasions
        .filter(occasion => occasion.toLowerCase().includes(searchTerm))
        .map(occasion => ({
            name: occasion,
            displayName: `${occasion} Wear`,
            image: `/occasions/${occasion.toLowerCase()}.jpg`
        }));
}

function analyzeSearchResults(products, searchTerm) {
    const categories = {};
    const styles = {};
    const occasions = {};

    products.forEach(product => {
        // Count categories
        categories[product.category] = (categories[product.category] || 0) + 1;
        
        // Count styles
        product.styleTags?.forEach(style => {
            styles[style] = (styles[style] || 0) + 1;
        });
        
        // Count occasions
        product.occasion?.forEach(occasion => {
            occasions[occasion] = (occasions[occasion] || 0) + 1;
        });
    });

    return {
        popularCategories: Object.entries(categories)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count })),
        popularStyles: Object.entries(styles)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count })),
        popularOccasions: Object.entries(occasions)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }))
    };
}

function getUniqueValues(products, field) {
    const values = new Set();
    products.forEach(product => {
        if (Array.isArray(product[field])) {
            product[field].forEach(value => values.add(value));
        } else if (product[field]) {
            values.add(product[field]);
        }
    });
    return Array.from(values).sort();
}

module.exports = {
    getSuggestions,
    searchProducts,
    advancedSearch
};