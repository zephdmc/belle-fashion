import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../../services/productServic';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiArrowLeft, 
    FiUpload, 
    FiX, 
    FiPlus, 
    FiTag, 
    FiDollarSign, 
    FiPackage,
    FiEdit3,
    FiScissors,
    FiHeart,
    FiSave,
    FiTrash2,
    FiCheckCircle,
    FiAlertCircle,
    FiRuler,
    FiDroplet,
    FiTruck
} from 'react-icons/fi';

const FASHION_CATEGORIES = [
    'Dresses',
    'Tops',
    'Bottoms',
    'Outerwear',
    'Suits',
    'Traditional Wear',
    'Accessories',
    'Shoes'
];

const SUBCATEGORIES = {
    'Dresses': ['Casual Dresses', 'Evening Gowns', 'Cocktail Dresses', 'Wedding Dresses', 'Summer Dresses'],
    'Tops': ['Blouses', 'T-shirts', 'Shirts', 'Crop Tops', 'Tank Tops'],
    'Bottoms': ['Pants', 'Skirts', 'Shorts', 'Jeans', 'Leggings'],
    'Outerwear': ['Jackets', 'Coats', 'Blazers', 'Cardigans'],
    'Suits': ['Business Suits', 'Evening Suits', 'Traditional Suits'],
    'Traditional Wear': ['Ankara', 'Lace', 'Aso Oke', 'Kente'],
    'Accessories': ['Bags', 'Jewelry', 'Belts', 'Scarves'],
    'Shoes': ['Heels', 'Flats', 'Sandals', 'Boots']
};

const OCCASIONS = [
    'Casual',
    'Formal',
    'Wedding',
    'Party',
    'Corporate',
    'Traditional',
    'Beach',
    'Vacation'
];

