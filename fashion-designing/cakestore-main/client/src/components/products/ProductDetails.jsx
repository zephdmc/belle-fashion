import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../services/productServic';
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
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium font-serif">Loading fashion item details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gold/20"
                    >
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="text-red-500 text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4 font-serif">Fashion Item Not Found</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-black text-gold py-3 px-8 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold font-serif border border-gold/30 shadow-lg"
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
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gold/20"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="text-gray-500 text-2xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4 font-serif">Fashion Item Not Available</h3>
                        <p className="text-gray-600 mb-6">The fashion item you're looking for is no longer available.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-black text-gold py-3 px-8 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold font-serif border border-gold/30 shadow-lg"
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
        <div className="min-h-screen bg-gradient-to-br pt-8 from-white to-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Breadcrumb Navigation */}
                <motion.nav
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-black hover:text-gold font-semibold transition-colors duration-200 group font-serif"
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
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gold/20"
                    >
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-10 space-y-2">
                            {hasDiscount && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-r from-gold to-yellow-600 text-black text-sm font-bold px-3 py-2 rounded-full shadow-lg transform -rotate-6 font-serif"
                                >
                                    {product.discountPercentage}% OFF
                                </motion.span>
                            )}
                            
                            {product.isCustomizable && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-black text-gold text-sm font-bold px-3 py-2 rounded-full shadow-lg block font-serif"
                                >
                                    Customizable
                                </motion.span>
                            )}

                            {product.isNewArrival && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gradient-to-r from-gold to-yellow-600 text-black text-sm font-bold px-3 py-2 rounded-full shadow-lg block font-serif"
                                >
                                    New Arrival
                                </motion.span>
                            )}

                            {product.isBestseller && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-black text-gold text-sm font-bold px-3 py-2 rounded-full shadow-lg block font-serif"
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
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg transition-all duration-200 border border-gold/20"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => navigateImage('next')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg transition-all duration-200 border border-gold/20"
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
                                                    ? 'border-gold shadow-md' 
                                                    : 'border-gray-200 hover:border-gold/50'
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
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gold/20"
                    >
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-2 font-serif">
                                    <FiTag className="mr-2" />
                                    <span className="uppercase tracking-wide font-medium">{product.category}</span>
                                    {product.subcategory && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span>{product.subcategory}</span>
                                        </>
                                    )}
                                </div>
                                
                                <h1 className="text-3xl lg:text-4xl font-bold text-black mb-3 font-serif">
                                    {product.name}
                                </h1>
                                
                                {(product.designer || product.brand) && (
                                    <p className="text-lg text-gray-600 mb-4 font-serif">
                                        by <span className="font-semibold">{product.designer || product.brand}</span>
                                    </p>
                                )}

                                {product.collection && (
                                    <div className="flex items-center text-gray-600 mb-4 font-serif">
                                        <FiMapPin className="mr-2" />
                                        <span className="font-medium">{product.collection} Collection</span>
                                    </div>
                                )}
                            </div>

                            {/* Price Section */}
                            <div className="bg-gradient-to-r from-gold/10 to-yellow-600/10 rounded-2xl p-6 border border-gold/20">
                                <div className="flex items-center gap-4 mb-3">
                                    {hasDiscount ? (
                                        <>
                                            <span className="text-3xl font-bold text-black font-serif">
                                                ₦{discountedPrice.toLocaleString()}
                                            </span>
                                            <span className="text-xl text-gray-500 line-through font-serif">
                                                ₦{originalPrice.toLocaleString()}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold text-black font-serif">
                                            ₦{product.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status */}
                                {!product.isCustomizable && (
                                    <div className="flex items-center font-serif">
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
                                    <h3 className="text-xl font-semibold mb-3 text-black flex items-center font-serif">
                                        <FiDroplet className="mr-2 text-gold" />
                                        Select Size
                                    </h3>
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                        {product.sizes.map((size) => (
                                            <motion.button
                                                key={size}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedSize(size)}
                                                className={`p-3 border-2 rounded-xl font-semibold transition-all duration-200 font-serif ${
                                                    selectedSize === size
                                                        ? 'border-gold bg-gold/10 text-black shadow-sm'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gold/50'
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
                                    <h3 className="text-xl font-semibold mb-3 text-black flex items-center font-serif">
                                        <FiDroplet className="mr-2 text-gold" />
                                        Select Color
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color) => (
                                            <motion.button
                                                key={color}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedColor(color)}
                                                className={`p-3 border-2 rounded-xl font-semibold transition-all duration-200 font-serif ${
                                                    selectedColor === color
                                                        ? 'border-gold bg-gold/10 text-black shadow-sm'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gold/50'
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
                                <h3 className="text-xl font-semibold mb-3 text-black flex items-center font-serif">
                                    <FiPackage className="mr-2 text-gold" />
                                    Product Description
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-lg font-serif">{product.description}</p>
                            </div>

                            {/* Material & Care */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.material && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-black font-serif">Material</h3>
                                        <p className="text-gray-700 font-serif">{product.material}</p>
                                    </div>
                                )}
                                
                                {product.careInstructions && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-black font-serif">Care Instructions</h3>
                                        <p className="text-gray-700 font-serif">{product.careInstructions}</p>
                                    </div>
                                )}
                            </div>

                            {/* Fit & Style Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.fitType && (
                                    <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="text-sm text-gray-600 mb-1 font-serif">Fit</div>
                                        <div className="font-semibold text-black font-serif">{product.fitType}</div>
                                    </div>
                                )}
                                
                                {product.length && (
                                    <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="text-sm text-gray-600 mb-1 font-serif">Length</div>
                                        <div className="font-semibold text-black font-serif">{product.length}</div>
                                    </div>
                                )}
                                
                                {product.neckline && (
                                    <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="text-sm text-gray-600 mb-1 font-serif">Neckline</div>
                                        <div className="font-semibold text-black font-serif">{product.neckline}</div>
                                    </div>
                                )}
                                
                                {product.sleeveType && (
                                    <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="text-sm text-gray-600 mb-1 font-serif">Sleeve</div>
                                        <div className="font-semibold text-black font-serif">{product.sleeveType}</div>
                                    </div>
                                )}
                            </div>

                            {/* Style Tags */}
                            {product.styleTags && product.styleTags.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-black font-serif">Style</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.styleTags.map((tag, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-gold/20 text-black px-3 py-2 rounded-xl text-sm font-semibold font-serif border border-gold/30"
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
                                    <h3 className="text-xl font-semibold mb-3 text-black flex items-center font-serif">
                                        <FiHeart className="mr-2 text-gold" />
                                        Perfect For
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.occasion.map((occasion, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-black text-gold px-3 py-2 rounded-xl text-sm font-semibold font-serif border border-gold/30"
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
                                    <div className="flex items-center bg-gold/10 rounded-xl p-4 border border-gold/20">
                                        <FiClock className="text-black mr-3 text-xl" />
                                        <div>
                                            <div className="font-semibold text-black font-serif">Production Time</div>
                                            <div className="text-gray-700 font-serif">{product.productionTime}</div>
                                        </div>
                                    </div>
                                )}
                                
                                {product.deliveryEstimate && (
                                    <div className="flex items-center bg-black/5 rounded-xl p-4 border border-gray-200">
                                        <FiTruck className="text-black mr-3 text-xl" />
                                        <div>
                                            <div className="font-semibold text-black font-serif">Delivery Estimate</div>
                                            <div className="text-gray-700 font-serif">{product.deliveryEstimate}</div>
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
                                            <label className="block text-gray-700 mb-3 font-semibold text-lg font-serif">Quantity</label>
                                            <select
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                className="border-2 border-gray-300 rounded-xl p-3 w-24 bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 font-semibold font-serif"
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
                                        className="w-full bg-black text-gold py-4 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold text-lg flex items-center justify-center font-serif border border-gold/30 shadow-lg"
                                    >
                                        {product.isCustomizable ? (
                                            <>
                                                <FiScissors className="mr-3 text-xl" />
                                                Add to Cart
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
                                    <p className="text-red-700 font-semibold mb-4 text-lg font-serif">This fashion item is currently unavailable</p>
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="bg-black text-gold py-3 px-8 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold font-serif border border-gold/30 shadow-lg"
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
                            className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all duration-200 border border-gold/30"
                        >
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
