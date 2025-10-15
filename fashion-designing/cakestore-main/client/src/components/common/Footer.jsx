import React from 'react';
import { motion } from 'framer-motion';
import {  
    FiFacebook, 
    FiInstagram, 
    FiMail, 
    FiPhone, 
    FiMapPin,
    FiArrowUp,
    FiSend,
    FiHeart
} from 'react-icons/fi';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';

// Social Media Icons with Animation
const SocialIcon = ({ href, icon: Icon, delay = 0 }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        whileHover={{ 
            scale: 1.3, 
            y: -3,
            rotate: 5,
            transition: { duration: 0.2 }
        }}
        transition={{ 
            duration: 0.4, 
            delay,
            type: "spring",
            stiffness: 300
        }}
        className="w-10 h-10 bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/30 rounded-xl flex items-center justify-center text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:bg-yellow-500/20 hover:border-yellow-300/50 shadow-lg hover:shadow-yellow-500/20"
    >
        <Icon size={18} />
    </motion.a>
);

// Footer Link Component
const FooterLink = ({ href, children, delay = 0 }) => (
    <motion.li
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay }}
        viewport={{ once: true }}
    >
        <a 
            href={href} 
            className="text-white/80 hover:text-yellow-300 transition-all duration-300 flex items-center group py-2 hover:translate-x-1"
        >
            <motion.span 
                className="w-1 h-1 bg-yellow-400 rounded-full mr-3 opacity-0 group-hover:opacity-100"
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.2 }}
            />
            <span className="text-sm">{children}</span>
        </a>
    </motion.li>
);

// Contact Info Item
const ContactItem = ({ icon: Icon, children, delay = 0 }) => (
    <motion.li 
        className="flex items-start mb-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        viewport={{ once: true }}
    >
        <motion.div 
            className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
        >
            <Icon className="text-white text-sm" />
        </motion.div>
        <div className="text-white/80 text-sm leading-relaxed">{children}</div>
    </motion.li>
);

