import { motion } from 'framer-motion';
import { FaRibbon, FaPalette, FaHandsHelping, FaWhatsapp, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
import { FiScissors } from 'react-icons/fi';

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

   

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-8 pb-12 md:pt-20 md:pb-28">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-black mb-4 sm:mb-6">
                            Our <span className="text-yellow-500">Style</span> Story
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-black max-w-2xl mx-auto px-4">
                            Where contemporary elegance meets timeless craftsmanship for the modern Nigerian woman
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={container}
                        className="max-w-5xl mx-auto"
                    >
                        <motion.h2 variants={item} className="text-2xl sm:text-3xl font-serif font-bold text-center mb-8 sm:mb-12 text-black">
                            At Bellebyokien, we believe style is personal expression.
                        </motion.h2>

                        <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
                            <motion.div variants={item} className="bg-white p-4 sm:p-6 rounded-xl text-center border border-yellow-500">
                                <div className="flex justify-center text-yellow-500 mb-3 sm:mb-4">
                                    <FaPalette className="text-3xl sm:text-4xl" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 font-serif">Contemporary Design</h3>
                                <p className="text-black text-sm sm:text-base">
                                    Creating pieces that blend modern aesthetics with timeless elegance for today's sophisticated woman.
                                </p>
                            </motion.div>

                            <motion.div variants={item} className="bg-white p-4 sm:p-6 rounded-xl text-center border border-yellow-500">
                                <div className="flex justify-center text-yellow-500 mb-3 sm:mb-4">
                                    <FiScissors className="text-3xl sm:text-4xl" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 font-serif">Quality Craftsmanship</h3>
                                <p className="text-black text-sm sm:text-base">
                                    Each garment is meticulously crafted with attention to detail, ensuring perfect fit and lasting quality.
                                </p>
                            </motion.div>

                          
                        </motion.div>

                        <motion.div variants={item} className="bg-yellow-500 text-black p-6 sm:p-8 md:p-12 rounded-xl border border-yellow-500">
                            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4 text-center">
                                Our Fashion Mission
                            </h3>
                            <p className="text-center text-black text-base sm:text-lg">
                                To empower contemporary women with elegant, well-crafted fashion that celebrates 
                                their individuality. We create pieces that transition seamlessly from day to night, 
                                offering both style and substance for the modern lifestyle.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={container}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.h2 variants={item} className="text-2xl sm:text-3xl font-serif font-bold mb-4 sm:mb-6 text-black">
                            Our Design Philosophy
                        </motion.h2>
                        <motion.p variants={item} className="text-black mb-8 sm:mb-12 max-w-2xl mx-auto text-base sm:text-lg">
                            The principles that guide every design, stitch, and collection
                        </motion.p>

                        <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-left">
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
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white p-4 sm:p-6 rounded-lg border border-yellow-500 flex items-start group transition"
                                >
                                    <div className="bg-yellow-500 text-black p-2 rounded-full mr-3 sm:mr-4 transition">
                                        <FaRibbon className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-black font-serif text-sm sm:text-base">{value}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Brand Story Section */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={container}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.h2 variants={item} className="text-2xl sm:text-3xl font-serif font-bold mb-4 sm:mb-6 text-black">
                            The Bellebyokien Journey
                        </motion.h2>
                        <motion.div variants={item} className="bg-yellow-500/10 p-6 sm:p-8 rounded-2xl border border-yellow-500">
                            <p className="text-black text-base sm:text-lg leading-relaxed">
                                Born from a passion for elegant design and the unique style of contemporary African women, 
                                Bellebyokien emerged as a celebration of modern femininity. Our name reflects our commitment 
                                to creating beautiful, well-crafted pieces that make women feel confident and empowered. 
                                Each collection is thoughtfully designed in Port Harcourt, inspired by the vibrant energy 
                                and sophisticated taste of Nigerian women.
                            </p>
                            <div className="mt-4 sm:mt-6 flex justify-center">
                                <div className="w-16 sm:w-24 h-1 bg-yellow-500 rounded-full"></div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={container}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.h2 variants={item} className="text-2xl sm:text-3xl font-serif font-bold text-center mb-4 sm:mb-6 text-black">
                            Style Questions Answered
                        </motion.h2>
                        <motion.p variants={item} className="text-black text-center mb-8 sm:mb-12 text-base sm:text-lg">
                            Everything you need to know about Bellebyokien Ready-to-Wear
                        </motion.p>

                     
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-12 sm:py-16 bg-yellow-500 text-black">
                <div className="container mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={container}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.h2 variants={item} className="text-2xl sm:text-3xl font-serif font-bold mb-4 sm:mb-6">
                            Style Consultation
                        </motion.h2>
                        <motion.p variants={item} className="text-black mb-8 sm:mb-12 max-w-2xl mx-auto text-base sm:text-lg">
                            Need help finding your perfect style? Reach out for personal styling advice, size guidance, or to discuss our latest collections.
                        </motion.p>

                        <motion.div variants={container} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="https://wa.me/2349014727839"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black hover:bg-gray-800 p-3 sm:p-4 rounded-lg flex flex-col items-center transition border border-black"
                            >
                                <FaWhatsapp className="text-2xl sm:text-3xl mb-2 text-white" />
                                <span className="text-white text-sm sm:text-base">WhatsApp</span>
                                <span className="text-gray-300 text-xs sm:text-sm mt-1">Style Advice</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="mailto:bellebyokien@gmail.com"
                                className="bg-black hover:bg-gray-800 p-3 sm:p-4 rounded-lg flex flex-col items-center transition border border-black"
                            >
                                <FaEnvelope className="text-2xl sm:text-3xl mb-2 text-white" />
                                <span className="text-white text-sm sm:text-base">Email Us</span>
                                <span className="text-gray-300 text-xs sm:text-sm mt-1">Collections</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="https://instagram.com/bellebyokien"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black hover:bg-gray-800 p-3 sm:p-4 rounded-lg flex flex-col items-center transition border border-black"
                            >
                                <FaInstagram className="text-2xl sm:text-3xl mb-2 text-white" />
                                <span className="text-white text-sm sm:text-base">Instagram</span>
                                <span className="text-gray-300 text-xs sm:text-sm mt-1">Latest Styles</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="tel:+2349014727839"
                                className="bg-black hover:bg-gray-800 p-3 sm:p-4 rounded-lg flex flex-col items-center transition border border-black"
                            >
                                <FaPhone className="text-2xl sm:text-3xl mb-2 text-white" />
                                <span className="text-white text-sm sm:text-base">Call Us</span>
                                <span className="text-gray-300 text-xs sm:text-sm mt-1">Consultation</span>
                            </motion.a>
                        </motion.div>

                    
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
