import { useState, useEffect } from 'react';
import ProductCard from '../../components/products/ProductCard';
import ProductFilter from '../../components/products/ProductFilter';
import { useProducts } from '../../context/ProductContext';
import CustomCakeForm from '../../components/orders/CustomCakeForm';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiLoader, 
    FiFilter, 
    FiGrid, 
    FiList, 
    FiSearch,
    FiRefreshCw,
    FiX,
    FiShoppingBag,
    FiScissors
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

// Create MotionLink component
const MotionLink = motion(Link);

// Mobile Product Card Component
const MobileProductCard = ({ product, index }) => {
    const discountedPrice = product.discountPercentage > 0 
        ? product.price - (product.price * (product.discountPercentage / 100))
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            className="bg-white rounded-lg border border-gray-200 hover:border-gold transition-all duration-300 overflow-hidden group cursor-pointer shadow-sm"
        >
            <Link to={`/products/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                    {/* Discount Badge */}
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 z-10">
                            <span className="bg-gold text-black text-xs font-bold px-2 py-1 rounded-full">
                                {product.discountPercentage}% OFF
                            </span>
                        </div>
                    )}
                    
                    {/* Product Image */}
                    <img 
                        src={product.images?.[0] || '/api/placeholder/300/300'} 
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Price Section */}
                <div className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {discountedPrice ? (
                                <>
                                    <span className="text-gold font-bold text-sm">
                                        ₦{discountedPrice.toLocaleString()}
                                    </span>
                                    <span className="text-gray-500 text-xs line-through">
                                        ₦{product.price.toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-gold font-bold text-sm">
                                    ₦{product.price.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

// Loading Skeleton Component
const ProductSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="relative pt-[125%] bg-gray-300 rounded-lg mb-4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3 mt-4"></div>
                </div>
            </div>
        ))}
    </div>
);

// Mobile Loading Skeleton Component
const MobileProductSkeleton = () => (
    <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg border border-gray-200 animate-pulse">
                <div className="relative pt-[100%] bg-gray-300 rounded-t-lg"></div>
                <div className="p-2">
                    <div className="h-4 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
            </div>
        ))}
    </div>
);

// View Toggle Component
const ViewToggle = ({ viewMode, setViewMode }) => (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 border border-gray-200">
        <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' 
                    ? 'bg-gold text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gold hover:bg-gold/10'
            }`}
        >
            <FiGrid className="text-lg" />
        </button>
        <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list' 
                    ? 'bg-gold text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gold hover:bg-gold/10'
            }`}
        >
            <FiList className="text-lg" />
        </button>
    </div>
);

// Collection Badges Component
const CollectionBadges = ({ onCollectionSelect }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3 mb-6"
    >
        {[
            { name: 'All', value: 'all' },
            { name: 'New Arrivals', value: 'new' },
            { name: 'Featured', value: 'featured' },
            { name: 'Summer', value: 'summer' },
            { name: 'Custom', value: 'custom' },
        ].map((collection) => (
            <motion.button
                key={collection.value}
                onClick={() => onCollectionSelect(collection.value)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    collection.value === 'all'
                        ? 'bg-gold text-white shadow-sm hover:bg-yellow-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gold hover:text-white border border-gray-200'
                }`}
            >
                {collection.name}
            </motion.button>
        ))}
    </motion.div>
);

