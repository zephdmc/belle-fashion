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
    FiShoppingBag
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
const NotificationItem = ({ notification, onMarkAsRead, isScrolled }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 border-b flex justify-between items-start group hover:bg-gold/10 transition-all duration-300 ${
            !notification.read ? 'bg-yellow-500/10' : ''
        } ${
            isScrolled 
                ? 'border-gray-200 hover:bg-gold/5' 
                : 'border-gold/20 hover:bg-gold/10'
        }`}
    >
        <div className="flex-1 min-w-0">
            <div className={`text-sm leading-relaxed ${
                isScrolled ? 'text-gray-800' : 'text-white'
            }`}>{notification.text}</div>
            <div className={`text-xs mt-2 ${
                isScrolled ? 'text-gray-500' : 'text-white/60'
            }`}>{notification.date}</div>
        </div>
        {!notification.read && (
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id || notification._id);
                }}
                className="text-yellow-400 hover:text-yellow-300 ml-3 transition-colors duration-200"
                title="Mark as read"
            >
                <FiCheck size={16} />
            </motion.button>
        )}
    </motion.div>
);

// Search Suggestion Item
const SearchSuggestion = ({ item, onClick, isScrolled }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-3 hover:bg-gold/10 cursor-pointer border-b last:border-b-0 flex justify-between items-center group transition-all duration-300 ${
            isScrolled 
                ? 'border-gray-200 hover:bg-gold/5' 
                : 'border-gold/20 hover:bg-gold/10'
        }`}
        onClick={onClick}
    >
        <div className="flex-1 min-w-0">
            <div className={`font-medium truncate ${
                isScrolled ? 'text-gray-800' : 'text-white'
            }`}>{item.name}</div>
            <div className={`text-xs mt-1 ${
                isScrolled ? 'text-gray-500' : 'text-white/60'
            }`}>{item.category}</div>
        </div>
        <FiArrowRight className={`transform group-hover:translate-x-1 transition-all duration-300 ${
            isScrolled ? 'text-gray-400 group-hover:text-gray-600' : 'text-white/40 group-hover:text-white'
        }`} />
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
            setIsScrolled(scrollTop > 50);
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
    const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
            : 'bg-transparent'
    }`;

    const textClass = (isHover = false) => 
        isScrolled 
            ? isHover ? 'text-gold' : 'text-gray-800' 
            : isHover ? 'text-yellow-200' : 'text-white';

    const iconButtonClass = `p-2 rounded-2xl transition-all duration-300 backdrop-blur-sm border ${
        isScrolled 
            ? 'bg-white/80 border-gold/30 text-gray-700 hover:bg-gold/10 hover:text-gold hover:border-gold/50' 
            : 'bg-white/10 border-yellow-400/20 text-white hover:text-yellow-200 hover:border-yellow-400/40'
    }`;

    const searchInputClass = `w-full pl-5 pr-12 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm border ${
        isScrolled 
            ? 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-gold focus:border-transparent' 
            : 'bg-white/10 border-yellow-400/20 text-white placeholder-white/60 focus:ring-yellow-400 focus:border-transparent'
    }`;

    const dropdownClass = `backdrop-blur-sm border rounded-2xl shadow-2xl z-50 ${
        isScrolled 
            ? 'bg-white/95 border-gray-200' 
            : 'bg-black/90 border-yellow-400/20'
    }`;

    if (isAdmin) {
        return (
            <header className={headerClass}>
                <div className="container mx-auto px-4 py-3 flex justify-end">
                    <MotionLink
                        to="/admin"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white py-2 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg flex items-center gap-2 backdrop-blur-sm border border-gold/30"
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
                        className={`p-3 text-sm flex items-center justify-center gap-3 border-b ${
                            isScrolled 
                                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700' 
                                : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200'
                        }`}
                    >
                        <FiAlertTriangle className="flex-shrink-0" />
                        <span>Session expires in {formatTime(timeLeft)}. Move your mouse to extend.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 py-3">
                {/* Main Header */}
                <div className="flex justify-between items-center">
                    {/* Logo and Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`lg:hidden transition-all duration-300 ${iconButtonClass}`}
                        >
                            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </motion.button>
                        
                        <MotionLink
                            to="/"
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group"
                        >
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center p-2 transition-all duration-300 backdrop-blur-sm border ${
                                isScrolled 
                                    ? 'bg-white/80 border-gold/30' 
                                    : 'bg-white/10 border-yellow-400/20'
                            }`}>
                                <img 
                                    src="/images/logo.png" 
                                    alt="Bellebyokien Fashion"
                                    className="w-full h-full object-contain" 
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className={`text-2xl sm:text-3xl font-bold tracking-tight -mb-1 transition-colors duration-300 ${
                                    textClass()
                                }`}>
                                    Bellebyokien
                                </span>
                                <span className={`text-sm sm:text-base font-medium tracking-wider mt-0.5 transition-colors duration-300 ${
                                    isScrolled ? 'text-gray-600' : 'text-white/80'
                                }`}>
                                    Fashion 
                                </span>
                            </div>
                        </MotionLink>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
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
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                        isScrolled ? 'text-gray-500 hover:text-gold' : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    <FiSearch size={20} />
                                </motion.button>
                            </div>

                            {/* Search Suggestions */}
                            <AnimatePresence>
                                {showSuggestions && searchSuggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={`absolute top-full left-0 right-0 mt-2 rounded-2xl z-50 max-h-96 overflow-y-auto ${dropdownClass}`}
                                    >
                                        {searchSuggestions.map((item, index) => (
                                            <SearchSuggestion
                                                key={item.id || `search-${index}`}
                                                item={item}
                                                isScrolled={isScrolled}
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
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        {currentUser && (
                            <div className="relative notifications-container">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`relative transition-colors duration-300 ${iconButtonClass}`}
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <FiBell size={20} />
                                    {unreadNotifications > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 ${
                                                isScrolled 
                                                    ? 'bg-red-500 text-white border-white' 
                                                    : 'bg-red-500 text-white border-black'
                                            }`}
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
                                            className={`absolute right-0 mt-2 w-80 z-50 ${dropdownClass}`}
                                        >
                                            <div className={`p-4 font-semibold border-b flex justify-between items-center ${
                                                isScrolled 
                                                    ? 'text-gray-800 border-gray-200' 
                                                    : 'text-white border-yellow-400/20'
                                            }`}>
                                                <span>Notifications</span>
                                                {unreadNotifications > 0 && (
                                                    <button
                                                        onClick={handleMarkAllAsRead}
                                                        className={`text-sm transition-colors duration-300 ${
                                                            isScrolled ? 'text-gold hover:text-yellow-600' : 'text-yellow-300 hover:text-yellow-200'
                                                        }`}
                                                    >
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification, index) => (
                                                        <NotificationItem
                                                            key={notification.id || notification._id || `notification-${index}`}
                                                            notification={notification}
                                                            isScrolled={isScrolled}
                                                            onMarkAsRead={handleMarkAsRead}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className={`p-6 text-center ${
                                                        isScrolled ? 'text-gray-500' : 'text-white/60'
                                                    }`}>
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
                            <FiShoppingCart size={20} className="transition-colors duration-300" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`absolute -top-2 -right-2 text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold border-2 ${
                                        isScrolled 
                                            ? 'bg-gradient-to-r from-gold to-yellow-600 text-white border-white' 
                                            : 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white border-black'
                                    }`}
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
                                    className={`flex items-center gap-3 transition-colors duration-300 ${iconButtonClass}`}
                                >
                                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r from-gold to-yellow-600 flex items-center justify-center overflow-hidden border-2 ${
                                        isScrolled ? 'border-gold/30' : 'border-yellow-400/30'
                                    }`}>
                                        {currentUser.photoURL ? (
                                            <img
                                                src={currentUser.photoURL}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-white text-lg" />
                                        )}
                                    </div>
                                    <FiChevronDown className={`transition-transform duration-300 ${
                                        showUserDropdown ? 'rotate-180' : ''
                                    } ${textClass()}`} />
                                </motion.button>

                                {/* User Dropdown */}
                                <AnimatePresence>
                                    {showUserDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className={`absolute right-0 mt-2 w-64 z-50 ${dropdownClass}`}
                                        >
                                            <div className={`p-4 border-b ${
                                                isScrolled ? 'border-gray-200' : 'border-yellow-400/20'
                                            }`}>
                                                <div className={`font-semibold text-lg ${
                                                    textClass()
                                                }`}>
                                                    {currentUser.displayName || currentUser.email.split('@')[0]}
                                                </div>
                                                <div className={`text-sm mt-1 ${
                                                    isScrolled ? 'text-gray-500' : 'text-white/60'
                                                }`}>{currentUser.email}</div>
                                            </div>
                                            
                                            <div className="p-2 space-y-1">
                                                {currentUser.isAdmin && (
                                                    <NavLink
                                                        to="/admin"
                                                        onClick={() => setShowUserDropdown(false)}
                                                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                                                            isScrolled 
                                                                ? 'text-gray-700 hover:bg-gold/10 hover:text-gold' 
                                                                : 'text-white hover:bg-yellow-500/20'
                                                        }`}
                                                    >
                                                        <FiPackage className="text-lg" />
                                                        Dashboard
                                                    </NavLink>
                                                )}
                                                <NavLink
                                                    to="/orders"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                                                        isScrolled 
                                                            ? 'text-gray-700 hover:bg-gold/10 hover:text-gold' 
                                                            : 'text-white hover:bg-yellow-500/20'
                                                    }`}
                                                >
                                                    <FiShoppingBag className="text-lg" />
                                                    My Orders
                                                </NavLink>
                                                <NavLink
                                                    to="/products"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                                                        isScrolled 
                                                            ? 'text-gray-700 hover:bg-gold/10 hover:text-gold' 
                                                            : 'text-white hover:bg-yellow-500/20'
                                                    }`}
                                                >
                                                    <FiHeart className="text-lg" />
                                                    Products
                                                </NavLink>
                                            </div>
                                            
                                            <div className={`p-2 border-t ${
                                                isScrolled ? 'border-gray-200' : 'border-yellow-400/20'
                                            }`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleLogout}
                                                    disabled={logoutLoading}
                                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                                                        logoutLoading ? 'opacity-50 cursor-wait' : ''
                                                    } ${
                                                        isScrolled 
                                                            ? 'text-red-600 hover:bg-red-500/10' 
                                                            : 'text-red-200 hover:bg-red-500/20'
                                                    }`}
                                                >
                                                    <FiLogOut className="text-lg" />
                                                    {logoutLoading ? 'Signing out...' : 'Sign out'}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-3">
                                <MotionLink
                                    to="/about"
                                    whileHover={{ scale: 1.05 }}
                                    className={`font-medium transition-colors duration-300 ${textClass(true)}`}
                                >
                                    About
                                </MotionLink>
                                <MotionLink
                                    to="/login"
                                    whileHover={{ scale: 1.05 }}
                                    className={`font-medium transition-colors duration-300 ${textClass(true)}`}
                                >
                                    Login
                                </MotionLink>
                                <MotionLink
                                    to="/register"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white py-2 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
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
                            className="mt-3 lg:hidden"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search dresses, and more..."
                                    className={`mobile-search-input w-full pl-4 pr-12 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm border ${
                                        isScrolled 
                                            ? 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-gold focus:border-transparent' 
                                            : 'bg-white/10 border-yellow-400/20 text-white placeholder-white/60 focus:ring-yellow-400 focus:border-transparent'
                                    }`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    ref={searchRef}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSearch}
                                    className={`mobile-search-input absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                        isScrolled ? 'text-gray-500 hover:text-gold' : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    <FiSearch size={20} />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        className={`mobile-menu-container lg:hidden border-t fixed inset-0 z-40 pt-20 ${
                            isScrolled 
                                ? 'bg-white/95 backdrop-blur-md border-gray-200' 
                                : 'bg-black/95 backdrop-blur-md border-yellow-400/20'
                        }`}
                    >
                        {/* Close Button */}
                        <div className="absolute top-4 right-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`p-3 rounded-2xl transition-all duration-300 backdrop-blur-sm border ${
                                    isScrolled 
                                        ? 'bg-white/80 border-gold/30 text-gray-700 hover:bg-gold/10 hover:text-gold' 
                                        : 'bg-white/10 border-yellow-400/20 text-white hover:text-yellow-200'
                                }`}
                            >
                                <FiX size={24} />
                            </motion.button>
                        </div>

                        {/* User Profile Section */}
                        {currentUser && (
                            <div className={`px-6 py-4 border-b mb-4 ${
                                isScrolled ? 'border-gray-200' : 'border-yellow-400/20'
                            }`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-gold to-yellow-600 flex items-center justify-center overflow-hidden border-2 border-yellow-400/30">
                                        {currentUser.photoURL ? (
                                            <img
                                                src={currentUser.photoURL}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-white text-2xl" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-semibold text-lg truncate ${
                                            textClass()
                                        }`}>
                                            {currentUser.displayName || currentUser.email.split('@')[0]}
                                        </div>
                                        <div className={`text-sm truncate ${
                                            isScrolled ? 'text-gray-500' : 'text-white/60'
                                        }`}>
                                            {currentUser.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <nav className="container mx-auto px-6 py-4 flex flex-col space-y-2">
                            <NavLink
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                        isActive 
                                            ? isScrolled 
                                                ? 'bg-gold/20 text-gold' 
                                                : 'bg-yellow-500/20 text-white'
                                            : isScrolled 
                                                ? 'text-gray-700 hover:bg-gold/10 hover:text-gold' 
                                                : 'text-white/80 hover:bg-yellow-500/10 hover:text-white'
                                    }`
                                }
                            >
                                <FiHome className="text-xl" />
                                Home
                            </NavLink>
                            
                            <NavLink
                                to="/products"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                        isActive 
                                            ? isScrolled 
                                                ? 'bg-gold/20 text-gold' 
                                                : 'bg-yellow-500/20 text-white'
                                            : isScrolled 
                                                ? 'text-gray-700 hover:bg-gold/10 hover:text-gold' 
                                                : 'text-white/80 hover:bg-yellow-500/10 hover:text-white'
                                    }`
                                }
                            >
                                <FiShoppingBag className="text-xl" />
                                Products
                            </NavLink>

                            {currentUser && (
                                <>
                                    <NavLink
                                        to="/orders"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                                isActive 
                                                    ? isScrolled 
                                                        ? 'bg-gold/20 text-gold' 
                                                        : 'bg-yellow-500/20 text-white'
                                                    : isScrolled 
                                                        ? 'text-gray-700 hover:bg-gold/10 hover:text-gold' 
                                                        : 'text-white/80 hover:bg-yellow-500/10 hover:text-white'
                                            }`
                                        }
                                    >
                                        <FiPackage className="text-xl" />
                                        Orders
                                    </NavLink>
                                    
                                    {currentUser.isAdmin && (
                                        <NavLink
                                            to="/admin"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                                    isActive 
                                                        ? isScrolled 
                                                            ? 'bg-gold/20 text-gold' 
                                                            : 'bg-yellow-500/20 text-white'
                                                        : isScrolled 
                                                            ? 'text-gray-700 hover:bg-gold/10 hover:text-gold' 
                                                            : 'text-white/80 hover:bg-yellow-500/10 hover:text-white'
                                                }`
                                            }
                                        >
                                            <FiUser className="text-xl" />
                                            Dashboard
                                        </NavLink>
                                    )}
                                </>
                            )}

                            {currentUser ? (
                                <div className={`pt-6 border-t mt-4 ${
                                    isScrolled ? 'border-gray-200' : 'border-yellow-400/20'
                                }`}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLogout}
                                        disabled={logoutLoading}
                                        className={`w-full flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                            logoutLoading 
                                                ? 'opacity-50 cursor-wait' 
                                                : isScrolled 
                                                    ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20' 
                                                    : 'bg-red-500/20 text-red-200 hover:bg-red-500/30'
                                        }`}
                                    >
                                        <FiLogOut className="text-xl" />
                                        {logoutLoading ? 'Signing out...' : 'Sign out'}
                                    </motion.button>
                                </div>
                            ) : (
                                <div className={`pt-6 border-t mt-4 space-y-2 ${
                                    isScrolled ? 'border-gray-200' : 'border-yellow-400/20'
                                }`}>
                                    <MotionLink
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                            isScrolled 
                                                ? 'text-gray-700 hover:bg-gold/10 hover:text-gold' 
                                                : 'text-white/80 hover:bg-yellow-500/10 hover:text-white'
                                        }`}
                                    >
                                        <FiUser className="text-xl" />
                                        Login
                                    </MotionLink>
                                    <MotionLink
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium bg-gradient-to-r from-gold to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
                                    >
                                        <FiUser className="text-xl" />
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
