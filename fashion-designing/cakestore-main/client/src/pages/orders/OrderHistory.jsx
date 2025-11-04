import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByUser } from '../../services/orderService';
import { getCustomOrdersByUser } from '../../services/customOrderService';
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
    FiRefreshCw,
    FiGrid,
    FiList
} from 'react-icons/fi';
import CustomCakeForm from '../../components/orders/CustomCakeForm';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);

// Loading Skeleton Component
const OrderSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-6 border border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-32"></div>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-gray-300 rounded w-24"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
            </div>
        ))}
    </div>
);

// Status Badge Component
const StatusBadge = ({ order, orderType }) => {
    // Custom order status configuration
    const customStatusConfig = {
        consultation: { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Consultation', icon: FiClock },
        design: { color: 'bg-purple-100 text-purple-700 border-purple-200', text: 'Design Phase', icon: FiScissors },
        measurement: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', text: 'Measurement', icon: FiTag },
        production: { color: 'bg-gold/20 text-yellow-700 border-gold/30', text: 'In Production', icon: FiPackage },
        fitting: { color: 'bg-orange-100 text-orange-700 border-orange-200', text: 'Fitting', icon: FiCheckCircle },
        ready: { color: 'bg-green-100 text-green-700 border-green-200', text: 'Ready', icon: FiCheckCircle },
        shipped: { color: 'bg-teal-100 text-teal-700 border-teal-200', text: 'Shipped', icon: FiTruck },
        delivered: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Delivered', icon: FiCheckCircle },
        cancelled: { color: 'bg-red-100 text-red-700 border-red-200', text: 'Cancelled', icon: FiAlertCircle }
    };

    // Regular order status configuration
    const regularStatusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Pending Payment', icon: FiClock },
        confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Confirmed', icon: FiCheckCircle },
        processing: { color: 'bg-gold/20 text-yellow-700 border-gold/30', text: 'Processing', icon: FiPackage },
        ready_to_ship: { color: 'bg-orange-100 text-orange-700 border-orange-200', text: 'Ready to Ship', icon: FiTruck },
        shipped: { color: 'bg-green-100 text-green-700 border-green-200', text: 'Shipped', icon: FiTruck },
        delivered: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Delivered', icon: FiCheckCircle },
        cancelled: { color: 'bg-red-100 text-red-700 border-red-200', text: 'Cancelled', icon: FiAlertCircle }
    };

    const config = orderType === 'custom' 
        ? customStatusConfig[order.status] || customStatusConfig.consultation
        : regularStatusConfig[order.status] || regularStatusConfig.pending;
    
    const Icon = config.icon;

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-2 ${config.color} px-3 py-1 rounded-full text-xs font-semibold border`}
        >
            <Icon className="text-xs" />
            {config.text}
        </motion.span>
    );
};

// Order Type Badge
const OrderTypeBadge = ({ orderType }) => {
    const typeConfig = {
        standard: { color: 'bg-gold/20 text-yellow-700 border-gold/30', text: 'Ready-to-Wear', icon: FiPackage },
        custom: { color: 'bg-purple-100 text-purple-700 border-purple-200', text: 'Custom Design', icon: FiScissors },
        mixed: { color: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Mixed Order', icon: FiTag }
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
const OrderCard = ({ order, index, orderType }) => {
    const totalItems = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
    const customItemsCount = order.customOrders?.length || 0;

    // Custom order specific details
    const isCustomOrder = orderType === 'custom';
    const designType = order.designType;
    const occasion = order.occasion;
    const eventDate = order.eventDate;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
                y: -4,
                transition: { duration: 0.3 }
            }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden group hover:border-gold transition-all duration-500 shadow-sm"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                            isCustomOrder 
                                ? 'bg-purple-100 text-purple-600 border-purple-200' 
                                : 'bg-gold text-white border-gold'
                        }`}>
                            {isCustomOrder ? (
                                <FiScissors className="text-lg" />
                            ) : (
                                <FiPackage className="text-lg" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {order.orderNumber || `Order #${order.id?.substring(0, 8)}`}
                                </h3>
                                <OrderTypeBadge orderType={isCustomOrder ? 'custom' : 'standard'} />
                            </div>
                            <p className="text-gray-600 text-sm flex items-center gap-1">
                                <FiCalendar className="text-xs" />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <StatusBadge order={order} orderType={isCustomOrder ? 'custom' : 'regular'} />
                </div>

                {/* Custom Order Specific Details */}
                {isCustomOrder && (
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">Design:</span>
                            <span className="text-gray-900 font-medium">{designType}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">Occasion:</span>
                            <span className="text-gray-900 font-medium">{occasion}</span>
                        </div>
                        {eventDate && (
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600">Event Date:</span>
                                <span className="text-gray-900 font-medium">
                                    {new Date(eventDate).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-gray-600 text-sm">Total Amount</p>
                        <p className="text-gray-900 font-semibold text-lg flex items-center gap-1">
                            <FiDollarSign className="text-gold" />
                            ₦{order.totalPrice?.toLocaleString() || order.basePrice?.toLocaleString() || '0'}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-gray-600 text-sm">
                            {isCustomOrder ? 'Type' : 'Items'}
                        </p>
                        <p className="text-gray-900 font-semibold">
                            {isCustomOrder ? (
                                designType || 'Custom Design'
                            ) : (
                                `${totalItems} item${totalItems !== 1 ? 's' : ''}`
                            )}
                        </p>
                    </div>
                </div>

                {/* Order Preview */}
                {!isCustomOrder && order.items && order.items.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={item.image || '/images/placeholder-fashion.png'}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                    />
                                    {item.quantity > 1 && (
                                        <div className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                            {item.quantity}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(order.items.length > 3 || customItemsCount > 0) && (
                                <div className="text-gray-500 text-sm">
                                    +{Math.max(0, order.items.length - 3) + customItemsCount} more
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Custom Order Inspiration Images */}
                {isCustomOrder && order.inspirationImages && order.inspirationImages.length > 0 && (
                    <div className="mb-4">
                        <p className="text-gray-600 text-sm mb-2">Inspiration Images:</p>
                        <div className="flex items-center gap-2">
                            {order.inspirationImages.slice(0, 3).map((image, idx) => (
                                <img
                                    key={idx}
                                    src={image}
                                    alt={`Inspiration ${idx + 1}`}
                                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                />
                            ))}
                            {order.inspirationImages.length > 3 && (
                                <div className="text-gray-500 text-sm">
                                    +{order.inspirationImages.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        {order.trackingNumber && (
                            <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <FiTruck className="text-xs" />
                                Tracked
                            </span>
                        )}
                        <span className="text-gray-500 text-sm">
                            {order.shippingMethod || 'Standard Shipping'}
                        </span>
                    </div>
                    <MotionLink
                        to={isCustomOrder ? `/custom-orders/${order.id}` : `/orders/${order.id}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 group-hover:bg-yellow-600"
                    >
                        View Details
                        <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                    </MotionLink>
                </div>
            </div>
        </motion.div>
    );
};

// Order Type Toggle Component
const OrderTypeToggle = ({ activeType, onTypeChange }) => {
    const types = [
        { value: 'all', label: 'All Orders', icon: FiGrid },
        { value: 'regular', label: 'Ready-to-Wear', icon: FiPackage },
        { value: 'custom', label: 'Custom Designs', icon: FiScissors }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex bg-gray-100 rounded-lg p-2 border border-gray-200 max-w-md"
        >
            {types.map((type) => {
                const Icon = type.icon;
                const isActive = activeType === type.value;
                
                return (
                    <motion.button
                        key={type.value}
                        onClick={() => onTypeChange(type.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex-1 justify-center ${
                            isActive
                                ? 'bg-gold text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Icon className="text-sm" />
                        {type.label}
                    </motion.button>
                );
            })}
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === page 
                            ? 'bg-gold text-white shadow-sm' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
            Next
            <FiArrowRight className="text-sm" />
        </motion.button>
    </motion.div>
);

// Filter Component
const OrderFilters = ({ filters, onFilterChange, orderType }) => {
    const filterOptions = orderType === 'custom' 
        ? [
            { value: 'all', label: 'All Custom Orders' },
            { value: 'consultation', label: 'Consultation' },
            { value: 'design', label: 'Design Phase' },
            { value: 'production', label: 'In Production' },
            { value: 'delivered', label: 'Delivered' }
        ]
        : orderType === 'regular'
        ? [
            { value: 'all', label: 'All Ready-to-Wear' },
            { value: 'processing', label: 'Processing' },
            { value: 'delivered', label: 'Delivered' }
        ]
        : [
            { value: 'all', label: 'All Orders' },
            { value: 'standard', label: 'Ready-to-Wear' },
            { value: 'custom', label: 'Custom Designs' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'processing', label: 'Processing' }
        ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 mb-6"
        >
            <div className="flex items-center gap-2 text-gray-600">
                <FiFilter className="text-sm" />
                <span className="text-sm">Filter by:</span>
            </div>
            
            {filterOptions.map(filter => (
                <motion.button
                    key={filter.value}
                    onClick={() => onFilterChange(filter.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        filters.status === filter.value
                            ? 'bg-gold text-white shadow-sm'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                    {filter.label}
                </motion.button>
            ))}
        </motion.div>
    );
};

export default function OrderHistory() {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [customOrders, setCustomOrders] = useState([]);
    const [regularOrders, setRegularOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: 'all' });
    const [orderType, setOrderType] = useState('all'); // 'all', 'regular', 'custom'
    const ordersPerPage = 6;
    const [showCustomOrderForm, setShowCustomOrderForm] = useState(false);

    useEffect(() => {
        const fetchAllOrders = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                setError('');
                
                console.log('Starting to fetch orders...');
                
                // Fetch both regular and custom orders with error handling
                const [regularResponse, customResponse] = await Promise.allSettled([
                    getOrdersByUser().catch(err => {
                        console.log('Regular orders not available:', err.message);
                        return { data: { data: [] } }; // Return proper structure
                    }),
                    getCustomOrdersByUser().catch(err => {
                        console.log('Custom orders error:', err.message);
                        return { data: { data: [] } }; // Return proper structure
                    })
                ]);

                console.log('Regular response:', regularResponse);
                console.log('Custom response:', customResponse);

                // Extract data from responses - handle different response structures
                const getOrdersData = (response) => {
                    if (!response || response.status !== 'fulfilled') return [];
                    
                    const value = response.value;
                    // Handle different response structures
                    if (value?.data?.data) {
                        return value.data.data; // { data: { data: [...] } }
                    } else if (value?.data) {
                        return value.data; // { data: [...] }
                    } else if (Array.isArray(value)) {
                        return value; // [...]
                    } else {
                        return [];
                    }
                };

                const regularOrdersData = getOrdersData(regularResponse);
                const customOrdersData = getOrdersData(customResponse);

                console.log('Regular orders data:', regularOrdersData);
                console.log('Custom orders data:', customOrdersData);

                setRegularOrders(regularOrdersData);
                setCustomOrders(customOrdersData);
                setOrders([...regularOrdersData, ...customOrdersData]);

            } catch (err) {
                console.error('Error in fetchAllOrders:', err);
                setError(err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchAllOrders();
    }, [currentUser]);

    const handleCustomOrderSubmit = async (orderData) => {
        if (!currentUser) {
            console.error("User is not authenticated. Cannot create order.");
            alert("Your session has expired. Please log in again.");
            return;
        }

        try {
            // Handle custom order submission
            setShowCustomOrderForm(false);
        } catch (error) {
            console.error("Error preparing custom order: ", error);
            alert("There was an error preparing your order. Please try again.");
        }
    };

    const handleCustomOrderClick = (e) => {
        e.preventDefault();
        if (!currentUser) {
            // Handle login redirect
            return;
        } else {
            setShowCustomOrderForm(true);
        }
    };

    // Filter orders based on type, search term and filters
    const filteredOrders = (orderType === 'all' ? orders : 
                          orderType === 'regular' ? regularOrders : 
                          customOrders).filter(order => {
        if (!order) return false;
        
        const isCustom = orderType === 'custom' || (orderType === 'all' && customOrders.includes(order));
        
        const matchesSearch = 
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.totalPrice?.toString().includes(searchTerm) ||
            (isCustom && order.designType?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (isCustom && order.occasion?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = 
            filters.status === 'all' ||
            (filters.status === 'delivered' && (order.isDelivered || order.status === 'delivered')) ||
            (filters.status === 'processing' && (
                (!order.isDelivered && order.isPaid) || 
                ['consultation', 'design', 'measurement', 'production', 'fitting'].includes(order.status)
            )) ||
            (filters.status === 'standard' && !isCustom) ||
            (filters.status === 'custom' && isCustom) ||
            (filters.status === 'consultation' && order.status === 'consultation') ||
            (filters.status === 'design' && order.status === 'design') ||
            (filters.status === 'production' && order.status === 'production');

        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    // Stats calculation
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || order.basePrice || 0), 0);
    const deliveredOrders = orders.filter(order => order.isDelivered || order.status === 'delivered').length;
    const customOrdersCount = customOrders.length;

    const refreshOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const [regularResponse, customResponse] = await Promise.allSettled([
                getOrdersByUser().catch(err => {
                    console.log('Regular orders not available:', err.message);
                    return { data: { data: [] } };
                }),
                getCustomOrdersByUser().catch(err => {
                    console.log('Custom orders error:', err.message);
                    return { data: { data: [] } };
                })
            ]);

            // Extract data from responses
            const getOrdersData = (response) => {
                if (!response || response.status !== 'fulfilled') return [];
                
                const value = response.value;
                if (value?.data?.data) {
                    return value.data.data;
                } else if (value?.data) {
                    return value.data;
                } else if (Array.isArray(value)) {
                    return value;
                } else {
                    return [];
                }
            };

            const regularOrdersData = getOrdersData(regularResponse);
            const customOrdersData = getOrdersData(customResponse);

            setRegularOrders(regularOrdersData);
            setCustomOrders(customOrdersData);
            setOrders([...regularOrdersData, ...customOrdersData]);
        } catch (err) {
            setError(err.message || 'Failed to refresh orders');
        } finally {
            setLoading(false);
        }
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.status, orderType, searchTerm]);

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Order History</h1>
                        <p className="text-gray-600">Track and manage all your fashion orders in one place</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                            onClick={refreshOrders}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-gray-200"
                        >
                            <FiRefreshCw className="text-sm" />
                            Refresh
                        </motion.button>
                        <MotionLink
                            to="/collections"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 border border-gold"
                        >
                            <FiShoppingBag className="text-sm" />
                            Continue Shopping
                        </MotionLink>
                    </div>
                </motion.div>

                {/* Order Type Toggle */}
                <div className="flex justify-center mb-8">
                    <OrderTypeToggle activeType={orderType} onTypeChange={setOrderType} />
                </div>

                {/* Stats Cards */}
                {orders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                    >
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center border border-gold">
                                    <FiPackage className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Total Orders</p>
                                    <p className="text-gray-900 text-2xl font-bold">{totalOrders}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center border border-green-500">
                                    <FiTrendingUp className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Total Spent</p>
                                    <p className="text-gray-900 text-2xl font-bold">₦{totalSpent.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center border border-blue-500">
                                    <FiTruck className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Delivered</p>
                                    <p className="text-gray-900 text-2xl font-bold">{deliveredOrders}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center border border-purple-500">
                                    <FiScissors className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Custom Designs</p>
                                    <p className="text-gray-900 text-2xl font-bold">{customOrdersCount}</p>
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
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                placeholder={
                                    orderType === 'custom' 
                                        ? "Search custom orders by design, occasion..." 
                                        : orderType === 'regular'
                                        ? "Search ready-to-wear orders..."
                                        : "Search all orders..."
                                }
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                            />
                        </div>

                        {/* Filters */}
                        <OrderFilters 
                            filters={filters} 
                            onFilterChange={(status) => setFilters({ ...filters, status })} 
                            orderType={orderType}
                        />
                    </motion.div>
                )}

                {/* Content */}
                {loading ? (
                    <OrderSkeleton />
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
                    >
                        <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <motion.button
                            onClick={refreshOrders}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-gold text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 border border-gold"
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
                        <div className="bg-white border border-gray-200 rounded-lg p-12 max-w-2xl mx-auto shadow-sm">
                            <div className="w-20 h-20 bg-gold rounded-lg flex items-center justify-center mx-auto mb-6 border border-gold">
                                <FiPackage className="text-3xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                You haven't placed any orders yet. Start exploring our fashion collections and make your first purchase!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <MotionLink
                                    to="/collections"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-600 text-white py-3 px-8 rounded-lg font-semibold transition-all duration-300 border border-gold"
                                >
                                    <FiShoppingBag className="text-sm" />
                                    Shop Collections
                                </MotionLink>
                                <MotionLink
                                    to="/custom-order"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-8 rounded-lg font-semibold transition-all duration-300 border border-gray-200"
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
                            <p className="text-gray-600">
                                Showing {Math.min(filteredOrders.length, ordersPerPage)} of {filteredOrders.length} orders
                                {filters.status !== 'all' && ` (${filters.status})`}
                                {orderType !== 'all' && ` • ${orderType === 'custom' ? 'Custom Designs' : 'Ready-to-Wear'}`}
                            </p>
                            {(searchTerm || filters.status !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilters({ status: 'all' });
                                    }}
                                    className="text-gold hover:text-yellow-600 text-sm font-medium flex items-center gap-1"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </motion.div>

                        {/* Orders Grid */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${orderType}-${currentPage}-${filters.status}-${searchTerm}`}
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
                                        orderType={orderType === 'all' 
                                            ? (customOrders.includes(order) ? 'custom' : 'regular')
                                            : orderType
                                        }
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
                                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                                    <FiSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
                                    <p className="text-gray-600 mb-4">
                                        No orders match your current filters. Try adjusting your search criteria.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilters({ status: 'all' });
                                        }}
                                        className="text-gold hover:text-yellow-600 font-medium"
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
