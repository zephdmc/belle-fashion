// server/routes/searchRoutes.js
const express = require('express');
const { 
    searchProducts, 
    getSuggestions,
    advancedSearch 
} = require('../controllers/searchController');

const router = express.Router();

// GET /api/search/suggestions?q=query
router.get('/suggestions', getSuggestions);

// GET /api/search?q=query&category=dresses&size=M&color=red&minPrice=50&maxPrice=200&occasion=wedding&style=vintage&sort=price_asc&page=1&limit=12
router.get('/', searchProducts);

// GET /api/search/advanced?categories[]=dresses&categories[]=tops&sizes[]=M&sizes[]=L&colors[]=red&colors[]=blue&occasions[]=wedding&styles[]=vintage&minPrice=50&maxPrice=200&material=silk&fitType=slim&isNew=true&isFeatured=true&isOnSale=true&sort=newest&page=1&limit=12
router.get('/advanced', advancedSearch);

// GET /api/search/categories - Get all available categories for search
router.get('/categories', async (req, res) => {
    try {
        // This would typically come from your database
        const categories = [
            { name: 'Dresses', count: 45, image: '/categories/dresses.jpg' },
            { name: 'Tops', count: 32, image: '/categories/tops.jpg' },
            { name: 'Bottoms', count: 28, image: '/categories/bottoms.jpg' },
            { name: 'Outerwear', count: 15, image: '/categories/outerwear.jpg' },
            { name: 'Accessories', count: 22, image: '/categories/accessories.jpg' },
            { name: 'Suits', count: 18, image: '/categories/suits.jpg' },
            { name: 'Gowns', count: 12, image: '/categories/gowns.jpg' }
        ];
        
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
});

// GET /api/search/filters - Get all available filters
router.get('/filters', async (req, res) => {
    try {
        const filters = {
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Red', 'Blue', 'Black', 'White', 'Green', 'Pink', 'Purple', 'Yellow', 'Orange', 'Brown', 'Gray', 'Multi'],
            occasions: ['Casual', 'Formal', 'Wedding', 'Party', 'Business', 'Beach', 'Evening', 'Cocktail'],
            styles: ['Vintage', 'Modern', 'Bohemian', 'Classic', 'Trendy', 'Elegant', 'Minimalist', 'Romantic'],
            materials: ['Cotton', 'Silk', 'Linen', 'Wool', 'Polyester', 'Denim', 'Velvet', 'Chiffon'],
            fitTypes: ['Slim', 'Regular', 'Oversized', 'Relaxed', 'Tailored'],
            priceRanges: [
                { label: 'Under $50', min: 0, max: 50 },
                { label: '$50 - $100', min: 50, max: 100 },
                { label: '$100 - $200', min: 100, max: 200 },
                { label: '$200+', min: 200, max: 1000 }
            ]
        };
        
        res.status(200).json({
            success: true,
            data: filters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching filters'
        });
    }
});

// GET /api/search/trending - Get trending search terms
router.get('/trending', async (req, res) => {
    try {
        const trendingSearches = [
            { term: 'Summer Dresses', count: 156 },
            { term: 'Wedding Guest', count: 89 },
            { term: 'Linen Pants', count: 76 },
            { term: 'Evening Gowns', count: 64 },
            { term: 'Bohemian Style', count: 58 },
            { term: 'Office Wear', count: 45 },
            { term: 'Beach Coverups', count: 42 }
        ];
        
        res.status(200).json({
            success: true,
            data: trendingSearches
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching trending searches'
        });
    }
});

// GET /api/search/collections - Get all collections
router.get('/collections', async (req, res) => {
    try {
        const collections = [
            { 
                name: 'Summer Collection', 
                description: 'Light and breezy styles for warm weather',
                image: '/collections/summer.jpg',
                productCount: 34
            },
            { 
                name: 'Winter Collection', 
                description: 'Cozy and warm outfits for cold days',
                image: '/collections/winter.jpg',
                productCount: 28
            },
            { 
                name: 'Wedding Collection', 
                description: 'Elegant dresses for special occasions',
                image: '/collections/wedding.jpg',
                productCount: 22
            },
            { 
                name: 'Office Collection', 
                description: 'Professional and stylish workwear',
                image: '/collections/office.jpg',
                productCount: 18
            }
        ];
        
        res.status(200).json({
            success: true,
            data: collections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching collections'
        });
    }
});

module.exports = router;