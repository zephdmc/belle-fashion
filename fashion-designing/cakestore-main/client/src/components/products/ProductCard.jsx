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
    const displaySizes = product.sizes?.slice(0, 3) || [];
    const displayColors = product.colors?.slice(0, 2) || [];

    // Check if product is customizable
    const isCustomizable = product.isCustomizable;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative group border border-gold/20"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <Link to={`/products/${product.id}`}>
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                            e.target.src = '/placeholder-fashion.png';
                        }}
                    />
                </Link>

                {/* Badges Container */}
                <div className="absolute top-3 left-3 space-y-2">
                    {/* Discount Badge */}
                    {hasDiscount && (
                        <motion.span
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: -12 }}
                            className="bg-gradient-to-r from-gold to-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg block font-serif"
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
                            className="bg-black text-gold text-xs font-bold px-3 py-1 rounded-full shadow-lg block font-serif"
                        >
                            Customizable
                        </motion.span>
                    )}

                    {/* New Arrival Badge */}
                    {product.isNewArrival && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-r from-gold to-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg block font-serif"
                        >
                            New Arrival
                        </motion.span>
                    )}

                    {/* Bestseller Badge */}
                    {product.isBestseller && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-black text-gold text-xs font-bold px-3 py-1 rounded-full shadow-lg block font-serif"
                        >
                            Bestseller
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
                            className={`bg-white text-black rounded-full p-3 shadow-lg border border-gold/30 ${
                                (!product.isCustomizable && product.countInStock === 0) 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-black hover:text-gold'
                            } transition-all duration-200`}
                        >
                            <FiShoppingCart size={20} />
                        </motion.button>
                    </div>
                )}
            </div>
            
            {/* Content Container */}
            <div className="p-5">
                {/* Category */}
                {product.category && (
                    <div className="flex items-center text-xs text-gray-500 mb-2 font-serif">
                        <FiTag size={12} className="mr-1" />
                        <span className="uppercase tracking-wide font-medium">{product.category}</span>
                    </div>
                )}

                {/* Product Name */}
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-lg text-black mb-2 hover:text-gold transition-colors duration-200 line-clamp-2 group-hover:underline font-serif">
                        {product.name}
                    </h3>
                </Link>

                {/* Designer/Brand */}
                {(product.designer || product.brand) && (
                    <p className="text-sm text-gray-600 mb-3 font-serif">
                        by {product.designer || product.brand}
                    </p>
                )}

                {/* Size and Color Info */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {/* Sizes */}
                    {displaySizes.length > 0 && (
                        <div className="flex items-center text-xs text-gray-600 font-serif">
                            <FiPackage size={12} className="mr-1 text-gold" />
                            <span className="font-medium">Sizes: </span>
                            <span className="ml-1">{displaySizes.join(', ')}</span>
                            {product.sizes?.length > 3 && (
                                <span className="text-gray-400 ml-1">+{product.sizes.length - 3} more</span>
                            )}
                        </div>
                    )}

                    {/* Colors */}
                    {displayColors.length > 0 && (
                        <div className="flex items-center text-xs text-gray-600 font-serif">
                            <FiDroplet size={12} className="mr-1 text-gold" />
                            <span className="font-medium">Colors: </span>
                            <span className="ml-1">{displayColors.join(', ')}</span>
                            {product.colors?.length > 2 && (
                                <span className="text-gray-400 ml-1">+{product.colors.length - 2} more</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Material */}
                {product.material && (
                    <div className="flex items-center text-xs text-gray-600 mb-3 font-serif">
                        <FiPackage size={12} className="mr-1 text-gold" />
                        <span>{product.material}</span>
                    </div>
                )}

                {/* Style Tags */}
                {product.styleTags && product.styleTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.styleTags.slice(0, 3).map((tag, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-xs bg-gold/20 text-black px-2 py-1 rounded-full font-medium font-serif border border-gold/30"
                            >
                                {tag}
                            </motion.span>
                        ))}
                        {product.styleTags.length > 3 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-serif">
                                +{product.styleTags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Occasion Tags */}
                {product.occasion && product.occasion.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {product.occasion.slice(0, 2).map((occasion, index) => (
                            <span
                                key={index}
                                className="text-xs bg-black text-gold px-2 py-1 rounded-full font-medium flex items-center font-serif border border-gold/30"
                            >
                                <FiHeart size={10} className="mr-1" />
                                {occasion}
                            </span>
                        ))}
                    </div>
                )}

                {/* Production Time */}
                {product.productionTime && (
                    <div className="flex items-center text-xs text-gray-600 mb-3 font-serif">
                        <FiTruck size={12} className="mr-1 text-gold" />
                        <span>{product.productionTime}</span>
                    </div>
                )}

                {/* Price and Action Section */}
                <div className="flex items-center justify-between mt-auto">
                    {/* Price Display */}
                    <div className="flex flex-col">
                        {hasDiscount ? (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-black font-serif">
                                    ₦{displayPrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 line-through font-serif">
                                    ₦{originalPrice.toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-black font-serif">
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
                        className={`flex items-center px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 font-serif border border-gold/30 ${
                            (!product.isCustomizable && product.countInStock === 0) 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : isCustomizable
                                    ? 'bg-black text-gold hover:bg-gray-800 hover:shadow-lg'
                                    : 'bg-black text-gold hover:bg-gray-800 hover:shadow-lg'
                        }`}
                    >
                        {isCustomizable ? (
                            <>
                                <FiScissors className="mr-2" size={16} />
                                Customize
                            </>
                        ) : product.countInStock === 0 ? (
                            'Out of Stock'
                        ) : (
                            <>
                                <FiShoppingCart className="mr-2" size={16} />
                                Add to Cart
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Rating and Reviews */}
                {(product.rating || product.reviewCount) && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <FiStar className="text-yellow-400 mr-1" size={14} />
                                <span className="text-sm font-medium text-gray-700 font-serif">
                                    {product.rating?.toFixed(1) || '4.5'}
                                </span>
                            </div>
                            {product.reviewCount && (
                                <>
                                    <span className="text-xs text-gray-500 mx-2">•</span>
                                    <span className="text-xs text-gray-500 font-serif">
                                        {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''}
                                    </span>
                                </>
                            )}
                        </div>
                        
                        {/* Delivery Estimate */}
                        {product.deliveryEstimate && (
                            <span className="text-xs text-gray-500 font-serif">
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
                                        ? `Only ${product.countInStock} left` 
                                        : 'In Stock'
                                    : 'Out of Stock'
                                }
                            </span>
                        </div>
                        
                        {/* Featured Badge */}
                        {product.isFeatured && (
                            <span className="bg-gold/20 text-black px-2 py-1 rounded-full text-xs font-medium font-serif border border-gold/30">
                                Featured
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/50 rounded-2xl pointer-events-none transition-all duration-300"></div>
        </motion.div>
    );
}
