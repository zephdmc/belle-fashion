const { v4: uuidv4 } = require('uuid');

class Product {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.originalPrice = data.originalPrice || this.price; // For showing discounts
        this.description = data.description || '';
        this.images = data.images || []; // Multiple product images
        this.category = data.category || ''; // e.g., "Dresses", "Tops", "Bottoms", "Accessories"
        this.subcategory = data.subcategory || ''; // e.g., "Casual Dresses", "Evening Gowns"
        this.collection = data.collection || ''; // e.g., "Summer Collection", "Winter Line"
        
        // Inventory & Sizing
        this.countInStock = data.countInStock || 0;
        this.sizes = data.sizes || []; // Array of available sizes: ["XS", "S", "M", "L", "XL"]
        this.sizeChart = data.sizeChart || {}; // Detailed size measurements
        this.colors = data.colors || []; // Available colors: ["Red", "Blue", "Black"]
        this.colorHex = data.colorHex || {}; // Color codes for display
        
        // Product Details
        this.material = data.material || ''; // Fabric composition
        this.careInstructions = data.careInstructions || '';
        this.brand = data.brand || 'Zeph Fashion';
        this.designer = data.designer || '';
        
        // Fashion Attributes
        this.occasion = data.occasion || []; // ["Casual", "Formal", "Wedding", "Party"]
        this.styleTags = data.styleTags || []; // ["Vintage", "Modern", "Bohemian", "Classic"]
        this.features = data.features || []; // ["Adjustable Straps", "Pockets", "Removable Belt"]
        
        // Fit & Style
        this.fitType = data.fitType || ''; // "Slim", "Regular", "Oversized"
        this.length = data.length || ''; // "Mini", "Knee-length", "Maxi"
        this.neckline = data.neckline || ''; // "V-neck", "Round", "Square"
        this.sleeveType = data.sleeveType || ''; // "Short", "Long", "Sleeveless"
        
        // Shipping & Production
        this.isReadyToWear = data.isReadyToWear || true;
        this.isCustomizable = data.isCustomizable || false;
        this.productionTime = data.productionTime || ''; // "Ready to ship", "2-3 weeks"
        this.deliveryEstimate = data.deliveryEstimate || ''; // "3-5 business days"
        
        // Marketing & SEO
        this.sku = data.sku || `ZEPH-${uuidv4().slice(0, 8).toUpperCase()}`;
        this.tags = data.tags || [];
        this.metaDescription = data.metaDescription || '';
        this.seoKeywords = data.seoKeywords || [];
        
        // Reviews & Ratings
        this.rating = data.rating || 0;
        this.reviewCount = data.reviewCount || 0;
        this.reviews = data.reviews || []; // Array of review objects
        
        // Customer Gallery
        this.customerImages = data.customerImages || []; // Photos from customers
        this.stylingTips = data.stylingTips || ''; // How to style this item
        
        // Pricing & Discounts
        this.discountPercentage = data.discountPercentage || 0;
        this.isOnSale = data.isOnSale || false;
        this.saleStartDate = data.saleStartDate || null;
        this.saleEndDate = data.saleEndDate || null;
        
        // Product Status
        this.isFeatured = data.isFeatured || false;
        this.isNewArrival = data.isNewArrival || false;
        this.isBestseller = data.isBestseller || false;
        this.status = data.status || 'active'; // active, inactive, out-of-stock
        
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    toFirestore() {
        return {
            name: this.name,
            price: this.price,
            originalPrice: this.originalPrice,
            description: this.description,
            images: this.images,
            category: this.category,
            subcategory: this.subcategory,
            collection: this.collection,
            
            // Inventory & Sizing
            countInStock: this.countInStock,
            sizes: this.sizes,
            sizeChart: this.sizeChart,
            colors: this.colors,
            colorHex: this.colorHex,
            
            // Product Details
            material: this.material,
            careInstructions: this.careInstructions,
            brand: this.brand,
            designer: this.designer,
            
            // Fashion Attributes
            occasion: this.occasion,
            styleTags: this.styleTags,
            features: this.features,
            
            // Fit & Style
            fitType: this.fitType,
            length: this.length,
            neckline: this.neckline,
            sleeveType: this.sleeveType,
            
            // Shipping & Production
            isReadyToWear: this.isReadyToWear,
            isCustomizable: this.isCustomizable,
            productionTime: this.productionTime,
            deliveryEstimate: this.deliveryEstimate,
            
            // Marketing & SEO
            sku: this.sku,
            tags: this.tags,
            metaDescription: this.metaDescription,
            seoKeywords: this.seoKeywords,
            
            // Reviews & Ratings
            rating: this.rating,
            reviewCount: this.reviewCount,
            reviews: this.reviews,
            
            // Customer Gallery
            customerImages: this.customerImages,
            stylingTips: this.stylingTips,
            
            // Pricing & Discounts
            discountPercentage: this.discountPercentage,
            isOnSale: this.isOnSale,
            saleStartDate: this.saleStartDate,
            saleEndDate: this.saleEndDate,
            
            // Product Status
            isFeatured: this.isFeatured,
            isNewArrival: this.isNewArrival,
            isBestseller: this.isBestseller,
            status: this.status,
            
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromFirestore(id, data) {
        return new Product({
            id,
            ...data
        });
    }

    // Helper methods
    calculateDiscountedPrice() {
        if (this.discountPercentage > 0) {
            this.price = this.originalPrice * (1 - this.discountPercentage / 100);
        }
        return this.price;
    }

    addReview(review) {
        this.reviews.push(review);
        this.updateRating();
        this.updatedAt = new Date().toISOString();
    }

    updateRating() {
        if (this.reviews.length > 0) {
            const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
            this.rating = total / this.reviews.length;
            this.reviewCount = this.reviews.length;
        }
    }

    checkStockForSizeColor(size, color) {
        // Implementation for size/color specific inventory
        return this.countInStock > 0;
    }

    addCustomerImage(imageUrl) {
        this.customerImages.push({
            url: imageUrl,
            uploadedAt: new Date().toISOString()
        });
        this.updatedAt = new Date().toISOString();
    }
}

module.exports = Product;