import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    FiMenu, 
    FiX, 
    FiHome, 
    FiShoppingBag, 
    FiUsers, 
    FiSettings, 
    FiDollarSign, 
    FiLogOut,
    FiPackage,
    FiTrendingUp,
    FiUser,
    FiShield,
    FiScissors,
    FiGrid
} from 'react-icons/fi';

const AdminLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { signOut, currentUser } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <FiHome className="text-xl" /> },
        { name: 'Products', path: '/admin/products', icon: <FiShoppingBag className="text-xl" /> },
        { name: 'Orders', path: '/admin/orders', icon: <FiDollarSign className="text-xl" /> },
        { name: 'Custom Orders', path: '/admin/custom-orders', icon: <FiScissors className="text-xl" /> },
        // { name: 'Users', path: '/admin/users', icon: <FiUsers className="text-xl" /> },
        // { name: 'Settings', path: '/admin/settings', icon: <FiSettings className="text-xl" /> },
    ];

    // Close mobile menu when location changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const isActivePath = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col bg-black/80 backdrop-blur-sm border-r border-gold/20 shadow-2xl transition-all duration-300 ${
                sidebarCollapsed ? 'w-20' : 'w-64'
            }`}>
                {/* Header */}
                <div className="p-6 border-b border-gold/20">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div>
                                <h2 className="text-2xl font-bold text-gold font-serif">
                                    Belle Fashion
                                </h2>
                                <p className="text-xs text-gold/70 mt-1 font-serif">Admin Dashboard</p>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 rounded-lg hover:bg-gold/10 transition-colors duration-200 border border-gold/20"
                        >
                            <FiMenu className="text-gold text-lg" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-3">
                        {navItems.map((item) => {
                            const isActive = isActivePath(item.path);
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center p-3 rounded-xl transition-all duration-200 group border ${
                                            isActive
                                                ? 'bg-gradient-to-r from-gold/20 to-yellow-600/20 text-gold border-gold/30 shadow-lg'
                                                : 'text-gold/70 hover:bg-gold/10 hover:text-gold border-transparent hover:border-gold/20'
                                        } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                    >
                                        <span className={`transition-transform duration-200 ${
                                            isActive ? 'scale-110' : 'group-hover:scale-110'
                                        }`}>
                                            {item.icon}
                                        </span>
                                        {!sidebarCollapsed && (
                                            <span className="ml-3 font-medium text-sm font-serif">{item.name}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gold/20">
                    {!sidebarCollapsed && currentUser && (
                        <div className="mb-4 p-3 bg-gold/5 rounded-xl border border-gold/10">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-600 rounded-full flex items-center justify-center">
                                    <FiUser className="text-black text-sm" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white truncate font-serif">
                                        {currentUser.email}
                                    </p>
                                    <p className="text-xs text-gold/70 font-serif">Administrator</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleSignOut}
                        className={`flex items-center w-full p-3 rounded-xl text-gold/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 border border-transparent hover:border-red-500/20 ${
                            sidebarCollapsed ? 'justify-center' : ''
                        }`}
                    >
                        <FiLogOut className="text-lg" />
                        {!sidebarCollapsed && (
                            <span className="ml-3 font-medium text-sm text-gold/70 font-serif">Logout</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-gold/20 shadow-2xl z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg bg-gold/10 hover:bg-gold/20 transition-colors duration-200 border border-gold/20"
                    >
                        {mobileMenuOpen ? <FiX size={20} className="text-gold" /> : <FiMenu size={20} className="text-gold" />}
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-gold font-serif">
                            Belle Fashion
                        </h1>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-gold to-yellow-600 rounded-full flex items-center justify-center border border-gold/30">
                        <FiShield className="text-black" />
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
                mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
                <div
                    className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
                <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-black/90 backdrop-blur-sm border-r border-gold/20 shadow-2xl transform transition-transform duration-300 ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    {/* Mobile Sidebar Header */}
                    <div className="p-6 border-b border-gold/20 bg-gradient-to-r from-gold/20 to-yellow-600/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gold font-serif">Belle Fashion</h2>
                                <p className="text-gold/70 text-sm mt-1 font-serif">Admin Dashboard</p>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-gold/20 transition-colors duration-200 border border-gold/30"
                            >
                                <FiX size={20} className="text-gold" />
                            </button>
                        </div>
                        {currentUser && (
                            <div className="mt-4 p-3 bg-gold/10 rounded-xl border border-gold/20">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center border border-gold/30">
                                        <FiUser className="text-gold" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white truncate font-serif">
                                            {currentUser.email}
                                        </p>
                                        <p className="text-xs text-gold/70 font-serif">Administrator</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6">
                        <ul className="space-y-2 px-4">
                            {navItems.map((item) => {
                                const isActive = isActivePath(item.path);
                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center p-4 rounded-xl transition-all duration-200 border ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-gold/20 to-yellow-600/20 text-gold border-gold/30 shadow-lg'
                                                    : 'text-gold/70 hover:bg-gold/10 hover:text-gold border-transparent hover:border-gold/20'
                                            }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <span className={`transition-transform duration-200 ${
                                                isActive ? 'scale-110' : ''
                                            }`}>
                                                {item.icon}
                                            </span>
                                            <span className="ml-4 font-medium font-serif">{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Mobile Logout */}
                    <div className="p-4 border-t border-gold/20">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center w-full p-4 rounded-xl text-gold/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 border border-transparent hover:border-red-500/20"
                        >
                            <FiLogOut className="text-lg" />
                            <span className="ml-4 font-medium font-serif">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${
                sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
            } ${mobileMenuOpen ? 'lg:ml-0' : ''}`}>
                <div className="pt-16 lg:pt-0">
                    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
