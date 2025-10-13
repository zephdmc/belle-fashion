import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../components/products/ProductCard';
import { getProducts } from '../../services/productServic';
import TestimonialSlider from '../../pages/home/HomePageComponent/TestimonialSlider';
import AboutSection from '../../pages/home/HomePageComponent/AboutSection';
import { FiAward, FiLoader, FiAlertTriangle, FiEye, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { 
    FiPhone, 
    FiMail, 
    FiGlobe, 
    FiGrid, 
    FiHeart, 
    
    FiUser, 
    FiFeather, 
    
    FiScissors 
} from 'react-icons/fi';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getBlogPosts } from '../../services/contentful';
import SkincareQuizForm from './HomePageComponent/SkincareQuizForm';
import { BiBookReader } from "react-icons/bi";
import { GiTrophyCup } from "react-icons/gi";
import { FaGraduationCap } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { GiTwoFeathers } from "react-icons/gi";
import CustomCakeForm from '../../components/orders/CustomCakeForm';
import { createCustomOrder } from '../../services/customOrderService';
// Enhanced ImageSlideShow Component
const ImageSlideShow = ({ isMobile = false }) => {
  const images = [
    "/images/hero1.png",
    "/images/hero2.png",
    "/images/hero3.png",
    "/images/hero4.png"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden">
      {images.map((src, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ 
            opacity: 0, 
            scale: 1.1,
            rotate: index % 2 === 0 ? -2 : 2,
            y: -20,
            zIndex: images.length - index
          }}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.1,
            rotate: index === currentIndex ? 0 : (index % 2 === 0 ? -5 : 5),
            y: index === currentIndex ? 0 : -30,
            zIndex: index === currentIndex ? images.length : images.length - index
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            opacity: { duration: 0.5 }
          }}
          style={{
            transformOrigin: "center center",
          }}
        >
          <img 
            src={src} 
            alt={`Beauty product ${index + 1}`}
            className={`w-full h-full object-cover ${isMobile ? '' : 'rounded-3xl'}`}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
        </motion.div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// New Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ 
      y: -8,
      transition: { duration: 0.3 }
    }}
    className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
  >
    <div className="relative z-10">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-white text-xl" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed">{description}</p>
    </div>
    {/* Background glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </motion.div>
);

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCustomOrderForm, setShowCustomOrderForm] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showQuizForm, setShowQuizForm] = useState(false);
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.isAdmin;
import { FiArrowRight, FiHeart, FiShoppingBag, FiChevronLeft, FiChevronRight, FiAlertTriangle, FiStar, FiPackage } from 'react-icons/fi';
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data?.slice(0, 8) || []);
            } catch (err) {
                setError(err.message || 'Failed to load featured products');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);




     const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products and organize by category
    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Try to fetch products
                const response = await fetch('/api/products?limit=50');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || 'Failed to load products');
                }

                // Check if we have products data
                if (!result.data || !Array.isArray(result.data)) {
                    setCategories([]);
                    return;
                }

                // Organize products by category
                const productsByCategory = {};
                
                result.data.forEach(product => {
                    if (product.status !== 'inactive') {
                        const category = product.category || 'Uncategorized';
                        if (!productsByCategory[category]) {
                            productsByCategory[category] = {
                                id: category.toLowerCase().replace(/\s+/g, '-'),
                                name: category,
                                slug: category.toLowerCase().replace(/\s+/g, '-'),
                                description: `Explore our ${category} collection`,
                                products: []
                            };
                        }
                        productsByCategory[category].products.push(product);
                    }
                });

                // Convert to array and take top categories with most products
                const categoryArray = Object.values(productsByCategory)
                    .filter(cat => cat.products.length > 0)
                    .sort((a, b) => b.products.length - a.products.length)
                    .slice(0, 6); // Show top 6 categories

                setCategories(categoryArray);
                
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
                setCategories([]); // Ensure categories is always an array
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByCategory();
    }, []);

    // Calculate discounted price
    const calculateDiscountedPrice = (price, discountPercentage) => {
        return price - (price * (discountPercentage / 100));
    };

    // Get product rating
    const getProductRating = (product) => {
        if (!product.reviews || !Array.isArray(product.reviews) || product.reviews.length === 0) return 0;
        const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / product.reviews.length;
    };

    // Safe array access helper
    const safeArray = (arr) => {
        return Array.isArray(arr) ? arr : [];
    };


    
    useEffect(() => {
      const fetchBlogs = async () => {
        try {
          const posts = await getBlogPosts();
          setBlogs(posts.slice(0, 3));
        } catch (err) {
          console.error("Failed to fetch blog posts:", err);
        }
      };
      fetchBlogs();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const handleCustomOrderSubmit = async (orderData) => {
        if (!currentUser) {
            console.error("User is not authenticated. Cannot create order.");
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
            console.error("Error preparing custom order: ", error);
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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700">
            {/* Admin Button */}
            {isAdmin && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed top-6 right-6 z-50"
                >
                    <Link
                        to="https://belle-fashion.vercel.app/admin"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-2xl font-medium transition-all duration-300 shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-white/20"
                    >
                        Admin Panel
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            )}

        {/* Enhanced Hero Section with 3-Column Layout */}
