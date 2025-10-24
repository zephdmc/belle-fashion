import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import CustomCakeForm from '../../components/orders/CustomCakeForm';
import CartSummary from '../../components/cart/CartSummary';
import { useAuth } from '../../context/AuthContext';

import { 
    FiShoppingBag, 
    FiArrowRight, 
    FiTrash2,
    FiHeart,
    FiShoppingCart,
    FiPackage,
    FiScissors,
    FiStar,
    FiTruck,
    FiShield,
    FiRefreshCw
} from 'react-icons/fi';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);

// Empty Cart Component - Now accepts handleCustomOrderClick as a prop
const EmptyCart = ({ onCustomOrderClick }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
    >
        <div className="text-center max-w-md mx-auto">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-gradient-to-br from-gold/20 to-yellow-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gold/30"
            >
                <FiShoppingCart className="text-4xl text-gold/60" />
            </motion.div>
            
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-4 font-serif"
            >
                Your Style Cart is Empty
            </motion.h1>
            
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gold/70 mb-8 text-lg font-serif"
            >
                Discover our latest contemporary collections and custom design services to elevate your style.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <MotionLink
                    to="/products"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-4 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-lg group border border-gold/30 font-serif"
                >
                    <FiShoppingBag className="text-sm" />
                    Shop Collections
                    <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                </MotionLink>
                
                <motion.button
                    onClick={onCustomOrderClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-gold/10 hover:bg-gold/20 text-gold py-4 px-8 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-gold/20 font-serif"
                >
                    <FiScissors className="text-sm" />
                    Create Custom Design
                </motion.button>
            </motion.div>

            {/* Fashion Categories */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 grid grid-cols-2 gap-4"
            >
                {[
                    { name: 'Dresses', color: 'from-gold to-yellow-600', href: '/collections?category=dresses' },
                    { name: 'Tops & Blouses', color: 'from-gray-800 to-gray-600', href: '/collections?category=tops' },
                    { name: 'Bottoms', color: 'from-gold to-yellow-600', href: '/collections?category=bottoms' },
                    { name: 'Custom Designs', color: 'from-gray-800 to-gray-600', href: '/custom-order' }
                ].map((category, index) => (
                    <MotionLink
                        key={category.name}
                        to={category.href}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`bg-gradient-to-r ${category.color} text-white p-4 rounded-2xl text-center font-medium shadow-lg hover:shadow-xl transition-all duration-300 font-serif`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                    >
                        {category.name}
                    </MotionLink>
                ))}
            </motion.div>

            {/* Seasonal Collections */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-8"
            >
                <h3 className="text-gold/70 text-sm font-semibold mb-4 font-serif">Featured Collections</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { name: 'Summer Collection', href: '/collections?collection=summer' },
                        { name: 'New Arrivals', href: '/collections?new=true' },
                        { name: 'Wedding Collection', href: '/collections?occasion=wedding' },
                        { name: 'Office Wear', href: '/collections?category=office' }
                    ].map((collection, index) => (
                        <MotionLink
                            key={collection.name}
                            to={collection.href}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gold/5 hover:bg-gold/10 text-gold/80 hover:text-gold text-xs p-3 rounded-xl text-center transition-all duration-300 border border-gold/10 hover:border-gold/20 font-serif"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 + index * 0.1 }}
                        >
                            {collection.name}
                        </MotionLink>
                    ))}
                </div>
            </motion.div>
        </div>
    </motion.div>
);

// Cart Header with Actions
const CartHeader = ({ cartCount, onClearCart, hasCustomItems }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
    >
        <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-serif">Style Cart</h1>
            <div className="flex flex-wrap items-center gap-4 text-gold/70">
                <p className="flex items-center gap-2 font-serif">
                    <FiShoppingBag className="text-sm" />
                    {cartCount} fashion {cartCount === 1 ? 'piece' : 'pieces'} selected
                </p>
                {hasCustomItems && (
                    <span className="flex items-center gap-1 bg-gold/30 text-gold px-3 py-1 rounded-full text-sm font-serif">
                        <FiScissors className="text-xs" />
                        Custom Designs
                    </span>
                )}
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearCart}
                className="flex items-center gap-2 bg-gold/10 hover:bg-red-500/20 text-gold/70 hover:text-red-300 py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-gold/20 hover:border-red-500/30 font-serif"
            >
                <FiTrash2 className="text-sm" />
                Clear Style Cart
            </motion.button>
            
            <MotionLink
                to="/collections"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-gold/20 font-serif"
            >
                <FiArrowRight className="text-sm rotate-180" />
                Continue Shopping
            </MotionLink>
        </div>
    </motion.div>
);

// Size Guide Helper
const SizeGuideHelper = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gold/20 border border-gold/30 rounded-2xl p-4 mb-6"
    >
        <div className="flex items-start gap-3">
            <FiStar className="text-gold mt-0.5 flex-shrink-0" />
            <div>
                <h4 className="text-gold font-semibold mb-1 font-serif">Perfect Fit Guide</h4>
                <p className="text-gold/80 text-sm font-serif">
                    Unsure about your size? Check our comprehensive size guide for the perfect fit.
                </p>
                <MotionLink
                    to="/size-guide"
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-1 text-gold hover:text-yellow-400 text-sm font-medium mt-2 transition-colors font-serif"
                >
                    View Size Guide
                    <FiArrowRight className="text-xs" />
                </MotionLink>
            </div>
        </div>
    </motion.div>
);

