import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../../services/productServic';
import TestimonialSlider from '../../pages/home/HomePageComponent/TestimonialSlider';
import { 
    FiPhone, 
    FiMail, 
    FiGlobe, 
    FiGrid, 
    FiHeart, 
    FiUser, 
    FiFeather, 
    FiScissors,
    FiShoppingBag,
    FiArrowRight,
    FiEye,
    FiAlertTriangle,
    FiStar,
    FiPackage,
    FiCheck,
    FiCreditCard,
    FiTruck,
    FiSmile
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import CustomCakeForm from '../../components/orders/CustomCakeForm';

// Animated Contact Banner for Mobile
const AnimatedContactBanner = () => {
    return (
        <div className="lg:hidden overflow-hidden py-3 mb-6 bg-black/40 backdrop-blur-sm rounded-xl border border-gold/20">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: [0, -300],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 25,
                        ease: "linear",
                    },
                }}
            >
                {/* Multiple copies for seamless looping */}
                {[...Array(3)].map((_, setIndex) => (
                    <div key={setIndex} className="flex items-center space-x-6 px-4">
                        <div className="flex items-center space-x-2">
                            <FiPhone className="text-gold text-sm" />
                            <span className="text-white text-sm font-medium">+234 901 087 3215</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FiMail className="text-gold text-sm" />
                            <span className="text-white text-sm font-medium">bellebyokien@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FiGlobe className="text-gold text-sm" />
                            <span className="text-white text-sm font-medium">www.bellebyokien.com</span>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

// Loading Slideshow Component for Mobile
const LoadingSlideshow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            icon: FiCheck,
            title: "Browse Collections",
            description: "Explore our latest fashion collections and find your perfect style"
        },
        {
            icon: FiShoppingBag,
            title: "Add to Cart",
            description: "Select your favorite items and add them to your shopping cart"
        },
        {
            icon: FiCreditCard,
            title: "Secure Checkout",
            description: "Complete your purchase with our safe and secure payment system"
        },
        {
            icon: FiTruck,
            title: "Fast Delivery",
            description: "Receive your order with our express delivery service"
        },
        {
            icon: FiSmile,
            title: "Enjoy Your Style",
            description: "Look fabulous in your new fashion pieces from Belle"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 300000);

        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="lg:hidden bg-black/40 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 mb-8">
            <h3 className="text-gold text-lg font-semibold mb-4 text-center font-serif">
                How to Shop at Belle
            </h3>
            <div className="relative h-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-full flex items-center justify-center mb-3">
                            {React.createElement(slides[currentSlide].icon, { className: "text-black text-xl" })}
                        </div>
                        <h4 className="text-white font-semibold mb-2 font-serif">
                            {slides[currentSlide].title}
                        </h4>
                        <p className="text-gold/70 text-sm font-serif">
                            {slides[currentSlide].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-gold scale-125' : 'bg-gold/30'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

// Product Grid Card Component
const ProductGridCard = ({ product, index }) => {
    const discountedPrice = product.discountPercentage > 0 
        ? product.price - (product.price * (product.discountPercentage / 100))
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            className="bg-black/40 backdrop-blur-sm rounded-xl border border-gold/20 hover:border-gold/40 transition-all duration-300 overflow-hidden group cursor-pointer"
        >
            <Link to={`/products/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative pt-[100%] bg-gray-800 overflow-hidden">
                    {/* Discount Badge */}
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 z-10">
                            <span className="bg-gradient-to-r from-gold to-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-full">
                                {product.discountPercentage}% OFF
                            </span>
                        </div>
                    )}
                    
                    {/* Product Image */}
                    <img 
                        src={product.images?.[0] || '/api/placeholder/300/300'} 
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-3">
                    {/* Product Name */}
                    <h3 className="text-white text-sm font-medium mb-2 line-clamp-2 group-hover:text-gold transition-colors font-serif">
                        {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {discountedPrice ? (
                                <>
                                    <span className="text-gold font-bold text-sm">
                                        ₦{discountedPrice.toLocaleString()}
                                    </span>
                                    <span className="text-white/50 text-xs line-through">
                                        ₦{product.price.toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-gold font-bold text-sm">
                                    ₦{product.price.toLocaleString()}
                                </span>
                            )}
                        </div>
                        
                        {/* View Details */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FiEye className="text-gold w-4 h-4" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

// Simple Image Slideshow Component
const SimpleImageSlideShow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            id: 1,
            image: "/images/hero1.png",
            alt: "Luxury Fashion Collection"
        },
        {
            id: 2, 
            image: "/images/hero2.png",
            alt: "Elegant Evening Wear"
        },
        {
            id: 3,
            image: "/images/hero3.png",
            alt: "Designer Collection"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000000);

        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentSlide}
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].alt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                        e.target.src = `https://picsum.photos/1200/800?random=${currentSlide + 1}`;
                    }}
                />
            </AnimatePresence>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-gold' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

// MovingImagesGrid Component
const MovingImagesGrid = () => {
    const images = [
        '/images/fashion1.png',
        '/images/fashion2.png',
        '/images/fashion3.png',
        '/images/fashion4.png',
        '/images/fashion5.png',
        '/images/fashion6.png',
        '/images/fashion7.png',
        '/images/fashion8.png',
    ];

    return (
        <div className="w-full overflow-hidden">
            {/* Desktop: 8 images */}
            <div className="hidden lg:block">
                <motion.div
                    className="flex"
                    animate={{
                        x: [0, -1600],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 40,
                            ease: "linear",
                        },
                    }}
                >
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex">
                            {images.map((image, index) => (
                                <div
                                    key={`${setIndex}-${index}`}
                                    className="w-48 h-32 flex-shrink-0 mx-0.5 rounded-lg overflow-hidden border border-gold/20"
                                >
                                    <img
                                        src={image}
                                        alt={`Fashion ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Tablet: 6 images */}
            <div className="hidden md:block lg:hidden">
                <motion.div
                    className="flex"
                    animate={{
                        x: [0, -1200],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 35,
                            ease: "linear",
                        },
                    }}
                >
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex">
                            {images.slice(0, 6).map((image, index) => (
                                <div
                                    key={`${setIndex}-${index}`}
                                    className="w-40 h-28 flex-shrink-0 mx-0.5 rounded-lg overflow-hidden border border-gold/20"
                                >
                                    <img
                                        src={image}
                                        alt={`Fashion ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Mobile: 4 images */}
            <div className="md:hidden">
                <motion.div
                    className="flex"
                    animate={{
                        x: [0, -800],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex">
                            {images.slice(0, 4).map((image, index) => (
                                <div
                                    key={`${setIndex}-${index}`}
                                    className="w-32 h-24 flex-shrink-0 mx-0.5 rounded-lg overflow-hidden border border-gold/20"
                                >
                                    <img
                                        src={image}
                                        alt={`Fashion ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

// Mock products data for fallback
const mockProducts = [
    {
        id: 1,
        name: "Elegant Evening Gown",
        price: 29999,
        originalPrice: 39999,
        discountPercentage: 25,
        category: "Evening Wear",
        subcategory: "Gowns",
        images: ["/images/hero1.png"],
        sizes: ["S", "M", "L"],
        colors: ["Black", "Navy"],
        isFeatured: true,
        isNewArrival: true,
        reviews: [{ rating: 4.5 }, { rating: 5 }],
        status: "active"
    },
    {
        id: 2,
        name: "Designer Cocktail Dress",
        price: 18999,
        category: "Casual Wear", 
        subcategory: "Dresses",
        images: ["/images/hero2.png"],
        sizes: ["XS", "S", "M"],
        colors: ["Red", "Blue"],
        isFeatured: true,
        reviews: [{ rating: 4.5 }, { rating: 5 }],
        status: "active"
    }
];

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCustomOrderForm, setShowCustomOrderForm] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.isAdmin;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts();
                
                if (response && response.data && Array.isArray(response.data)) {
                    setProducts(response.data.slice(0, 24));
                } else {
                    setProducts(mockProducts);
                }
            } catch (err) {
                setProducts(mockProducts);
                setError('Using demo data - API connection issue');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCustomOrderSubmit = async (orderData) => {
        if (!currentUser) {
            alert("Your session has expired. Please log in again.");
            navigate('/login');
            return;
        }

        try {
            navigate('/checkout', {
                state: {
                    customOrderData: orderData,
                    isCustomOrder: true
                }
            });
            setShowCustomOrderForm(false);
        } catch (error) {
            alert("There was an error preparing your order. Please try again.");
        }
    };

    const handleCustomOrderClick = (e) => {
        e.preventDefault();
        if (!currentUser) {
            navigate('/login', { state: { from: '/', message: 'Please login to place a custom order' } });
        } else {
            setShowCustomOrderForm(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900">
            {/* Admin Button */}
            {isAdmin && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed top-6 right-6 z-50"
                >
                    <Link
                        to="/admin"
                        className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-3 px-6 rounded-2xl font-medium transition-all duration-300 shadow-2xl shadow-gold/30 flex items-center gap-3 backdrop-blur-sm border border-gold/30"
                    >
                        Admin Panel
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            )}

            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-[90vh] flex items-center px-4">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-600/20 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto max-w-7xl relative z-10 pt-2 lg:pt-0">
                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                        {/* Animated Contact Banner - ADDED THIS */}
                        <AnimatedContactBanner />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-gold/20 mb-6"
                        >
                            <SimpleImageSlideShow />
                        </motion.div>

                        <div className="mt-4 mb-6 overflow-hidden">
                            <MovingImagesGrid />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-center"
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
                            >
                                Crafting Fashion{' '}
                                <span className="bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
                                    You Can Feel,
                                </span>{' '}
                                Wear & Love
                            </motion.h1>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="flex flex-col sm:flex-row gap-3 justify-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/products"
                                        className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-2xl text-center backdrop-blur-sm border border-gold/30 block"
                                    >
                                        Shop Ready-to-Wear
                                    </Link>
                                </motion.div>
                                
                                <motion.button
                                    onClick={handleCustomOrderClick}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-black/20 hover:bg-gold/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-2xl text-center backdrop-blur-sm border border-gold/30"
                                >
                                    Create Custom Design
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch">
                        {/* Categories Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:col-span-3 flex flex-col"
                        >
                            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-gold/30 shadow-2xl flex-1">
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                                    <FiGrid className="mr-2 text-gold" />
                                    Categories
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Evening Gowns', icon: FiHeart, count: 24 },
                                        { name: 'Wedding Dresses', icon: FiHeart, count: 18 },
                                        { name: 'Casual Wear', icon: FiUser, count: 32 },
                                        { name: 'Traditional', icon: FiFeather, count: 15 },
                                        { name: 'Accessories', icon: FiShoppingBag, count: 45 },
                                        { name: 'Custom Designs', icon: FiScissors, count: 'New' }
                                    ].map((category, index) => (
                                        <motion.div
                                            key={category.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-gold/10 transition-all duration-300 cursor-pointer group"
                                        >
                                            <div className="flex items-center">
                                                {React.createElement(category.icon, { 
                                                    className: "text-gold mr-3 group-hover:text-yellow-300 transition-colors", 
                                                    size: 18 
                                                })}
                                                <span className="text-white font-medium group-hover:text-gold transition-colors">
                                                    {category.name}
                                                </span>
                                            </div>
                                            <span className="bg-gold/20 text-white text-xs px-2 py-1 rounded-full">
                                                {category.count}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Banner Column */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="lg:col-span-6 flex flex-col"
                        >
                            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-gold/20 flex-1">
                                <SimpleImageSlideShow />
                            </div>
                            <div className="mt-4">
                                <MovingImagesGrid />
                            </div>
                        </motion.div>

                        {/* Contact Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="lg:col-span-3 flex flex-col"
                        >
                            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-gold/30 shadow-2xl flex-1">
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                                    <FiPhone className="mr-2 text-gold" />
                                    Contact Us
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center p-3 rounded-xl hover:bg-gold/10 transition-all duration-300 group">
                                        <FiPhone className="text-gold mr-3 group-hover:text-yellow-300 transition-colors" />
                                        <div>
                                            <p className="text-white font-medium">Phone</p>
                                            <a href="tel:+1234567890" className="text-gold text-sm hover:text-yellow-300 transition-colors">
                                                +234 901 087 3215
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 rounded-xl hover:bg-gold/10 transition-all duration-300 group">
                                        <FiMail className="text-gold mr-3 group-hover:text-yellow-300 transition-colors" />
                                        <div>
                                            <p className="text-white font-medium">Email</p>
                                            <a href="mailto:info@bellebyokien.com" className="text-gold text-sm hover:text-yellow-300 transition-colors">
                                                bellebyokien@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Product Grid Section */}
            <section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-black">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-serif">
                            Featured Collections
                        </h2>
                        <p className="text-gold/70 text-lg font-serif">
                            Discover our latest fashion pieces
                        </p>
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <div className="space-y-8">
                            <LoadingSlideshow />
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
                                {[...Array(24)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-black/20 rounded-xl border border-gold/20 animate-pulse"
                                    >
                                        <div className="pt-[100%] bg-gray-800 rounded-t-xl"></div>
                                        <div className="p-2">
                                            <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && products.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2"
                        >
                            {products.map((product, index) => (
                                <ProductGridCard 
                                    key={product.id} 
                                    product={product} 
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* View More Button */}
                    {!loading && products.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mt-12"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/products"
                                    className="group inline-flex items-center justify-center bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-xl transition-all duration-500 shadow-2xl hover:shadow-3xl border-2 border-transparent hover:border-gold font-serif"
                                >
                                    View All Products
                                    <FiArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
                <div className="container mx-auto max-w-7xl px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-white mb-6 font-serif">What Our Customers Say</h2>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto font-serif">Real results from real people</p>
                    </motion.div>
                    <TestimonialSlider />
                </div>
            </section>

            {/* WhatsApp Button */}
            <motion.div
                className="fixed bottom-8 right-8 z-50"
            >
                <motion.a
                    href="https://wa.me/+2349010873215"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                >
                    <FaWhatsapp size={28} />
                </motion.a>
            </motion.div>

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
