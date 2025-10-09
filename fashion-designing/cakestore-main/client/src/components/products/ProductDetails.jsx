import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../services/productService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiArrowLeft, 
    FiShoppingCart, 
    FiStar, 
    FiHeart, 
    FiShare2, 
    FiPackage,
    FiClock,
    FiChevronLeft,
    FiChevronRight,
    FiTag,
    FiRuler,
    FiDroplet,
    FiScissors,
    FiTruck,
    FiUsers,
    FiMapPin
} from 'react-icons/fi';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                const productData = response.data;
                setProduct(productData);
                
                // Set default selections
                if (productData.sizes && productData.sizes.length > 0) {
                    setSelectedSize(productData.sizes[0]);
                }
                if (productData.colors && productData.colors.length > 0) {
                    setSelectedColor(productData.colors[0]);
                }
            } catch (err) {
                setError(err.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        const cartItem = {
            ...product,
            selectedSize,
            selectedColor,
            quantity
        };
        addToCart(cartItem, quantity);
        // Show success notification here if needed
    };

    const navigateImage = (direction) => {
        if (!product.images) return;
        
        if (direction === 'next') {
            setSelectedImageIndex((prev) => 
                prev === product.images.length - 1 ? 0 : prev + 1
            );
        } else {
            setSelectedImageIndex((prev) => 
                prev === 0 ? product.images.length - 1 : prev - 1
            );
        }
    };

    if (loading) {
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
    
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="text-red-500 text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Fashion Item Not Found</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            Browse Fashion Items
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="text-gray-500 text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Fashion Item Not Available</h3>
                        <p className="text-gray-600 mb-6">The fashion item you're looking for is no longer available.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            Browse Fashion Items
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Calculate discounted price
    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    const originalPrice = product.originalPrice || product.price;
    const discountedPrice = hasDiscount 
        ? product.price
        : product.price;

    // Get current display image
    const displayImage = product.images && product.images.length > 0 
        ? product.images[selectedImageIndex] 
        : '/placeholder-fashion.png';

    // Check if product can be added to cart
    const canAddToCart = product.isCustomizable || (product.countInStock > 0 && selectedSize && selectedColor);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Breadcrumb Navigation */}
                <motion.nav
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 group"
                    >
                        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Fashion Items
                    </button>
                </motion.nav>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden relative"
                    >
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-10 space-y-2">
                            {hasDiscount && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg transform -rotate-6"
                                >
                                    {product.discountPercentage}% OFF
                                </motion.span>
                            )}
                            
                            {product.isCustomizable && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg block"
                                >
                                    Customizable
                                </motion.span>
                            )}

                            {product.isNewArrival && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg block"
                                >
                                    New Arrival
                                </motion.span>
                            )}

                            {product.isBestseller && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg block"
                                >
                                    Bestseller
                                </motion.span>
                            )}
                        </div>

                        {/* Main Image */}
                        <div className="relative aspect-[3/4] bg-gray-50">
                            <motion.img
                                key={selectedImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={displayImage}
                                alt={product.name}
                                className="w-full h-full object-cover cursor-zoom-in"
                                onClick={() => setIsImageZoomed(true)}
                                onError={(e) => {
                                    e.target.src = '/placeholder-fashion.png';
                                }}
                            />
                            
                            {/* Image Navigation */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => navigateImage('prev')}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => navigateImage('next')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200"
                                    >
                                        <FiChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex gap-3 overflow-x-auto py-2">
                                    {product.images.map((image, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`flex-shrink-0 w-16 h-20 border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                                                selectedImageIndex === index 
                                                    ? 'border-blue-500 shadow-md' 
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <FiTag className="mr-2" />
                                    <span className="uppercase tracking-wide font-medium">{product.category}</span>
                                    {product.subcategory && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span>{product.subcategory}</span>
                                        </>
                                    )}
                                </div>
                                
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                    {product.name}
                                </h1>
                                
                                {(product.designer || product.brand) && (
                                    <p className="text-lg text-gray-600 mb-4">
                                        by <span className="font-semibold">{product.designer || product.brand}</span>
                                    </p>
                                )}

                                {product.collection && (
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <FiMapPin className="mr-2" />
                                        <span className="font-medium">{product.collection} Collection</span>
                                    </div>
                                )}
                            </div>

                            {/* Price Section */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                                <div className="flex items-center gap-4 mb-3">
                                    {hasDiscount ? (
                                        <>
                                            <span className="text-3xl font-bold text-blue-600">
                                                ₦{discountedPrice.toLocaleString()}
                                            </span>
                                            <span className="text-xl text-gray-500 line-through">
                                                ₦{originalPrice.toLocaleString()}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold text-blue-600">
                                            ₦{product.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status */}
                                {!product.isCustomizable && (
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${
                                            product.countInStock > 0 
                                                ? product.countInStock < 10 
                                                    ? 'bg-orange-500' 
                                                    : 'bg-green-500'
                                                : 'bg-red-500'
                                        }`}></div>
                                        <span className={
                                            product.countInStock > 0 
                                                ? product.countInStock < 10 
                                                    ? "text-orange-600 font-medium" 
                                                    : "text-green-600 font-medium"
                                                : "text-red-600 font-medium"
                                        }>
                                            {product.countInStock > 0 
                                                ? product.countInStock < 10 
                                                    ? `Only ${product.countInStock} left in stock` 
                                                    : 'In stock'
                                                : 'Out of stock'
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
                                        <FiRuler className="mr-2 text-blue-500" />
                                        Select Size
                                    </h3>
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                        {product.sizes.map((size) => (
                                            <motion.button
                                                key={size}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedSize(size)}
                                                className={`p-3 border-2 rounded-xl font-semibold transition-all duration-200 ${
                                                    selectedSize === size
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                                                }`}
                                            >
                                                {size}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
                                        <FiDroplet className="mr-2 text-blue-500" />
                                        Select Color
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color) => (
                                            <motion.button
                                                key={color}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedColor(color)}
                                                className={`p-3 border-2 rounded-xl font-semibold transition-all duration-200 ${
                                                    selectedColor === color
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                                                }`}
                                            >
                                                {color}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
                                    <FiPackage className="mr-2 text-blue-500" />
                                    Product Description
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                            </div>

                            {/* Material & Care */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.material && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Material</h3>
                                        <p className="text-gray-700">{product.material}</p>
                                    </div>
                                )}
                                
                                {product.careInstructions && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Care Instructions</h3>
                                        <p className="text-gray-700">{product.careInstructions}</p>
                                    </div>
                                )}
                            </div>

                            {/* Fit & Style Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.fitType && (
                                    <div className="text-center bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-600 mb-1">Fit</div>
                                        <div className="font-semibold text-gray-900">{product.fitType}</div>
                                    </div>
                                )}
                                
                                {product.length && (
                                    <div className="text-center bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-600 mb-1">Length</div>
                                        <div className="font-semibold text-gray-900">{product.length}</div>
                                    </div>
                                )}
                                
                                {product.neckline && (
                                    <div className="text-center bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-600 mb-1">Neckline</div>
                                        <div className="font-semibold text-gray-900">{product.neckline}</div>
                                    </div>
                                )}
                                
                                {product.sleeveType && (
                                    <div className="text-center bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-600 mb-1">Sleeve</div>
                                        <div className="font-semibold text-gray-900">{product.sleeveType}</div>
                                    </div>
                                )}
                            </div>

                            {/* Style Tags */}
                            {product.styleTags && product.styleTags.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Style</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.styleTags.map((tag, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-xl text-sm font-semibold"
                                            >
                                                {tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Occasion Tags */}
                            {product.occasion && product.occasion.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
                                        <FiHeart className="mr-2 text-blue-500" />
                                        Perfect For
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.occasion.map((occasion, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-purple-100 text-purple-800 px-3 py-2 rounded-xl text-sm font-semibold"
                                            >
                                                {occasion}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Production & Delivery */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.productionTime && (
                                    <div className="flex items-center bg-orange-50 rounded-xl p-4">
                                        <FiClock className="text-orange-500 mr-3 text-xl" />
                                        <div>
                                            <div className="font-semibold text-gray-900">Production Time</div>
                                            <div className="text-gray-700">{product.productionTime}</div>
                                        </div>
                                    </div>
                                )}
                                
                                {product.deliveryEstimate && (
                                    <div className="flex items-center bg-green-50 rounded-xl p-4">
                                        <FiTruck className="text-green-500 mr-3 text-xl" />
                                        <div>
                                            <div className="font-semibold text-gray-900">Delivery Estimate</div>
                                            <div className="text-gray-700">{product.deliveryEstimate}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Add to Cart Section */}
                            {canAddToCart && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                                >
                                    {!product.isCustomizable && (
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-3 font-semibold text-lg">Quantity</label>
                                            <select
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                className="border-2 border-gray-300 rounded-xl p-3 w-24 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-semibold"
                                            >
                                                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddToCart}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold text-lg flex items-center justify-center"
                                    >
                                        {product.isCustomizable ? (
                                            <>
                                                <FiScissors className="mr-3 text-xl" />
                                                Customize This Item
                                            </>
                                        ) : (
                                            <>
                                                <FiShoppingCart className="mr-3 text-xl" />
                                                Add to Cart
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Out of Stock Message */}
                            {!canAddToCart && !product.isCustomizable && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center bg-red-50 rounded-2xl p-6 border border-red-200"
                                >
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FiPackage className="text-red-500 text-xl" />
                                    </div>
                                    <p className="text-red-700 font-semibold mb-4 text-lg">This fashion item is currently unavailable</p>
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                                    >
                                        Browse Other Fashion Items
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Image Zoom Modal */}
            <AnimatePresence>
                {isImageZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsImageZoomed(false)}
                    >
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={displayImage}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={() => setIsImageZoomed(false)}
                            className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all duration-200"
                        >
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}