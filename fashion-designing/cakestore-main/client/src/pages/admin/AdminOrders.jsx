import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderToDelivered, updateOrderStatus, addTrackingInfo } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSearch, 
    FiFilter, 
    FiPackage, 
    FiCheckCircle, 
    FiClock, 
    FiTruck, 
    FiDollarSign,
    FiCalendar,
    FiUser,
    FiEye,
    FiRefreshCw,
    FiAlertCircle,
    FiTrendingUp,
    FiScissors,
    FiEdit3,
    FiMapPin,
    FiTag
} from 'react-icons/fi';

const statusConfig = {
    pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: FiClock,
        label: 'Pending'
    },
    confirmed: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: FiCheckCircle,
        label: 'Confirmed'
    },
    processing: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: FiEdit3,
        label: 'Processing'
    },
    ready_to_ship: { 
        color: 'bg-orange-100 text-orange-800 border-orange-200', 
        icon: FiPackage,
        label: 'Ready to Ship'
    },
    shipped: { 
        color: 'bg-teal-100 text-teal-800 border-teal-200', 
        icon: FiTruck,
        label: 'Shipped'
    },
    delivered: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: FiCheckCircle,
        label: 'Delivered'
    },
    cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: FiAlertCircle,
        label: 'Cancelled'
    },
    returned: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: FiRefreshCw,
        label: 'Returned'
    }
};

