import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productServic';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiPlus, 
    FiEdit, 
    FiTrash2, 
    FiPackage, 
    FiDollarSign, 
    FiTag, 
    FiShoppingCart,
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiAlertCircle,
    FiCheckCircle,
    FiStar,
    FiTrendingUp,
    FiScissors,
    FiImage,
    FiGrid,
    FiLayers
} from 'react-icons/fi';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [subcategoryFilter, setSubcategoryFilter] = useState('all');
    const [collectionFilter, setCollectionFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [deletingProduct, setDeletingProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(Array.isArray(response?.data) ? response.data : []);
            } catch (err) {
                setError(err.message || 'Failed to load products');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            setDeletingProduct(productId);
            try {
                await deleteProduct(productId);
                setProducts(prevProducts =>
                    prevProducts.filter(product => product.id !== productId)
                );
                setSuccess('Product deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.message || 'Failed to delete product');
            } finally {
                setDeletingProduct(null);
            }
        }
    };

    const refreshProducts = () => {
        setLoading(true);
        getProducts()
            .then(response => {
                setProducts(Array.isArray(response?.data) ? response.data : []);
            })
            .catch(err => {
                setError(err.message || 'Failed to refresh products');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Get unique values for filters
    const categories = ['all', ...new Set(products.map(product => product.category).filter(Boolean))];
    const subcategories = ['all', ...new Set(products.map(product => product.subcategory).filter(Boolean))];
    const collections = ['all', ...new Set(products.map(product => product.collection).filter(Boolean))];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesSubcategory = subcategoryFilter === 'all' || product.subcategory === subcategoryFilter;
        const matchesCollection = collectionFilter === 'all' || product.collection === collectionFilter;
        
        const matchesStock = stockFilter === 'all' || 
                           (stockFilter === 'in-stock' && product.countInStock > 0) ||
                           (stockFilter === 'out-of-stock' && product.countInStock === 0) ||
                           (stockFilter === 'low-stock' && product.countInStock > 0 && product.countInStock <= 10);

        const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'active' && product.status === 'active') ||
                            (statusFilter === 'inactive' && product.status === 'inactive');

        const matchesType = typeFilter === 'all' ||
                          (typeFilter === 'ready-to-wear' && product.isReadyToWear) ||
                          (typeFilter === 'customizable' && product.isCustomizable);

        return matchesSearch && matchesCategory && matchesSubcategory && matchesCollection && 
               matchesStock && matchesStatus && matchesType;
    });

    // Get product statistics
    const getProductStats = () => {
        const totalProducts = products.length;
        const inStockProducts = products.filter(p => p.countInStock > 0).length;
        const outOfStockProducts = products.filter(p => p.countInStock === 0).length;
        const lowStockProducts = products.filter(p => p.countInStock > 0 && p.countInStock <= 10).length;
        const categoriesCount = new Set(products.map(p => p.category)).size;
        const featuredProducts = products.filter(p => p.isFeatured).length;
        const newArrivals = products.filter(p => p.isNewArrival).length;
        const bestsellers = products.filter(p => p.isBestseller).length;

        return { 
            totalProducts, 
            inStockProducts, 
            outOfStockProducts, 
            lowStockProducts,
            categoriesCount, 
            featuredProducts,
            newArrivals,
            bestsellers
        };
    };

    const stats = getProductStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <Loader />
                            <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fashion Product Management</h1>
                            <p className="text-gray-600">Manage your fashion catalog, inventory, and collections</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
                            <button
                                onClick={refreshProducts}
                                className="flex items-center bg-white text-gray-700 py-3 px-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <FiRefreshCw className="mr-2" />
                                Refresh
                            </button>
                            <Link
                                to="/admin/products/new"
                                className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <FiPlus className="mr-2" />
                                Add New Product
                            </Link>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
                        {[
                            { label: 'Total', value: stats.totalProducts, color: 'bg-gradient-to-r from-gray-500 to-gray-600', icon: FiPackage },
                            { label: 'In Stock', value: stats.inStockProducts, color: 'bg-gradient-to-r from-green-500 to-green-600', icon: FiShoppingCart },
                            { label: 'Low Stock', value: stats.lowStockProducts, color: 'bg-gradient-to-r from-orange-500 to-orange-600', icon: FiAlertCircle },
                            { label: 'Out of Stock', value: stats.outOfStockProducts, color: 'bg-gradient-to-r from-red-500 to-red-600', icon: FiAlertCircle },
                            { label: 'Featured', value: stats.featuredProducts, color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: FiStar },
                            { label: 'New Arrivals', value: stats.newArrivals, color: 'bg-gradient-to-r from-blue-500 to-blue-600', icon: FiTrendingUp },
                            { label: 'Bestsellers', value: stats.bestsellers, color: 'bg-gradient-to-r from-pink-500 to-pink-600', icon: FiTrendingUp },
                            { label: 'Categories', value: stats.categoriesCount, color: 'bg-gradient-to-r from-teal-500 to-teal-600', icon: FiTag }
                        ].map(({ label, value, color, icon: Icon }) => (
                            <motion.div
                                key={label}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl shadow-lg p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{value}</p>
                                        <p className="text-xs text-gray-600 mt-1">{label}</p>
                                    </div>
                                    <div className={`${color} rounded-xl p-2`}>
                                        <Icon className="text-white text-lg" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center">
                                <FiFilter className="text-purple-600 mr-3 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 flex-1">
                                {/* Search */}
                                <div className="relative lg:col-span-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search products, SKU..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div className="relative">
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.filter(cat => cat !== 'all').map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiTag className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Subcategory Filter */}
                                <div className="relative">
                                    <select
                                        value={subcategoryFilter}
                                        onChange={(e) => setSubcategoryFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Types</option>
                                        {subcategories.filter(sub => sub !== 'all').map(subcategory => (
                                            <option key={subcategory} value={subcategory}>
                                                {subcategory}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiGrid className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Collection Filter */}
                                <div className="relative">
                                    <select
                                        value={collectionFilter}
                                        onChange={(e) => setCollectionFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Collections</option>
                                        {collections.filter(col => col !== 'all').map(collection => (
                                            <option key={collection} value={collection}>
                                                {collection}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiLayers className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Stock Filter */}
                                <div className="relative">
                                    <select
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Stock</option>
                                        <option value="in-stock">In Stock</option>
                                        <option value="low-stock">Low Stock</option>
                                        <option value="out-of-stock">Out of Stock</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiShoppingCart className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-200">
                            {/* Product Type Filter */}
                            <div className="relative">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                >
                                    <option value="all">All Types</option>
                                    <option value="ready-to-wear">Ready-to-Wear</option>
                                    <option value="customizable">Customizable</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <FiScissors className="text-gray-400" />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <FiCheckCircle className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Status Messages */}
                <AnimatePresence>
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
                </AnimatePresence>

                {/* Products Content */}
                <AnimatePresence mode="wait">
                    {filteredProducts.length > 0 ? (
                        <motion.div
                            key="products-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Desktop Table */}
                            <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                                            <tr>
                                                {['Product', 'SKU', 'Price', 'Category', 'Stock', 'Status', 'Type', 'Actions'].map((header) => (
                                                    <th
                                                        key={header}
                                                        className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredProducts.map((product, index) => (
                                                <motion.tr
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={product.images?.[0] || '/placeholder-fashion.png'}
                                                                alt={product.name}
                                                                className="h-12 w-12 object-cover rounded-xl border border-gray-200 mr-4"
                                                                onError={(e) => {
                                                                    e.target.src = '/placeholder-fashion.png';
                                                                }}
                                                            />
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {product.name || 'Untitled Product'}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {product.isFeatured && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                                                                            <FiStar className="mr-1" size={10} />
                                                                            Featured
                                                                        </span>
                                                                    )}
                                                                    {product.isNewArrival && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                                                                            New
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                            {product.sku || 'N/A'}
                                                        </code>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FiDollarSign className="text-gray-400 mr-2" />
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                ${product.price?.toLocaleString() || '0'}
                                                            </span>
                                                            {product.originalPrice > product.price && (
                                                                <span className="text-xs text-gray-500 line-through ml-2">
                                                                    ${product.originalPrice?.toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-gray-900 capitalize">
                                                                {product.category || 'Uncategorized'}
                                                            </span>
                                                            {product.subcategory && (
                                                                <span className="text-xs text-gray-500">
                                                                    {product.subcategory}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                                            product.countInStock > 10 
                                                                ? 'bg-green-100 text-green-800 border-green-200' 
                                                                : product.countInStock > 0
                                                                ? 'bg-orange-100 text-orange-800 border-orange-200'
                                                                : 'bg-red-100 text-red-800 border-red-200'
                                                        }`}>
                                                            <FiShoppingCart className="mr-1" size={12} />
                                                            {product.countInStock || 0} in stock
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                                                            product.status === 'active' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {product.status === 'active' ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                                                                product.isReadyToWear 
                                                                    ? 'bg-blue-100 text-blue-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {product.isReadyToWear ? 'Ready-to-Wear' : 'Custom'}
                                                            </span>
                                                            {product.isCustomizable && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                                                                    Customizable
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-3">
                                                            <Link
                                                                to={`/admin/products/${product.id}/edit`}
                                                                className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                                                            >
                                                                <FiEdit className="mr-1" />
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                disabled={deletingProduct === product.id}
                                                                className="flex items-center text-red-600 hover:text-red-700 font-semibold disabled:opacity-50 transition-colors duration-200"
                                                            >
                                                                {deletingProduct === product.id ? (
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                                                ) : (
                                                                    <FiTrash2 className="mr-1" />
                                                                )}
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-4">
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={product.images?.[0] || '/placeholder-fashion.png'}
                                                alt={product.name}
                                                className="h-20 w-16 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-fashion.png';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {product.name || 'Untitled Product'}
                                                        </h3>
                                                        <code className="text-xs text-gray-500 mt-1">
                                                            {product.sku || 'No SKU'}
                                                        </code>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                                                            product.status === 'active' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {product.status === 'active' ? 'Active' : 'Inactive'}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                                                            product.isReadyToWear 
                                                                ? 'bg-blue-100 text-blue-800' 
                                                                : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {product.isReadyToWear ? 'Ready-to-Wear' : 'Custom'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mt-2">
                                                    {product.isFeatured && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                                                            <FiStar className="mr-1" size={10} />
                                                            Featured
                                                        </span>
                                                    )}
                                                    {product.isNewArrival && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                                                            New
                                                        </span>
                                                    )}
                                                    {product.isCustomizable && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-pink-100 text-pink-800">
                                                            Customizable
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mt-3">
                                                    <div className="bg-gray-50 rounded-lg p-2">
                                                        <p className="text-xs text-gray-500">Price</p>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            ${product.price?.toLocaleString() || '0'}
                                                        </p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-2">
                                                        <p className="text-xs text-gray-500">Stock</p>
                                                        <p className={`text-sm font-semibold ${
                                                            product.countInStock > 10 ? 'text-green-600' :
                                                            product.countInStock > 0 ? 'text-orange-600' : 'text-red-600'
                                                        }`}>
                                                            {product.countInStock || 0}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-3">
                                                    <p className="text-xs text-gray-500">Category</p>
                                                    <p className="text-sm text-gray-900">
                                                        {product.category} {product.subcategory && `• ${product.subcategory}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex space-x-3">
                                                <Link
                                                    to={`/admin/products/${product.id}/edit`}
                                                    className="flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
                                                >
                                                    <FiEdit className="mr-1" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deletingProduct === product.id}
                                                    className="flex items-center text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50 transition-colors duration-200"
                                                >
                                                    {deletingProduct === product.id ? (
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-2"></div>
                                                    ) : (
                                                        <FiTrash2 className="mr-1" />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center bg-white rounded-2xl shadow-lg p-12"
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiPackage className="text-white text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                {products.length === 0 
                                    ? "Get started by adding your first fashion product to the catalog" 
                                    : "No products match your current filters"
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {(searchQuery || categoryFilter !== 'all' || stockFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setCategoryFilter('all');
                                            setSubcategoryFilter('all');
                                            setCollectionFilter('all');
                                            setStockFilter('all');
                                            setStatusFilter('all');
                                            setTypeFilter('all');
                                        }}
                                        className="bg-white text-gray-700 py-3 px-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 font-semibold"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                                <Link
                                    to="/admin/products/new"
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                                >
                                    <FiPlus className="mr-2 inline" />
                                    Add New Product
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
