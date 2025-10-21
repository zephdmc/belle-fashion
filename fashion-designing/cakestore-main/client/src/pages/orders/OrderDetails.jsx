import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getOrderById } from '../../services/orderService';
import { 
    FiArrowLeft, 
    FiPackage, 
    FiTruck, 
    FiCreditCard, 
    FiCalendar,
    FiUser,
    FiMapPin,
    FiMail,
    FiPhone,
    FiInfo,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiScissors,
    FiTag,
    FiEdit3,
    FiRefreshCw,
    FiShoppingBag
} from 'react-icons/fi';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);

// Loading Skeleton Component
const OrderSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-6 bg-yellow-500/20 rounded w-48 mb-4"></div>
                <div className="h-8 bg-yellow-500/20 rounded w-64 mb-2"></div>
                <div className="h-4 bg-yellow-500/20 rounded w-96"></div>
            </div>
            
            {/* Tabs Skeleton */}
            <div className="flex gap-4 mb-6">
                <div className="h-10 bg-yellow-500/20 rounded w-32"></div>
                <div className="h-10 bg-yellow-500/20 rounded w-32"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-yellow-500/10 rounded-2xl p-6 h-64"></div>
                    <div className="bg-yellow-500/10 rounded-2xl p-6 h-48"></div>
                </div>
                <div className="space-y-6">
                    <div className="bg-yellow-500/10 rounded-2xl p-6 h-48"></div>
                    <div className="bg-yellow-500/10 rounded-2xl p-6 h-64"></div>
                </div>
            </div>
        </div>
    </div>
);

// Status Badge Component
const StatusBadge = ({ status, isPaid, isDelivered }) => {
    const statusConfig = {
        pending: { color: 'from-yellow-500 to-yellow-600', text: 'Pending Payment', icon: FiClock },
        confirmed: { color: 'from-yellow-400 to-yellow-500', text: 'Confirmed', icon: FiCheckCircle },
        processing: { color: 'from-amber-500 to-yellow-500', text: 'Processing', icon: FiPackage },
        ready_to_ship: { color: 'from-orange-500 to-amber-500', text: 'Ready to Ship', icon: FiTruck },
        shipped: { color: 'from-yellow-600 to-amber-600', text: 'Shipped', icon: FiTruck },
        delivered: { color: 'from-green-600 to-emerald-500', text: 'Delivered', icon: FiCheckCircle },
        cancelled: { color: 'from-red-600 to-red-500', text: 'Cancelled', icon: FiAlertCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${config.color} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-yellow-400/30`}
        >
            <Icon className="text-sm" />
            {config.text}
        </motion.div>
    );
};

// Order Type Badge
const OrderTypeBadge = ({ orderType }) => {
    const typeConfig = {
        standard: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Ready-to-Wear', icon: FiShoppingBag },
        custom: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', text: 'Custom Design', icon: FiScissors },
        mixed: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', text: 'Mixed Order', icon: FiTag }
    };

    const config = typeConfig[orderType] || typeConfig.standard;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon className="text-xs" />
            {config.text}
        </span>
    );
};

// Tab Navigation Component
const TabNavigation = ({ activeTab, setActiveTab, showCustomTab, orderType }) => (
    <div className="flex space-x-1 bg-black/30 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-yellow-500/20">
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('orderInfo')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'orderInfo' 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg' 
                    : 'text-yellow-100/70 hover:text-yellow-100 hover:bg-yellow-500/10'
            }`}
        >
            <FiInfo className="text-sm" />
            Order Information
        </motion.button>
        
        {(showCustomTab || orderType === 'custom' || orderType === 'mixed') && (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('customDetails')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'customDetails' 
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg' 
                        : 'text-yellow-100/70 hover:text-yellow-100 hover:bg-yellow-500/10'
                }`}
            >
                <FiScissors className="text-sm" />
                Custom Details
            </motion.button>
        )}

        {(order.trackingNumber || order.status === 'shipped' || order.status === 'delivered') && (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('tracking')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'tracking' 
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg' 
                        : 'text-yellow-100/70 hover:text-yellow-100 hover:bg-yellow-500/10'
                }`}
            >
                <FiTruck className="text-sm" />
                Tracking
            </motion.button>
        )}
    </div>
);

