import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiCheck, FiArrowRight, FiDownload } from 'react-icons/fi';

const SizeGuidePage = () => {
    const [activeCategory, setActiveCategory] = useState('dresses');
    const [selectedSize, setSelectedSize] = useState(null);

    const sizeData = {
        dresses: {
            title: "Dresses",
            description: "Perfect fit for our contemporary dress collection",
            measurements: ["Bust", "Waist", "Hips", "Length"],
            sizes: [
                { size: "XS", bust: "32-34", waist: "24-26", hips: "34-36", length: "58", us: "0-2", uk: "4-6", eu: "32-34" },
                { size: "S", bust: "34-36", waist: "26-28", hips: "36-38", length: "59", us: "4-6", uk: "8-10", eu: "36-38" },
                { size: "M", bust: "36-38", waist: "28-30", hips: "38-40", length: "60", us: "8-10", uk: "12-14", eu: "40-42" },
                { size: "L", bust: "38-40", waist: "30-32", hips: "40-42", length: "61", us: "12-14", uk: "16-18", eu: "44-46" },
                { size: "XL", bust: "40-42", waist: "32-34", hips: "42-44", length: "62", us: "16-18", uk: "20-22", eu: "48-50" }
            ]
        },
        tops: {
            title: "Tops & Blouses",
            description: "Sizing for our elegant tops and blouses",
            measurements: ["Bust", "Waist", "Length"],
            sizes: [
                { size: "XS", bust: "32-34", waist: "24-26", length: "52", us: "0-2", uk: "4-6", eu: "32-34" },
                { size: "S", bust: "34-36", waist: "26-28", length: "53", us: "4-6", uk: "8-10", eu: "36-38" },
                { size: "M", bust: "36-38", waist: "28-30", length: "54", us: "8-10", uk: "12-14", eu: "40-42" },
                { size: "L", bust: "38-40", waist: "30-32", length: "55", us: "12-14", uk: "16-18", eu: "44-46" },
                { size: "XL", bust: "40-42", waist: "32-34", length: "56", us: "16-18", uk: "20-22", eu: "48-50" }
            ]
        },
        bottoms: {
            title: "Bottoms & Skirts",
            description: "Find your perfect fit for pants and skirts",
            measurements: ["Waist", "Hips", "Length"],
            sizes: [
                { size: "XS", waist: "24-26", hips: "34-36", length: "96", us: "0-2", uk: "4-6", eu: "32-34" },
                { size: "S", waist: "26-28", hips: "36-38", length: "98", us: "4-6", uk: "8-10", eu: "36-38" },
                { size: "M", waist: "28-30", hips: "38-40", length: "100", us: "8-10", uk: "12-14", eu: "40-42" },
                { size: "L", waist: "30-32", hips: "40-42", length: "102", us: "12-14", uk: "16-18", eu: "44-46" },
                { size: "XL", waist: "32-34", hips: "42-44", length: "104", us: "16-18", uk: "20-22", eu: "48-50" }
            ]
        }
    };

    const categories = [
        { id: 'dresses', name: 'Dresses', icon: '👗' },
        { id: 'tops', name: 'Tops', icon: '👚' },
        { id: 'bottoms', name: 'Bottoms', icon: '👖' }
    ];

    const currentCategory = sizeData[activeCategory];

    const measuringGuide = [
        {
            step: 1,
            title: "Bust Measurement",
            description: "Measure around the fullest part of your bust, keeping the tape horizontal",
            tip: "Wear your best-fitting bra for accurate measurement"
        },
        {
            step: 2,
            title: "Waist Measurement",
            description: "Measure around the narrowest part of your natural waist",
            tip: "Usually about 1-2 inches above your belly button"
        },
        {
            step: 3,
            title: "Hip Measurement",
            description: "Measure around the fullest part of your hips",
            tip: "Keep the tape parallel to the floor and don't pull too tight"
        },
        {
            step: 4,
            title: "Length Measurement",
            description: "For dresses: from shoulder to hem. For tops: from shoulder to bottom.",
            tip: "Consider your height and preferred length"
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-20 pb-12">
            <div className="container mx-auto px-3 sm:px-4">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 px-2"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-xl mb-4 text-sm sm:text-base sm:px-6 sm:py-3"
                    >
                        <span className="font-semibold">Perfect Fit Guarantee</span>
                    </motion.div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                        Find Your Perfect
                        <span className="block text-gold mt-1 sm:mt-2">Size</span>
                    </h1>
                    
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
                        Use our comprehensive size guide to ensure your Bellebyokien pieces 
                        fit perfectly. All measurements in inches.
                    </p>
                </motion.div>

                <div className="max-w-7xl mx-auto">
                    {/* Category Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 px-2"
                    >
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setActiveCategory(category.id);
                                    setSelectedSize(null);
                                }}
                                className={`flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold transition-all duration-300 border-2 text-sm sm:text-base ${
                                    activeCategory === category.id
                                        ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gold/50 hover:bg-gray-50'
                                }`}
                            >
                                <span className="text-xl">{category.icon}</span>
                                <span className="hidden xs:inline">{category.name}</span>
                            </motion.button>
                        ))}
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12">
                        {/* Size Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full"
                        >
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-gold to-yellow-600 p-4 sm:p-6 text-white">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{currentCategory.title}</h2>
                                    <p className="text-white/90 text-sm sm:text-base">{currentCategory.description}</p>
                                </div>
                                
                                <div className="overflow-x-auto -mx-2 sm:mx-0">
                                    <div className="min-w-full">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-3 sm:px-4 py-3 text-left font-semibold text-gray-900 border-b border-gray-200 text-sm">
                                                        Size
                                                    </th>
                                                    {currentCategory.measurements.map((measurement) => (
                                                        <th key={measurement} className="px-2 sm:px-3 py-3 text-center font-semibold text-gray-900 border-b border-gray-200 text-sm">
                                                            {measurement}
                                                        </th>
                                                    ))}
                                                    <th className="px-2 sm:px-3 py-3 text-center font-semibold text-gray-900 border-b border-gray-200 text-sm">
                                                        US
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentCategory.sizes.map((size, index) => (
                                                    <motion.tr
                                                        key={size.size}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.1 * index }}
                                                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                                                            selectedSize === size.size ? 'bg-gold/5' : ''
                                                        }`}
                                                        onClick={() => setSelectedSize(size.size)}
                                                    >
                                                        <td className="px-3 sm:px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                {selectedSize === size.size && (
                                                                    <FiCheck className="text-gold text-base sm:text-lg flex-shrink-0" />
                                                                )}
                                                                <span className={`font-semibold text-sm sm:text-base ${
                                                                    selectedSize === size.size ? 'text-gold' : 'text-gray-900'
                                                                }`}>
                                                                    {size.size}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        {currentCategory.measurements.map((measurement) => (
                                                            <td key={measurement} className="px-2 sm:px-3 py-3 text-center text-gray-600 text-sm">
                                                                {size[measurement.toLowerCase()]}
                                                            </td>
                                                        ))}
                                                        <td className="px-2 sm:px-3 py-3 text-center text-gray-600 text-sm">
                                                            {size.us}
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* International Sizes */}
                            {selectedSize && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 sm:mt-6 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200"
                                >
                                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                                        International Size Conversion for {selectedSize}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">US</div>
                                            <div className="text-gold font-medium">
                                                {currentCategory.sizes.find(s => s.size === selectedSize)?.us}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">UK</div>
                                            <div className="text-gray-600">
                                                {currentCategory.sizes.find(s => s.size === selectedSize)?.uk}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">EU</div>
                                            <div className="text-gray-600">
                                                {currentCategory.sizes.find(s => s.size === selectedSize)?.eu}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Measuring Guide */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4 sm:space-y-6"
                        >
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                                    How to Measure
                                </h2>
                                
                                <div className="space-y-4 sm:space-y-6">
                                    {measuringGuide.map((step, index) => (
                                        <motion.div
                                            key={step.step}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index + 0.5 }}
                                            className="flex gap-3 sm:gap-4"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gold text-white rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm">
                                                    {step.step}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{step.title}</h3>
                                                <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 leading-relaxed">{step.description}</p>
                                                <div className="bg-gold/10 text-gold text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                                                    💡 {step.tip}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white">
                                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Need Help Sizing?</h3>
                                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                                    Our style consultants are here to help you find the perfect fit.
                                </p>
                                
                                <div className="space-y-3 sm:space-y-4">
                                    <button className="w-full bg-gold hover:bg-yellow-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
                                        <FiArrowRight className="text-sm sm:text-lg flex-shrink-0" />
                                        Contact Style Consultant
                                    </button>
                                    
                                    <button className="w-full bg-transparent hover:bg-white/10 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base border border-white/20">
                                        <FiDownload className="text-sm sm:text-lg flex-shrink-0" />
                                        Download Size Chart
                                    </button>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                                <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">💫 Pro Tips</h4>
                                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                                    <li className="flex items-start gap-2 sm:gap-3">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                                        <span>For a relaxed fit, consider going one size up</span>
                                    </li>
                                    <li className="flex items-start gap-2 sm:gap-3">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                                        <span>Check individual product pages for specific fit notes</span>
                                    </li>
                                    <li className="flex items-start gap-2 sm:gap-3">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                                        <span>All measurements include ease for comfortable wear</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeGuidePage;
