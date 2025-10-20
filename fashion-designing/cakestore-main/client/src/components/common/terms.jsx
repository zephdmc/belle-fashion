import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiShoppingBag, FiDollarSign, FiTruck, FiRefreshCw, FiGlobe, FiShield, FiAlertTriangle, FiEdit } from 'react-icons/fi';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      duration: 0.8
    }
  }
};

// Section Component
const PolicySection = ({ icon: Icon, title, children, delay = 0 }) => (
  <motion.section
    variants={itemVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
  >
    <div className="flex items-start gap-4 mb-4">
      <motion.div
        variants={iconVariants}
        className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold to-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
      >
        <Icon className="text-white text-lg" />
      </motion.div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-gold transition-colors duration-300 font-serif">
        {title}
      </h2>
    </div>
    <div className="text-gray-600 leading-relaxed space-y-3">
      {children}
    </div>
  </motion.section>
);

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold/10">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-800"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1)_0%,transparent_50%)]"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gold/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gold/30">
              <FiGlobe className="text-gold text-2xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              Terms of Service
            </h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <p className="text-gold text-lg">Bellebyokien Ready-to-Wear</p>
              <div className="bg-gold/10 border border-gold/20 rounded-lg px-4 py-2">
                <p className="text-gold text-sm font-medium">
                  Effective: January 22, 2025
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
          </svg>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 -mt-8 relative z-10"
      >
        {/* Introduction */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to <span className="font-semibold text-gold font-serif">Bellebyokien Ready-to-Wear</span>! 
            These Terms of Service govern your experience with our contemporary fashion collections, 
            website, and services. By engaging with our brand, you agree to these terms.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Section 1 */}
          <PolicySection icon={FiUser} title="1. Customer Eligibility">
            <p>
              To purchase from Bellebyokien, you must be at least 18 years old or have consent from a legal guardian. 
              We specialize in contemporary women's wear designed for modern, sophisticated individuals.
            </p>
          </PolicySection>

          {/* Section 2 */}
          <PolicySection icon={FiShoppingBag} title="2. Fashion Collections & Products">
            <p>
              We offer curated ready-to-wear collections, including dresses, separates, and accessories. 
              All pieces are subject to availability, and we reserve the right to limit quantities or 
              discontinue styles to maintain exclusivity.
            </p>
            <div className="mt-4 p-4 bg-gold/5 rounded-lg border border-gold/20">
              <p className="text-gray-700 text-sm">
                🎀 <strong>Style Note:</strong> Our collections are released seasonally. Follow us for launch announcements!
              </p>
            </div>
          </PolicySection>

          {/* Section 3 */}
          <PolicySection icon={FiDollarSign} title="3. Pricing & Payment">
            <p>
              All prices are listed in Nigerian Naira (₦) and reflect the quality and craftsmanship of our 
              contemporary fashion pieces. Prices may be updated to reflect new collections and materials.
            </p>
            <p>
              We accept bank transfers, card payments, and other secure methods displayed at checkout. 
              Full payment is required before order processing begins.
            </p>
          </PolicySection>

          {/* Section 4 */}
          <PolicySection icon={FiTruck} title="4. Delivery & Fashion Shipping">
            <p>
              Your style deserves careful handling. Please review our comprehensive 
              <a href="/shipping" className="text-gold hover:underline font-medium mx-1">Shipping Policy</a> 
              for detailed information on delivery timelines, fees, and package tracking for your fashion items.
            </p>
          </PolicySection>

          {/* Section 5 */}
          <PolicySection icon={FiRefreshCw} title="5. Returns & Exchanges">
            <p>
              Due to the intimate nature of clothing and to maintain hygiene standards, we only accept returns 
              for defective, damaged, or incorrect items. For complete details, please see our 
              <a href="/returns" className="text-gold hover:underline font-medium mx-1">Return Policy</a>.
            </p>
            <ul className="space-y-2 mt-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                All items are quality-checked before shipping
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                Size exchanges subject to availability
              </li>
            </ul>
          </PolicySection>

          {/* Section 6 */}
          <PolicySection icon={FiGlobe} title="6. Website & Intellectual Property">
            <p>
              Our website content, including designs, photography, and brand aesthetics, is the intellectual 
              property of Bellebyokien. You agree not to misuse, copy, or distribute our content without 
              express written permission.
            </p>
          </PolicySection>

          {/* Section 7 */}
          <PolicySection icon={FiShield} title="7. Privacy & Style Preferences">
            <p>
              We respect your privacy and style choices. Your personal information and preferences are 
              handled with care as outlined in our 
              <a href="/privacy" className="text-gold hover:underline font-medium mx-1">Privacy Policy</a>.
            </p>
          </PolicySection>

          {/* Section 8 */}
          <PolicySection icon={FiAlertTriangle} title="8. Limitation of Liability">
            <p>
              Bellebyokien Ready-to-Wear is not liable for indirect or incidental damages arising from 
              your use of our services or products. We stand behind the quality of our craftsmanship 
              and provide clear care instructions with each garment.
            </p>
          </PolicySection>

          {/* Section 9 */}
          <PolicySection icon={FiEdit} title="9. Terms Updates">
            <p>
              We may update these Terms to reflect changes in our services, collections, or legal requirements. 
              Continued engagement with Bellebyokien constitutes acceptance of any revised terms.
            </p>
          </PolicySection>
        </div>

        {/* Closing Section */}
        <motion.section
          variants={itemVariants}
          className="text-center mt-16 py-12 bg-gradient-to-r from-gray-900 to-black rounded-3xl text-white border border-gold/20"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
            Thank You for Choosing Bellebyokien
          </h3>
          <p className="text-gold text-lg max-w-2xl mx-auto leading-relaxed">
            We're committed to providing you with exceptional contemporary fashion and a seamless 
            shopping experience that matches the elegance of our designs.
          </p>
        </motion.section>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-1/4 left-5 w-3 h-3 bg-gold rounded-full opacity-30"
      />
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="fixed top-1/3 right-10 w-2 h-2 bg-gold rounded-full opacity-40"
      />
    </div>
  );
}
