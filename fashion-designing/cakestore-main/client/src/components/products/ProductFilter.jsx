import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSearch, 
    FiFilter, 
    FiX, 
    FiDollarSign, 
    FiTag, 
    FiHeart,
    FiScissors,
    FiStar,
    FiRefreshCw,
    FiDroplet,
    FiCalendar,
    FiTrendingUp
} from 'react-icons/fi';

// Define fashion-specific filter options
const OCCASIONS = [
    'Casual',
    'Formal',
    'Wedding',
    'Party',
    'Corporate',
    'Traditional',
    'Beach',
    'Vacation'
];

const STYLE_TAGS = [
    'Vintage',
    'Modern',
    'Bohemian',
    'Classic',
    'Minimalist',
    'Romantic',
    'Edgy',
    'Elegant'
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Gray', 'Multi-color'];

export default function ProductFilter({ categories, onFilter }) {
    const [filters, setFilters] = useState({
        category: '',
        subcategory: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        occasion: '',
        style: '',
        size: '',
        color: '',
        productType: '',
        isFeatured: '',
        isNewArrival: '',
        isBestseller: '',
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeFilters, setActiveFilters] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = {
            ...filters,
            [name]: value,
        };
        setFilters(newFilters);
        
        // Count active filters
        const activeCount = Object.values(newFilters).filter(val => val !== '').length;
        setActiveFilters(activeCount);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            category: '',
            subcategory: '',
            minPrice: '',
            maxPrice: '',
            search: '',
            occasion: '',
            style: '',
            size: '',
            color: '',
            productType: '',
            isFeatured: '',
            isNewArrival: '',
            isBestseller: '',
        };
        setFilters(resetFilters);
        setActiveFilters(0);
        onFilter({});
        setIsExpanded(false);
    };

    const handleQuickApply = () => {
        onFilter(filters);
        setIsExpanded(false);
    };

    const FilterSection = ({ title, icon: Icon, children, className = '' }) => (
        <div className={`bg-white rounded-lg p-4 border border-yellow-500 ${className}`}>
            <div className="flex items-center mb-3">
                <Icon className="text-black mr-2 text-lg" />
                <label className="text-black font-semibold text-sm">{title}</label>
            </div>
            {children}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden border border-yellow-500"
        >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FiFilter className="text-black text-xl sm:text-2xl mr-3" />
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-black">Filter Fashion Items</h3>
                            <p className="text-gray-600 text-sm">
                                {activeFilters > 0 
                                    ? `${activeFilters} active filter${activeFilters > 1 ? 's' : ''}`
                                    : 'Refine your fashion search'
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {activeFilters > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-yellow-500 text-black text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center"
                            >
                                {activeFilters}
                            </motion.span>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-black hover:text-gray-600 transition-colors duration-200"
                        >
                            {isExpanded ? <FiX size={20} className="sm:w-6 sm:h-6" /> : <FiFilter size={20} className="sm:w-6 sm:h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="p-4 sm:p-6 space-y-4 sm:space-y-6"
                    >
                        {/* Search & Main Filters */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                            {/* Search */}
                            <FilterSection title="Search Fashion" icon={FiSearch}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="search"
                                        value={filters.search}
                                        onChange={handleChange}
                                        placeholder="Search dresses, suits, accessories..."
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                    />
                                    <FiSearch className="absolute right-3 top-3 text-gray-400" />
                                </div>
                            </FilterSection>

                            {/* Category */}
                            <FilterSection title="Category" icon={FiTag}>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-500">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category} className="text-black">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </FilterSection>

                            {/* Product Type */}
                            <FilterSection title="Product Type" icon={FiScissors}>
                                <select
                                    name="productType"
                                    value={filters.productType}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-500">All Types</option>
                                    <option value="ready-to-wear" className="text-black">Ready-to-Wear</option>
                                    <option value="customizable" className="text-black">Customizable</option>
                                </select>
                            </FilterSection>
                        </div>

                        {/* Size & Color Filters */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Size */}
                            <FilterSection title="Size" icon={FiDroplet}>
                                <select
                                    name="size"
                                    value={filters.size}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-500">All Sizes</option>
                                    {SIZES.map((size) => (
                                        <option key={size} value={size} className="text-black">
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </FilterSection>

                            {/* Color */}
                            <FilterSection title="Color" icon={FiDroplet}>
                                <select
                                    name="color"
                                    value={filters.color}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-500">All Colors</option>
                                    {COLORS.map((color) => (
                                        <option key={color} value={color} className="text-black">
                                            {color}
                                        </option>
                                    ))}
                                </select>
                            </FilterSection>
                        </div>

                        {/* Style & Occasion Filters */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Style Tags */}
                            <FilterSection title="Style" icon={FiStar}>
                                <select
                                    name="style"
                                    value={filters.style}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-500">All Styles</option>
                                    {STYLE_TAGS.map((tag) => (
                                        <option key={tag} value={tag} className="text-black">
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </FilterSection>

                            {/* Occasion */}
                            <FilterSection title="Occasion" icon={FiCalendar}>
                                <select
                                    name="occasion"
                                    value={filters.occasion}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-500">All Occasions</option>
                                    {OCCASIONS.map((occasion) => (
                                        <option key={occasion} value={occasion} className="text-black">
                                            {occasion}
                                        </option>
                                    ))}
                                </select>
                            </FilterSection>
                        </div>

                        {/* Special Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            {/* Featured */}
                            <FilterSection title="Featured Items" icon={FiStar}>
                                <select
                                    name="isFeatured"
                                    value={filters.isFeatured}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-500">All Items</option>
                                    <option value="true" className="text-black">Featured Only</option>
                                </select>
                            </FilterSection>

                            {/* New Arrivals */}
                            <FilterSection title="New Arrivals" icon={FiTrendingUp}>
                                <select
                                    name="isNewArrival"
                                    value={filters.isNewArrival}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-500">All Items</option>
                                    <option value="true" className="text-black">New Arrivals Only</option>
                                </select>
                            </FilterSection>

                            {/* Bestsellers */}
                            <FilterSection title="Bestsellers" icon={FiHeart}>
                                <select
                                    name="isBestseller"
                                    value={filters.isBestseller}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-500">All Items</option>
                                    <option value="true" className="text-black">Bestsellers Only</option>
                                </select>
                            </FilterSection>
                        </div>

                        {/* Price Range */}
                        <FilterSection title="Price Range" icon={FiDollarSign} className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="text-black text-sm font-medium mb-2 block">Minimum Price (₦)</label>
                                    <input
                                        type="number"
                                        name="minPrice"
                                        value={filters.minPrice}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-black text-sm font-medium mb-2 block">Maximum Price (₦)</label>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        value={filters.maxPrice}
                                        onChange={handleChange}
                                        placeholder="50000"
                                        min="0"
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </FilterSection>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200"
                        >
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex items-center justify-center bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold border border-gray-300"
                            >
                                <FiRefreshCw className="mr-2" />
                                Clear All Filters
                            </button>
                            <button
                                type="submit"
                                onClick={handleQuickApply}
                                className="flex items-center justify-center bg-yellow-500 text-black py-3 px-8 rounded-lg hover:bg-yellow-600 hover:shadow-lg transition-all duration-200 font-semibold"
                            >
                                Apply Filters
                            </button>
                        </motion.div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Quick Filter Bar (when collapsed) */}
            {!isExpanded && activeFilters > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-600 text-sm">
                                {activeFilters} filter{activeFilters > 1 ? 's' : ''} active
                            </span>
                            {/* Show active filter badges */}
                            <div className="flex flex-wrap gap-1">
                                {filters.category && (
                                    <span className="bg-yellow-500/20 text-black text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                                        {filters.category}
                                    </span>
                                )}
                                {filters.size && (
                                    <span className="bg-yellow-500/20 text-black text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                                        Size: {filters.size}
                                    </span>
                                )}
                                {filters.color && (
                                    <span className="bg-yellow-500/20 text-black text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                                        Color: {filters.color}
                                    </span>
                                )}
                                {filters.occasion && (
                                    <span className="bg-yellow-500/20 text-black text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                                        {filters.occasion}
                                    </span>
                                )}
                                {filters.minPrice && (
                                    <span className="bg-yellow-500/20 text-black text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                                        From ₦{filters.minPrice}
                                    </span>
                                )}
                                {filters.maxPrice && (
                                    <span className="bg-yellow-500/20 text-black text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                                        To ₦{filters.maxPrice}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleReset}
                                className="text-gray-600 hover:text-black text-sm font-medium transition-colors duration-200"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="text-black hover:text-gray-600 text-sm font-medium transition-colors duration-200"
                            >
                                Edit Filters
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
