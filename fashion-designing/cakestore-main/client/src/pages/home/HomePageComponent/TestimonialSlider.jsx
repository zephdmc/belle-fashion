import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
    {
        id: 1,
        name: "Maria Okoro.",
        role: "Wedding Client",
        content: "belle by okien created the most breathtaking wedding gown for our special day! Not only was it stunningly beautiful, but the fit was absolutely perfect. The intricate lace detailing and flawless silhouette made me feel like royalty. Our guests are still talking about how exquisite I looked!",
        rating: 5,
        avatar: "/images/maria.jpg",
        favorite: "Wedding Tier Cake"
    },
    {
        id: 2,
        name: "David Okoye.",
        role: "Regular Customer",
        content: "The custom evening gown from belle by okien exceeded all my expectations! The design was incredibly unique and the craftsmanship was impeccable. I felt so confident and elegant at the gala - everyone kept asking who designed my dress!",
        rating: 5,
        avatar: "/images/devid.jpg",
        favorite: "Butter Croissants"
    },
    {
        id: 3,
        name: "Sophie Mmadu.",
        role: "Birthday Party Host",
        content: "belle by okien crafted the most sophisticated couture piece I've ever owned! The attention to detail, from the hand-sewn beads to the luxurious fabric, was extraordinary. It's not just a dress - it's a work of art that makes you feel incredible",
        rating: 5,
        avatar: "/images/sofia.jpg",
        favorite: "Custom Cupcakes"
    },
    {
        id: 4,
        name: "Mr. Johnson",
        role: "Anniversary Celebration",
        content: "belle by okien designed the most stunning gown for my special event! The exquisite craftsmanship and perfect fit made me feel absolutely radiant. Everyone was mesmerized by the beautiful design!",
        rating: 5,
        avatar: "/images/jonson.jpg",
        favorite: "Red Velvet Cake"
    },
    {
        id: 5,
        name: "Clement Obinna",
        role: "Local Restaurant Owner",
        content: "As a fashion editor, I see countless designs, but belle by okien's work stands out. The architectural precision of their cuts combined with luxurious fabrics creates pieces that are both visually stunning and incredibly well-constructed. True couture quality..",
        rating: 5,
        avatar: "/images/clement.jpg",
        favorite: "Artisan Sourdough"
    }
];

export default function TestimonialSlider() {
    const [current, setCurrent] = useState(0);

    const nextTestimonial = () => {
        setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const prevTestimonial = () => {
        setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    return (
        <div className="relative max-w-4xl mx-auto px-4">
            <motion.div
                key={testimonials[current].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-lg border border-amber-200"
            >
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 text-amber-300 text-6xl opacity-30">"</div>
                
                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                    <div className="flex space-x-1">
                        {[...Array(testimonials[current].rating)].map((_, i) => (
                            <FiStar key={i} className="w-6 h-6 text-amber-400 fill-current" />
                        ))}
                    </div>
                </div>

                {/* Testimonial Content */}
                <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center relative z-10">
                    "{testimonials[current].content}"
                </p>

                {/* Favorite Item */}
                <div className="text-center mb-6">
                    <span className="inline-block bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Favorite: {testimonials[current].favorite}
                    </span>
                </div>

                {/* Customer Info */}
                <div className="flex items-center justify-center space-x-4">
                    <div className="relative">
                        <img
                            src={testimonials[current].avatar}
                            alt={testimonials[current].name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-amber-200 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <FiStar className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-gray-900 text-lg">{testimonials[current].name}</h4>
                        <p className="text-amber-600 font-medium">{testimonials[current].role}</p>
                    </div>
                </div>
            </motion.div>

            {/* Navigation Buttons */}
            <button
                onClick={prevTestimonial}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl border border-amber-200 hover:bg-amber-50 transition-all duration-300 group"
            >
                <FiChevronLeft className="w-6 h-6 text-amber-600 group-hover:text-amber-700" />
            </button>
            <button
                onClick={nextTestimonial}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl border border-amber-200 hover:bg-amber-50 transition-all duration-300 group"
            >
                <FiChevronRight className="w-6 h-6 text-amber-600 group-hover:text-amber-700" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            current === index 
                                ? 'bg-amber-500 w-8' 
                                : 'bg-amber-200 hover:bg-amber-300'
                        }`}
                    />
                ))}
            </div>

            {/* Auto-play indicator */}
            <div className="text-center mt-4">
                <div className="inline-flex items-center space-x-2 text-sm text-amber-600 bg-amber-100 px-4 py-2 rounded-full">
                    <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                    <span>What our customers say</span>
                </div>
            </div>
        </div>
    );
}
