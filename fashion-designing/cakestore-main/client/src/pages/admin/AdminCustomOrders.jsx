// pages/admin/AdminCustomOrders.jsx
import { useState, useEffect } from 'react';
import { getAllCustomOrders, updateCustomOrderStatus } from '../../services/customOrderService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiFilter, 
    FiPackage, 
    FiClock, 
    FiCheckCircle, 
    FiTruck, 
    FiXCircle, 
    FiRefreshCw,
    FiDollarSign,
    FiCalendar,
    FiUser,
    FiImage,
    FiAlertTriangle,
    FiScissors,
    FiEdit3,
    FiEye,
    FiMapPin,
    FiMail,
    FiPhone,
    FiHome
} from 'react-icons/fi';

const statusConfig = {
    consultation: { color: 'bg-blue-400/20 text-blue-400 border-blue-400/30', icon: FiClock, label: 'Consultation' },
    design: { color: 'bg-purple-400/20 text-purple-400 border-purple-400/30', icon: FiEdit3, label: 'Design' },
    measurement: { color: 'bg-indigo-400/20 text-indigo-400 border-indigo-400/30', icon: FiMapPin, label: 'Measurement' },
    production: { color: 'bg-orange-400/20 text-orange-400 border-orange-400/30', icon: FiScissors, label: 'Production' },
    fitting: { color: 'bg-pink-400/20 text-pink-400 border-pink-400/30', icon: FiUser, label: 'Fitting' },
    ready: { color: 'bg-green-400/20 text-green-400 border-green-400/30', icon: FiPackage, label: 'Ready' },
    shipped: { color: 'bg-teal-400/20 text-teal-400 border-teal-400/30', icon: FiTruck, label: 'Shipped' },
    delivered: { color: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30', icon: FiCheckCircle, label: 'Delivered' },
    cancelled: { color: 'bg-red-400/20 text-red-400 border-red-400/30', icon: FiXCircle, label: 'Cancelled' }
};

const statusOptions = [
    { value: 'consultation', label: 'Consultation', icon: FiClock },
    { value: 'design', label: 'Design', icon: FiEdit3 },
    { value: 'measurement', label: 'Measurement', icon: FiMapPin },
    { value: 'production', label: 'Production', icon: FiScissors },
    { value: 'fitting', label: 'Fitting', icon: FiUser },
    { value: 'ready', label: 'Ready', icon: FiPackage },
    { value: 'shipped', label: 'Shipped', icon: FiTruck },
    { value: 'delivered', label: 'Delivered', icon: FiCheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: FiXCircle }
];

export default function AdminCustomOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllCustomOrders();
            
            // Handle the API response structure
            const ordersData = response.data || response;
            
            // Ensure arrays are properly formatted and handle potential null/undefined values
            const sanitizedOrders = Array.isArray(ordersData) ? ordersData.map(order => ({
                ...order,
                designFeatures: Array.isArray(order.designFeatures) ? order.designFeatures : [],
                embellishments: Array.isArray(order.embellishments) ? order.embellishments : [],
                inspirationImages: Array.isArray(order.inspirationImages) ? order.inspirationImages : [],
                referenceLinks: Array.isArray(order.referenceLinks) ? order.referenceLinks : [],
                measurements: order.measurements || {},
                deliveryAddress: order.deliveryAddress || {},
                // Ensure other array fields are properly initialized
                id: order.id || order._id || `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                status: order.status || 'consultation',
                userName: order.userName || order.user?.name || 'Unknown User',
                userEmail: order.userEmail || order.user?.email || 'No email',
                totalPrice: order.totalPrice || order.finalPrice || order.basePrice || 0,
                materialQuality: order.materialQuality || 'standard',
                designType: order.designType || 'dress',
                occasion: order.occasion || 'Not specified',
                fabricType: order.fabricType || 'Not specified',
                fabricColor: order.fabricColor || 'Not specified',
                priority: order.priority || 'normal',
                shippingMethod: order.shippingMethod || 'standard',
                eventDate: order.eventDate || 'Not specified',
                requiredByDate: order.requiredByDate || 'Not specified',
                specialRequests: order.specialRequests || '',
                assignedDesigner: order.assignedDesigner || 'Not assigned',
                createdAt: order.createdAt || new Date().toISOString(),
                updatedAt: order.updatedAt || new Date().toISOString()
            })) : [];
            
            setOrders(sanitizedOrders);
        } catch (error) {
            console.error('Error loading custom orders:', error);
            setError('Failed to load custom orders. Please try again.');
            setOrders([]); // Set to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (!orderId) {
            console.error('No order ID provided for status update');
            return;
        }

        setUpdatingOrder(orderId);
        try {
            await updateCustomOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            console.error('Error updating order status:', error);
            setError('Failed to update order status. Please try again.');
        } finally {
            setUpdatingOrder(null);
        }
    };

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(order => order.status === filter);

    const getStatusCounts = () => {
        const counts = {
            all: orders.length,
            consultation: 0,
            design: 0,
            measurement: 0,
            production: 0,
            fitting: 0,
            ready: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };
        
        orders.forEach(order => {
            if (order.status && order.status in counts) {
                counts[order.status]++;
            }
        });
        
        return counts;
    };

    const statusCounts = getStatusCounts();

    // Safe array check function
    const hasArrayItems = (array) => {
        return Array.isArray(array) && array.length > 0;
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount || 0);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                            <p className="text-gold/70 font-medium font-serif">Loading custom fashion orders...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gold mb-2 font-serif">Custom Fashion Orders</h1>
                            <p className="text-gold/70 font-serif">Manage and track all custom design orders</p>
                        </div>
                        <button
                            onClick={loadOrders}
                            className="flex items-center bg-gold text-black hover:bg-yellow-500 py-3 px-6 rounded-xl border border-gold/30 hover:shadow-lg transition-all duration-200 font-semibold mt-4 lg:mt-0 font-serif"
                        >
                            <FiRefreshCw className="mr-2" />
                            Refresh Orders
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 border border-red-500/20"
                        >
                            <div className="flex items-center">
                                <FiAlertTriangle className="text-red-400 text-xl mr-3" />
                                <div>
                                    <p className="text-red-300 font-medium font-serif">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Status Filter */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gold flex items-center font-serif">
                                <FiFilter className="mr-3 text-gold" />
                                Filter Orders
                            </h2>
                            <span className="text-sm text-gold/70 font-serif">
                                {filteredOrders.length} of {orders.length} orders
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-3">
                            {[
                                { value: 'all', label: 'All', count: statusCounts.all, color: 'bg-gray-400' },
                                { value: 'consultation', label: 'Consultation', count: statusCounts.consultation, color: 'bg-blue-400' },
                                { value: 'design', label: 'Design', count: statusCounts.design, color: 'bg-purple-400' },
                                { value: 'measurement', label: 'Measurement', count: statusCounts.measurement, color: 'bg-indigo-400' },
                                { value: 'production', label: 'Production', count: statusCounts.production, color: 'bg-orange-400' },
                                { value: 'fitting', label: 'Fitting', count: statusCounts.fitting, color: 'bg-pink-400' },
                                { value: 'ready', label: 'Ready', count: statusCounts.ready, color: 'bg-green-400' },
                                { value: 'shipped', label: 'Shipped', count: statusCounts.shipped, color: 'bg-teal-400' },
                                { value: 'delivered', label: 'Delivered', count: statusCounts.delivered, color: 'bg-emerald-400' },
                                { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-red-400' }
                            ].map(({ value, label, count, color }) => (
                                <button
                                    key={value}
                                    onClick={() => setFilter(value)}
                                    className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                                        filter === value 
                                            ? 'bg-gold/20 border-gold shadow-lg' 
                                            : 'bg-black/20 border-gold/10 hover:bg-gold/10 hover:border-gold/30'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className={`w-2 h-2 rounded-full ${color}`}></div>
                                        <span className="text-lg font-bold text-white font-serif">{count}</span>
                                    </div>
                                    <p className="text-xs font-medium text-gold/80 leading-tight font-serif">{label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Orders Grid */}
                <AnimatePresence mode="wait">
                    {filteredOrders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 p-12"
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiScissors className="text-white text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 font-serif">No Orders Found</h3>
                            <p className="text-gold/70 mb-8 max-w-md mx-auto font-serif">
                                {filter === 'all' 
                                    ? "There are no custom fashion orders yet."
                                    : `No orders with status "${statusConfig[filter]?.label}" found.`
                                }
                            </p>
                            {filter !== 'all' && (
                                <button
                                    onClick={() => setFilter('all')}
                                    className="bg-gradient-to-r from-gold to-yellow-600 text-black py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold font-serif border border-gold/30"
                                >
                                    View All Orders
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-6"
                        >
                            {filteredOrders.map((order, index) => {
                                const StatusIcon = statusConfig[order.status]?.icon || FiClock;
                                
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 overflow-hidden hover:border-gold/40 hover:shadow-xl transition-all duration-300 group"
                                    >
                                        {/* Order Header */}
                                        <div className="bg-gradient-to-r from-gold/20 to-yellow-600/20 px-6 py-4 border-b border-gold/20">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex items-center mb-4 lg:mb-0">
                                                    <div className="bg-gold/20 rounded-lg p-2 mr-4 border border-gold/30">
                                                        <FiScissors className="text-gold text-xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white font-serif">
                                                            Design #{order.id?.slice(-8).toUpperCase() || 'N/A'}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center text-gold/80 text-sm mt-1 gap-3 font-serif">
                                                            <div className="flex items-center">
                                                                <FiUser className="mr-1" />
                                                                <span>{order.userName}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <FiMail className="mr-1" />
                                                                <span>{order.userEmail}</span>
                                                            </div>
                                                            {order.designType && (
                                                                <div className="flex items-center">
                                                                    <span className="bg-gold/20 px-2 py-1 rounded text-xs border border-gold/30">
                                                                        {order.designType}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-gold font-serif">
                                                            {formatCurrency(order.totalPrice)}
                                                        </p>
                                                        <p className="text-gold/80 text-sm font-serif capitalize">
                                                            {order.materialQuality} Quality
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <select 
                                                            value={order.status} 
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                            disabled={updatingOrder === order.id}
                                                            className="bg-black/40 text-white border border-gold/30 rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 disabled:opacity-50 font-serif"
                                                        >
                                                            {statusOptions.map(option => {
                                                                const OptionIcon = option.icon;
                                                                return (
                                                                    <option key={option.value} value={option.value} className="text-black">
                                                                        {option.label}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                        {updatingOrder === order.id && (
                                                            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-gold"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Content */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                                {/* Design Details */}
                                                <div>
                                                    <h4 className="font-semibold text-gold mb-4 flex items-center font-serif">
                                                        <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                                                        Design Specifications
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {[
                                                            ['Design Type', order.designType],
                                                            ['Occasion', order.occasion],
                                                            ['Fabric', order.fabricType],
                                                            ['Color', order.fabricColor],
                                                            ['Quality', order.materialQuality],
                                                            ['Priority', order.priority]
                                                        ].map(([label, value]) => (
                                                            value && (
                                                                <div key={label} className="bg-gold/5 rounded-lg p-3 border border-gold/10">
                                                                    <span className="text-xs font-medium text-gold/70 block mb-1 font-serif">
                                                                        {label}
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-white font-serif capitalize">
                                                                        {value}
                                                                    </span>
                                                                </div>
                                                            )
                                                        ))}
                                                        {order.styleDescription && (
                                                            <div className="sm:col-span-2 bg-gold/10 rounded-lg p-3 border border-gold/20">
                                                                <span className="text-xs font-medium text-gold block mb-1 font-serif">
                                                                    Style Description
                                                                </span>
                                                                <span className="text-sm font-semibold text-white font-serif">
                                                                    {order.styleDescription}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Design Features */}
                                                    {(hasArrayItems(order.designFeatures) || hasArrayItems(order.embellishments)) && (
                                                        <div className="mt-4">
                                                            <h5 className="text-sm font-medium text-gold/80 mb-2 font-serif">Design Features</h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {hasArrayItems(order.designFeatures) && order.designFeatures.map((feature, idx) => (
                                                                    <span key={idx} className="bg-blue-400/20 text-blue-400 px-2 py-1 rounded text-xs border border-blue-400/30">
                                                                        {feature}
                                                                    </span>
                                                                ))}
                                                                {hasArrayItems(order.embellishments) && order.embellishments.map((embellishment, idx) => (
                                                                    <span key={idx} className="bg-pink-400/20 text-pink-400 px-2 py-1 rounded text-xs border border-pink-400/30">
                                                                        {embellishment}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Measurements & Timeline */}
                                                <div>
                                                    <h4 className="font-semibold text-gold mb-4 flex items-center font-serif">
                                                        <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                                                        Measurements & Timeline
                                                    </h4>
                                                    <div className="space-y-4">
                                                        {/* Measurements */}
                                                        {order.measurements && Object.keys(order.measurements).length > 0 && (
                                                            <div>
                                                                <h5 className="text-sm font-medium text-gold/80 mb-2 font-serif">Body Measurements</h5>
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                                    {Object.entries(order.measurements).map(([key, value]) => (
                                                                        value && (
                                                                            <div key={key} className="bg-gold/5 rounded p-2 text-center border border-gold/10">
                                                                                <span className="text-xs text-gold/70 block capitalize font-serif">
                                                                                    {key}
                                                                                </span>
                                                                                <span className="text-sm font-semibold text-white font-serif">
                                                                                    {value}
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Timeline */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {[
                                                                ['Event Date', formatDate(order.eventDate)],
                                                                ['Required By', formatDate(order.requiredByDate)],
                                                                ['Shipping Method', order.shippingMethod],
                                                            ].map(([label, value]) => (
                                                                value && value !== 'Not specified' && (
                                                                    <div key={label} className="bg-gold/5 rounded-lg p-3 border border-gold/10">
                                                                        <span className="text-xs font-medium text-gold/70 block mb-1 font-serif">
                                                                            {label}
                                                                        </span>
                                                                        <span className="text-sm font-semibold text-white font-serif capitalize">
                                                                            {value}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            ))}
                                                        </div>
                                                        
                                                        {/* Delivery Address */}
                                                        {order.deliveryAddress && Object.keys(order.deliveryAddress).length > 0 && (
                                                            <div className="bg-gold/5 rounded-lg p-3 border border-gold/10">
                                                                <h5 className="text-sm font-medium text-gold/80 mb-2 flex items-center font-serif">
                                                                    <FiHome className="mr-2" />
                                                                    Delivery Address
                                                                </h5>
                                                                <div className="text-sm text-white font-serif">
                                                                    {Object.entries(order.deliveryAddress).map(([key, value]) => (
                                                                        value && <div key={key} className="capitalize">{key}: {value}</div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {order.specialRequests && (
                                                            <div className="bg-yellow-400/10 rounded-lg p-3 border border-yellow-400/20">
                                                                <span className="text-xs font-medium text-yellow-400 block mb-1 font-serif">
                                                                    Special Requests
                                                                </span>
                                                                <span className="text-sm font-semibold text-white font-serif">
                                                                    {order.specialRequests}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Inspiration Images */}
                                                        {hasArrayItems(order.inspirationImages) && (
                                                            <div className="bg-gold/5 rounded-lg p-4 border border-gold/10">
                                                                <h5 className="text-sm font-medium text-gold/80 mb-3 flex items-center font-serif">
                                                                    <FiImage className="mr-2" />
                                                                    Inspiration Images ({order.inspirationImages.length})
                                                                </h5>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {order.inspirationImages.slice(0, 4).map((image, index) => (
                                                                        <img 
                                                                            key={index}
                                                                            src={image} 
                                                                            alt={`Inspiration ${index + 1}`}
                                                                            className="h-24 w-full object-cover rounded-lg border border-gold/20 bg-white cursor-pointer hover:opacity-80 transition-opacity"
                                                                            onClick={() => window.open(image, '_blank')}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Footer */}
                                        <div className="bg-gold/5 px-6 py-4 border-t border-gold/20">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="flex items-center">
                                                    <StatusIcon className={`text-sm mr-2 text-gold`} />
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                                        statusConfig[order.status]?.color
                                                    } font-serif`}>
                                                        {statusConfig[order.status]?.label || order.status}
                                                    </span>
                                                    {order.assignedDesigner && order.assignedDesigner !== 'Not assigned' && (
                                                        <span className="ml-3 text-sm text-gold/80 font-serif">
                                                            Designer: {order.assignedDesigner}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gold/70 font-serif">
                                                    {order.trackingNumber && (
                                                        <div className="flex items-center">
                                                            <FiTruck className="mr-1" />
                                                            <span>Track: {order.trackingNumber}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        Created: {formatDate(order.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
