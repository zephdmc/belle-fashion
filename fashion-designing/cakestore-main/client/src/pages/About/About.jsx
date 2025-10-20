import { motion } from 'framer-motion';
import { FaRibbon, FaPalette, FaHandsHelping, FaWhatsapp, FaInstagram, FaEnvelope, FaPhone, FaSeedling } from 'react-icons/fa';
import { FiScissors, FiTrendingUp } from 'react-icons/fi';

const AboutPage = () => {
    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const faqs = [
        {
            question: "How long does delivery take?",
            answer: "Delivery typically takes 1-2 business days within Port Harcourt and 2-7 business days for other states. We partner with premium logistics providers to ensure your fashion pieces arrive in perfect condition."
        },
        {
            question: "Do you offer custom sizing or alterations?",
            answer: "Yes! We offer basic alterations and custom sizing on select pieces. Contact us before ordering to discuss your specific requirements and timeline."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns for damaged or defective items within 48 hours of delivery. Due to the nature of clothing, all items must be unworn with original tags attached."
        },
        {
            question: "Do you ship nationwide?",
            answer: "Yes, we deliver contemporary fashion to all 36 states in Nigeria. Shipping rates vary by location and are calculated at checkout."
        },
        {
            question: "How do I care for my Bellebyokien pieces?",
            answer: "Each garment comes with specific care instructions. We recommend gentle washing, air drying, and proper storage to maintain the quality and longevity of your contemporary pieces."
        },
        {
            question: "Do you release new collections regularly?",
            answer: "Yes! We launch seasonal collections and occasional limited editions. Follow us on social media and subscribe to our newsletter for exclusive previews and early access."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="container mx-auto px-4 py-20 md:py-28 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                            Our <span className="text-gold">Style</span> Story
                        </h1>
                        <p className="text-lg md:text-xl text-gray max-w-3xl mx-auto">
                            Where contemporary elegance meets timeless craftsmanship for the modern Nigerian woman
                        </p>
                    </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-gold/20 opacity-30 animate-float"></div>
                    <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-gray-800/20 opacity-30 animate-float animation-delay-2000"></div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-5xl mx-auto"
                    >
                        <motion.h2 variants={item} className="text-3xl font-serif font-bold text-center mb-12 text-gray-800">
                            At Bellebyokien, we believe style is personal expression.
                        </motion.h2>

                        <motion.div variants={container} className="grid md:grid-cols-3 gap-8 mb-16">
                            <motion.div variants={item} className="bg-gradient-to-br from-white to-gold/5 p-8 rounded-xl text-center border border-gold/20">
                                <div className="flex justify-center text-gold mb-4">
                                    <FaPalette className="text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-serif">Contemporary Design</h3>
                                <p className="text-gray-600">
                                    Creating pieces that blend modern aesthetics with timeless elegance for today's sophisticated woman.
                                </p>
                            </motion.div>

                            <motion.div variants={item} className="bg-gradient-to-br from-white to-gold/5 p-8 rounded-xl text-center border border-gold/20">
                                <div className="flex justify-center text-gold mb-4">
                                    <FiScissors className="text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-serif">Quality Craftsmanship</h3>
                                <p className="text-gray-600">
                                    Each garment is meticulously crafted with attention to detail, ensuring perfect fit and lasting quality.
                                </p>
                            </motion.div>

                            <motion.div variants={item} className="bg-gradient-to-br from-white to-gold/5 p-8 rounded-xl text-center border border-gold/20">
                                <div className="flex justify-center text-gold mb-4">
                                    <FaHandsHelping className="text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-serif">Personal Styling</h3>
                                <p className="text-gray-600">
                                    Dedicated to helping you discover and express your unique style through personalized consultations.
                                </p>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={item} className="bg-gradient-to-r from-gray-900 to-black text-white p-8 md:p-12 rounded-xl border border-gold/20">
                            <h3 className="text-2xl font-serif font-bold mb-4 text-center text-gold">
                                Our Fashion Mission
                            </h3>
                            <p className="text-center text-gray/30 text-lg">
                                To empower contemporary women with elegant, well-crafted fashion that celebrates 
                                their individuality. We create pieces that transition seamlessly from day to night, 
                                offering both style and substance for the modern lifestyle.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-gold/5">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.h2 variants={item} className="text-3xl font-serif font-bold mb-6 text-gray-800">
                            Our Design Philosophy
                        </motion.h2>
                        <motion.p variants={item} className="text-gray-600 mb-12 max-w-2xl mx-auto">
                            The principles that guide every design, stitch, and collection
                        </motion.p>

                        <motion.div variants={container} className="grid md:grid-cols-2 gap-8 text-left">
                            {[
                                "Quality fabrics that feel as good as they look",
                                "Timeless designs with contemporary flair",
                                "Perfect fit for the Nigerian woman's silhouette",
                                "Sustainable and ethical production practices",
                                "Versatile pieces for multiple occasions",
                                "Attention to detail in every stitch"
                            ].map((value, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-white p-6 rounded-lg border border-gold/20 flex items-start group hover:bg-gold/5 transition"
                                >
                                    <div className="bg-gold text-white p-2 rounded-full mr-4 group-hover:scale-110 transition">
                                        <FaRibbon className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-800 font-serif">{value}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Brand Story Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.h2 variants={item} className="text-3xl font-serif font-bold mb-6 text-gray-800">
                            The Bellebyokien Journey
                        </motion.h2>
                        <motion.div variants={item} className="bg-gradient-to-br from-gold/10 to-transparent p-8 rounded-2xl border border-gold/20">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Born from a passion for elegant design and the unique style of contemporary African women, 
                                Bellebyokien emerged as a celebration of modern femininity. Our name reflects our commitment 
                                to creating beautiful, well-crafted pieces that make women feel confident and empowered. 
                                Each collection is thoughtfully designed in Port Harcourt, inspired by the vibrant energy 
                                and sophisticated taste of Nigerian women.
                            </p>
                            <div className="mt-6 flex justify-center">
                                <div className="w-24 h-1 bg-gold rounded-full"></div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-gold/5">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.h2 variants={item} className="text-3xl font-serif font-bold text-center mb-6 text-gray-800">
                            Style Questions Answered
                        </motion.h2>
                        <motion.p variants={item} className="text-gray-600 text-center mb-12">
                            Everything you need to know about Bellebyokien Ready-to-Wear
                        </motion.p>

                        <motion.div variants={container} className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    className="border border-gold/20 rounded-xl overflow-hidden bg-white hover:shadow-lg transition"
                                >
                                    <details className="group">
                                        <summary className="list-none p-6 flex justify-between items-center cursor-pointer hover:bg-gold/5 transition">
                                            <h3 className="font-medium text-gray-900 font-serif">{faq.question}</h3>
                                            <svg className="w-5 h-5 text-gold group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <div className="px-6 pb-6 pt-0 text-gray-600 border-t border-gold/10 mt-2">
                                            {faq.answer}
                                        </div>
                                    </details>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.h2 variants={item} className="text-3xl font-serif font-bold mb-6 text-gold">
                            Style Consultation
                        </motion.h2>
                        <motion.p variants={item} className="text-gray-300 mb-12 max-w-2xl mx-auto">
                            Need help finding your perfect style? Reach out for personal styling advice, size guidance, or to discuss our latest collections.
                        </motion.p>

                        <motion.div variants={container} className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="https://wa.me/2349014727839"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 p-4 rounded-lg flex flex-col items-center transition border border-green-500/30"
                            >
                                <FaWhatsapp className="text-3xl mb-2" />
                                <span>WhatsApp</span>
                                <span className="text-green-200 text-sm mt-1">Style Advice</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="mailto:bellebyokien@fashion.com"
                                className="bg-gold hover:bg-yellow-600 p-4 rounded-lg flex flex-col items-center transition border border-gold/30"
                            >
                                <FaEnvelope className="text-3xl mb-2" />
                                <span>Email Us</span>
                                <span className="text-yellow-200 text-sm mt-1">Collections</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="https://instagram.com/bellebyokien"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-pink-600 hover:bg-pink-700 p-4 rounded-lg flex flex-col items-center transition border border-pink-500/30"
                            >
                                <FaInstagram className="text-3xl mb-2" />
                                <span>Instagram</span>
                                <span className="text-pink-200 text-sm mt-1">Latest Styles</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="tel:+2349014727839"
                                className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg flex flex-col items-center transition border border-blue-500/30"
                            >
                                <FaPhone className="text-3xl mb-2" />
                                <span>Call Us</span>
                                <span className="text-blue-200 text-sm mt-1">Consultation</span>
                            </motion.a>
                        </motion.div>

                        {/* Boutique Info */}
                        <motion.div variants={item} className="mt-12 p-6 bg-gold/10 rounded-xl border border-gold/20">
                            <h3 className="text-xl font-serif font-bold mb-3 text-gold">Visit Our Boutique</h3>
                            <p className="text-gray-300">
                                330 PH/Aba Express way Rumukwurushi, Port Harcourt
                            </p>
                            <p className="text-gold text-sm mt-2">Monday - Saturday: 9AM - 6PM</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
