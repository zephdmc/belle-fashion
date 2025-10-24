import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTruck, 
  FiMapPin, 
  FiHome, 
  FiMail, 
  FiPhone,
  FiNavigation,
  FiCreditCard,
  FiArrowRight,
  FiShoppingBag,
  FiTag,
  FiUser
} from 'react-icons/fi';

export default function ShippingForm({ onSubmit, isCustomOrder = false }) {
    const { currentUser } = useAuth();
    const { cartTotal } = useCart();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nigeria',
        phone: '',
        promocode: '',
        email: currentUser?.email || '',
        deliveryMethod: 'pickup',
        shippingPrice: 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const deliveryOptions = [
        { 
            value: 'pickup', 
            label: 'Store Pickup', 
            price: 0, 
            description: 'Collect from our store',
            icon: FiHome,
            color: 'gold'
        },
        { 
            value: 'portHarcourt', 
            label: 'Port Harcourt', 
            price: 3500, 
            description: 'Fast city delivery',
            icon: FiNavigation,
            color: 'gold'
        },
        { 
            value: 'outsidePortHarcourt', 
            label: 'Outside PH', 
            price: 6500, 
            description: 'Nationwide delivery',
            icon: FiTruck,
            color: 'gold'
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDeliveryChange = (method) => {
        const selectedOption = deliveryOptions.find(opt => opt.value === method);
        setFormData(prev => ({
            ...prev,
            deliveryMethod: method,
            shippingPrice: selectedOption.price
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.email) {
            alert('Please enter a valid email address');
            return;
        }
        if (!formData.firstName || !formData.lastName) {
            alert('Please enter your first and last name');
            return;
        }
        if (!formData.phone) {
            alert('Please enter your phone number');
            return;
        }
        if (!formData.address) {
            alert('Please enter your address');
            return;
        }
        
        setIsSubmitting(true);
        // Simulate loading for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        onSubmit(formData);
        setIsSubmitting(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
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

    const selectedDelivery = deliveryOptions.find(opt => opt.value === formData.deliveryMethod);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto px-2"
        >
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-black to-gray-900 rounded-2xl p-4 text-white mb-4 relative overflow-hidden border border-gold/30"
            >
                <div className="absolute inset-0 bg-gold/10 backdrop-blur-sm"></div>
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-gold/30">
                        <FiMapPin className="text-xl text-gold" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold mb-1">Shipping Information</h2>
                        <p className="text-gold/80 text-xs">
                            {isCustomOrder ? 'Enter custom cake delivery details' : 'Enter your delivery details'}
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col gap-4">
                {/* Main Form */}
                <div>
                    <motion.form
                        variants={itemVariants}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
                    >
                        {/* Personal Information */}
                        <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FiUser className="text-gold text-sm" />
                                Personal Information
                            </h3>
                            <div className="grid gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="First name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FiMail className="text-gold text-sm" />
                                Contact Information
                            </h3>
                            <div className="grid gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 bg-gray-50"
                                        required
                                        disabled={!!currentUser?.email}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="08012345678"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FiHome className="text-gold text-sm" />
                                Shipping Address
                            </h3>
                            <div className="grid gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Street Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="Complete address"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                            required
                                            placeholder="Port Harcourt"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                            required
                                            placeholder="Rivers"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Country *</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 bg-white"
                                            required
                                        >
                                            <option value="Nigeria">Nigeria</option>
                                            <option value="Ghana">Ghana</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Method */}
                        <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FiTruck className="text-gold text-sm" />
                                Delivery Method
                            </h3>
                            <div className="grid gap-3">
                                {deliveryOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <motion.div
                                            key={option.value}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                                formData.deliveryMethod === option.value
                                                    ? 'border-gold bg-gold/10'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => handleDeliveryChange(option.value)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                                                        <Icon className="text-gold text-sm" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800 text-sm">{option.label}</div>
                                                        <div className="text-xs text-gray-600">{option.description}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-gray-800 text-sm">
                                                        {option.price === 0 ? 'Free' : `₦${option.price.toLocaleString()}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Promo Code */}
                        <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FiTag className="text-gold text-sm" />
                                Promo Code
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="promocode"
                                    value={formData.promocode}
                                    onChange={handleChange}
                                    className="flex-1 p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                    placeholder="Promo code (optional)"
                                />
                                <button
                                    type="button"
                                    className="px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-300 text-sm"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                            className={`w-full bg-gradient-to-r from-black to-gray-900 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-gold/30 ${
                                isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-gold/20'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full"
                                    />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Continue to Payment
                                    <FiCreditCard className="text-sm" />
                                </>
                            )}
                        </motion.button>
                    </motion.form>
                </div>

                {/* Order Summary Sidebar */}
                <div>
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
                    >
                        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiShoppingBag className="text-gold text-sm" />
                            Order Summary
                        </h3>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Subtotal</span>
                                <span>₦{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Shipping</span>
                                <span>{formData.shippingPrice === 0 ? 'Free' : `₦${formData.shippingPrice.toLocaleString()}`}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between font-bold text-gray-800 text-sm">
                                    <span>Total</span>
                                    <span>₦{(cartTotal + formData.shippingPrice).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Selected Delivery Info */}
                        {selectedDelivery && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gold/5 rounded-xl p-3 border border-gold/20 mb-4"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 bg-gold/20 rounded flex items-center justify-center">
                                        <selectedDelivery.icon className="text-gold text-xs" />
                                    </div>
                                    <span className="font-medium text-gray-800 text-sm">{selectedDelivery.label}</span>
                                </div>
                                <p className="text-xs text-gray-600">{selectedDelivery.description}</p>
                            </motion.div>
                        )}

                        <Link
                            to="/products"
                            className="w-full border border-gold/30 text-gold py-2 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gold/5 transition-all duration-300 text-sm"
                        >
                            <FiArrowRight className="transform rotate-180 text-xs" />
                            Continue Shopping
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
