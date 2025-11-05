import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { 
    FiShoppingCart, 
    FiStar, 
    FiTag, 
    FiPackage,
    FiHeart,
    FiScissors, 
    FiDroplet,
    FiTruck
} from 'react-icons/fi';

export default function ProductCard({ product, showQuickAdd = true }) {
    const { addToCart } = useCart();
    
    // Calculate prices using the same logic as featured products section
    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    
    // Original price calculation
    const originalPrice = product.originalPrice || product.price;
    
    // Final price is just product.price when there's a discount
    const displayPrice = hasDiscount ? product.price : product.price;

    // Get the first image for the card display
    const displayImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : '/placeholder-fashion.png';

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    // Get available sizes and colors for display
    const displaySizes = product.sizes?.slice(0, 2) || []; // Reduced for mobile
    const displayColors = product.colors?.slice(0, 1) || []; // Reduced for mobile

    // Check if product is customizable
    const isCustomizable = product.isCustomizable;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg sm:rounded-2xl overflow-hidden transition-all duration-300 relative group border border-yellow-500"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <Link to={`/products/${product.id}`}>
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover"
                        onError={(e) => {
                            e.target.src = '/placeholder-fashion.png';
                        }}
                    />
                </Link>

                {/* Badges Container */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 space-y-1 sm:space-y-2">
                    {/* Discount Badge */}
                    {hasDiscount && (
                        <motion.span
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: -12 }}
                            className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full block font-serif"
                        >
                            {product.discountPercentage}% OFF
                        </motion.span>
                    )}

                    {/* Customizable Product Badge */}
                    {isCustomizable && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-black text-yellow-500 text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full block font-serif"
                        >
                            Custom
                        </motion.span>
                    )}

                    {/* New Arrival Badge */}
                    {product.isNewArrival && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full block font-serif"
                        >
                            New
                        </motion.span>
                    )}

                    {/* Bestseller Badge */}
                    {product.isBestseller && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-black text-yellow-500 text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full block font-serif"
                        >
                            Popular
                        </motion.span>
                    )}
                </div>

                {/* Quick Actions Overlay */}
                {showQuickAdd && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCart}
                            disabled={!product.isCustomizable && product.countInStock === 0}
                            className={`bg-white text-black rounded-full p-2 sm:p-3 border border-yellow-500 ${
                                (!product.isCustomizable && product.countInStock === 0) 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-black hover:text-yellow-500'
                            } transition-all duration-200`}
                        >
                            <FiShoppingCart size={16} className="sm:w-5 sm:h-5" />
                        </motion.button>
                    </div>
                )}
            </div>
            
            {/* Content Container */}
            <div className="p-3 sm:p-4 md:p-5">
                {/* Category */}
                {product.category && (
                    <div className="flex items-center text-xs text-black mb-1 sm:mb-2 font-serif">
                        <FiTag size={12} className="mr-1" />
                        <span className="uppercase tracking-wide font-medium">{product.category}</span>
                    </div>
                )}

                {/* Product Name */}
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-base sm:text-lg text-black mb-1 sm:mb-2 line-clamp-2 group-hover:underline font-serif">
                        {product.name}
                    </h3>
                </Link>

                {/* Designer/Brand */}
                {(product.designer || product.brand) && (
                    <p className="text-sm text-black mb-2 sm:mb-3 font-serif">
                        by {product.designer || product.brand}
                    </p>
                )}

                {/* Size and Color Info */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                    {/* Sizes */}
                    {displaySizes.length > 0 && (
                        <div className="flex items-center text-xs text-black font-serif">
                            <FiPackage size={12} className="mr-1 text-yellow-500" />
                            <span className="font-medium">Sizes: </span>
                            <span className="ml-1">{displaySizes.join(', ')}</span>
                            {product.sizes?.length > 2 && (
                                <span className="text-gray-500 ml-1">+{product.sizes.length - 2}</span>
                            )}
                        </div>
                    )}

                    {/* Colors */}
                    {displayColors.length > 0 && (
                        <div className="flex items-center text-xs text-black font-serif">
                            <FiDroplet size={12} className="mr-1 text-yellow-500" />
                            <span className="font-medium">Colors: </span>
                            <span className="ml-1">{displayColors.join(', ')}</span>
                            {product.colors?.length > 1 && (
                                <span className="text-gray-500 ml-1">+{product.colors.length - 1}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Material */}
                {product.material && (
                    <div className="flex items-center text-xs text-black mb-2 sm:mb-3 font-serif">
                        <FiPackage size={12} className="mr-1 text-yellow-500" />
                        <span className="truncate">{product.material}</span>
                    </div>
                )}

                {/* Style Tags */}
                {product.styleTags && product.styleTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                        {product.styleTags.slice(0, 2).map((tag, index) => ( // Reduced for mobile
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-xs bg-yellow-500/20 text-black px-2 py-1 rounded-full font-medium font-serif border border-yellow-500/30"
                            >
                                {tag}
                            </motion.span>
                        ))}
                        {product.styleTags.length > 2 && (
                            <span className="text-xs text-black bg-gray-100 px-2 py-1 rounded-full font-serif">
                                +{product.styleTags.length - 2}
                            </span>
                        )}
                    </div>
                )}

                {/* Occasion Tags */}
                {product.occasion && product.occasion.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                        {product.occasion.slice(0, 1).map((occasion, index) => ( // Reduced for mobile
                            <span
                                key={index}
                                className="text-xs bg-black text-yellow-500 px-2 py-1 rounded-full font-medium flex items-center font-serif border border-yellow-500/30"
                            >
                                <FiHeart size={10} className="mr-1" />
                                {occasion}
                            </span>
                        ))}
                    </div>
                )}

                {/* Production Time */}
                {product.productionTime && (
                    <div className="flex items-center text-xs text-black mb-2 sm:mb-3 font-serif">
                        <FiTruck size={12} className="mr-1 text-yellow-500" />
                        <span className="truncate">{product.productionTime}</span>
                    </div>
                )}

                {/* Price and Action Section */}
                <div className="flex items-center justify-between mt-auto">
                    {/* Price Display */}
                    <div className="flex flex-col">
                        {hasDiscount ? (
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-base sm:text-lg font-bold text-black font-serif">
                                    ₦{displayPrice.toLocaleString()}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 line-through font-serif">
                                    ₦{originalPrice.toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <span className="text-base sm:text-lg font-bold text-black font-serif">
                                ₦{product.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={!product.isCustomizable && product.countInStock === 0}
                        className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 font-serif border border-yellow-500 ${
                            (!product.isCustomizable && product.countInStock === 0) 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : isCustomizable
                                    ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                                    : 'bg-yellow-500 text-black hover:bg-yellow-600'
                        }`}
                    >
                        {isCustomizable ? (
                            <>
                                <FiScissors className="mr-1 sm:mr-2" size={14} />
                                <span className="hidden sm:inline">Customize</span>
                                <span className="sm:hidden">Custom</span>
                            </>
                        ) : product.countInStock === 0 ? (
                            'Out of Stock'
                        ) : (
                            <>
                                <FiShoppingCart className="mr-1 sm:mr-2" size={14} />
                                <span className="hidden sm:inline">Add to Cart</span>
                                <span className="sm:hidden">Add</span>
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Rating and Reviews */}
                {(product.rating || product.reviewCount) && (
                    <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <FiStar className="text-yellow-500 mr-1" size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span className="text-xs sm:text-sm font-medium text-black font-serif">
                                    {product.rating?.toFixed(1) || '4.5'}
                                </span>
                            </div>
                            {product.reviewCount && (
                                <>
                                    <span className="text-xs text-gray-500 mx-1 sm:mx-2">•</span>
                                    <span className="text-xs text-gray-500 font-serif">
                                        {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''}
                                    </span>
                                </>
                            )}
                        </div>
                        
                        {/* Delivery Estimate */}
                        {product.deliveryEstimate && (
                            <span className="text-xs text-black font-serif hidden sm:inline">
                                {product.deliveryEstimate}
                            </span>
                        )}
                    </div>
                )}

                {/* Stock Status - Don't show for customizable products */}
                {!product.isCustomizable && (
                    <div className="flex items-center justify-between mt-2 text-xs">
                        <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
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
                                        : "text-green-600"
                                    : "text-red-600"
                            }>
                                {product.countInStock > 0 
                                    ? product.countInStock < 10 
                                        ? `${product.countInStock} left` 
                                        : 'In Stock'
                                    : 'Out of Stock'
                                }
                            </span>
                        </div>
                        
                        {/* Featured Badge */}
                        {product.isFeatured && (
                            <span className="bg-yellow-500/20 text-black px-2 py-1 rounded-full text-xs font-medium font-serif border border-yellow-500/30">
                                Featured
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500 rounded-lg sm:rounded-2xl pointer-events-none transition-all duration-300"></div>
        </motion.div>
    );
}
