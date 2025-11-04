import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { requestNotificationPermission, setupMessageHandler } from '../../firebase/config';
import {
    FiShoppingCart,
    FiUser,
    FiLogOut,
    FiAlertTriangle,
    FiMenu,
    FiX,
    FiSearch,
    FiBell,
    FiChevronDown,
    FiCheck,
    FiArrowRight,
    FiHeart,
    FiPackage,
    FiHome,
    FiShoppingBag,
    FiInfo,
    FiGrid,
    FiHelpCircle
} from 'react-icons/fi';
import debounce from 'lodash.debounce';
import {
    getSearchSuggestions,
    searchProducts
} from '../../services/searchService';
import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from '../../services/notificationService';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);
const MotionNavLink = motion(NavLink);

// Notification Item Component
const NotificationItem = ({ notification, onMarkAsRead }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 border-b border-gray-200 flex justify-between items-start group hover:bg-gold/10 transition-all duration-300 ${
            !notification.read ? 'bg-yellow-500/10' : ''
        }`}
    >
        <div className="flex-1 min-w-0">
            <div className="text-gray-800 text-sm leading-relaxed">{notification.text}</div>
            <div className="text-gray-500 text-xs mt-2">{notification.date}</div>
        </div>
        {!notification.read && (
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id || notification._id);
                }}
                className="text-gold hover:text-yellow-600 ml-3 transition-colors duration-200"
                title="Mark as read"
            >
                <FiCheck size={16} />
            </motion.button>
        )}
    </motion.div>
);

// Search Suggestion Item
const SearchSuggestion = ({ item, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 hover:bg-gold/10 cursor-pointer border-b border-gray-200 last:border-b-0 flex justify-between items-center group transition-all duration-300"
        onClick={onClick}
    >
        <div className="flex-1 min-w-0">
            <div className="text-gray-800 font-medium truncate">{item.name}</div>
            <div className="text-gray-500 text-xs mt-1">{item.category}</div>
        </div>
        <FiArrowRight className="text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all duration-300" />
    </motion.div>
);

export default function Header() {
    const {
        currentUser,
        logoutLoading,
        signOut,
        sessionExpiresAt,
        refreshToken
    } = useAuth();

    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    // Scroll effect for header background
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide entire nav if user is admin
    const isAdmin = currentUser?.isAdmin;

    // Session timeout warning
    useEffect(() => {
        if (!sessionExpiresAt) return;

        const updateTimeoutWarning = () => {
            const remainingTime = sessionExpiresAt - Date.now();
            setTimeLeft(Math.max(0, remainingTime));
            setShowTimeoutWarning(remainingTime < 5 * 60 * 1000);
        };

        updateTimeoutWarning();
        const interval = setInterval(updateTimeoutWarning, 30000);
        return () => clearInterval(interval);
    }, [sessionExpiresAt]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && 
                !event.target.closest('.mobile-menu-container') && 
                !event.target.closest('.mobile-search-input')) {
                setMobileMenuOpen(false);
            }
            if (showUserDropdown && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
            if (showNotifications && !event.target.closest('.notifications-container')) {
                setShowNotifications(false);
            }
            if (showSuggestions && searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen, showUserDropdown, showNotifications, showSuggestions]);

    // Notifications setup
    useEffect(() => {
        if (!currentUser) return;

        const fetchNotifications = async () => {
            try {
                const response = await getNotifications();
                setNotifications(response || []);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                setNotifications([]);
            }
        };

        requestNotificationPermission(currentUser.uid)
            .catch(error => console.error('Notification permission error:', error));

        const unsubscribe = setupMessageHandler((payload) => {
            toast.info(payload.notification?.body || 'New notification');
            fetchNotifications();
        });

        fetchNotifications();
        return () => unsubscribe();
    }, [currentUser]);

    // Debounced search function with useCallback
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.trim().length > 2) {
                try {
                    const data = await getSearchSuggestions(query);
                    setSearchSuggestions(data || []);
                    setShowSuggestions(true);
                } catch (error) {
                    setSearchSuggestions([]);
                    setShowSuggestions(false);
                }
            } else {
                setSearchSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300),
        []
    );

    // Search suggestions
    useEffect(() => {
        debouncedSearch(searchQuery);
        
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    const handleLogout = async () => {
        try {
            await signOut({
                redirectTo: '/login',
                onSuccess: () => {
                    toast.success("Logged out successfully");
                    setMobileMenuOpen(false);
                },
            });
        } catch (error) {
            toast.error(`Logout failed: ${error.message}`);
        }
    };

    // Search function
    const handleSearch = useCallback(debounce(() => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowSuggestions(false);
            if (searchRef.current) searchRef.current.blur();
        }
    }, 500), [searchQuery, navigate]);

    // Mark as read functions
    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(notifications.map(n =>
                (n.id === id || n._id === id) ? { ...n, read: true } : n
            ));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    const formatTime = (ms) => {
        if (!ms) return '0:00';
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle Enter key in search
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
            e.preventDefault();
        }
    };

    // Dynamic classes based on scroll state
    const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
            ? 'bg-white shadow-md border-b border-gray-200' 
            : 'bg-white'
    }`;

    const iconButtonClass = `p-2 rounded-xl transition-all duration-300 border bg-white border-gold/30 text-gray-700 hover:bg-gold/10 hover:text-gold hover:border-gold/50`;

    const searchInputClass = `w-full pl-4 pr-10 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-300 border bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-gold focus:border-transparent`;

    const dropdownClass = `border border-gray-200 rounded-xl shadow-lg z-50 bg-white`;

    if (isAdmin) {
        return (
            <header className={headerClass}>
                <div className="container mx-auto px-4 py-2 flex justify-end">
                    <MotionLink
                        to="/admin"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gold hover:bg-yellow-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 border border-gold"
                    >
                        Admin Dashboard
                        <FiArrowRight className="text-sm" />
                    </MotionLink>
                </div>
            </header>
        );
    }

    return (
        <header className={headerClass}>
            {/* Session Timeout Warning */}
            <AnimatePresence>
                {showTimeoutWarning && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-2 text-sm flex items-center justify-center gap-2 border-b border-yellow-500/20 bg-yellow-500/10 text-yellow-700"
                    >
                        <FiAlertTriangle className="flex-shrink-0 text-xs" />
                        <span className="text-xs">Session expires in {formatTime(timeLeft)}. Move your mouse to extend.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 py-2">
                {/* Main Header */}
                <div className="flex justify-between items-center">
                    {/* Logo and Mobile Menu */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`lg:hidden transition-all duration-300 ${iconButtonClass}`}
                        >
                            {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                        </motion.button>
                        
                        <MotionLink
                            to="/"
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all duration-300">
                                <img 
                                    src="/images/logo.png" 
                                    alt="Bellebyokien Fashion"
                                    className="w-full h-full object-contain" 
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight -mb-1 transition-colors duration-300">
                                    Bellebyokien
                                </span>
                            </div>
                        </MotionLink>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-6 mx-6">
                        <MotionLink
                            to="/about"
                            whileHover={{ scale: 1.05 }}
                            className="font-medium text-gray-800 hover:text-gold transition-colors duration-300 text-sm"
                        >
                            About
                        </MotionLink>
                        <MotionLink
                            to="/collections"
                            whileHover={{ scale: 1.05 }}
                            className="font-medium text-gray-800 hover:text-gold transition-colors duration-300 text-sm"
                        >
                            Collections
                        </MotionLink>
                        <MotionLink
                            to="/size-guide"
                            whileHover={{ scale: 1.05 }}
                            className="font-medium text-gray-800 hover:text-gold transition-colors duration-300 text-sm"
                        >
                            Size Guide
                        </MotionLink>
                        <MotionLink
                            to="/faq"
                            whileHover={{ scale: 1.05 }}
                            className="font-medium text-gray-800 hover:text-gold transition-colors duration-300 text-sm"
                        >
                            FAQ
                        </MotionLink>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-lg mx-6 relative">
                        <div className="relative w-full" ref={searchRef}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search dresses, and more..."
                                    className={searchInputClass}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSearch}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gold transition-colors duration-300"
                                >
                                    <FiSearch size={18} />
                                </motion.button>
                            </div>

                            {/* Search Suggestions */}
                            <AnimatePresence>
                                {showSuggestions && searchSuggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={`absolute top-full left-0 right-0 mt-1 rounded-xl z-50 max-h-80 overflow-y-auto ${dropdownClass}`}
                                    >
                                        {searchSuggestions.map((item, index) => (
                                            <SearchSuggestion
                                                key={item.id || `search-${index}`}
                                                item={item}
                                                onClick={() => {
                                                    navigate(`/products/${item.id}`);
                                                    setShowSuggestions(false);
                                                    setSearchQuery('');
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right-side Icons */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        {currentUser && (
                            <div className="relative notifications-container">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`relative transition-colors duration-300 ${iconButtonClass}`}
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <FiBell size={18} />
                                    {unreadNotifications > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center border border-white text-[10px]"
                                        >
                                            {unreadNotifications}
                                        </motion.span>
                                    )}
                                </motion.button>
                                
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className={`absolute right-0 mt-2 w-72 z-50 ${dropdownClass}`}
                                        >
                                            <div className="p-3 font-semibold text-gray-800 border-b border-gray-200 flex justify-between items-center text-sm">
                                                <span>Notifications</span>
                                                {unreadNotifications > 0 && (
                                                    <button
                                                        onClick={handleMarkAllAsRead}
                                                        className="text-xs text-gold hover:text-yellow-600 transition-colors duration-300"
                                                    >
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification, index) => (
                                                        <NotificationItem
                                                            key={notification.id || notification._id || `notification-${index}`}
                                                            notification={notification}
                                                            onMarkAsRead={handleMarkAsRead}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-gray-500 text-center text-sm">
                                                        No notifications
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Cart */}
                        <MotionLink
                            to="/cart"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`relative group transition-all duration-300 ${iconButtonClass}`}
                        >
                            <FiShoppingCart size={18} className="transition-colors duration-300" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold border border-white text-[10px]"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </MotionLink>

                        {/* Auth Section */}
                        {currentUser ? (
                            <div className="hidden lg:block relative" ref={userMenuRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className={`flex items-center gap-2 transition-colors duration-300 ${iconButtonClass}`}
                                >
                                    <div className="w-8 h-8 rounded-xl bg-gold flex items-center justify-center overflow-hidden border border-gold">
                                        {currentUser.photoURL ? (
                                            <img
                                                src={currentUser.photoURL}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-white text-sm" />
                                        )}
                                    </div>
                                    <FiChevronDown className={`transition-transform duration-300 text-gray-700 text-sm ${
                                        showUserDropdown ? 'rotate-180' : ''
                                    }`} />
                                </motion.button>

                                {/* User Dropdown */}
                                <AnimatePresence>
                                    {showUserDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className={`absolute right-0 mt-2 w-56 z-50 ${dropdownClass}`}
                                        >
                                            <div className="p-3 border-b border-gray-200">
                                                <div className="font-semibold text-gray-800 text-sm">
                                                    {currentUser.displayName || currentUser.email.split('@')[0]}
                                                </div>
                                                <div className="text-gray-500 text-xs mt-1">{currentUser.email}</div>
                                            </div>
                                            
                                            <div className="p-1 space-y-1">
                                                {currentUser.isAdmin && (
                                                    <NavLink
                                                        to="/admin"
                                                        onClick={() => setShowUserDropdown(false)}
                                                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gold/10 hover:text-gold rounded-lg transition-all duration-300 text-sm font-medium"
                                                    >
                                                        <FiPackage className="text-base" />
                                                        Dashboard
                                                    </NavLink>
                                                )}
                                                <NavLink
                                                    to="/orders"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gold/10 hover:text-gold rounded-lg transition-all duration-300 text-sm font-medium"
                                                    >
                                                    <FiShoppingBag className="text-base" />
                                                    My Orders
                                                </NavLink>
                                                <NavLink
                                                    to="/products"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gold/10 hover:text-gold rounded-lg transition-all duration-300 text-sm font-medium"
                                                >
                                                    <FiHeart className="text-base" />
                                                    Collections
                                                </NavLink>
                                            </div>
                                            
                                            <div className="p-1 border-t border-gray-200">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleLogout}
                                                    disabled={logoutLoading}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-all duration-300 text-sm font-medium ${
                                                        logoutLoading ? 'opacity-50 cursor-wait' : ''
                                                    }`}
                                                >
                                                    <FiLogOut className="text-base" />
                                                    {logoutLoading ? 'Signing out...' : 'Sign out'}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <MotionLink
                                    to="/login"
                                    whileHover={{ scale: 1.05 }}
                                    className="font-medium text-gray-800 hover:text-gold transition-colors duration-300 text-sm"
                                >
                                    Login
                                </MotionLink>
                                <MotionLink
                                    to="/register"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gold hover:bg-yellow-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-300 text-sm"
                                >
                                    Register
                                </MotionLink>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 lg:hidden"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search dresses, and more..."
                                    className="mobile-search-input w-full pl-3 pr-10 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-300 border bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-gold focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    ref={searchRef}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSearch}
                                    className="mobile-search-input absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gold transition-colors duration-300"
                                >
                                    <FiSearch size={18} />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Menu - Solid White Background */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        className="mobile-menu-container lg:hidden border-t border-gray-200 bg-white fixed inset-0 z-40 pt-16"
                    >
                        {/* Close Button */}
                        <div className="absolute top-3 right-3">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-xl transition-all duration-300 border bg-white border-gold/30 text-gray-700 hover:bg-gold/10 hover:text-gold"
                            >
                                <FiX size={20} />
                            </motion.button>
                        </div>

                        {/* User Profile Section */}
                        {currentUser && (
                            <div className="px-4 py-3 border-b border-gray-200 mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center overflow-hidden border border-gold">
                                        {currentUser.photoURL ? (
                                            <img
                                                src={currentUser.photoURL}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-white text-xl" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-800 text-base truncate">
                                            {currentUser.displayName || currentUser.email.split('@')[0]}
                                        </div>
                                        <div className="text-gray-500 text-sm truncate">
                                            {currentUser.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <nav className="container mx-auto px-4 py-3 flex flex-col space-y-1">
                            <NavLink
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-gold/20 text-gold' 
                                            : 'text-gray-700 hover:bg-gold/10 hover:text-gold'
                                    }`
                                }
                            >
                                <FiHome className="text-lg" />
                                Home
                            </NavLink>
                            
                            <NavLink
                                to="/products"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-gold/20 text-gold' 
                                            : 'text-gray-700 hover:bg-gold/10 hover:text-gold'
                                    }`
                                }
                            >
                                <FiShoppingBag className="text-lg" />
                                Collections
                            </NavLink>

                            {/* Additional Links for Mobile */}
                            <NavLink
                                to="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-gold/20 text-gold' 
                                            : 'text-gray-700 hover:bg-gold/10 hover:text-gold'
                                    }`
                                }
                            >
                                <FiInfo className="text-lg" />
                                About
                            </NavLink>

                            <NavLink
                                to="/size-guide"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-gold/20 text-gold' 
                                            : 'text-gray-700 hover:bg-gold/10 hover:text-gold'
                                    }`
                                }
                            >
                                <FiHeart className="text-lg" />
                                Size Guide
                            </NavLink>

                            <NavLink
                                to="/faq"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-gold/20 text-gold' 
                                            : 'text-gray-700 hover:bg-gold/10 hover:text-gold'
                                    }`
                                }
                            >
                                <FiHelpCircle className="text-lg" />
                                FAQ
                            </NavLink>

                            {currentUser && (
                                <>
                                    <NavLink
                                        to="/orders"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium transition-all duration-300 ${
                                                isActive 
                                                    ? 'bg-gold/20 text-gold' 
                                                    : 'text-gray-700 hover:bg-gold/10 hover:text-gold'
                                            }`
                                        }
                                    >
                                        <FiPackage className="text-lg" />
                                        Orders
                                    </NavLink>
                                    
                                    {currentUser.isAdmin && (
                                        <NavLink
                                            to="/admin"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium transition-all duration-300 ${
                                                    isActive 
                                                        ? 'bg-gold/20 text-gold' 
                                                        : 'text-gray-700 hover:bg-gold/10 hover:text-gold'
                                                }`
                                            }
                                        >
                                            <FiUser className="text-lg" />
                                            Dashboard
                                        </NavLink>
                                    )}
                                </>
                            )}

                            {currentUser ? (
                                <div className="pt-4 border-t border-gray-200 mt-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLogout}
                                        disabled={logoutLoading}
                                        className={`w-full flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium transition-all duration-300 ${
                                            logoutLoading 
                                                ? 'opacity-50 cursor-wait bg-gray-100 text-gray-500' 
                                                : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                                        }`}
                                    >
                                        <FiLogOut className="text-lg" />
                                        {logoutLoading ? 'Signing out...' : 'Sign out'}
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-gray-200 mt-3 space-y-1">
                                    <MotionLink
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gold/10 hover:text-gold transition-all duration-300"
                                    >
                                        <FiUser className="text-lg" />
                                        Login
                                    </MotionLink>
                                    <MotionLink
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 py-3 px-3 rounded-xl text-base font-medium bg-gold text-white hover:bg-yellow-600 transition-all duration-300"
                                    >
                                        <FiUser className="text-lg" />
                                        Register
                                    </MotionLink>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