<section className="relative overflow-hidden min-h-[90vh] flex items-center px-4">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
    </div>

    {/* Mobile Contact Bar */}
    <div className="lg:hidden absolute top-4 left-0 right-0 z-20">
        <div className="container mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="flex justify-between items-center text-white text-xs">
                    <div className="flex items-center space-x-3">
                        <a href="tel:+1234567890" className="flex items-center hover:text-blue-200 transition-colors">
                            <FiPhone className="mr-1" size={12} />
                            <span>+123 456 7890</span>
                        </a>
                        <a href="mailto:info@bellebyokien.com" className="flex items-center hover:text-blue-200 transition-colors">
                            <FiMail className="mr-1" size={12} />
                            <span>info@bellebyokien.com</span>
                        </a>
                    </div>
                    <a href="https://bellebyokien.com" className="hover:text-blue-200 transition-colors">
                        <FiGlobe className="mr-1" size={12} />
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div className="container mx-auto max-w-7xl relative z-10 pt-16 lg:pt-0">
        {/* Mobile Banner */}
        <div className="lg:hidden mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-[300px] rounded-2xl overflow-hidden shadow-2xl"
            >
                <ImageSlideShow />
            </motion.div>
        </div>

        {/* Desktop 3-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Column 1: Categories List */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-3"
            >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                        <FiGrid className="mr-2 text-blue-300" />
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
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-center">
                                    <category.icon className="text-blue-300 mr-3 group-hover:text-blue-200 transition-colors" size={18} />
                                    <span className="text-white font-medium group-hover:text-blue-200 transition-colors">
                                        {category.name}
                                    </span>
                                </div>
                                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                                    {category.count}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Column 2: Main Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-6"
            >
                <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                    <ImageSlideShow />
                    
                    {/* Floating elements on banner */}
                    <motion.div
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ 
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-2xl"
                    >
                        <FiHeart className="text-yellow-300 text-2xl" />
                    </motion.div>
                    
                    <motion.div
                        animate={{ 
                            y: [0, 20, 0],
                            rotate: [0, -5, 0]
                        }}
                        transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-2xl"
                    >
                        <FiHeart className="text-pink-300 text-2xl" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Column 3: Contact Card & Brand Card */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="lg:col-span-3 space-y-6"
            >
                {/* Contact Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                        <FiPhone className="mr-2 text-blue-300" />
                        Contact Us
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group">
                            <FiPhone className="text-blue-300 mr-3 group-hover:text-blue-200 transition-colors" />
                            <div>
                                <p className="text-white font-medium">Phone</p>
                                <a href="tel:+1234567890" className="text-blue-200 text-sm hover:text-blue-100 transition-colors">
                                    +123 456 7890
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group">
                            <FiMail className="text-blue-300 mr-3 group-hover:text-blue-200 transition-colors" />
                            <div>
                                <p className="text-white font-medium">Email</p>
                                <a href="mailto:info@bellebyokien.com" className="text-blue-200 text-sm hover:text-blue-100 transition-colors">
                                    info@bellebyokien.com
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group">
                            <FiGlobe className="text-blue-300 mr-3 group-hover:text-blue-200 transition-colors" />
                            <div>
                                <p className="text-white font-medium">Website</p>
                                <a href="https://bellebyokien.com" className="text-blue-200 text-sm hover:text-blue-100 transition-colors">
                                    bellebyokien.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brand Banner Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl relative overflow-hidden"
                >
                    {/* Animated background elements */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    
                    <motion.div
                        animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">
                            belle
                        </h2>
                        <p className="text-blue-200 text-sm font-light">
                            by okien
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>

        {/* Mobile Text Content */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:hidden text-center mt-8"
        >
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
            >
                Crafting Fashion{' '}
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
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
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-2xl text-center backdrop-blur-sm border border-white/20 block"
                    >
                        Shop Ready-to-Wear
                    </Link>
                </motion.div>
                
                <motion.button
                    onClick={handleCustomOrderClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-2xl text-center backdrop-blur-sm border border-white/20"
                >
                    Create Custom Design
                </motion.button>
            </motion.div>
        </motion.div>
    </div>
</section>

            {/* Enhanced Feature Cards Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto max-w-7xl">
                {loading ? (
                    <div className="text-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-flex items-center justify-center w-16 h-16 border-2 border-amber-500 border-t-transparent rounded-full mb-4"
                        />
                        <p className="text-gray-600 font-medium">Loading fashion collections...</p>
                    </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                    >
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                            <FiAlertTriangle className="text-2xl text-red-500 mx-auto mb-4" />
                            <p className="text-gray-700">{error}</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-16">
                        {/* Safe mapping through categories - will show nothing if categories is empty */}
                        {safeArray(categories).map((category, categoryIndex) => (
                            <motion.div
                                key={category.id || categoryIndex}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                                className="category-section"
                            >
                                {/* Category Header */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 px-2 gap-4">
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: 40 }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                            className="h-0.5 bg-gradient-to-r from-amber-500 to-black rounded-full"
                                        />
                                        <div>
                                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                                                {category.name || 'Uncategorized'}
                                            </h2>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {safeArray(category.products).length} {safeArray(category.products).length === 1 ? 'item' : 'items'} available
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Link
                                            to={`/categories/${category.slug || 'all'}?category=${encodeURIComponent(category.name || 'all')}`}
                                            className="group inline-flex items-center gap-2 text-gray-700 hover:text-amber-600 font-semibold text-lg transition-all duration-300 border-b-2 border-transparent hover:border-amber-600 pb-1"
                                        >
                                            View Collection
                                            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Products Scroll Container */}
                                <div className="relative">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
                                    >
                                        {safeArray(category.products).slice(0, 8).map((product, index) => (
                                            <motion.div
                                                key={product?.id || index}
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                whileHover={{ 
                                                    y: -8,
                                                    transition: { type: "spring", stiffness: 400 }
                                                }}
                                                className="flex-shrink-0 w-[280px] snap-start"
                                            >
                                                <Link 
                                                    to={product ? `/products/${product.id}` : '#'}
                                                    className="block group"
                                                >
                                                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl overflow-hidden border border-gray-100 hover:border-amber-500/50 transition-all duration-500 h-full flex flex-col">
                                                        {/* Product Image */}
                                                        <div className="relative pt-[120%] bg-gray-100 overflow-hidden">
                                                            {/* Discount Badge */}
                                                            {product?.discountPercentage > 0 && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    whileInView={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 500 }}
                                                                    className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg"
                                                                >
                                                                    {product.discountPercentage}% OFF
                                                                </motion.div>
                                                            )}
                                                            
                                                            {/* Favorite Button */}
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-10 hover:bg-red-50 transition-colors"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    // Add to wishlist functionality
                                                                }}
                                                            >
                                                                <FiHeart className="w-4 h-4 text-gray-600" />
                                                            </motion.button>
                                                            
                                                            {/* Product Image */}
                                                            <motion.img 
                                                                src={product?.images?.[0] || '/api/placeholder/300/360'} 
                                                                alt={product?.name || 'Product image'}
                                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                                                whileHover={{ scale: 1.05 }}
                                                                transition={{ duration: 0.4 }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        </div>
                                                        
                                                        {/* Product Info */}
                                                        <div className="p-5 flex-grow flex flex-col">
                                                            {/* Product Name & Category */}
                                                            <div className="mb-3">
                                                                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full mb-2">
                                                                    {product?.subcategory || product?.category || 'Fashion'}
                                                                </span>
                                                                <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">
                                                                    {product?.name || 'Product Name'}
                                                                </h3>
                                                            </div>

                                                            {/* Rating */}
                                                            {product?.reviews && safeArray(product.reviews).length > 0 && (
                                                                <div className="flex items-center gap-1 mb-3">
                                                                    <div className="flex items-center gap-1">
                                                                        <FiStar className="w-4 h-4 text-amber-400 fill-current" />
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            {getProductRating(product).toFixed(1)}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-gray-400 text-sm">
                                                                        ({safeArray(product.reviews).length})
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Price Section */}
                                                            <div className="mt-auto space-y-2">
                                                                {product?.discountPercentage > 0 ? (
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-gray-400 text-sm line-through">
                                                                            ₦{product.originalPrice?.toLocaleString() || product?.price?.toLocaleString()}
                                                                        </span>
                                                                        <span className="text-gray-900 font-bold text-xl">
                                                                            ₦{calculateDiscountedPrice(product.price, product.discountPercentage).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-900 font-bold text-xl">
                                                                        ₦{product?.price?.toLocaleString() || '0'}
                                                                    </span>
                                                                )}
                                                                
                                                                {/* Size Variants */}
                                                                <div className="flex gap-1">
                                                                    {safeArray(product?.sizes || ['S', 'M', 'L', 'XL']).slice(0, 4).map((size) => (
                                                                        <span 
                                                                            key={size}
                                                                            className="w-6 h-6 flex items-center justify-center text-xs border border-gray-200 rounded hover:border-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                                                                        >
                                                                            {size}
                                                                        </span>
                                                                    ))}
                                                                    {safeArray(product?.sizes).length > 4 && (
                                                                        <span className="w-6 h-6 flex items-center justify-center text-xs border border-gray-200 rounded text-gray-400">
                                                                            +{safeArray(product?.sizes).length - 4}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Add to Cart Button */}
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="mt-4 w-full bg-gray-900 hover:bg-amber-500 text-white font-semibold py-3.5 px-4 rounded-xl hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    // Add to cart functionality
                                                                }}
                                                            >
                                                                <FiShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                                Add to Cart
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Scroll Hint */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex justify-center mt-6"
                                    >
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <FiChevronLeft className="w-4 h-4" />
                                            <span className="animate-pulse">Scroll to discover more</span>
                                            <FiChevronRight className="w-4 h-4" />
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Show "Data Not Available" when no categories exist */}
                {!loading && !error && (!categories || categories.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="bg-gray-50 rounded-2xl p-12 max-w-2xl mx-auto">
                            <FiPackage className="text-4xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Data Not Available</h3>
                            <p className="text-gray-600 mb-6">No fashion collections are currently available. Please check back later.</p>
                            <Link
                                to="/products"
                                className="inline-block bg-gray-900 text-white font-semibold py-3 px-8 rounded-xl hover:bg-amber-500 transition-colors"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* View All Collections Button - Only show if we have categories */}
                {!loading && !error && categories && categories.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center mt-20"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/products"
                                className="group inline-flex items-center justify-center bg-gray-900 hover:bg-amber-500 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-3xl border-2 border-transparent hover:border-gray-900 text-lg"
                            >
                                Explore All Collections
                                <FiArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>

            <AboutSection />

            {/* Enhanced Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="container mx-auto max-w-7xl px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-purple-900 mb-6">What Our Customers Say</h2>
                        <p className="text-xl text-purple-700 max-w-2xl mx-auto">Real results from real people</p>
                    </motion.div>

                    <TestimonialSlider />
                </div>
            </section>

            {/* Enhanced WhatsApp Button */}
            <motion.div
                drag
                dragConstraints={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 z-50 cursor-grab active:cursor-grabbing"
            >
                <motion.a
                    href="https://wa.me/+2349014727839"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20"
                    whileHover={{ 
                        boxShadow: "0 20px 40px rgba(72, 187, 120, 0.4)"
                    }}
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

            {showQuizForm && (
                <SkincareQuizForm onClose={() => setShowQuizForm(false)} />
            )}
        </div>
    );
}