export default function ProductListPage() {
    const { 
        products, 
        categories, 
        loading, 
        error, 
        fetchProducts,
        refreshProducts 
    } = useProducts();
    const [showCustomOrderForm, setShowCustomOrderForm] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [activeCollection, setActiveCollection] = useState('all');
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Filter products based on search query and active collection
    const filteredProducts = products.filter(product => {
        const matchesSearch = 
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.styleTags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            product.occasion?.some(occasion => occasion.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCollection = 
            activeCollection === 'all' ||
            (activeCollection === 'new' && product.isNewArrival) ||
            (activeCollection === 'featured' && product.isFeatured) ||
            (activeCollection === 'summer' && product.collection?.toLowerCase().includes('summer')) ||
            (activeCollection === 'custom' && product.isCustomizable);

        return matchesSearch && matchesCollection;
    });

    const handleCustomOrderSubmit = async (orderData) => {
        if (!currentUser) {
            console.error("User is not authenticated. Cannot create order.");
            alert("Your session has expired. Please log in again.");
            navigate('/login');
            return;
        }

        try {
            navigate('/checkout', {
                state: {
                    customOrderData: orderData,
                    isCustomOrder: true
                }
            });
            setShowCustomOrderForm(false);
        } catch (error) {
            console.error("Error preparing custom order: ", error);
            alert("There was an error preparing your order. Please try again.");
        }
    };

    const handleCustomOrderClick = (e) => {
        e.preventDefault();
        if (!currentUser) {
            navigate('/login', { state: { from: '/', message: 'Please login to place a custom order' } });
        } else {
            setShowCustomOrderForm(true);
        }
    };

    const handleFilter = async (filters) => {
        try {
            setLocalLoading(true);
            await fetchProducts(filters);
        } catch (err) {
            console.error('Filter error:', err);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleClearFilters = () => {
        refreshProducts();
        setSearchQuery('');
        setActiveCollection('all');
    };

    const handleCollectionSelect = (collection) => {
        setActiveCollection(collection);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <FiLoader className="text-4xl text-gold" />
                    </motion.div>
                    <p className="text-gray-600 text-lg">Loading fashion collection...</p>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-2xl mx-auto"
                >
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FiX className="text-2xl text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <motion.button
                        onClick={refreshProducts}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-gold text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-yellow-600"
                    >
                        <FiRefreshCw className="text-sm" />
                        Try Again
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            Fashion Collection
                        </h1>
                        <p className="text-gray-600">
                            Discover our curated collection of ready-to-wear and custom designs
                        </p>
                    </div>
                    
                    {filteredProducts.length > 0 && (
                        <div className="flex items-center gap-4">
                            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-100 rounded-lg px-4 py-2 border border-gray-200"
                            >
                                <span className="text-gray-900 font-semibold">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'design' : 'designs'}
                                </span>
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* Collection Badges */}
                <CollectionBadges onCollectionSelect={handleCollectionSelect} />

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col lg:flex-row gap-4 mb-8"
                >
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Search by name, description, style, or occasion..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <FiX className="text-lg" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button */}
                    <motion.button
                        onClick={() => setShowFilters(!showFilters)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-gold text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-yellow-600"
                    >
                        <FiFilter className="text-sm" />
                        Filters
                        {showFilters && <FiX className="text-sm transition-transform" />}
                    </motion.button>
                </motion.div>

                {/* Filter Section */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-8"
                        >
                            <ProductFilter 
                                categories={categories} 
                                onFilter={handleFilter} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filter Loading Indicator */}
                <AnimatePresence>
                    {localLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-center gap-3 bg-gray-100 rounded-lg p-4 mb-6 border border-gray-200"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <FiLoader className="text-gold text-lg" />
                            </motion.div>
                            <span className="text-gray-700 font-medium">Applying filters...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Summary */}
                {filteredProducts.length > 0 && !localLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between mb-6"
                    >
                        <div className="flex items-center gap-4">
                            <p className="text-gray-600">
                                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'design' : 'designs'}
                                {searchQuery && ` for "${searchQuery}"`}
                                {activeCollection !== 'all' && ` in ${activeCollection.replace(/([A-Z])/g, ' $1').trim()}`}
                            </p>
                            {activeCollection !== 'all' && (
                                <span className="bg-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {activeCollection.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            )}
                        </div>
                        {(searchQuery || products.length !== filteredProducts.length || activeCollection !== 'all') && (
                            <button
                                onClick={handleClearFilters}
                                className="text-gold hover:text-yellow-600 text-sm font-medium flex items-center gap-1"
                            >
                                <FiRefreshCw className="text-xs" />
                                Clear all
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Products Grid/List */}
                <AnimatePresence mode="wait">
                    {localLoading ? (
                        // Show appropriate skeleton based on screen size
                        <div className="block lg:hidden">
                            <MobileProductSkeleton />
                        </div>
                    ) : (
                        <motion.div
                            key={viewMode + filteredProducts.length + activeCollection}
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {/* Mobile View - 3 Column Grid */}
                            <div className="block lg:hidden">
                                <div className="grid grid-cols-3 gap-2">
                                    {filteredProducts.map((product, index) => (
                                        <MobileProductCard 
                                            key={product.id} 
                                            product={product} 
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Desktop View - Original Layout */}
                            <div className="hidden lg:block">
                                <div className={
                                    viewMode === 'grid' 
                                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                        : "grid grid-cols-1 gap-6"
                                }>
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            variants={itemVariants}
                                            layout
                                            whileHover={{ 
                                                y: -8,
                                                transition: { duration: 0.3 }
                                            }}
                                        >
                                            <ProductCard 
                                                product={product} 
                                                viewMode={viewMode}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {filteredProducts.length === 0 && !localLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gold rounded-lg flex items-center justify-center mx-auto mb-6">
                                <FiShoppingBag className="text-3xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {searchQuery || activeCollection !== 'all' ? 'No designs found' : 'No designs available'}
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                {searchQuery 
                                    ? `We couldn't find any designs matching "${searchQuery}". Try adjusting your search or filters.`
                                    : activeCollection !== 'all'
                                    ? `No designs found in the ${activeCollection} collection. Try browsing other collections.`
                                    : 'No designs match your current filter criteria. Try clearing filters to see all available designs.'
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    onClick={handleClearFilters}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-gold text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-yellow-600"
                                >
                                    <FiRefreshCw className="text-sm" />
                                    Clear Filters
                                </motion.button>
                                <MotionLink
                                    onClick={handleCustomOrderClick}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-200 border border-gray-200"
                                >
                                    <FiScissors className="text-sm" />
                                    Create Custom Design
                                </MotionLink>
                            </div>
                        </div>
                    </motion.div>
                )}

     

                {/* Loading Skeleton for Filtering */}
                {localLoading && (
                    <div className="block lg:hidden">
                        <MobileProductSkeleton />
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCustomOrderForm && (
                <CustomCakeForm 
                    onClose={() => setShowCustomOrderForm(false)} 
                    onSubmit={handleCustomOrderSubmit}
                />
            )}
        </div>
    );
}
