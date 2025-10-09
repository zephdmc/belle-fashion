import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getProducts } from '../services/productService';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [occasions, setOccasions] = useState([]);
    const [styleTags, setStyleTags] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            const response = await getProducts(filters);
            setProducts(response.data || response.products || response);

            // Extract unique categories
            const uniqueCategories = [...new Set(
                response.data.map(product => product.category).filter(Boolean)
            )].sort();
            setCategories(uniqueCategories);

            // Extract unique subcategories
            const allSubcategories = response.data.flatMap(product => 
                product.subcategory ? [product.subcategory] : []
            );
            const uniqueSubcategories = [...new Set(allSubcategories)].filter(Boolean).sort();
            setSubcategories(uniqueSubcategories);

            // Extract unique occasions
            const allOccasions = response.data.flatMap(product => 
                product.occasion || []
            );
            const uniqueOccasions = [...new Set(allOccasions)].filter(Boolean).sort();
            setOccasions(uniqueOccasions);

            // Extract unique style tags
            const allStyleTags = response.data.flatMap(product => 
                product.styleTags || []
            );
            const uniqueStyleTags = [...new Set(allStyleTags)].filter(Boolean).sort();
            setStyleTags(uniqueStyleTags);

            // Extract unique sizes
            const allSizes = response.data.flatMap(product => 
                product.sizes || []
            );
            const uniqueSizes = [...new Set(allSizes)].filter(Boolean).sort((a, b) => {
                const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
                return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
            });
            setSizes(uniqueSizes);

            // Extract unique colors
            const allColors = response.data.flatMap(product => 
                product.colors || []
            );
            const uniqueColors = [...new Set(allColors)].filter(Boolean).sort();
            setColors(uniqueColors);

            // Extract unique materials
            const allMaterials = response.data.map(product => product.material).filter(Boolean);
            const uniqueMaterials = [...new Set(allMaterials)].filter(Boolean).sort();
            setMaterials(uniqueMaterials);

        } catch (err) {
            setError(err.message || 'Failed to load fashion items');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const getProductById = (id) => {
        return products.find(product => product.id === id);
    };

    const getProductsByCategory = (category) => {
        return products.filter(product => product.category === category);
    };

    const getProductsBySubcategory = (subcategory) => {
        return products.filter(product => product.subcategory === subcategory);
    };

    const getProductsByOccasion = (occasion) => {
        return products.filter(product => 
            product.occasion && product.occasion.includes(occasion)
        );
    };

    const getProductsByStyleTag = (tag) => {
        return products.filter(product => 
            product.styleTags && product.styleTags.includes(tag)
        );
    };

    const getProductsBySize = (size) => {
        return products.filter(product => 
            product.sizes && product.sizes.includes(size)
        );
    };

    const getProductsByColor = (color) => {
        return products.filter(product => 
            product.colors && product.colors.includes(color)
        );
    };

    const getProductsByMaterial = (material) => {
        return products.filter(product => product.material === material);
    };

    const getCustomizableProducts = () => {
        return products.filter(product => product.isCustomizable);
    };

    const getReadyToWearProducts = () => {
        return products.filter(product => product.isReadyToWear !== false);
    };

    const getFeaturedProducts = () => {
        return products.filter(product => 
            product.isFeatured || product.isBestseller || product.isNewArrival
        ).slice(0, 8);
    };

    const getNewArrivals = () => {
        return products.filter(product => product.isNewArrival)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6);
    };

    const getBestsellers = () => {
        return products.filter(product => product.isBestseller)
            .slice(0, 6);
    };

    const getProductsWithDiscount = () => {
        return products.filter(product => 
            product.discountPercentage && product.discountPercentage > 0
        ).slice(0, 6);
    };

    const getProductsByCollection = (collection) => {
        return products.filter(product => product.collection === collection);
    };

    const getProductsByDesigner = (designer) => {
        return products.filter(product => product.designer === designer);
    };

    const getProductsByPriceRange = (minPrice, maxPrice) => {
        return products.filter(product => {
            const price = product.discountPercentage > 0 ? product.price : product.price;
            return price >= minPrice && price <= maxPrice;
        });
    };

    const getRelatedProducts = (currentProduct, limit = 4) => {
        return products
            .filter(product => 
                product.id !== currentProduct.id && 
                (product.category === currentProduct.category || 
                 product.occasion?.some(occ => currentProduct.occasion?.includes(occ)) ||
                 product.styleTags?.some(tag => currentProduct.styleTags?.includes(tag)))
            )
            .slice(0, limit);
    };

    const getProductsByAvailability = (inStockOnly = true) => {
        if (inStockOnly) {
            return products.filter(product => 
                product.isCustomizable || product.countInStock > 0
            );
        }
        return products;
    };

    const refreshProducts = () => {
        fetchProducts();
    };

    const searchProducts = (query) => {
        if (!query) return products;
        
        const searchTerm = query.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.designer?.toLowerCase().includes(searchTerm) ||
            product.brand?.toLowerCase().includes(searchTerm) ||
            product.styleTags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            product.occasion?.some(occ => occ.toLowerCase().includes(searchTerm)) ||
            product.material?.toLowerCase().includes(searchTerm)
        );
    };

    const getFilteredProducts = (filters = {}) => {
        let filtered = [...products];

        // Apply category filter
        if (filters.category) {
            filtered = filtered.filter(product => product.category === filters.category);
        }

        // Apply subcategory filter
        if (filters.subcategory) {
            filtered = filtered.filter(product => product.subcategory === filters.subcategory);
        }

        // Apply search filter
        if (filters.search) {
            filtered = searchProducts(filters.search);
        }

        // Apply occasion filter
        if (filters.occasion) {
            filtered = filtered.filter(product => 
                product.occasion && product.occasion.includes(filters.occasion)
            );
        }

        // Apply style filter
        if (filters.style) {
            filtered = filtered.filter(product => 
                product.styleTags && product.styleTags.includes(filters.style)
            );
        }

        // Apply size filter
        if (filters.size) {
            filtered = filtered.filter(product => 
                product.sizes && product.sizes.includes(filters.size)
            );
        }

        // Apply color filter
        if (filters.color) {
            filtered = filtered.filter(product => 
                product.colors && product.colors.includes(filters.color)
            );
        }

        // Apply product type filter
        if (filters.productType === 'customizable') {
            filtered = filtered.filter(product => product.isCustomizable);
        } else if (filters.productType === 'ready-to-wear') {
            filtered = filtered.filter(product => product.isReadyToWear !== false);
        }

        // Apply featured filter
        if (filters.isFeatured === 'true') {
            filtered = filtered.filter(product => product.isFeatured);
        }

        // Apply new arrival filter
        if (filters.isNewArrival === 'true') {
            filtered = filtered.filter(product => product.isNewArrival);
        }

        // Apply bestseller filter
        if (filters.isBestseller === 'true') {
            filtered = filtered.filter(product => product.isBestseller);
        }

        // Apply price range filter
        if (filters.minPrice || filters.maxPrice) {
            const min = parseFloat(filters.minPrice) || 0;
            const max = parseFloat(filters.maxPrice) || Number.MAX_SAFE_INTEGER;
            filtered = filtered.filter(product => {
                const price = product.discountPercentage > 0 ? product.price : product.price;
                return price >= min && price <= max;
            });
        }

        return filtered;
    };

    const value = {
        // State
        products,
        categories,
        subcategories,
        occasions,
        styleTags,
        sizes,
        colors,
        materials,
        loading,
        error,

        // Basic product getters
        getProductById,
        getProductsByCategory,
        getProductsBySubcategory,
        getProductsByOccasion,
        getProductsByStyleTag,
        getProductsBySize,
        getProductsByColor,
        getProductsByMaterial,
        getProductsByCollection,
        getProductsByDesigner,
        getProductsByPriceRange,

        // Special collections
        getCustomizableProducts,
        getReadyToWearProducts,
        getFeaturedProducts,
        getNewArrivals,
        getBestsellers,
        getProductsWithDiscount,
        getRelatedProducts,
        getProductsByAvailability,

        // Search and filtering
        searchProducts,
        getFilteredProducts,

        // Actions
        refreshProducts,
        fetchProducts
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}