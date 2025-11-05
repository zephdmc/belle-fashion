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
    FiSmile,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

// Fashion Loading Animation Component
const FashionLoadingAnimation = () => {
    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
            <motion.div
                className="relative w-64 h-64 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Needle */}
                <motion.div
                    className="absolute w-2 h-32 bg-gray-800 rounded-full z-20"
                    initial={{ rotate: 0 }}
                    animate={{ 
                        rotate: [0, 15, 0, -15, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* Needle Eye */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gold rounded-full border-2 border-gray-800" />
                </motion.div>

                {/* Thread */}
                <motion.div
                    className="absolute w-1 h-24 bg-gradient-to-b from-gold to-yellow-300 rounded-full z-10"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ 
                        y: [ -100, 120, -100 ],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.5, 1]
                    }}
                />

                {/* Fabric */}
                <motion.div
                    className="absolute bottom-0 w-48 h-24 bg-gradient-to-r from-gold to-black-500 rounded-lg opacity-80"
                    initial={{ scaleY: 0.5 }}
                    animate={{ 
                        scaleY: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Stitching Lines */}
                <motion.div
                    className="absolute bottom-12 w-48 h-1 bg-white opacity-70"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>

            {/* Loading Text */}
            <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <motion.h3
                    className="text-2xl font-serif text-gray-800 mb-2"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Crafting Your Style
                </motion.h3>
                <p className="text-gray-600 font-serif">Preparing the latest fashion collections...</p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
                className="mt-6 w-64 h-2 bg-gray-200 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    className="h-full bg-gradient-to-r from-gold to-yellow-600"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                />
            </motion.div>
        </div>
    );
};

