import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByUser } from '../../services/orderService';
import { 
    FiPackage, 
    FiShoppingBag, 
    FiCalendar, 
    FiDollarSign, 
    FiTrendingUp,
    FiArrowRight,
    FiArrowLeft,
    FiChevronRight,
    FiCheckCircle,
    FiClock,
    FiTruck,
    FiAlertCircle,
    FiSearch,
    FiScissors,
    FiTag,
    FiFilter,
    FiRefreshCw
} from 'react-icons/fi';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);

// Loading Skeleton Component
const OrderSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gold/20 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-6 bg-gold/20 rounded w-32"></div>
                        <div className="h-4 bg-gold/20 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-gold/20 rounded w-20"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-gold/20 rounded w-24"></div>
                    <div className="h-4 bg-gold/20 rounded w-16"></div>
                </div>
            </div>
        ))}
    </div>
);

// Status Badge Component
const StatusBadge = ({ order }) => {
    const statusConfig = {
        pending: { color: 'from-yellow-500 to-yellow-600', text: 'Pending Payment', icon: FiClock },
        confirmed: { color: 'from-blue-500 to-blue-600', text: 'Confirmed', icon: FiCheckCircle },
        processing: { color: 'from-gold to-yellow-600', text: 'Processing', icon: FiPackage },
        ready_to_ship: { color: 'from-orange-500 to-orange-600', text: 'Ready to Ship', icon: FiTruck },
        shipped: { color: 'from-green-500 to-green-600', text: 'Shipped', icon: FiTruck },
        delivered: { color: 'from-emerald-500 to-emerald-600', text: 'Delivered', icon: FiCheckCircle },
        cancelled: { color: 'from-red-500 to-red-600', text: 'Cancelled', icon: FiAlertCircle }
    };

    const config = statusConfig[order.status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${config.color} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg border border-gold/20`}
        >
            <Icon className="text-xs" />
            {config.text}
        </motion.span>
    );
};

// Order Type Badge
const OrderTypeBadge = ({ orderType }) => {
    const typeConfig = {
        standard: { color: 'bg-gold/20 text-gold border-gold/30', text: 'Ready-to-Wear', icon: FiPackage },
        custom: { color: 'bg-gray-800/50 text-gold border-gold/30', text: 'Custom Design', icon: FiScissors },
        mixed: { color: 'bg-gray-700/50 text-gold border-gold/30', text: 'Mixed Order', icon: FiTag }
    };

    const config = typeConfig[orderType] || typeConfig.standard;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon className="text-xs" />
            {config.text}
        </span>
    );
};

// Order Card Component
const OrderCard = ({ order, index }) => {
    const totalItems = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
    const customItemsCount = order.customOrders?.length || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
                y: -4,
                transition: { duration: 0.3 }
            }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 overflow-hidden group hover:border-gold/40 transition-all duration-500"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gold to-yellow-600 rounded-xl flex items-center justify-center border border-gold/30">
                            <FiPackage className="text-white text-lg" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-white font-serif">
                                    {order.orderNumber || `Order #${order.id?.substring(0, 8)}`}
                                </h3>
                                <OrderTypeBadge orderType={order.orderType} />
                            </div>
                            <p className="text-gold/70 text-sm flex items-center gap-1 font-serif">
                                <FiCalendar className="text-xs" />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <StatusBadge order={order} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gold/5 rounded-xl p-3 border border-gold/10">
                        <p className="text-gold/70 text-sm font-serif">Total Amount</p>
                        <p className="text-white font-semibold text-lg flex items-center gap-1 font-serif">
                            <FiDollarSign className="text-gold" />
                            ₦{order.totalPrice?.toLocaleString() || '0'}
                        </p>
                    </div>
                    <div className="bg-gold/5 rounded-xl p-3 border border-gold/10">
                        <p className="text-gold/70 text-sm font-serif">Items</p>
                        <p className="text-white font-semibold font-serif">
                            {totalItems} item{totalItems !== 1 ? 's' : ''}
                            {customItemsCount > 0 && ` + ${customItemsCount} custom`}
                        </p>
                    </div>
                </div>

                {/* Order Preview */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        {order.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="relative">
                                <img
                                    src={item.image || '/images/placeholder-fashion.png'}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-gold/20"
                                />
                                {item.quantity > 1 && (
                                    <div className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        {item.quantity}
                                    </div>
                                )}
                            </div>
                        ))}
                        {(order.items?.length > 3 || customItemsCount > 0) && (
                            <div className="text-gold/60 text-sm font-serif">
                                +{Math.max(0, (order.items?.length || 0) - 3) + customItemsCount} more
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                    <div className="flex items-center gap-2">
                        {order.trackingNumber && (
                            <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <FiTruck className="text-xs" />
                                Tracked
                            </span>
                        )}
                        <span className="text-gold/60 text-sm font-serif">
                            {order.shippingMethod || 'Standard Shipping'}
                        </span>
                    </div>
                    <MotionLink
                        to={`/orders/${order.id}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold py-2 px-4 rounded-xl font-medium transition-all duration-300 group-hover:bg-gold/20 font-serif"
                    >
                        View Details
                        <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                    </MotionLink>
                </div>
            </div>
        </motion.div>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mt-8"
    >
        <motion.button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 font-serif ${
                currentPage === 1 
                    ? 'bg-gold/10 text-gold/40 cursor-not-allowed' 
                    : 'bg-gold/10 hover:bg-gold/20 text-gold'
            }`}
        >
            <FiArrowLeft className="text-sm" />
            Previous
        </motion.button>

        <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <motion.button
                    key={page}
                    onClick={() => onPageChange(page)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 font-serif ${
                        currentPage === page 
                            ? 'bg-gradient-to-r from-gold to-yellow-600 text-black shadow-lg' 
                            : 'bg-gold/10 hover:bg-gold/20 text-gold'
                    }`}
                >
                    {page}
                </motion.button>
            ))}
        </div>

        <motion.button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 font-serif ${
                currentPage === totalPages 
                    ? 'bg-gold/10 text-gold/40 cursor-not-allowed' 
                    : 'bg-gold/10 hover:bg-gold/20 text-gold'
            }`}
        >
            Next
            <FiArrowRight className="text-sm" />
        </motion.button>
    </motion.div>
);

// Filter Component
const OrderFilters = ({ filters, onFilterChange }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 mb-6"
    >
        <div className="flex items-center gap-2 text-gold/70 font-serif">
            <FiFilter className="text-sm" />
            <span className="text-sm">Filter by:</span>
        </div>
        
        {[
            { value: 'all', label: 'All Orders' },
            { value: 'standard', label: 'Ready-to-Wear' },
            { value: 'custom', label: 'Custom Designs' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'processing', label: 'Processing' }
        ].map(filter => (
            <motion.button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 font-serif ${
                    filters.status === filter.value
                        ? 'bg-gradient-to-r from-gold to-yellow-600 text-black shadow-lg'
                        : 'bg-gold/10 hover:bg-gold/20 text-gold'
                }`}
            >
                {filter.label}
            </motion.button>
        ))}
    </motion.div>
);

export default function OrderHistory() {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: 'all', type: 'all' });
    const ordersPerPage = 6;

    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const response = await getOrdersByUser();
                setOrders(response?.data || response || []);
            } catch (err) {
                setError(err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser]);

    // Filter orders based on search term and filters
    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.totalPrice?.toString().includes(searchTerm);

        const matchesStatus = 
            filters.status === 'all' ||
            (filters.status === 'delivered' && order.isDelivered) ||
            (filters.status === 'processing' && !order.isDelivered && order.isPaid) ||
            (filters.status === 'standard' && order.orderType === 'standard') ||
            (filters.status === 'custom' && (order.orderType === 'custom' || order.orderType === 'mixed'));

        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    // Stats calculation
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const deliveredOrders = orders.filter(order => order.isDelivered).length;
    const customOrders = orders.filter(order => order.orderType === 'custom' || order.orderType === 'mixed').length;

    const refreshOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrdersByUser();
            setOrders(response?.data || response || []);
        } catch (err) {
            setError(err.message || 'Failed to refresh orders');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-serif">Order History</h1>
                        <p className="text-gold/70 font-serif">Track and manage all your fashion orders in one place</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                            onClick={refreshOrders}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-gold/20 font-serif"
                        >
                            <FiRefreshCw className="text-sm" />
                            Refresh
                        </motion.button>
                        <MotionLink
                            to="/collections"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg backdrop-blur-sm border border-gold/30 font-serif"
                        >
                            <FiShoppingBag className="text-sm" />
                            Continue Shopping
                        </MotionLink>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                {orders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                    >
                        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-gold/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-xl flex items-center justify-center border border-gold/30">
                                    <FiPackage className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-gold/70 text-sm font-serif">Total Orders</p>
                                    <p className="text-white text-2xl font-bold font-serif">{totalOrders}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-gold/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center border border-green-500/30">
                                    <FiTrendingUp className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-gold/70 text-sm font-serif">Total Spent</p>
                                    <p className="text-white text-2xl font-bold font-serif">₦{totalSpent.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-gold/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center border border-blue-500/30">
                                    <FiTruck className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-gold/70 text-sm font-serif">Delivered</p>
                                    <p className="text-white text-2xl font-bold font-serif">{deliveredOrders}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-gold/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-xl flex items-center justify-center border border-gold/30">
                                    <FiScissors className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-gold/70 text-sm font-serif">Custom Designs</p>
                                    <p className="text-white text-2xl font-bold font-serif">{customOrders}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Search and Filters */}
                {orders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4 mb-6"
                    >
                        {/* Search Bar */}
                        <div className="relative max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold/60 text-lg" />
                            <input
                                type="text"
                                placeholder="Search orders by number, ID, or amount..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 backdrop-blur-sm border border-gold/20 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-gold/60 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent font-serif"
                            />
                        </div>

                        {/* Filters */}
                        <OrderFilters filters={filters} onFilterChange={(status) => setFilters({ ...filters, status })} />
                    </motion.div>
                )}

                {/* Content */}
                {loading ? (
                    <OrderSkeleton />
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center"
                    >
                        <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2 font-serif">Error Loading Orders</h3>
                        <p className="text-gold/80 mb-6 font-serif">{error}</p>
                        <motion.button
                            onClick={refreshOrders}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-600 text-black py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg border border-gold/30 font-serif"
                        >
                            Try Again
                        </motion.button>
                    </motion.div>
                ) : orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="bg-black/40 backdrop-blur-sm border border-gold/20 rounded-2xl p-12 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-r from-gold to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gold/30">
                                <FiPackage className="text-3xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 font-serif">No Orders Yet</h3>
                            <p className="text-gold/70 mb-8 max-w-md mx-auto font-serif">
                                You haven't placed any orders yet. Start exploring our fashion collections and make your first purchase!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <MotionLink
                                    to="/collections"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-3 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-lg border border-gold/30 font-serif"
                                >
                                    <FiShoppingBag className="text-sm" />
                                    Shop Collections
                                </MotionLink>
                                <MotionLink
                                    to="/custom-order"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold py-3 px-8 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-gold/20 font-serif"
                                >
                                    <FiScissors className="text-sm" />
                                    Create Custom Design
                                </MotionLink>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Orders Count */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between mb-6"
                        >
                            <p className="text-gold/70 font-serif">
                                Showing {Math.min(filteredOrders.length, ordersPerPage)} of {filteredOrders.length} orders
                                {filters.status !== 'all' && ` (${filters.status})`}
                            </p>
                            {(searchTerm || filters.status !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilters({ status: 'all', type: 'all' });
                                    }}
                                    className="text-gold hover:text-yellow-400 text-sm font-medium flex items-center gap-1 font-serif"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </motion.div>

                        {/* Orders Grid */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentPage}-${filters.status}-${searchTerm}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            >
                                {currentOrders.map((order, index) => (
                                    <OrderCard 
                                        key={order.id} 
                                        order={order} 
                                        index={index} 
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {/* Empty Filter Results */}
                        {currentOrders.length === 0 && filteredOrders.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12"
                            >
                                <div className="bg-black/40 backdrop-blur-sm border border-gold/20 rounded-2xl p-8">
                                    <FiSearch className="text-4xl text-gold/50 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2 font-serif">No Orders Found</h3>
                                    <p className="text-gold/70 mb-4 font-serif">
                                        No orders match your current filters. Try adjusting your search criteria.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilters({ status: 'all', type: 'all' });
                                        }}
                                        className="text-gold hover:text-yellow-400 font-medium font-serif"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
