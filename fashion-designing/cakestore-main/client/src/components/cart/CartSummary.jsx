import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingBag, 
  FiTruck, 
  FiPercent, 
  FiCreditCard, 
  FiTrash2,
  FiArrowRight,
  FiShoppingCart,
  FiShield
} from 'react-icons/fi';

export default function CartSummary() {
    const { cartTotal, cartCount, clearCart, cartItems } = useCart();

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
            clearCart();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.02, 
            y: -2,
            transition: { duration: 0.2 }
        },
        tap: { scale: 0.98 }
    };

    const isCartEmpty = cartCount === 0;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-8"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black px-6 py-4 text-white border-b border-gold/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-gold/30">
                        <FiShoppingBag className="text-lg text-gold" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-serif">Style Summary</h3>
                        <p className="text-gold/80 text-sm font-serif">{cartCount} fashion item{cartCount !== 1 ? 's' : ''} selected</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Summary Items */}
                <motion.div 
                    variants={itemVariants}
                    className="space-y-4 mb-6"
                >
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center border border-gold/20">
                                <FiShoppingCart className="text-gold text-sm" />
                            </div>
                            <span className="text-gray-600 font-serif">Subtotal</span>
                        </div>
                        <span className="font-semibold text-gray-800 font-serif">₦{cartTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center border border-gold/20">
                                <FiTruck className="text-gold text-sm" />
                            </div>
                            <span className="text-gray-600 font-serif">Premium Shipping</span>
                        </div>
                        <span className="text-green-600 font-semibold font-serif">Calculated at checkout</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center border border-gold/20">
                                <FiPercent className="text-gold text-sm" />
                            </div>
                            <span className="text-gray-600 font-serif">Tax & Fees</span>
                        </div>
                        <span className="text-green-600 font-semibold font-serif">Included</span>
                    </div>
                </motion.div>

                {/* Total */}
                <motion.div
                    variants={itemVariants}
                    className="border-t border-gray-200 pt-4 mb-6"
                >
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gold/10 to-yellow-600/10 rounded-2xl border border-gold/20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-600 rounded-lg flex items-center justify-center">
                                <FiCreditCard className="text-white text-sm" />
                            </div>
                            <span className="font-bold text-gray-800 text-lg font-serif">Total Amount</span>
                        </div>
                        <span className="font-bold text-gold text-xl font-serif">₦{cartTotal.toLocaleString()}</span>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                    variants={itemVariants}
                    className="space-y-3"
                >
                    <AnimatePresence>
                        {!isCartEmpty && (
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Link
                                    to="/checkout"
                                    className="w-full bg-gradient-to-r from-gold to-yellow-600 text-black py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 block hover:from-yellow-500 hover:to-yellow-700 border border-gold/30 font-serif"
                                >
                                    <FiCreditCard className="text-lg" />
                                    Complete Your Style Order
                                    <FiArrowRight className="text-lg" />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {!isCartEmpty && (
                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={handleClearCart}
                                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-2xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-3 font-serif"
                            >
                                <FiTrash2 className="text-lg" />
                                Clear Style Selections
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {isCartEmpty && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold/20">
                                <FiShoppingCart className="text-gold text-2xl" />
                            </div>
                            <p className="text-gray-500 mb-4 font-serif">Your style cart is empty</p>
                            <Link
                                to="/collections"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-600 text-black py-3 px-6 rounded-2xl font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 border border-gold/30 font-serif"
                            >
                                <FiShoppingBag />
                                Explore Collections
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                {/* Security & Benefits */}
                {!isCartEmpty && (
                    <motion.div
                        variants={itemVariants}
                        className="mt-6 pt-6 border-t border-gray-200 space-y-3"
                    >
                        <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center border border-green-200">
                                <FiShield className="text-green-600 text-xs" />
                            </div>
                            <span className="font-serif">Secure SSL Encryption • Style Protection</span>
                        </div>
                        <div className="text-center text-xs text-gold/60 font-serif">
                            Free returns • Quality guarantee • Premium packaging
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Floating decorative elements */}
            <AnimatePresence>
                {!isCartEmpty && (
                    <>
                        <motion.div
                            animate={{ 
                                y: [0, -10, 0],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -top-2 -right-2 w-4 h-4 bg-gold/30 rounded-full"
                        />
                        <motion.div
                            animate={{ 
                                y: [0, 8, 0],
                                opacity: [0.4, 0.7, 0.4]
                            }}
                            transition={{ 
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                            className="absolute -bottom-2 -left-2 w-3 h-3 bg-gold/40 rounded-full"
                        />
                    </>
                )}
            </AnimatePresence>

            {/* Bellebyokien Brand Element */}
            <div className="absolute bottom-4 right-4">
                <div className="bg-gold/10 text-gold text-xs px-3 py-1 rounded-full border border-gold/20 font-medium font-serif">
                    Bellebyokien
                </div>
            </div>
        </motion.div>
    );
}