// Enhanced Mobile Hero Slider
const MobileHeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            id: 1,
            image: "/images/hero1.jpeg",
            alt: "Luxury Fashion Collection",
            title: "Elegant Evening Wear",
            subtitle: "Discover our premium collection"
        },
        {
            id: 2, 
            image: "/images/hero2.jpeg",
            alt: "Designer Dresses",
            title: "Designer Collection",
            subtitle: "Exclusive designs for every occasion"
        },
        {
            id: 3,
            image: "/images/hero3.jpeg",
            alt: "Casual Fashion",
            title: "Casual Elegance",
            subtitle: "Comfort meets style"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-[60vh] rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].alt}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.target.src = `https://picsum.photos/800/600?random=${currentSlide + 1}`;
                        }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Text Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold font-serif mb-2"
                        >
                            {slides[currentSlide].title}
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-white/90 font-serif"
                        >
                            {slides[currentSlide].subtitle}
                        </motion.p>
                    </div>
                </motion.div>
            </AnimatePresence>
            
            {/* Navigation Arrows - Always visible on mobile */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-300 shadow-lg"
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-300 shadow-lg"
            >
                <FiChevronRight className="w-5 h-5" />
            </button>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                                ? 'bg-gold scale-125' 
                                : 'bg-white/70 hover:bg-white'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

// Enhanced Mobile Contact Banner
const AnimatedContactBanner = () => {
    return (
        <motion.div 
            className="lg:hidden overflow-hidden py-3 mb-6 bg-gradient-to-r from-gold/20 to-yellow-100/80 backdrop-blur-lg rounded-2xl border border-gold/40 shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: [0, -400],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 20,
                        ease: "linear",
                    },
                }}
            >
                {[...Array(4)].map((_, setIndex) => (
                    <div key={setIndex} className="flex items-center space-x-8 px-4">
                        <div className="flex items-center space-x-3">
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FiPhone className="text-gold text-base" />
                            </motion.div>
                            <span className="text-gray-800 text-sm font-semibold">+234 901 087 3215</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FiMail className="text-gold text-base" />
                            </motion.div>
                            <span className="text-gray-800 text-sm font-semibold">bellebyokien@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FiGlobe className="text-gold text-base" />
                            </motion.div>
                            <span className="text-gray-800 text-sm font-semibold">www.bellebyokien.com</span>
                        </div>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
};

// Enhanced Loading Slideshow for Mobile
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
            description: "Look fabulous in your new fashion pieces from Bellebyokien"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <motion.div 
            className="lg:hidden bg-gradient-to-br from-gold/10 to-yellow-50/80 backdrop-blur-lg rounded-3xl border border-gold/30 p-6 mb-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h3 
                className="text-gold text-xl font-bold mb-6 text-center font-serif"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                How to Shop at Bellebyokien
            </motion.h3>
            <div className="relative h-40">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center"
                    >
                        <motion.div 
                            className="w-16 h-16 bg-gradient-to-r from-gold to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {React.createElement(slides[currentSlide].icon, { className: "text-white text-2xl" })}
                        </motion.div>
                        <h4 className="text-gray-800 font-bold text-lg mb-2 font-serif">
                            {slides[currentSlide].title}
                        </h4>
                        <p className="text-gray-600 text-sm font-serif leading-relaxed">
                            {slides[currentSlide].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="flex justify-center space-x-3 mt-6">
                {slides.map((_, index) => (
                    <motion.button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.8 }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-gold scale-125' : 'bg-gold/40'
                        }`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

// Product Grid Card Component - Enhanced for Mobile
const ProductGridCard = ({ product, index }) => {
    const discountedPrice = product.discountPercentage > 0 
        ? product.price - (product.price * (product.discountPercentage / 100))
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl border border-gray-200 hover:border-gold/50 transition-all duration-300 overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl"
        >
            <Link to={`/products/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                    {/* Discount Badge */}
                    {product.discountPercentage > 0 && (
                        <motion.div 
                            className="absolute top-3 left-3 z-10"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <span className="bg-gradient-to-r from-gold to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                {product.discountPercentage}% OFF
                            </span>
                        </motion.div>
                    )}
                    
                    {/* Product Image */}
                    <motion.img 
                        src={product.images?.[0] || '/api/placeholder/300/300'} 
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        whileHover={{ scale: 1.1 }}
                    />
                    
                    {/* Overlay on hover */}
                    <motion.div 
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                    />
                    
                    {/* Quick View Button */}
                    <motion.div 
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ scale: 1.2 }}
                    >
                        <div className="bg-white/90 hover:bg-white text-gold rounded-full p-2 shadow-lg">
                            <FiEye className="w-4 h-4" />
                        </div>
                    </motion.div>
                </div>

                {/* Product Info - Enhanced for Mobile */}
                <div className="p-4">
                    {/* Product Name */}
                    <h3 className="text-gray-800 text-sm font-bold  line-clamp-2 group-hover:text-gold transition-colors font-serif leading-tight min-h-[40px]">
                        {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {discountedPrice ? (
                                <>
                                    <div className="text-gold font-bold text-base">
                                        ₦{discountedPrice.toLocaleString()}
                                    </div>
                                    <div className="text-gray-500 text-sm line-through">
                                        ₦{product.price.toLocaleString()}
                                    </div>
                                </>
                            ) : (
                                <span className="text-gold font-bold text-base">
                                    ₦{product.price.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                    
              
                </div>
            </Link>
        </motion.div>
    );
};

// Enhanced MovingImagesGrid for Mobile
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
        <motion.div 
            className="w-full overflow-hidden py-6 bg-gradient-to-r from-gold/5 to-transparent rounded-2xl my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h3 
                className="text-center text-gray-800 font-bold text-lg mb-4 font-serif"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Trending Styles
            </motion.h3>
            
            {/* Mobile: 4 images with enhanced animation */}
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
                            duration: 25,
                            ease: "linear",
                        },
                    }}
                >
                    {[...Array(3)].map((_, setIndex) => (
                        <div key={setIndex} className="flex">
                            {images.slice(0, 4).map((image, index) => (
                                <motion.div
                                    key={`${setIndex}-${index}`}
                                    className="w-36 h-24 flex-shrink-0 mx-3 rounded-xl overflow-hidden border-2 border-gold/40 shadow-lg"
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <img
                                        src={image}
                                        alt={`Fashion ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
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
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex">
                            {images.slice(0, 6).map((image, index) => (
                                <motion.div
                                    key={`${setIndex}-${index}`}
                                    className="w-40 h-28 flex-shrink-0 mx-3 rounded-xl overflow-hidden border-2 border-gold/40 shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img
                                        src={image}
                                        alt={`Fashion ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};



// Desktop Hero Slider Component
const DesktopHeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            id: 1,
            image: "/images/hero1.jpeg",
            alt: "Luxury Fashion Collection",
            title: "Elegant Evening Wear",
            subtitle: "Discover our premium collection"
        },
        {
            id: 2, 
            image: "/images/hero2.jpeg",
            alt: "Designer Dresses",
            title: "Designer Collection",
            subtitle: "Exclusive designs for every occasion"
        },
        {
            id: 3,
            image: "/images/hero3.jpeg",
            alt: "Casual Fashion",
            title: "Casual Elegance",
            subtitle: "Comfort meets style"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].alt}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.target.src = `https://picsum.photos/1200/800?random=${currentSlide + 1}`;
                        }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>
            
            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
            >
                <FiArrowRight className="rotate-180 w-5 h-5" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
            >
                <FiArrowRight className="w-5 h-5" />
            </button>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
                            index === currentSlide 
                                ? 'bg-gold scale-125' 
                                : 'bg-white/70 hover:bg-white'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

// Desktop MovingImagesGrid Component
const DesktopMovingImagesGrid = () => {
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
        <div className="w-full overflow-hidden py-4">
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
                            <motion.div
                                key={`${setIndex}-${index}`}
                                className="w-48 h-32 flex-shrink-0 mx-2 rounded-lg overflow-hidden border border-gold/30 shadow-lg"
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img
                                    src={image}
                                    alt={`Fashion ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ))}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

// Mock products data for fallback
const mockProducts = [
    {
        id: 1,
        name: "Elegant Evening Gown with Sequins",
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
        name: "Designer Cocktail Dress Red",
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
    const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.isAdmin;

    useEffect(() => {
        // Check if this is the first load using localStorage
        const hasSeenLoading = localStorage.getItem('hasSeenLoadingAnimation');
        
        if (!hasSeenLoading) {
            setShowLoadingAnimation(true);
            // Mark that user has seen the loading animation
            localStorage.setItem('hasSeenLoadingAnimation', 'true');
        } else {
            setPageLoaded(true);
        }

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
                
                // Only set minimum display time if showing loading animation
                if (showLoadingAnimation) {
                    setTimeout(() => {
                        setPageLoaded(true);
                    }, 3000);
                }
            }
        };

        fetchProducts();
    }, [showLoadingAnimation]);

    // Show loading animation only on first load
    if (showLoadingAnimation && !pageLoaded) {
        return <FashionLoadingAnimation />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Admin Button */}
            {isAdmin && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="fixed top-6 right-6 z-50"
                >
                    <Link
                        to="/admin"
                        className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white py-3 px-6 rounded-2xl font-medium transition-all duration-300 shadow-2xl shadow-gold/30 flex items-center gap-3 backdrop-blur-sm border border-gold/30"
                    >
                        Admin Panel
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            )}

            {/* ENHANCED MOBILE HERO SECTION */}
            <section className="relative overflow-hidden lg:hidden min-h-screen flex items-center px-4 bg-white pt-4">
                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Enhanced Animated Contact Banner */}
                    <AnimatedContactBanner />

                    {/* Main Hero Slider */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6"
                    >
                        <MobileHeroSlider />
                    </motion.div>

                    {/* Moving Images Grid */}
                    <MovingImagesGrid />

                    {/* Hero Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center mb-8"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-4xl font-bold text-gray-800 mb-4 leading-tight font-serif"
                        >
                            Crafting Fashion{' '}
                            <span className="bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
                                You Can Feel,
                            </span>{' '}
                            Wear & Love
                        </motion.h1>
                        
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="text-gray-600 text-lg mb-6 font-serif leading-relaxed"
                        >
                            Discover exquisite fashion pieces crafted with passion and precision. 
                            Find your perfect style that makes you feel confident and beautiful.
                        </motion.p>

                        {/* Mobile Quick Stats */}
                        <MobileQuickStats />

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="flex flex-col gap-4"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/products"
                                    className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 shadow-2xl text-center backdrop-blur-sm border border-gold/30 block text-lg"
                                >
                                    Shop Our Collection
                                </Link>
                            </motion.div>
                            
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/about"
                                    className="border-2 border-gold text-gold hover:bg-gold hover:text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 shadow-lg text-center block text-lg"
                                >
                                    Learn More
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Loading Slideshow */}
                    <LoadingSlideshow />
                </div>
            </section>

            {/* DESKTOP LAYOUT */}
            <section className="hidden lg:block relative overflow-hidden min-h-[80vh] flex items-center px-4 bg-white">
                <div className="container mx-auto max-w-7xl relative z-10 pt-2 lg:pt-0">
                    <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
                        {/* Text Content Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col justify-center space-y-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <motion.h1
                                    className="text-6xl font-bold text-gray-800 mb-6 leading-tight font-serif"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                    Crafting Fashion{' '}
                                    <span className="bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent block">
                                        You Can Feel,
                                    </span>{' '}
                                    Wear & Love
                                </motion.h1>
                                
                                <motion.p
                                    className="text-xl text-gray-600 mb-8 font-serif leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                >
                                    Discover exquisite fashion pieces crafted with passion and precision. 
                                    From elegant evening wear to casual chic, find your perfect style 
                                    that makes you feel confident and beautiful.
                                </motion.p>
                            </motion.div>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/products"
                                        className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white py-4 px-12 rounded-xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-3xl text-center backdrop-blur-sm border border-gold/30 inline-flex items-center gap-3"
                                    >
                                        Shop Now
                                        <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/about"
                                        className="border-2 border-gold text-gold hover:bg-gold hover:text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 shadow-lg text-center"
                                    >
                                        Learn More
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Stats */}
                      
                        </motion.div>

                        {/* Image Slider Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative h-full min-h-[600px]"
                        >
                            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
                                <DesktopHeroSlider />
                            </div>
                            
                            {/* Floating Elements */}
                            <motion.div
                                className="absolute -top-4 -right-4 w-24 h-24 bg-gold/10 rounded-full blur-xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-200/20 rounded-full blur-xl"
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Product Grid Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 font-serif">
                            Featured Collections
                        </h2>
                        <p className="text-gray-600 text-lg font-serif">
                            Discover our latest fashion pieces
                        </p>
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                                {[...Array(8)].map((_, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl border border-gray-200 animate-pulse shadow-lg"
                                    >
                                        <div className="pt-[100%] bg-gray-200 rounded-t-2xl"></div>
                                        <div className="p-4">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </motion.div>
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
                            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
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
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-center mt-12"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/products"
                                    className="group inline-flex items-center justify-center bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-3xl border-2 border-transparent hover:border-gold font-serif text-lg"
                                >
                                    View All Products
                                    <FiArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* WhatsApp Button */}
            <motion.div
                className="fixed bottom-8 right-8 z-50"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 1 }}
            >
                <motion.a
                    href="https://wa.me/+2349010873215"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black rounded-2xl p-4 shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-yellow/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaWhatsapp size={28} />
                </motion.a>
            </motion.div>
        </div>
    );
}