const orderTypeConfig = {
    standard: { color: 'bg-blue-50 text-blue-700', label: 'Ready-to-Wear', icon: FiPackage },
    custom: { color: 'bg-purple-50 text-purple-700', label: 'Custom Design', icon: FiScissors },
    mixed: { color: 'bg-pink-50 text-pink-700', label: 'Mixed Order', icon: FiTag }
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [orderTypeFilter, setOrderTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getAllOrders();
                const ordersData = Array.isArray(response?.data) ? response.data : [];
                setOrders(ordersData);
                setFilteredOrders(ordersData);
            } catch (err) {
                setError(err.message || 'Failed to load orders');
                setOrders([]);
                setFilteredOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, dateFilter, statusFilter, orderTypeFilter, searchQuery]);

    const filterOrders = () => {
        let result = [...orders];

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        // Apply order type filter
        if (orderTypeFilter !== 'all') {
            result = result.filter(order => order.orderType === orderTypeFilter);
        }

        // Apply date filter
        if (dateFilter !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            result = result.filter(order => {
                const orderDate = new Date(order.createdAt);
                switch (dateFilter) {
                    case 'today':
                        return orderDate >= today;
                    case 'week':
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return orderDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return orderDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order => 
                order.orderNumber?.toLowerCase().includes(query) || 
                order.id.toLowerCase().includes(query) || 
                (order.userId && order.userId.toLowerCase().includes(query)) ||
                (order.userEmail && order.userEmail.toLowerCase().includes(query)) ||
                (order.userName && order.userName.toLowerCase().includes(query))
            );
        }

        setFilteredOrders(result);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingOrder(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            setSuccess(`Order status updated to ${statusConfig[newStatus]?.label}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update order status');
        } finally {
            setUpdatingOrder(null);
        }
    };

    const handleAddTracking = async (orderId, trackingData) => {
        try {
            await addTrackingInfo(orderId, trackingData);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { 
                        ...order, 
                        trackingNumber: trackingData.trackingNumber,
                        shippingCarrier: trackingData.courier,
                        status: 'shipped'
                    } : order
                )
            );
            setShowTrackingModal(null);
            setSuccess('Tracking information added successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to add tracking information');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusCounts = () => {
        const counts = {
            all: orders.length,
            pending: 0,
            confirmed: 0,
            processing: 0,
            ready_to_ship: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
            returned: 0
        };
        
        orders.forEach(order => {
            if (order.status in counts) {
                counts[order.status]++;
            }
        });
        
        return counts;
    };

    const getOrderTypeCounts = () => {
        const counts = {
            all: orders.length,
            standard: 0,
            custom: 0,
            mixed: 0
        };
        
        orders.forEach(order => {
            if (order.orderType in counts) {
                counts[order.orderType]++;
            }
        });
        
        return counts;
    };

    const statusCounts = getStatusCounts();
    const orderTypeCounts = getOrderTypeCounts();

    const refreshOrders = () => {
        setLoading(true);
        getAllOrders()
            .then(response => {
                const ordersData = Array.isArray(response?.data) ? response.data : [];
                setOrders(ordersData);
                setFilteredOrders(ordersData);
            })
            .catch(err => {
                setError(err.message || 'Failed to refresh orders');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <Loader />
                            <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
                            <p className="text-gray-600">Manage and track all customer orders</p>
                        </div>
                        <button
                            onClick={refreshOrders}
                            className="flex items-center bg-white text-gray-700 py-3 px-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 font-semibold mt-4 lg:mt-0"
                        >
                            <FiRefreshCw className="mr-2" />
                            Refresh Orders
                        </button>
                    </div>

                    {/* Status Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4 mb-6">
                        {[
                            { status: 'all', label: 'Total', count: statusCounts.all, color: 'bg-gradient-to-r from-gray-500 to-gray-600', icon: FiPackage },
                            { status: 'pending', label: 'Pending', count: statusCounts.pending, color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', icon: FiClock },
                            { status: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed, color: 'bg-gradient-to-r from-blue-500 to-blue-600', icon: FiCheckCircle },
                            { status: 'processing', label: 'Processing', count: statusCounts.processing, color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: FiEdit3 },
                            { status: 'ready_to_ship', label: 'Ready', count: statusCounts.ready_to_ship, color: 'bg-gradient-to-r from-orange-500 to-orange-600', icon: FiPackage },
                            { status: 'shipped', label: 'Shipped', count: statusCounts.shipped, color: 'bg-gradient-to-r from-teal-500 to-teal-600', icon: FiTruck },
                            { status: 'delivered', label: 'Delivered', count: statusCounts.delivered, color: 'bg-gradient-to-r from-green-500 to-green-600', icon: FiCheckCircle },
                            { status: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-gradient-to-r from-red-500 to-red-600', icon: FiAlertCircle },
                            { status: 'returned', label: 'Returned', count: statusCounts.returned, color: 'bg-gradient-to-r from-gray-400 to-gray-500', icon: FiRefreshCw }
                        ].map(({ status, label, count, color, icon: Icon }) => (
                            <motion.div
                                key={status}
                                whileHover={{ scale: 1.02 }}
                                className={`bg-white rounded-2xl shadow-lg p-4 cursor-pointer transition-all duration-200 ${
                                    statusFilter === status ? 'ring-2 ring-purple-500' : ''
                                }`}
                                onClick={() => setStatusFilter(status === 'all' ? 'all' : status)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{count}</p>
                                        <p className="text-xs text-gray-600 mt-1">{label}</p>
                                    </div>
                                    <div className={`${color} rounded-xl p-2`}>
                                        <Icon className="text-white text-lg" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Type Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[
                            { type: 'all', label: 'All Types', count: orderTypeCounts.all, color: 'bg-gradient-to-r from-gray-500 to-gray-600', icon: FiPackage },
                            { type: 'standard', label: 'Ready-to-Wear', count: orderTypeCounts.standard, color: 'bg-gradient-to-r from-blue-500 to-blue-600', icon: FiPackage },
                            { type: 'custom', label: 'Custom Designs', count: orderTypeCounts.custom, color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: FiScissors }
                        ].map(({ type, label, count, color, icon: Icon }) => (
                            <motion.div
                                key={type}
                                whileHover={{ scale: 1.02 }}
                                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-200 ${
                                    orderTypeFilter === type ? 'ring-2 ring-purple-500' : ''
                                }`}
                                onClick={() => setOrderTypeFilter(type === 'all' ? 'all' : type)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                                        <p className="text-sm text-gray-600 mt-1">{label}</p>
                                    </div>
                                    <div className={`${color} rounded-xl p-3`}>
                                        <Icon className="text-white text-xl" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center">
                                <FiFilter className="text-purple-600 mr-3 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-900">Filter Orders</h3>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:justify-end">
                                {/* Search */}
                                <div className="relative flex-1 sm:max-w-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search orders..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                    />
                                </div>

                                {/* Order Type Filter */}
                                <div className="relative">
                                    <select
                                        value={orderTypeFilter}
                                        onChange={(e) => setOrderTypeFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="standard">Ready-to-Wear</option>
                                        <option value="custom">Custom Designs</option>
                                        <option value="mixed">Mixed Orders</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiTag className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Status</option>
                                        {Object.entries(statusConfig).map(([value, config]) => (
                                            <option key={value} value={value}>{config.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiFilter className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Date Filter */}
                                <div className="relative">
                                    <select
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Dates</option>
                                        <option value="today">Today</option>
                                        <option value="week">Last 7 Days</option>
                                        <option value="month">Last 30 Days</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiCalendar className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Status Messages */}
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

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 shadow-sm"
                        >
                            <div className="flex items-center">
                                <FiAlertCircle className="text-red-500 text-xl mr-3" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Orders Content */}
                <AnimatePresence mode="wait">
                    {filteredOrders.length > 0 ? (
                        <motion.div
                            key="orders-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {/* Desktop Table */}
                            <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                                            <tr>
                                                {['Order', 'Customer', 'Type', 'Date', 'Amount', 'Status', 'Tracking', 'Actions'].map((header) => (
                                                    <th
                                                        key={header}
                                                        className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredOrders.map((order, index) => {
                                                const StatusIcon = statusConfig[order.status]?.icon;
                                                const OrderTypeIcon = orderTypeConfig[order.orderType]?.icon;
                                                return (
                                                    <motion.tr
                                                        key={order.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FiPackage className="text-gray-400 mr-3" />
                                                                <div>
                                                                    <span className="text-sm font-semibold text-gray-900 block">
                                                                        {order.orderNumber || `#${order.id.substring(0, 8)}`}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {order.items?.length || 0} items
                                                                        {order.customOrders?.length > 0 && ` + ${order.customOrders.length} custom`}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FiUser className="text-gray-400 mr-3" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {order.userName || order.userEmail || `User ${order.userId?.substring(0, 8) || 'N/A'}`}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">{order.userEmail}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${orderTypeConfig[order.orderType]?.color}`}>
                                                                <OrderTypeIcon className="mr-1" size={12} />
                                                                {orderTypeConfig[order.orderType]?.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FiCalendar className="text-gray-400 mr-3" />
                                                                <span className="text-sm text-gray-900">
                                                                    {formatDate(order.createdAt)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FiDollarSign className="text-gray-400 mr-3" />
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    ${order.totalPrice?.toLocaleString() || '0'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select 
                                                                value={order.status} 
                                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                                disabled={updatingOrder === order.id}
                                                                className={`text-xs font-semibold border rounded px-2 py-1 focus:outline-none focus:ring-1 ${
                                                                    statusConfig[order.status]?.color
                                                                } ${updatingOrder === order.id ? 'opacity-50' : 'cursor-pointer'}`}
                                                            >
                                                                {Object.entries(statusConfig).map(([value, config]) => (
                                                                    <option key={value} value={value} className="text-gray-900">
                                                                        {config.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {updatingOrder === order.id && (
                                                                <div className="ml-1 animate-spin rounded-full h-3 w-3 border-b-2 border-current inline-block"></div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {order.trackingNumber ? (
                                                                <div className="flex items-center text-sm text-gray-600">
                                                                    <FiTruck className="mr-1" />
                                                                    {order.trackingNumber}
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => setShowTrackingModal(order.id)}
                                                                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                                                >
                                                                    Add Tracking
                                                                </button>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end space-x-3">
                                                                <Link
                                                                    to={`/admin/orders/${order.id}`}
                                                                    className="flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
                                                                >
                                                                    <FiEye className="mr-1" />
                                                                    Details
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-4">
                                {filteredOrders.map((order, index) => {
                                    const StatusIcon = statusConfig[order.status]?.icon;
                                    const OrderTypeIcon = orderTypeConfig[order.orderType]?.icon;
                                    return (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center">
                                                    <FiPackage className="text-gray-400 mr-3" />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {order.orderNumber || `Order #${order.id.substring(0, 8)}`}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${orderTypeConfig[order.orderType]?.color}`}>
                                                                <OrderTypeIcon className="mr-1" size={10} />
                                                                {orderTypeConfig[order.orderType]?.label}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {order.items?.length || 0} items
                                                                {order.customOrders?.length > 0 && ` + ${order.customOrders.length} custom`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${statusConfig[order.status]?.color}`}>
                                                    <StatusIcon className="mr-1" size={10} />
                                                    {statusConfig[order.status]?.label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">Customer</p>
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {order.userName || order.userEmail}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">Date</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">Amount</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        ${order.totalPrice?.toLocaleString() || '0'}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500">Tracking</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {order.trackingNumber || 'Not added'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t border-gray-200">
                                                <select 
                                                    value={order.status} 
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    disabled={updatingOrder === order.id}
                                                    className={`text-xs font-semibold border rounded px-3 py-2 focus:outline-none focus:ring-1 ${
                                                        statusConfig[order.status]?.color
                                                    } ${updatingOrder === order.id ? 'opacity-50' : 'cursor-pointer'}`}
                                                >
                                                    {Object.entries(statusConfig).map(([value, config]) => (
                                                        <option key={value} value={value} className="text-gray-900">
                                                            {config.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                
                                                <div className="flex gap-3">
                                                    {!order.trackingNumber && (
                                                        <button
                                                            onClick={() => setShowTrackingModal(order.id)}
                                                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                                        >
                                                            Add Tracking
                                                        </button>
                                                    )}
                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                        className="flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 text-sm"
                                                    >
                                                        <FiEye className="mr-1" />
                                                        Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center bg-white rounded-2xl shadow-lg p-12"
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiPackage className="text-white text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Orders Found</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                {orders.length === 0 
                                    ? "When customers place orders, they will appear here" 
                                    : "No orders match your current filters"
                                }
                            </p>
                            {(searchQuery || statusFilter !== 'all' || orderTypeFilter !== 'all' || dateFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                        setOrderTypeFilter('all');
                                        setDateFilter('all');
                                    }}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tracking Modal */}
                {showTrackingModal && (
                    <TrackingModal
                        orderId={showTrackingModal}
                        onClose={() => setShowTrackingModal(null)}
                        onSubmit={handleAddTracking}
                    />
                )}
            </div>
        </div>
    );
}

// Tracking Modal Component
function TrackingModal({ orderId, onClose, onSubmit }) {
    const [trackingData, setTrackingData] = useState({
        courier: '',
        trackingNumber: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(orderId, trackingData);
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