export default function CartPage() {
    const { cartItems, cartCount, clearCart } = useCart();
    const [showCustomOrderForm, setShowCustomOrderForm] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate(); // Added missing navigate

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
    
    // Check if cart has custom items
    const hasCustomItems = cartItems.some(item => item.isCustom);

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <EmptyCart onCustomOrderClick={handleCustomOrderClick} />
                </div>
            </div>
        );
    }
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <CartHeader cartCount={cartCount} onClearCart={clearCart} hasCustomItems={hasCustomItems} />

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Cart Items */}
                    <div className="xl:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-black/40 backdrop-blur-sm rounded-3xl border border-gold/20 overflow-hidden"
                        >
                            {/* Cart Items Header */}
                            <div className="bg-gradient-to-r from-gold/20 to-yellow-600/20 px-6 py-4 border-b border-gold/20">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gold flex items-center gap-3 font-serif">
                                        <FiShoppingBag className="text-gold" />
                                        Your Style Selection ({cartCount})
                                        {hasCustomItems && (
                                            <span className="bg-gold/30 text-black px-2 py-1 rounded-full text-sm font-normal font-serif">
                                                + Custom Designs
                                            </span>
                                        )}
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearCart}
                                        className="flex items-center gap-2 text-gold/70 hover:text-red-300 text-sm font-medium transition-colors duration-300 font-serif"
                                    >
                                        <FiTrash2 className="text-sm" />
                                        Clear All
                                    </motion.button>
                                </div>
                            </div>

                            {/* Size Guide Helper */}
                            <SizeGuideHelper />

                            {/* Cart Items List */}
                            <div className="divide-y divide-gold/10">
                                <AnimatePresence>
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id || `${item.productId}-${item.size}-${item.color}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ 
                                                duration: 0.5,
                                                delay: index * 0.1 
                                            }}
                                            layout
                                        >
                                            <CartItem item={item} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Additional Actions */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="p-6 bg-gold/5 border-t border-gold/10"
                            >
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <MotionLink
                                            to="/collections"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 text-gold/70 hover:text-gold transition-colors duration-300 font-serif"
                                        >
                                            <FiArrowRight className="text-sm rotate-180" />
                                            Continue Shopping
                                        </MotionLink>
                                        
                                        <MotionLink
                                            to="/wishlist"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 text-gold/70 hover:text-gold transition-colors duration-300 font-serif"
                                        >
                                            <FiHeart className="text-sm" />
                                            View Wishlist
                                        </MotionLink>

                                        <MotionLink
                                            to="/custom-order"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 text-gold/70 hover:text-gold transition-colors duration-300 font-serif"
                                        >
                                            <FiScissors className="text-sm" />
                                            Custom Design
                                        </MotionLink>
                                    </div>
                                    
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-gold/5 rounded-xl px-4 py-2 border border-gold/10"
                                    >
                                        <span className="text-gold font-semibold font-serif">
                                            Total: {cartCount} {cartCount === 1 ? 'fashion piece' : 'fashion pieces'}
                                        </span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Fashion Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
                        >
                            {[
                                { 
                                    icon: FiTruck, 
                                    title: 'Premium Shipping', 
                                    description: 'Careful handling',
                                    color: 'from-gold to-yellow-600'
                                },
                                { 
                                    icon: FiRefreshCw, 
                                    title: 'Easy Returns', 
                                    description: 'Quality guarantee',
                                    color: 'from-gray-800 to-gray-600'
                                },
                                { 
                                    icon: FiShield, 
                                    title: 'Quality Craftsmanship', 
                                    description: 'Premium materials',
                                    color: 'from-gold to-yellow-600'
                                },
                                { 
                                    icon: FiScissors, 
                                    title: 'Perfect Fit', 
                                    description: 'Size guidance',
                                    color: 'from-gray-800 to-gray-600'
                                }
                            ].map((badge, index) => (
                                <motion.div
                                    key={badge.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1 + index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-gold/20 text-center group hover:border-gold/40 transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <badge.icon className="text-white text-lg" />
                                    </div>
                                    <h3 className="text-gold font-semibold mb-1 text-sm font-serif">{badge.title}</h3>
                                    <p className="text-gold/60 text-xs font-serif">{badge.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Custom Design CTA */}
                        {!hasCustomItems && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.3 }}
                                className="mt-6 bg-gradient-to-r from-gold/20 to-yellow-600/20 border border-gold/30 rounded-2xl p-6"
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
                                            <FiScissors className="text-gold text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-gold font-semibold mb-1 font-serif">Need Something Unique?</h3>
                                            <p className="text-gold/70 text-sm font-serif">
                                                Create your custom designed outfit with our expert tailors.
                                            </p>
                                        </div>
                                    </div>
                                    <MotionLink
                                        to="/custom-order"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gold text-black hover:bg-yellow-500 py-3 px-6 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap border border-gold/30 font-serif"
                                    >
                                        Start Custom Design
                                    </MotionLink>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Cart Summary */}
                    <div className="xl:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="sticky top-8"
                        >
                            <CartSummary />
                        </motion.div>
                    </div>
                </div>
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