// Decorative Element
const FloatingOrnament = ({ position, delay = 0 }) => (
    <motion.div
        animate={{ 
            y: [0, -8, 0],
            opacity: [0.4, 0.8, 0.4],
            rotate: [0, 180, 360]
        }}
        transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay
        }}
        className={`absolute ${position} w-2 h-2 bg-yellow-400/40 rounded-full`}
    />
);

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Data arrays for better organization
    const quickLinks = [
        { href: '/', text: 'Home', delay: 0.1 },
        { href: '/products', text: 'Products', delay: 0.15 },
        { href: '/about', text: 'About Us', delay: 0.2 },
        { href: '/gallery', text: 'Gallery', delay: 0.25 },
        { href: '/reviews', text: 'Reviews', delay: 0.3 }
    ];

    const customerServiceLinks = [
        { href: '/contact', text: 'Contact Us', delay: 0.1 },
        { href: '/shipping', text: 'Shipping Policy', delay: 0.15 },
        { href: '/returns', text: 'Returns & Refunds', delay: 0.2 },
        { href: '/privacy', text: 'Privacy Policy', delay: 0.25 },
        { href: '/terms', text: 'Terms of Service', delay: 0.3 }
    ];

    const socialLinks = [
        { href: '#', icon: FiFacebook, delay: 0 },
        { href: '#', icon: FiInstagram, delay: 0.1 },
        { href: '#', icon: FaTiktok, delay: 0.2 },
        { href: 'https://wa.me/+2349014727839', icon: FaWhatsapp, delay: 0.3 }
    ];

    // Handle newsletter submission
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Add your newsletter logic here
        console.log('Newsletter subscription');
    };

    return (
        <footer className="bg-gradient-to-br from-black via-yellow-900/80 to-yellow-800 relative overflow-hidden border-t border-yellow-400/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(234,179,8,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
            </div>

            {/* Floating Ornaments */}
            <FloatingOrnament position="top-10 left-10" delay={0} />
            <FloatingOrnament position="top-20 right-20" delay={2} />
            <FloatingOrnament position="bottom-20 left-20" delay={4} />
            <FloatingOrnament position="bottom-10 right-10" delay={1} />

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {/* Brand Column */}
                    <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <motion.div 
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div 
                                className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <FiHeart className="text-white text-lg" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Bellebyokien
                                </h3>
                                <p className="text-yellow-400 text-sm font-medium">READY TO WEAR</p>
                            </div>
                        </motion.div>
                        
                        <p className="text-white/60 text-xs leading-relaxed">
                            Crafting exquisite cakes and pastries that turn moments into 
                            unforgettable celebrations. Quality baked with passion.
                        </p>
                        
                        {/* Social Media */}
                        <motion.div 
                            className="flex gap-2 pt-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            {socialLinks.map((social, index) => (
                                <SocialIcon 
                                    key={`social-${index}`}
                                    href={social.href}
                                    icon={social.icon}
                                    delay={social.delay}
                                />
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-sm font-semibold text-yellow-400 mb-4 pb-2 border-b border-yellow-400/20">Quick Links</h4>
                        <ul className="space-y-1">
                            {quickLinks.map((link, index) => (
                                <FooterLink 
                                    key={`quick-${index}`}
                                    href={link.href}
                                    delay={link.delay}
                                >
                                    {link.text}
                                </FooterLink>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Customer Service */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-sm font-semibold text-yellow-400 mb-4 pb-2 border-b border-yellow-400/20">Support</h4>
                        <ul className="space-y-1">
                            {customerServiceLinks.map((link, index) => (
                                <FooterLink 
                                    key={`service-${index}`}
                                    href={link.href}
                                    delay={link.delay}
                                >
                                    {link.text}
                                </FooterLink>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info & Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-sm font-semibold text-yellow-400 mb-4 pb-2 border-b border-yellow-400/20">Get In Touch</h4>
                        <ul className="space-y-1 mb-6">
                            <ContactItem icon={FiMapPin} delay={0.1}>
                                330 PH/Aba Express way<br />
                                Rumukwurushi<br />
                                Port Harcourt
                            </ContactItem>
                            <ContactItem icon={FiMail} delay={0.2}>
                                <a 
                                    href="mailto:stefanosbakeshop6@gmail.com" 
                                    className="hover:text-yellow-300 transition-colors duration-300 hover:underline"
                                >
                                    bellebyokien1@gmail.com
                                </a>
                            </ContactItem>
                            <ContactItem icon={FiPhone} delay={0.3}>
                                <a 
                                    href="tel:+2349014727839" 
                                    className="hover:text-yellow-300 transition-colors duration-300 hover:underline"
                                >
                                    +234 901 4727 839
                                </a>
                            </ContactItem>
                        </ul>

                        {/* Newsletter Subscription */}
                        <div className="mt-4">
                            <h5 className="text-xs font-medium text-yellow-400 mb-2">Join Our Newsletter</h5>
                            <motion.form 
                                className="flex flex-col gap-2"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                viewport={{ once: true }}
                                onSubmit={handleNewsletterSubmit}
                            >
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="px-3 py-2 w-full bg-white/5 backdrop-blur-sm border border-yellow-400/20 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 rounded-lg text-xs transition-all duration-300"
                                    required
                                />
                                <motion.button 
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1 shadow-lg hover:shadow-yellow-500/20"
                                >
                                    <span>Subscribe</span>
                                    <FiSend className="text-xs" />
                                </motion.button>
                            </motion.form>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="bg-black/40 backdrop-blur-sm border-t border-yellow-400/10 py-4 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                        <motion.div 
                            className="text-white/50 text-xs text-center md:text-left flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <span>&copy; {new Date().getFullYear()} Bellebyokien Ready To Wear.</span>
                            <span className="hidden sm:inline">Made with</span>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <FiHeart className="inline text-red-400 mx-1 text-xs" />
                            </motion.div>
                            <span>for sweet moments.</span>
                        </motion.div>
                        
                        {/* Scroll to Top Button */}
                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 border border-yellow-400/30 text-xs"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            aria-label="Scroll to top"
                        >
                            <FiArrowUp className="text-xs" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Animated Accent Line */}
            <motion.div 
                className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
            />
        </footer>
    );
}
