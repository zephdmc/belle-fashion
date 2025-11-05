import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
            {/* Main Spinner */}
            <motion.div
                className="relative"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Outer Golden Ring */}
                <motion.div
                    className="w-20 h-20 border-4 border-amber-200 rounded-full"
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                        },
                        scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                />
                
                {/* Middle Ring */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-3 border-amber-400 rounded-full"
                    animate={{
                        rotate: -360,
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        rotate: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        },
                        scale: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                />
                
                {/* Inner Spinning Core */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full shadow-lg"
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        rotate: {
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        },
                        scale: {
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                />
                
                {/* Floating Particles */}
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                        initial={{
                            scale: 0,
                            opacity: 0,
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            x: [
                                Math.cos((index * 120 * Math.PI) / 180) * 30,
                                Math.cos((index * 120 * Math.PI) / 180) * 50,
                                Math.cos((index * 120 * Math.PI) / 180) * 30,
                            ],
                            y: [
                                Math.sin((index * 120 * Math.PI) / 180) * 30,
                                Math.sin((index * 120 * Math.PI) / 180) * 50,
                                Math.sin((index * 120 * Math.PI) / 180) * 30,
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </motion.div>

            {/* Loading Text */}
            <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <motion.h3
                    className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent mb-2"
                    animate={{
                        opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                >
                    Loading Elegance
                </motion.h3>
                <motion.p
                    className="text-amber-600 font-serif"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.5,
                    }}
                >
                    Preparing something beautiful...
                </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
                className="mt-6 w-64 h-2 bg-amber-100 rounded-full overflow-hidden shadow-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-8 h-8 bg-amber-200/30 rounded-full blur-sm"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-yellow-300/20 rounded-full blur-sm"
                animate={{
                    scale: [1.5, 1, 1.5],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