const STYLE_TAGS = [
    'Vintage',
    'Modern',
    'Bohemian',
    'Classic',
    'Minimalist',
    'Romantic',
    'Edgy',
    'Elegant'
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Gray', 'Multi-color'];

const FABRIC_TYPES = [
    'Cotton', 'Linen', 'Silk', 'Satin', 'Velvet', 'Wool', 'Chiffon', 'Denim', 
    'Jersey', 'Crepe', 'Organza', 'Tulle', 'Lace', 'Polyester', 'Rayon'
];

export default function EditProductPage() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        // Basic Information
        name: '',
        price: '',
        originalPrice: '',
        description: '',
        category: '',
        subcategory: '',
        collection: '',
        
        // Inventory & Sizing
        countInStock: '',
        sizes: [],
        colors: [],
        
        // Product Details
        material: '',
        careInstructions: '',
        brand: 'Zeph Fashion',
        designer: '',
        
        // Fashion Attributes
        occasion: [],
        styleTags: [],
        features: [],
        
        // Fit & Style
        fitType: '',
        length: '',
        neckline: '',
        sleeveType: '',
        
        // Shipping & Production
        isReadyToWear: true,
        isCustomizable: false,
        productionTime: '',
        deliveryEstimate: '',
        
        // Marketing
        tags: [],
        isFeatured: false,
        isNewArrival: false,
        isBestseller: false,
        status: 'active',
        
        // Images
        images: [],
        
        // Pricing
        discountPercentage: '',
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [tagInput, setTagInput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                const product = response.data;
                
                setFormData({
                    name: product.name || '',
                    price: product.price || '',
                    originalPrice: product.originalPrice || product.price || '',
                    description: product.description || '',
                    category: product.category || '',
                    subcategory: product.subcategory || '',
                    collection: product.collection || '',
                    countInStock: product.countInStock || '',
                    sizes: product.sizes || [],
                    colors: product.colors || [],
                    material: product.material || '',
                    careInstructions: product.careInstructions || '',
                    brand: product.brand || 'Zeph Fashion',
                    designer: product.designer || '',
                    occasion: product.occasion || [],
                    styleTags: product.styleTags || [],
                    features: product.features || [],
                    fitType: product.fitType || '',
                    length: product.length || '',
                    neckline: product.neckline || '',
                    sleeveType: product.sleeveType || '',
                    isReadyToWear: product.isReadyToWear !== false,
                    isCustomizable: product.isCustomizable || false,
                    productionTime: product.productionTime || '',
                    deliveryEstimate: product.deliveryEstimate || '',
                    tags: product.tags || [],
                    isFeatured: product.isFeatured || false,
                    isNewArrival: product.isNewArrival || false,
                    isBestseller: product.isBestseller || false,
                    status: product.status || 'active',
                    images: product.images || [],
                    discountPercentage: product.discountPercentage || '',
                });
                
            } catch (err) {
                setError('Failed to load product details');
            } finally {
                setFetching(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isNaN(formData.price) || isNaN(formData.countInStock)) {
                throw new Error('Price and stock must be valid numbers');
            }

            if (formData.images.length === 0) {
                throw new Error('Please upload at least one product image');
            }

            const productToUpdate = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: parseFloat(formData.originalPrice || formData.price),
                countInStock: parseInt(formData.countInStock),
                discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
                sizes: Array.isArray(formData.sizes) ? formData.sizes : [],
                colors: Array.isArray(formData.colors) ? formData.colors : [],
                occasion: Array.isArray(formData.occasion) ? formData.occasion : [],
                styleTags: Array.isArray(formData.styleTags) ? formData.styleTags : [],
                features: Array.isArray(formData.features) ? formData.features : [],
                tags: Array.isArray(formData.tags) ? formData.tags : [],
            };

            const response = await updateProduct(id, productToUpdate);
            
            if (response.success) {
                setSuccess(response.message || 'Fashion item updated successfully!');
                setTimeout(() => navigate('/admin/products'), 1500);
            } else {
                throw new Error(response.message || 'Update failed on server');
            }

        } catch (err) {
            const errorMessage = err.response?.message ||
                err.message ||
                'Failed to update fashion item';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field, value, isChecked) => {
        setFormData(prev => {
            const currentArray = prev[field] || [];
            let newArray;
            
            if (isChecked) {
                newArray = [...currentArray, value];
            } else {
                newArray = currentArray.filter(item => item !== value);
            }
            
            return { ...prev, [field]: newArray };
        });
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const removeFeature = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, index) => index !== indexToRemove)
        }));
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        try {
            setLoading(true);
            const newImageUrls = [];

            for (const file of files) {
                const filename = `products/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
                const storageRef = ref(storage, filename);
                
                const snapshot = await uploadBytes(storageRef, file, {
                    contentType: file.type,
                    customMetadata: {
                        uploadedBy: auth.currentUser?.uid || 'admin'
                    }
                });
                
                const downloadURL = await getDownloadURL(snapshot.ref);
                newImageUrls.push(downloadURL);
            }

            setFormData(prev => ({ 
                ...prev, 
                images: [...prev.images, ...newImageUrls] 
            }));
            
        } catch (err) {
            console.error("Upload error:", err);
            setError('Image upload failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeImage = async (indexToRemove) => {
        try {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, index) => index !== indexToRemove)
            }));
        } catch (err) {
            console.error("Error removing image:", err);
            setError('Error removing image');
        }
    };

    const getSubcategories = () => {
        return SUBCATEGORIES[formData.category] || [];
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading fashion item details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-blue-600 hover:text-blue-700 font-semibold mr-6 group transition-colors duration-200"
                        >
                            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Products
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Fashion Item</h1>
                            <p className="text-gray-600">Update product details and inventory</p>
                        </div>
                    </div>
                </motion.div>

                {/* Status Messages */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 shadow-sm"
                        >
                            <div className="flex items-center">
                                <FiAlertCircle className="text-red-500 text-xl mr-3" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-4 mb-6 shadow-sm"
                        >
                            <div className="flex items-center">
                                <FiCheckCircle className="text-green-500 text-xl mr-3" />
                                <p className="text-green-700 font-medium">{success}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Information */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <FiEdit3 className="mr-3 text-blue-500" />
                                Basic Information
                            </h2>
                        </div>

                        {/* Product Name */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g. Elegant Evening Gown"
                            />
                        </div>

                        {/* Category & Subcategory */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Category *
                            </label>
                            <div className="relative">
                                <FiTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                                >
                                    <option value="">Select a category</option>
                                    {FASHION_CATEGORIES.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Subcategory
                            </label>
                            <select
                                name="subcategory"
                                value={formData.subcategory}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                                disabled={!formData.category}
                            >
                                <option value="">Select subcategory</option>
                                {getSubcategories().map(subcategory => (
                                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                                ))}
                            </select>
                        </div>

                        {/* Collection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Collection
                            </label>
                            <input
                                type="text"
                                name="collection"
                                value={formData.collection}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g. Summer Collection 2024"
                            />
                        </div>

                        {/* Brand & Designer */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Brand
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g. Zeph Fashion"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Designer
                            </label>
                            <input
                                type="text"
                                name="designer"
                                value={formData.designer}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g. Jane Smith"
                            />
                        </div>

                        {/* Price Section */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Price (₦) *
                            </label>
                            <div className="relative">
                                <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Original Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Original Price (₦)
                            </label>
                            <div className="relative">
                                <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="originalPrice"
                                    min="0"
                                    step="0.01"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Discount Percentage */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Discount Percentage (%)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                                <input
                                    type="number"
                                    name="discountPercentage"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.discountPercentage}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                name="countInStock"
                                min="0"
                                value={formData.countInStock}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g. 50"
                            />
                        </div>

                        {/* Sizes */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <FiRuler className="mr-2 text-blue-500" />
                                Available Sizes *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                {SIZES.map(size => (
                                    <motion.label
                                        key={size}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.sizes.includes(size)}
                                            onChange={(e) => handleArrayChange('sizes', size, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">{size}</span>
                                    </motion.label>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <FiDroplet className="mr-2 text-blue-500" />
                                Available Colors *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {COLORS.map(color => (
                                    <motion.label
                                        key={color}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.colors.includes(color)}
                                            onChange={(e) => handleArrayChange('colors', color, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">{color}</span>
                                    </motion.label>
                                ))}
                            </div>
                        </div>

                        {/* Material & Care */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Material/Fabric *
                            </label>
                            <select
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                            >
                                <option value="">Select material</option>
                                {FABRIC_TYPES.map(fabric => (
                                    <option key={fabric} value={fabric}>{fabric}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Care Instructions
                            </label>
                            <input
                                type="text"
                                name="careInstructions"
                                value={formData.careInstructions}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g. Machine wash cold, tumble dry low"
                            />
                        </div>

                        {/* Fit & Style */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Fit Type
                            </label>
                            <select
                                name="fitType"
                                value={formData.fitType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                            >
                                <option value="">Select fit</option>
                                <option value="Slim">Slim</option>
                                <option value="Regular">Regular</option>
                                <option value="Relaxed">Relaxed</option>
                                <option value="Oversized">Oversized</option>
                                <option value="Tailored">Tailored</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Length
                            </label>
                            <select
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                            >
                                <option value="">Select length</option>
                                <option value="Mini">Mini</option>
                                <option value="Knee-length">Knee-length</option>
                                <option value="Midi">Midi</option>
                                <option value="Maxi">Maxi</option>
                                <option value="Ankle">Ankle</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Neckline
                            </label>
                            <select
                                name="neckline"
                                value={formData.neckline}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                            >
                                <option value="">Select neckline</option>
                                <option value="Round">Round</option>
                                <option value="V-neck">V-neck</option>
                                <option value="Square">Square</option>
                                <option value="Off-shoulder">Off-shoulder</option>
                                <option value="High-neck">High-neck</option>
                                <option value="Sweetheart">Sweetheart</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Sleeve Type
                            </label>
                            <select
                                name="sleeveType"
                                value={formData.sleeveType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                            >
                                <option value="">Select sleeve</option>
                                <option value="Sleeveless">Sleeveless</option>
                                <option value="Short">Short</option>
                                <option value="Three-quarter">Three-quarter</option>
                                <option value="Long">Long</option>
                                <option value="Puff">Puff</option>
                                <option value="Bell">Bell</option>
                            </select>
                        </div>

                        {/* Occasions */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Suitable Occasions
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {OCCASIONS.map(occasion => (
                                    <motion.label
                                        key={occasion}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.occasion.includes(occasion)}
                                            onChange={(e) => handleArrayChange('occasion', occasion, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">{occasion}</span>
                                    </motion.label>
                                ))}
                            </div>
                        </div>

                        {/* Style Tags */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Style Tags
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {STYLE_TAGS.map(tag => (
                                    <motion.label
                                        key={tag}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.styleTags.includes(tag)}
                                            onChange={(e) => handleArrayChange('styleTags', tag, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">{tag}</span>
                                    </motion.label>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Features
                            </label>
                            <div className="flex gap-3 mb-4">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    placeholder="Add a feature (e.g., Pockets, Adjustable straps)"
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={addFeature}
                                    className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold"
                                >
                                    <FiPlus className="inline mr-2" />
                                    Add
                                </motion.button>
                            </div>
                            
                            {formData.features.length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Features:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.features.map((feature, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 flex items-center"
                                            >
                                                {feature}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(index)}
                                                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Tags */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Additional Tags
                            </label>
                            <div className="flex gap-3 mb-4">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Add a tag for search optimization"
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={addTag}
                                    className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold"
                                >
                                    <FiPlus className="inline mr-2" />
                                    Add
                                </motion.button>
                            </div>
                            
                            {formData.tags.length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 flex items-center"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(index)}
                                                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Production & Delivery */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Production Time
                            </label>
                            <input
                                type="text"
                                name="productionTime"
                                value={formData.productionTime}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g. Ready to ship, 2-3 weeks"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Delivery Estimate
                            </label>
                            <input
                                type="text"
                                name="deliveryEstimate"
                                value={formData.deliveryEstimate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g. 3-5 business days"
                            />
                        </div>

                        {/* Product Type Toggles */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <label className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isReadyToWear"
                                        checked={formData.isReadyToWear}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="ml-3">
                                        <span className="text-sm font-medium text-gray-900">Ready-to-Wear</span>
                                        <p className="text-xs text-gray-500">Item is ready for immediate purchase</p>
                                    </div>
                                </label>

                                <label className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isCustomizable"
                                        checked={formData.isCustomizable}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="ml-3">
                                        <span className="text-sm font-medium text-gray-900">Customizable</span>
                                        <p className="text-xs text-gray-500">Can be customized by customers</p>
                                    </div>
                                </label>

                                <label className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="ml-3">
                                        <span className="text-sm font-medium text-gray-900">Featured</span>
                                        <p className="text-xs text-gray-500">Show on featured section</p>
                                    </div>
                                </label>

                                <label className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isNewArrival"
                                        checked={formData.isNewArrival}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="ml-3">
                                        <span className="text-sm font-medium text-gray-900">New Arrival</span>
                                        <p className="text-xs text-gray-500">Mark as new product</p>
                                    </div>
                                </label>

                                <label className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isBestseller"
                                        checked={formData.isBestseller}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="ml-3">
                                        <span className="text-sm font-medium text-gray-900">Bestseller</span>
                                        <p className="text-xs text-gray-500">Mark as bestseller</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Product Images *
                            </label>
                            
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {formData.images.map((image, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative group"
                                        >
                                            <img
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-200"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                            >
                                                <FiX size={14} />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            <label className="cursor-pointer inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold">
                                <FiUpload className="mr-3" />
                                Upload Images
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="sr-only"
                                    multiple
                                    required
                                />
                            </label>
                            <p className="text-sm text-gray-500 mt-2">Select multiple images to upload (recommended: front, back, side views)</p>
                        </div>

                        {/* Description */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                placeholder="Describe the fashion item, its features, styling tips, and unique selling points..."
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-8 border-t border-gray-200"
                    >
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Updating Fashion Item...
                                </>
                            ) : (
                                <>
                                    <FiSave className="mr-3" />
                                    Update Fashion Item
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </motion.form>
            </div>
        </div>
    );
}
