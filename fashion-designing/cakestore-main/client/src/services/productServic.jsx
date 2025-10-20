import API from './api';
import { auth } from '../firebase/config';

export const getProducts = async (params = {}) => {
    try {
        // Transform fashion-specific filters for backend
        const fashionParams = {
            ...params,
            // Handle array parameters
            sizes: params.sizes ? (Array.isArray(params.sizes) ? params.sizes : [params.sizes]) : undefined,
            colors: params.colors ? (Array.isArray(params.colors) ? params.colors : [params.colors]) : undefined,
            occasion: params.occasion ? (Array.isArray(params.occasion) ? params.occasion : [params.occasion]) : undefined,
            styleTags: params.styleTags ? (Array.isArray(params.styleTags) ? params.styleTags : [params.styleTags]) : undefined,
            // Handle boolean filters
            isFeatured: params.isFeatured === 'true' ? true : params.isFeatured === 'false' ? false : undefined,
            isNewArrival: params.isNewArrival === 'true' ? true : params.isNewArrival === 'false' ? false : undefined,
            isBestseller: params.isBestseller === 'true' ? true : params.isBestseller === 'false' ? false : undefined,
            // Handle product type
            productType: params.productType === 'customizable' ? 'customizable' : 
                        params.productType === 'ready-to-wear' ? 'ready-to-wear' : undefined
        };

        // Remove undefined parameters
        Object.keys(fashionParams).forEach(key => {
            if (fashionParams[key] === undefined || fashionParams[key] === '') {
                delete fashionParams[key];
            }
        });

        const response = await API.get('api/products', { params: fashionParams });
        
        // Check if response is HTML (error page)
        if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE')) {
            throw new Error('Server returned HTML instead of JSON. Check API endpoint.');
        }
        
        return response;
    } catch (error) {
        console.error('Get Products Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        
        // Check if error response is HTML
        if (error.response && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
            throw new Error('API endpoint returned HTML. Please check the server configuration.');
        }
        
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await API.get(`api/products/${id}`);
        return response;
    } catch (error) {
        console.error('Get Product By ID Error:', error.response?.data || error.message);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        // Transform fashion product data for backend
        const fashionProductData = {
            ...productData,
            // Ensure arrays are properly formatted
            sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
            colors: Array.isArray(productData.colors) ? productData.colors : [],
            occasion: Array.isArray(productData.occasion) ? productData.occasion : [],
            styleTags: Array.isArray(productData.styleTags) ? productData.styleTags : [],
            features: Array.isArray(productData.features) ? productData.features : [],
            tags: Array.isArray(productData.tags) ? productData.tags : [],
            // Ensure numbers are properly formatted
            price: parseFloat(productData.price) || 0,
            originalPrice: parseFloat(productData.originalPrice) || parseFloat(productData.price) || 0,
            countInStock: parseInt(productData.countInStock) || 0,
            discountPercentage: parseFloat(productData.discountPercentage) || 0,
            // Ensure boolean fields
            isReadyToWear: productData.isReadyToWear !== false,
            isCustomizable: !!productData.isCustomizable,
            isFeatured: !!productData.isFeatured,
            isNewArrival: !!productData.isNewArrival,
            isBestseller: !!productData.isBestseller,
            // Default status
            status: productData.status || 'active'
        };

        const response = await API.post('/api/products', fashionProductData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        console.error('Create Product Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message);
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();

        // Transform fashion product data for update
        const fashionProductData = {
            ...productData,
            // Ensure arrays are properly formatted
            sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
            colors: Array.isArray(productData.colors) ? productData.colors : [],
            occasion: Array.isArray(productData.occasion) ? productData.occasion : [],
            styleTags: Array.isArray(productData.styleTags) ? productData.styleTags : [],
            features: Array.isArray(productData.features) ? productData.features : [],
            tags: Array.isArray(productData.tags) ? productData.tags : [],
            // Ensure numbers are properly formatted
            price: parseFloat(productData.price) || 0,
            originalPrice: parseFloat(productData.originalPrice) || parseFloat(productData.price) || 0,
            countInStock: parseInt(productData.countInStock) || 0,
            discountPercentage: parseFloat(productData.discountPercentage) || 0,
            // Ensure boolean fields
            isReadyToWear: productData.isReadyToWear !== false,
            isCustomizable: !!productData.isCustomizable,
            isFeatured: !!productData.isFeatured,
            isNewArrival: !!productData.isNewArrival,
            isBestseller: !!productData.isBestseller
        };

        const response = await API.put(`api/products/${id}`, fashionProductData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response;

    } catch (error) {
        console.error('Update Product Error:', {
            config: error.config,
            response: error.response?.data,
            status: error.response?.status
        });
        
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message);
    }
};

export const deleteProduct = async (id) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();

        const response = await API.delete(`api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response;
    } catch (error) {
        console.error('Delete Product Error:', error.response?.data || error.message);
        throw error;
    }
};

// Fashion-specific product services
export const getFeaturedProducts = async () => {
    try {
        const response = await API.get('api/products', {
            params: {
                isFeatured: true,
                limit: 8
            }
        });
        return response;
    } catch (error) {
        console.error('Get Featured Products Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getNewArrivals = async () => {
    try {
        const response = await API.get('api/products', {
            params: {
                isNewArrival: true,
                limit: 6,
                sort: 'createdAt_desc'
            }
        });
        return response;
    } catch (error) {
        console.error('Get New Arrivals Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getBestsellers = async () => {
    try {
        const response = await API.get('api/products', {
            params: {
                isBestseller: true,
                limit: 6
            }
        });
        return response;
    } catch (error) {
        console.error('Get Bestsellers Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getProductsByCategory = async (category, limit = 12) => {
    try {
        const response = await API.get('api/products', {
            params: {
                category,
                limit
            }
        });
        return response;
    } catch (error) {
        console.error('Get Products By Category Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getProductsByOccasion = async (occasion, limit = 12) => {
    try {
        const response = await API.get('api/products', {
            params: {
                occasion,
                limit
            }
        });
        return response;
    } catch (error) {
        console.error('Get Products By Occasion Error:', error.response?.data || error.message);
        throw error;
    }
};

export const searchProducts = async (searchTerm, filters = {}) => {
    try {
        const response = await API.get('api/products/search', {
            params: {
                search: searchTerm,
                ...filters
            }
        });
        return response;
    } catch (error) {
        console.error('Search Products Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getRelatedProducts = async (productId, limit = 4) => {
    try {
        const response = await API.get(`api/products/${productId}/related`, {
            params: { limit }
        });
        return response;
    } catch (error) {
        console.error('Get Related Products Error:', error.response?.data || error.message);
        throw error;
    }
};

export const updateProductStock = async (productId, newStock) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();

        const response = await API.patch(`api/products/${productId}/stock`, {
            countInStock: parseInt(newStock) || 0
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response;
    } catch (error) {
        console.error('Update Product Stock Error:', error.response?.data || error.message);
        throw error;
    }
};

export const updateProductStatus = async (productId, status) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();

        const response = await API.patch(`api/products/${productId}/status`, {
            status: status
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response;
    } catch (error) {
        console.error('Update Product Status Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getProductCategories = async () => {
    try {
        const response = await API.get('api/products/categories');
        return response;
    } catch (error) {
        console.error('Get Product Categories Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getProductStats = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();

        const response = await API.get('api/products/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response;
    } catch (error) {
        console.error('Get Product Stats Error:', error.response?.data || error.message);
        throw error;
    }
};
