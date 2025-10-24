import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllOrders } from '../../services/orderService';
import { getProducts } from '../../services/productServic';
import { getAllCustomOrders } from '../../services/customOrderService';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiPackage, 
    FiShoppingCart, 
    FiDollarSign, 
    FiUsers, 
    FiTrendingUp, 
    FiTrendingDown,
    FiRefreshCw,
    FiAlertCircle,
    FiBarChart2,
    FiCalendar,
    FiScissors,
    FiGrid,
    FiLayers
} from 'react-icons/fi';

const Dashboard = () => {
    const { currentUser, isAdmin } = useAuth();
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        customOrders: 0,
        revenue: 0,
        users: 0,
        monthlyGrowth: 0,
        pendingCustomOrders: 0,
        customOrdersRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'custom-orders'

    const fetchStats = async () => {
        try {
            setRefreshing(true);
            const [productsRes, ordersRes, customOrdersRes] = await Promise.all([
                getProducts().catch(err => {
                    console.error('Products fetch error:', err);
                    return { data: [] };
                }),
                getAllOrders().catch(err => {
                    console.error('Orders fetch error:', err);
                    return { data: [] };
                }),
                getAllCustomOrders().catch(err => {
                    console.error('Custom orders fetch error:', err);
                    return { data: [] };
                })
            ]);

            // Calculate standard orders revenue
            const revenue = ordersRes.data?.reduce(
                (acc, order) => acc + (order.totalPrice || 0),
                0
            ) || 0;

            // Calculate custom orders revenue and pending count
            const customOrdersData = customOrdersRes.data || [];
            const customOrdersRevenue = customOrdersData.reduce(
                (acc, order) => acc + (order.totalPrice || order.finalPrice || order.basePrice || 0),
                0
            ) || 0;

            const pendingCustomOrders = customOrdersData.filter(
                order => order.status === 'consultation' || order.status === 'design'
            ).length;

            const totalRevenue = revenue + customOrdersRevenue;
            const totalOrders = (ordersRes.data?.length || 0) + customOrdersData.length;

            // Calculate monthly growth (mock data for demo)
            const monthlyGrowth = 15;

            setStats({
                products: productsRes.data?.length || 0,
                orders: totalOrders,
                customOrders: customOrdersData.length,
                revenue: totalRevenue,
                users: 0,
                monthlyGrowth,
                pendingCustomOrders,
                customOrdersRevenue
            });
            setError(null);
        } catch (error) {
            console.error('Dashboard error:', error);
            setError('Failed to load dashboard data. Showing cached statistics.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleRefresh = () => {
        fetchStats();
    };

    if (!isAdmin) return null;

    const statsCards = {
        overview: [
            {
                title: "Total Products",
                value: stats.products,
                icon: FiPackage,
                color: "from-gold to-yellow-600",
                bgColor: "bg-gradient-to-r from-gold to-yellow-600",
                trend: { value: 12, label: "vs last month", positive: true },
                isError: error && stats.products === 0
            },
            {
                title: "Total Orders",
                value: stats.orders,
                icon: FiShoppingCart,
                color: "from-gray-800 to-gray-600",
                bgColor: "bg-gradient-to-r from-gray-800 to-gray-600",
                trend: { value: 8, label: "vs last month", positive: true },
                isError: error && stats.orders === 0,
                subtitle: `${stats.customOrders} custom orders`
            },
            {
                title: "Total Revenue",
                value: `₦${stats.revenue.toLocaleString()}`,
                icon: FiDollarSign,
                color: "from-gold to-yellow-600",
                bgColor: "bg-gradient-to-r from-gold to-yellow-600",
                trend: { value: 15, label: "vs last month", positive: true },
                isError: error && stats.revenue === 0,
                subtitle: `₦${stats.customOrdersRevenue.toLocaleString()} from custom`
            },
            {
                title: "Monthly Growth",
                value: `${stats.monthlyGrowth}%`,
                icon: FiBarChart2,
                color: "from-gray-800 to-gray-600",
                bgColor: "bg-gradient-to-r from-gray-800 to-gray-600",
                trend: { value: 2, label: "vs last month", positive: stats.monthlyGrowth > 0 },
                isError: false
            }
        ],
        'custom-orders': [
            {
                title: "Custom Orders",
                value: stats.customOrders,
                icon: FiScissors,
                color: "from-gold to-yellow-600",
                bgColor: "bg-gradient-to-r from-gold to-yellow-600",
                trend: { value: 25, label: "vs last month", positive: true },
                isError: error && stats.customOrders === 0
            },
            {
                title: "Pending Custom Orders",
                value: stats.pendingCustomOrders,
                icon: FiLayers,
                color: "from-gray-800 to-gray-600",
                bgColor: "bg-gradient-to-r from-gray-800 to-gray-600",
                trend: { value: -5, label: "vs last month", positive: false },
                isError: false,
                subtitle: "Consultation & Design phase"
            },
            {
                title: "Custom Orders Revenue",
                value: `₦${stats.customOrdersRevenue.toLocaleString()}`,
                icon: FiDollarSign,
                color: "from-gold to-yellow-600",
                bgColor: "bg-gradient-to-r from-gold to-yellow-600",
                trend: { value: 18, label: "vs last month", positive: true },
                isError: error && stats.customOrdersRevenue === 0,
                subtitle: "From custom designs"
            },
            {
                title: "Custom Order Growth",
                value: "28%",
                icon: FiTrendingUp,
                color: "from-gray-800 to-gray-600",
                bgColor: "bg-gradient-to-r from-gray-800 to-gray-600",
                trend: { value: 28, label: "custom orders growth", positive: true },
                isError: false
            }
        ]
    };

    const currentStatsCards = statsCards[viewMode] || statsCards.overview;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gold mb-2 font-serif">
                        {viewMode === 'overview' ? 'Dashboard Overview' : 'Custom Orders Dashboard'}
                    </h1>
                    <p className="text-gold/70 font-serif">
                        Welcome back, {currentUser?.email?.split('@')[0] || 'Admin'}! 
                        {viewMode === 'overview' ? " Here's what's happening today." : " Managing custom fashion orders."}
                    </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                    {/* View Mode Toggle */}
                    <div className="flex bg-black/40 backdrop-blur-sm rounded-2xl p-1 border border-gold/20">
                        <button
                            onClick={() => setViewMode('overview')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                viewMode === 'overview' 
                                    ? 'bg-gold text-black shadow-lg' 
                                    : 'text-gold/70 hover:text-gold hover:bg-gold/10'
                            }`}
                        >
                            <FiGrid className="inline mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setViewMode('custom-orders')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                viewMode === 'custom-orders' 
                                    ? 'bg-gold text-black shadow-lg' 
                                    : 'text-gold/70 hover:text-gold hover:bg-gold/10'
                            }`}
                        >
                            <FiScissors className="inline mr-2" />
                            Custom Orders
                        </button>
                    </div>

                    <div className="flex items-center text-sm text-gold/70">
                        <FiCalendar className="mr-2" />
                        <span>{new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center bg-gold text-black hover:bg-yellow-500 py-2 px-4 rounded-xl border border-gold/30 hover:shadow-lg transition-all duration-200 disabled:opacity-50 font-medium"
                    >
                        <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm border border-red-500/20"
                    >
                        <div className="flex items-center">
                            <FiAlertCircle className="text-red-400 text-xl mr-3" />
                            <div>
                                <p className="text-red-300 font-medium">{error}</p>
                                <p className="text-red-400/80 text-sm mt-1">
                                    Some data may not be up to date. Try refreshing the page.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="wait">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 h-32 animate-pulse"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gold/20 rounded w-1/2"></div>
                                        <div className="h-8 bg-gold/20 rounded w-3/4"></div>
                                    </div>
                                    <div className="w-12 h-12 bg-gold/20 rounded-xl"></div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        currentStatsCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 hover:border-gold/40 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm font-medium text-gold/70 mb-1 font-serif">
                                                    {card.title}
                                                </p>
                                                <p className={`text-2xl font-bold font-serif ${
                                                    card.isError ? 'text-red-400' : 'text-white'
                                                }`}>
                                                    {card.value}
                                                </p>
                                                {card.subtitle && (
                                                    <p className="text-xs text-gold/50 mt-1 font-serif">
                                                        {card.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={`${card.bgColor} rounded-xl p-3 text-white group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="text-xl" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {card.trend.positive ? (
                                                    <FiTrendingUp className="text-green-400 mr-1" />
                                                ) : (
                                                    <FiTrendingDown className="text-red-400 mr-1" />
                                                )}
                                                <span className={`text-sm font-medium font-serif ${
                                                    card.trend.positive ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                    {card.trend.positive ? '+' : ''}{card.trend.value}%
                                                </span>
                                            </div>
                                            <span className="text-xs text-gold/50 font-serif">
                                                {card.trend.label}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Progress bar */}
                                    <div className="w-full bg-gold/20 h-1">
                                        <div 
                                            className={`h-1 transition-all duration-1000 ${
                                                card.trend.positive ? 'bg-green-400' : 'bg-red-400'
                                            }`}
                                            style={{ width: `${Math.min(card.trend.value, 100)}%` }}
                                        ></div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Additional Dashboard Sections */}
            {!loading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Quick Actions */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 p-6">
                        <h3 className="text-lg font-semibold text-gold mb-4 font-serif">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Add Product', icon: FiPackage, path: '/admin/products/new' },
                                { label: 'View Orders', icon: FiShoppingCart, path: '/admin/orders' },
                                { label: 'Custom Orders', icon: FiScissors, path: '/admin/custom-orders' },
                                { label: 'Analytics', icon: FiBarChart2, path: '/admin/analytics' }
                            ].map((action, index) => (
                                <motion.button
                                    key={action.label}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col items-center justify-center p-4 bg-gold/10 rounded-xl hover:bg-gold/20 text-gold hover:text-white transition-all duration-200 group border border-gold/20"
                                >
                                    <action.icon className="text-2xl mb-2 text-gold group-hover:text-white" />
                                    <span className="text-sm font-medium font-serif group-hover:text-white">
                                        {action.label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 p-6">
                        <h3 className="text-lg font-semibold text-gold mb-4 font-serif">
                            {viewMode === 'overview' ? 'Recent Activity' : 'Custom Orders Activity'}
                        </h3>
                        <div className="space-y-4">
                            {(viewMode === 'overview' ? [
                                { action: 'New order received', time: '2 min ago', type: 'order' },
                                { action: 'Product stock updated', time: '1 hour ago', type: 'product' },
                                { action: 'Custom order consultation', time: '3 hours ago', type: 'custom' },
                                { action: 'Revenue target reached', time: '1 day ago', type: 'revenue' }
                            ] : [
                                { action: 'New custom order consultation', time: '15 min ago', type: 'custom' },
                                { action: 'Design sketch approved', time: '2 hours ago', type: 'design' },
                                { action: 'Fitting session scheduled', time: '1 day ago', type: 'fitting' },
                                { action: 'Custom order delivered', time: '2 days ago', type: 'delivery' }
                            ]).map((activity, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gold/10 transition-colors duration-200 border border-transparent hover:border-gold/20">
                                    <div className={`w-2 h-2 rounded-full ${
                                        activity.type === 'order' ? 'bg-blue-400' :
                                        activity.type === 'product' ? 'bg-purple-400' :
                                        activity.type === 'custom' ? 'bg-gold' :
                                        activity.type === 'design' ? 'bg-yellow-400' :
                                        activity.type === 'fitting' ? 'bg-orange-400' :
                                        activity.type === 'delivery' ? 'bg-green-400' : 'bg-green-400'
                                    }`}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white font-serif">{activity.action}</p>
                                        <p className="text-xs text-gold/70 font-serif">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Custom Orders Summary (Only in overview mode) */}
            {viewMode === 'overview' && !loading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gold font-serif">Custom Orders Summary</h3>
                        <button 
                            onClick={() => setViewMode('custom-orders')}
                            className="text-gold hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            View Details
                            <FiTrendingUp className="text-xs" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Custom Orders', value: stats.customOrders, color: 'text-gold' },
                            { label: 'Pending Consultation', value: stats.pendingCustomOrders, color: 'text-yellow-400' },
                            { label: 'In Production', value: Math.floor(stats.customOrders * 0.3), color: 'text-blue-400' },
                            { label: 'Completed', value: Math.floor(stats.customOrders * 0.4), color: 'text-green-400' }
                        ].map((item, index) => (
                            <div key={index} className="text-center p-4 bg-gold/5 rounded-xl border border-gold/10">
                                <p className="text-2xl font-bold text-white font-serif">{item.value}</p>
                                <p className={`text-sm font-medium ${item.color} font-serif`}>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