export default function OrderDetails() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('orderInfo');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const response = await getOrderById(id);
                setOrder(response?.data || response || null);
            } catch (err) {
                setError(err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, currentUser]);

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

    if (loading) return <OrderSkeleton />;

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center">
                        <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-yellow-100 mb-2">Error Loading Order</h3>
                        <p className="text-yellow-100/80 mb-6">{error}</p>
                        <MotionLink
                            to="/orders"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                        >
                            <FiArrowLeft className="text-sm" />
                            Back to Orders
                        </MotionLink>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="bg-black/30 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FiPackage className="text-2xl text-black" />
                        </div>
                        <h3 className="text-2xl font-bold text-yellow-100 mb-3">Order Not Found</h3>
                        <p className="text-yellow-100/70 mb-8">We couldn't find the order you're looking for.</p>
                        <MotionLink
                            to="/orders"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black py-3 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                        >
                            <FiArrowLeft className="text-sm" />
                            Back to Orders
                        </MotionLink>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Custom Order Details Component
    const CustomOrderDetails = () => (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-6"
        >
            {/* Custom Orders */}
            {order.customOrders?.map((customOrder, index) => (
                <motion.div
                    key={customOrder.id || index}
                    variants={containerVariants}
                    className="bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/20 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-6 py-4 border-b border-yellow-500/20">
                        <h2 className="text-xl font-semibold text-yellow-100 flex items-center gap-3">
                            <FiScissors className="text-amber-300" />
                            Custom Design #{customOrder.id?.substring(0, 8) || `#${index + 1}`}
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Design Specifications */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-yellow-100 mb-4 flex items-center gap-2">
                                <FiEdit3 className="text-amber-300" />
                                Design Specifications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: 'Design Type', value: customOrder.designType },
                                    { label: 'Occasion', value: customOrder.occasion },
                                    { label: 'Fabric Type', value: customOrder.fabricType },
                                    { label: 'Fabric Color', value: customOrder.fabricColor },
                                    { label: 'Material Quality', value: customOrder.materialQuality },
                                    { label: 'Priority', value: customOrder.priority },
                                ].filter(item => item.value).map((item, idx) => (
                                    <motion.div
                                        key={item.label}
                                        variants={itemVariants}
                                        className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20"
                                    >
                                        <h4 className="text-sm font-medium text-amber-300 mb-1">{item.label}</h4>
                                        <p className="text-yellow-100 font-medium capitalize">{item.value}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Measurements */}
                        {customOrder.measurements && (
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold text-yellow-100 mb-4 flex items-center gap-2">
                                    <FiInfo className="text-amber-300" />
                                    Body Measurements
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(customOrder.measurements).map(([key, value]) => (
                                        value && (
                                            <motion.div
                                                key={key}
                                                variants={itemVariants}
                                                className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20 text-center"
                                            >
                                                <h4 className="text-sm font-medium text-amber-300 mb-1 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h4>
                                                <p className="text-yellow-100 font-medium">{value}</p>
                                            </motion.div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Design Features */}
                        {(customOrder.designFeatures?.length > 0 || customOrder.embellishments?.length > 0) && (
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold text-yellow-100 mb-4">Design Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {customOrder.designFeatures?.map((feature, idx) => (
                                        <motion.span
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-yellow-500/20 text-yellow-300 px-3 py-2 rounded-xl text-sm border border-yellow-500/30"
                                        >
                                            {feature}
                                        </motion.span>
                                    ))}
                                    {customOrder.embellishments?.map((embellishment, idx) => (
                                        <motion.span
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-amber-500/20 text-amber-300 px-3 py-2 rounded-xl text-sm border border-amber-500/30"
                                        >
                                            {embellishment}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timeline & Notes */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {customOrder.eventDate && (
                                <motion.div variants={itemVariants} className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                    <h4 className="text-sm font-medium text-amber-300 mb-1 flex items-center gap-2">
                                        <FiCalendar className="text-sm" />
                                        Event Date
                                    </h4>
                                    <p className="text-yellow-100 font-medium">
                                        {new Date(customOrder.eventDate).toLocaleDateString()}
                                    </p>
                                </motion.div>
                            )}
                            {customOrder.requiredByDate && (
                                <motion.div variants={itemVariants} className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                    <h4 className="text-sm font-medium text-amber-300 mb-1">Required By</h4>
                                    <p className="text-yellow-100 font-medium">
                                        {new Date(customOrder.requiredByDate).toLocaleDateString()}
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Special Requests */}
                        {customOrder.specialRequests && (
                            <motion.div variants={itemVariants} className="md:col-span-2 bg-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
                                <h4 className="text-sm font-medium text-yellow-300 mb-1">Special Requests</h4>
                                <p className="text-yellow-100 whitespace-pre-wrap">{customOrder.specialRequests}</p>
                            </motion.div>
                        )}

                        {/* Inspiration Images */}
                        {customOrder.inspirationImages?.length > 0 && (
                            <motion.div variants={itemVariants} className="md:col-span-2">
                                <h4 className="text-lg font-semibold text-yellow-100 mb-4">Inspiration Images</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {customOrder.inspirationImages.map((image, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.05 }}
                                            className="relative rounded-2xl overflow-hidden border-2 border-yellow-500/30 cursor-pointer"
                                            onClick={() => window.open(image, '_blank')}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`Inspiration ${idx + 1}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-2">
                                                <span className="text-yellow-100 text-xs">Click to view</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );

    // Tracking Component
    const TrackingDetails = () => (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/20 overflow-hidden"
        >
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-6 py-4 border-b border-yellow-500/20">
                <h2 className="text-xl font-semibold text-yellow-100 flex items-center gap-3">
                    <FiTruck className="text-amber-300" />
                    Order Tracking
                </h2>
            </div>
            <div className="p-6">
                {order.trackingNumber ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div variants={itemVariants} className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                <h3 className="text-sm font-medium text-amber-300 mb-1">Courier</h3>
                                <p className="text-yellow-100 font-medium text-lg">{order.shippingCarrier}</p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                <h3 className="text-sm font-medium text-amber-300 mb-1">Tracking Number</h3>
                                <p className="text-yellow-100 font-medium text-lg font-mono">{order.trackingNumber}</p>
                            </motion.div>
                        </div>
                        
                        {order.shippedAt && (
                            <motion.div variants={itemVariants} className="bg-green-600/20 rounded-xl p-4 border border-green-500/30">
                                <h3 className="text-sm font-medium text-green-300 mb-1">Shipped On</h3>
                                <p className="text-yellow-100 font-medium">
                                    {new Date(order.shippedAt).toLocaleDateString()} at {new Date(order.shippedAt).toLocaleTimeString()}
                                </p>
                            </motion.div>
                        )}

                        {order.estimatedDeliveryDate && (
                            <motion.div variants={itemVariants} className="bg-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
                                <h3 className="text-sm font-medium text-yellow-300 mb-1">Estimated Delivery</h3>
                                <p className="text-yellow-100 font-medium">
                                    {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                                </p>
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="text-center">
                            <p className="text-yellow-100/70 mb-4">Track your package on the courier's website</p>
                            <motion.a
                                href={`https://tracking.com/${order.trackingNumber}`} // Replace with actual tracking URL
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                            >
                                <FiTruck className="text-sm" />
                                Track Package
                            </motion.a>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div variants={itemVariants} className="text-center py-8">
                        <FiPackage className="text-4xl text-yellow-500/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-yellow-100 mb-2">Tracking Not Available</h3>
                        <p className="text-yellow-100/70">Tracking information will be available once your order ships.</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <MotionLink
                                to="/orders"
                                whileHover={{ scale: 1.05, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-100 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-yellow-500/20"
                            >
                                <FiArrowLeft className="text-sm" />
                                Back to Orders
                            </MotionLink>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-yellow-100">
                                        {order.orderNumber || `Order #${order.id?.substring(0, 8) || 'N/A'}`}
                                    </h1>
                                    <OrderTypeBadge orderType={order.orderType} />
                                </div>
                                <p className="text-yellow-100/80 flex items-center gap-2 mt-1">
                                    <FiCalendar className="text-sm" />
                                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                        <StatusBadge 
                            status={order.status} 
                            isPaid={order.isPaid} 
                            isDelivered={order.isDelivered} 
                        />
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <TabNavigation 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    showCustomTab={order.isCustomOrder} 
                    orderType={order.orderType}
                />

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {activeTab === 'orderInfo' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Order Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/20 overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-6 py-4 border-b border-yellow-500/20">
                                        <h2 className="text-xl font-semibold text-yellow-100 flex items-center gap-3">
                                            <FiPackage className="text-amber-300" />
                                            Order Items
                                            {order.items?.length > 0 && ` (${order.items.length})`}
                                            {order.customOrders?.length > 0 && ` + ${order.customOrders.length} Custom Designs`}
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-yellow-500/20">
                                        {/* Standard Items */}
                                        {order.items?.map((item, index) => (
                                            <motion.div
                                                key={item.id || index}
                                                variants={itemVariants}
                                                className="p-6 flex items-center gap-4 hover:bg-yellow-500/10 transition-all duration-300"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <img
                                                            className="h-20 w-16 rounded-2xl object-cover border-2 border-yellow-500/30"
                                                            src={item.image || '/images/placeholder-fashion.png'}
                                                            alt={item.name}
                                                        />
                                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                                            {item.quantity}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-yellow-100 truncate">
                                                        <Link 
                                                            to={`/products/${item.productId}`}
                                                            className="hover:text-amber-300 transition-colors"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {item.size && (
                                                            <span className="text-sm text-amber-300 bg-amber-500/20 px-2 py-1 rounded">
                                                                Size: {item.size}
                                                            </span>
                                                        )}
                                                        {item.color && (
                                                            <span className="text-sm text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded">
                                                                Color: {item.color}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="text-amber-300 font-medium">
                                                            ${item.price?.toLocaleString()} each
                                                        </p>
                                                        <p className="text-yellow-100 font-bold text-lg">
                                                            ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Payment Information */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/20 overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-6 py-4 border-b border-yellow-500/20">
                                        <h2 className="text-xl font-semibold text-yellow-100 flex items-center gap-3">
                                            <FiCreditCard className="text-amber-300" />
                                            Payment Information
                                        </h2>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                            <h3 className="text-sm font-medium text-amber-300 mb-1">Payment Method</h3>
                                            <p className="text-yellow-100 font-medium capitalize">{order.paymentMethod}</p>
                                        </div>
                                        <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                            <h3 className="text-sm font-medium text-amber-300 mb-1">Payment Status</h3>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                                order.isPaid 
                                                    ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                                                    : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                                            }`}>
                                                {order.isPaid ? <FiCheckCircle className="text-sm" /> : <FiClock className="text-sm" />}
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </div>
                                        {order.isPaid && (
                                            <>
                                                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                                    <h3 className="text-sm font-medium text-amber-300 mb-1">Paid At</h3>
                                                    <p className="text-yellow-100 font-medium">
                                                        {new Date(order.paidAt).toLocaleDateString()} at {new Date(order.paidAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                                    <h3 className="text-sm font-medium text-amber-300 mb-1">Transaction ID</h3>
                                                    <p className="text-yellow-100 font-mono text-sm">
                                                        {order.paymentResult?.id || 'N/A'}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Order Summary */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/20 overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-6 py-4 border-b border-yellow-500/20">
                                        <h2 className="text-xl font-semibold text-yellow-100">Order Summary</h2>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {[
                                            { label: 'Items', value: order.itemsPrice },
                                            { label: 'Custom Designs', value: order.customOrdersPrice },
                                            { label: 'Shipping', value: order.shippingPrice },
                                            { label: 'Tax', value: order.taxPrice },
                                        ].filter(item => item.value > 0).map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                variants={itemVariants}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-yellow-100/80">{item.label}</span>
                                                <span className="text-yellow-100 font-medium">${item.value?.toLocaleString()}</span>
                                            </motion.div>
                                        ))}
                                        {order.discountAmount > 0 && (
                                            <motion.div
                                                variants={itemVariants}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-yellow-100/80">Discount</span>
                                                <span className="text-red-300 font-medium">-${order.discountAmount?.toLocaleString()}</span>
                                            </motion.div>
                                        )}
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex justify-between items-center pt-4 border-t border-yellow-500/20"
                                        >
                                            <span className="text-xl font-bold text-yellow-100">Total</span>
                                            <span className="text-xl font-bold text-yellow-100">${order.totalPrice?.toLocaleString()}</span>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Shipping Information */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/20 overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-6 py-4 border-b border-yellow-500/20">
                                        <h2 className="text-xl font-semibold text-yellow-100 flex items-center gap-3">
                                            <FiTruck className="text-amber-300" />
                                            Shipping Information
                                        </h2>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                            <h3 className="text-sm font-medium text-amber-300 mb-2 flex items-center gap-2">
                                                <FiUser className="text-sm" />
                                                Contact
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-yellow-100 flex items-center gap-2">
                                                    <FiMail className="text-sm text-amber-300" />
                                                    {order.userEmail || order.shippingAddress?.email}
                                                </p>
                                                {order.shippingAddress?.phone && (
                                                    <p className="text-yellow-100 flex items-center gap-2">
                                                        <FiPhone className="text-sm text-amber-300" />
                                                        {order.shippingAddress.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                            <h3 className="text-sm font-medium text-amber-300 mb-2 flex items-center gap-2">
                                                <FiMapPin className="text-sm" />
                                                Shipping Address
                                            </h3>
                                            <p className="text-yellow-100 text-sm leading-relaxed">
                                                {order.shippingAddress?.address},<br />
                                                {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                                                {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                                            </p>
                                        </div>
                                        {order.deliveryInstructions && (
                                            <div className="bg-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
                                                <h3 className="text-sm font-medium text-yellow-300 mb-1">Delivery Instructions</h3>
                                                <p className="text-yellow-100 text-sm">{order.deliveryInstructions}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'customDetails' && <CustomOrderDetails />}
                    {activeTab === 'tracking' && <TrackingDetails />}
                </motion.div>
            </div>
        </div>
    );
}
