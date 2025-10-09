import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, updateOrderToDelivered, updateOrderStatus, addTrackingInfo } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiArrowLeft, 
    FiPackage, 
    FiCheckCircle, 
    FiClock, 
    FiDollarSign, 
    FiUser, 
    FiMapPin, 
    FiTruck,
    FiCreditCard,
    FiAlertCircle,
    FiEdit3,
    FiScissors,
    FiTag,
    FiRefreshCw,
    FiMail,
    FiPhone
} from 'react-icons/fi';

const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
    confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Confirmed' },
    processing: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Processing' },
    ready_to_ship: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Ready to Ship' },
    shipped: { color: 'bg-teal-100 text-teal-800 border-teal-200', label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' },
    returned: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Returned' }
};

const orderTypeConfig = {
    standard: { color: 'bg-blue-50 text-blue-700', label: 'Ready-to-Wear', icon: FiPackage },
    custom: { color: 'bg-purple-50 text-purple-700', label: 'Custom Design', icon: FiScissors },
    mixed: { color: 'bg-pink-50 text-pink-700', label: 'Mixed Order', icon: FiTag }
};

export default function AdminOrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showTrackingModal, setShowTrackingModal] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await getOrderById(id);
                setOrder(response?.data || response || null);
            } catch (err) {
                setError(err.response?.message || err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            await updateOrderStatus(id, newStatus);
            setOrder(prev => ({
                ...prev,
                status: newStatus
            }));
            setSuccess(`Order status updated to ${statusConfig[newStatus]?.label}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.message || err.message || 'Failed to update order status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAddTracking = async (trackingData) => {
        try {
            await addTrackingInfo(id, trackingData);
            setOrder(prev => ({
                ...prev,
                trackingNumber: trackingData.trackingNumber,
                shippingCarrier: trackingData.courier,
                status: 'shipped'
            }));
            setShowTrackingModal(false);
            setSuccess('Tracking information added successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.message || err.message || 'Failed to add tracking information');
        }
    };

    const handleMarkAsDelivered = async () => {
        if (window.confirm('Are you sure you want to mark this order as delivered?')) {
            try {
                await updateOrderToDelivered(id);
                setOrder(prev => ({
                    ...prev,
                    isDelivered: true,
                    deliveredAt: new Date().toISOString(),
                    status: 'delivered'
                }));
                setSuccess('Order marked as delivered successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.response?.message || err.message || 'Failed to update order');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <Loader />
                            <p className="mt-4 text-gray-600 font-medium">Loading order details...</p>
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
                        className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-red-500"
                    >
                        <div className="flex items-center mb-4">
                            <FiAlertCircle className="text-red-500 text-xl mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Error Loading Order</h3>
                        </div>
                        <p className="text-gray-700 mb-6">{error}</p>
                        <Link
                            to="/admin/orders"
                            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back to Orders
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto"
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiPackage className="text-white text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h3>
                        <p className="text-gray-600 mb-8">
                            The order you're looking for doesn't exist or has been removed.
                        </p>
                        <Link
                            to="/admin/orders"
                            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back to Orders
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    const OrderTypeIcon = orderTypeConfig[order.orderType]?.icon || FiPackage;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        to="/admin/orders"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold mb-6 group transition-all duration-200"
                    >
                        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white rounded-2xl shadow-lg p-6">
                        <div className="mb-4 lg:mb-0">
                            <div className="flex items-center mb-2">
                                <h1 className="text-3xl font-bold text-gray-900 mr-4">
                                    {order.orderNumber || `Order #${order.id?.substring(0, 8) || 'N/A'}`}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig[order.status]?.color}`}>
                                    {statusConfig[order.status]?.label}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                <div className="flex items-center">
                                    <FiClock className="mr-2" />
                                    <span>Placed on {formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex items-center">
                                    <OrderTypeIcon className="mr-2" />
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${orderTypeConfig[order.orderType]?.color}`}>
                                        {orderTypeConfig[order.orderType]?.label}
                                    </span>
                                </div>
                                {order.priority === 'high' && (
                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                                        High Priority
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {!order.trackingNumber && order.status === 'ready_to_ship' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowTrackingModal(true)}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center"
                                >
                                    <FiTruck className="mr-2" />
                                    Add Tracking
                                </motion.button>
                            )}
                            {!order.isDelivered && order.status !== 'delivered' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleMarkAsDelivered}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center"
                                >
                                    <FiCheckCircle className="mr-2" />
                                    Mark as Delivered
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Success Message */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-4 mb-6 shadow-sm"
                        >
                            <div className="flex items-center">
                                <FiCheckCircle className="text-green-500 text-xl mr-3" />
                                <p className="text-green-700 font-medium">{success}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Order Items & Payment */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiPackage className="mr-3" />
                                    Order Items ({order.items?.length || 0})
                                    {order.customOrders?.length > 0 && ` + ${order.customOrders.length} Custom Designs`}
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {/* Standard Products */}
                                {order.items?.map((item, index) => (
                                    <motion.div
                                        key={`item-${index}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-6 flex items-center hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-20 w-16 object-cover rounded-xl shadow-sm border border-gray-200"
                                                src={item.image || '/images/placeholder-fashion.png'}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/placeholder-fashion.png';
                                                }}
                                            />
                                        </div>
                                        <div className="ml-6 flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {item.name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {item.size && (
                                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                Size: {item.size}
                                                            </span>
                                                        )}
                                                        {item.color && (
                                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                Color: {item.color}
                                                            </span>
                                                        )}
                                                        <span className="text-sm text-gray-500">
                                                            Qty: {item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        ${item.price?.toLocaleString()}
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold text-purple-600">
                                                        Subtotal: ${((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Custom Orders */}
                                {order.customOrders?.length > 0 && (
                                    <div className="p-6 bg-purple-50 border-l-4 border-purple-500">
                                        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                                            <FiScissors className="mr-2" />
                                            Custom Design Orders ({order.customOrders.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {order.customOrders.map((customOrderId, index) => (
                                                <div key={customOrderId} className="bg-white rounded-lg p-4 border border-purple-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                Custom Design #{customOrderId.substring(0, 8)}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Custom fashion design order
                                                            </p>
                                                        </div>
                                                        <Link
                                                            to={`/admin/custom-orders/${customOrderId}`}
                                                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Payment Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiCreditCard className="mr-3" />
                                    Payment Information
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
                                        <p className="text-lg font-semibold text-gray-900 capitalize">
                                            {order.paymentMethod}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Status</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            order.isPaid 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                        }`}>
                                            {order.isPaid ? 'Paid' : 'Not Paid'}
                                        </span>
                                    </div>
                                    {order.paymentResult && (
                                        <>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction Amount</h3>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    ${order.paymentResult.amount?.toLocaleString() || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction ID</h3>
                                                <p className="text-lg font-semibold text-gray-900 font-mono">
                                                    {order.paymentResult.id || 'N/A'}
                                                </p>
                                            </div>
                                            {order.paidAt && (
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Date</h3>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {formatDate(order.paidAt)}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Summary & Customer Info */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiDollarSign className="mr-3" />
                                    Order Summary
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Items Total</span>
                                        <span className="font-semibold text-gray-900">${order.itemsPrice?.toLocaleString()}</span>
                                    </div>
                                    {order.customOrdersPrice > 0 && (
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Custom Designs</span>
                                            <span className="font-semibold text-gray-900">${order.customOrdersPrice?.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-semibold text-gray-900">${order.shippingPrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-semibold text-gray-900">${order.taxPrice?.toLocaleString()}</span>
                                    </div>
                                    {order.discountAmount > 0 && (
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="font-semibold text-red-600">-${order.discountAmount?.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 pt-4 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-green-600">
                                                ${order.totalPrice?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Management */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiEdit3 className="mr-3" />
                                    Order Management
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {/* Status Update */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Update Status
                                        </label>
                                        <div className="flex gap-2">
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                                disabled={updatingStatus}
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                                            >
                                                {Object.entries(statusConfig).map(([value, config]) => (
                                                    <option key={value} value={value}>{config.label}</option>
                                                ))}
                                            </select>
                                            {updatingStatus && (
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tracking Information */}
                                    {order.trackingNumber && (
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                            <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                                                <FiTruck className="mr-2" />
                                                Tracking Information
                                            </h3>
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {order.shippingCarrier}: {order.trackingNumber}
                                                </p>
                                                {order.shippedAt && (
                                                    <p className="text-xs text-gray-500">
                                                        Shipped on {formatDate(order.shippedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Delivery Information */}
                                    {order.isDelivered && (
                                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                            <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                                                <FiCheckCircle className="mr-2" />
                                                Delivered
                                            </h3>
                                            <p className="text-sm text-gray-900">
                                                {formatDate(order.deliveredAt)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Customer Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FiUser className="mr-3" />
                                    Customer Information
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {/* Customer Details */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">Customer Details</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <FiUser className="text-gray-400 mr-2" />
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {order.userName || 'Customer'}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiMail className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{order.userEmail}</span>
                                            </div>
                                            {order.shippingAddress?.phone && (
                                                <div className="flex items-center">
                                                    <FiPhone className="text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-900">{order.shippingAddress.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                                            <FiMapPin className="mr-2" />
                                            Shipping Address
                                        </h3>
                                        <div className="text-sm text-gray-900 space-y-1">
                                            <p className="font-semibold">{order.shippingAddress?.address}</p>
                                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                            <p>{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
                                        </div>
                                        {order.deliveryInstructions && (
                                            <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                                                <p className="text-xs text-yellow-800">
                                                    <strong>Delivery Instructions:</strong> {order.deliveryInstructions}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Shipping Method */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Method</h3>
                                        <p className="text-sm font-semibold text-gray-900 capitalize">
                                            {order.shippingMethod || 'Standard'}
                                        </p>
                                        {order.estimatedDeliveryDate && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Est. Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Tracking Modal */}
                {showTrackingModal && (
                    <TrackingModal
                        onClose={() => setShowTrackingModal(false)}
                        onSubmit={handleAddTracking}
                    />
                )}
            </div>
        </div>
    );
}

// Tracking Modal Component
function TrackingModal({ onClose, onSubmit }) {
    const [trackingData, setTrackingData] = useState({
        courier: '',
        trackingNumber: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(trackingData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Tracking Information</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Courier
                        </label>
                        <select
                            value={trackingData.courier}
                            onChange={(e) => setTrackingData(prev => ({ ...prev, courier: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select Courier</option>
                            <option value="DHL">DHL</option>
                            <option value="FedEx">FedEx</option>
                            <option value="UPS">UPS</option>
                            <option value="GIG">GIG Logistics</option>
                            <option value="Local">Local Dispatch</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tracking Number
                        </label>
                        <input
                            type="text"
                            value={trackingData.trackingNumber}
                            onChange={(e) => setTrackingData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter tracking number"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                        >
                            Add Tracking
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}