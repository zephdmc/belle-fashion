import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiSearch, FiChevronDown, FiMail, FiMessageCircle, FiPackage, FiTruck, FiRefreshCw, FiStar, FiCalendar } from 'react-icons/fi';

const FAQPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [openItems, setOpenItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const faqData = {
        shipping: {
            icon: <FiTruck className="text-gold" />,
            title: "Shipping & Delivery",
            questions: [
                {
                    question: "How long does delivery take?",
                    answer: "Delivery typically takes 1-2 business days within Port Harcourt and 2-7 business days for other states. We partner with premium logistics providers to ensure your fashion pieces arrive in perfect condition.",
                    tags: ["delivery", "shipping", "time"]
                },
                {
                    question: "Do you ship nationwide?",
                    answer: "Yes, we deliver contemporary fashion to all 36 states in Nigeria. Shipping rates vary by location and are calculated at checkout.",
                    tags: ["shipping", "nationwide", "locations"]
                }
            ]
        },
        products: {
            icon: <FiPackage className="text-gold" />,
            title: "Products & Sizing",
            questions: [
                {
                    question: "Do you offer custom sizing or alterations?",
                    answer: "Yes! We offer basic alterations and custom sizing on select pieces. Contact us before ordering to discuss your specific requirements and timeline.",
                    tags: ["sizing", "alterations", "custom"]
                },
                {
                    question: "How do I care for my Bellebyokien pieces?",
                    answer: "Each garment comes with specific care instructions. We recommend gentle washing, air drying, and proper storage to maintain the quality and longevity of your contemporary pieces.",
                    tags: ["care", "maintenance", "washing"]
                }
            ]
        },
        policies: {
            icon: <FiRefreshCw className="text-gold" />,
            title: "Returns & Policies",
            questions: [
                {
                    question: "What is your return policy?",
                    answer: "We accept returns for damaged or defective items within 48 hours of delivery. Due to the nature of clothing, all items must be unworn with original tags attached.",
                    tags: ["returns", "policy", "refunds"]
                }
            ]
        },
        collections: {
            icon: <FiCalendar className="text-gold" />,
            title: "Collections & Updates",
            questions: [
                {
                    question: "Do you release new collections regularly?",
                    answer: "Yes! We launch seasonal collections and occasional limited editions. Follow us on social media and subscribe to our newsletter for exclusive previews and early access.",
                    tags: ["collections", "new", "updates"]
                }
            ]
        }
    };

    const allQuestions = Object.values(faqData).flatMap(category => 
        category.questions.map(q => ({ ...q, category: category.title }))
    );

    const categories = [
        { id: 'all', name: 'All Questions', count: allQuestions.length },
        { id: 'shipping', name: 'Shipping', count: faqData.shipping.questions.length },
        { id: 'products', name: 'Products', count: faqData.products.questions.length },
        { id: 'policies', name: 'Policies', count: faqData.policies.questions.length },
        { id: 'collections', name: 'Collections', count: faqData.collections.questions.length }
    ];

    const filteredQuestions = allQuestions.filter(item => {
        const matchesCategory = activeCategory === 'all' || 
            faqData[activeCategory]?.questions.includes(item);
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const toggleItem = (index) => {
        setOpenItems(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50/30 pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-3 bg-gold/10 text-gold px-6 py-3 rounded-2xl mb-6"
                    >
                        <FiMessageCircle className="text-lg" />
                        <span className="font-semibold">Style Questions Answered</span>
                    </motion.div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Everything you need to know about
                        <span className="block text-gold mt-2">Bellebyokien Ready-to-Wear</span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Find answers to common questions about our contemporary fashion pieces, 
                        shipping policies, and care instructions.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <div className="relative">
                        <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Search questions... (e.g., delivery, returns, sizing)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 text-lg rounded-2xl border-2 border-gray-200 focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all duration-300 bg-white shadow-lg"
                        />
                    </div>
                </motion.div>

                <div className="max-w-6xl mx-auto">
                    {/* Category Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-3 justify-center mb-12"
                    >
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                                    activeCategory === category.id
                                        ? 'bg-gold text-white shadow-lg shadow-gold/30'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                                }`}
                            >
                                {category.name}
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    activeCategory === category.id
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {category.count}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* FAQ Content */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Questions List */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-6"
                        >
                            <AnimatePresence>
                                {filteredQuestions.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                                    >
                                        <button
                                            onClick={() => toggleItem(index)}
                                            className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
                                                    {item.question}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.tags.map((tag, tagIndex) => (
                                                        <span
                                                            key={tagIndex}
                                                            className="px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex-shrink-0 ml-4"
                                            >
                                                <FiChevronDown className="text-gray-400 text-xl" />
                                            </motion.div>
                                        </button>
                                        
                                        <AnimatePresence>
                                            {openItems.includes(index) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="px-6 pb-5 pt-2 border-t border-gray-100">
                                                        <p className="text-gray-600 leading-relaxed">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {filteredQuestions.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <FiSearch className="text-gray-300 text-4xl mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-500 mb-2">
                                        No questions found
                                    </h3>
                                    <p className="text-gray-400">
                                        Try adjusting your search or filter criteria
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Sidebar - Contact & Additional Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-8"
                        >
                            {/* Contact Card */}
                            <div className="bg-gradient-to-br from-gold to-yellow-600 rounded-2xl p-8 text-white shadow-xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <FiMail className="text-2xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Still have questions?</h3>
                                        <p className="text-white/80">We're here to help</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-semibold mb-2">Email us at:</p>
                                        <a 
                                            href="mailto:support@bellebyokien.com"
                                            className="text-white hover:text-white/90 underline transition-colors"
                                        >
                                            support@bellebyokien.com
                                        </a>
                                    </div>
                                    
                                    <div>
                                        <p className="font-semibold mb-2">Call us:</p>
                                        <a 
                                            href="tel:+2348000000000"
                                            className="text-white hover:text-white/90 underline transition-colors"
                                        >
                                            +234 800 000 0000
                                        </a>
                                    </div>
                                    
                                    <p className="text-white/80 text-sm mt-4">
                                        Our customer service team is available Monday to Friday, 9AM - 6PM
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Bellebyokien</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gold/10 rounded-2xl">
                                            <FiStar className="text-gold text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Premium Quality</h4>
                                            <p className="text-gray-600 text-sm">Carefully crafted contemporary pieces</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gold/10 rounded-2xl">
                                            <FiTruck className="text-gold text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Nationwide Delivery</h4>
                                            <p className="text-gray-600 text-sm">Across all 36 states in Nigeria</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gold/10 rounded-2xl">
                                            <FiRefreshCw className="text-gold text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                                            <p className="text-gray-600 text-sm">48-hour return policy for defects</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="bg-gray-900 rounded-2xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                                <p className="text-gray-300 mb-6">
                                    Get notified about new collections, exclusive offers, and fashion tips.
                                </p>
                                
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
                                    />
                                    <button className="w-full bg-gold hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300">
                                        Subscribe to Newsletter
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
