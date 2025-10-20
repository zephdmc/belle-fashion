import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiLock } from 'react-icons/fi';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('');
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Check your inbox for instructions!');
            toast.success('Password reset email sent successfully');
        } catch (error) {
            toast.error(error.message);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden flex items-center justify-center px-4 py-8">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0">
                    <img 
                        src="/images/fashion-forgot-password.jpg"
                        alt="Bellebyokien Fashion Security"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black/85 to-gray-800/90"></div>
                </div>
                
                {/* Floating Elements */}
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
                    className="absolute top-20 left-10 w-6 h-6 bg-gold/30 rounded-full backdrop-blur-sm"
                />
                
                <motion.div
                    animate={{ 
                        y: [0, 30, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-1/3 right-20 w-8 h-8 bg-gold/40 rounded-full backdrop-blur-sm"
                />
            </div>

            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-6 left-6 z-20"
            >
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-gold/20 font-serif"
                >
                    <FiArrowLeft className="text-sm" />
                    Back to Login
                </Link>
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-black/40 backdrop-blur-sm border border-gold/20 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-gold/20 to-yellow-600/20 px-6 py-5 border-b border-gold/20">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-xl flex items-center justify-center">
                                <FiLock className="text-2xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gold text-center font-serif">
                                    Reset Password
                                </h2>
                                <p className="text-gold/70 text-sm text-center font-serif">
                                    Recover your style profile access
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8">
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 text-sm rounded-xl border flex items-center ${
                                    message.includes('sent') ?
                                    'bg-green-500/10 text-green-400 border-green-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}
                            >
                                {message}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gold mb-3 font-serif" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gold/60" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gold/20 text-white rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold transition placeholder:text-gold/40 font-serif"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gold/50 font-serif">
                                    Enter the email associated with your Bellebyokien account
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center font-serif text-lg border border-gold/30"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Reset Link...
                                    </>
                                ) : 'Send Reset Link'}
                            </motion.button>
                        </form>

                        {/* Additional Links */}
                        <div className="mt-8 text-center">
                            <p className="text-gold/70 font-serif">
                                Remember your password?{' '}
                                <Link 
                                    to="/login" 
                                    className="font-semibold text-gold hover:text-yellow-400 transition-colors duration-300 hover:underline font-serif"
                                >
                                    Sign in to your account
                                </Link>
                            </p>
                        </div>

                        {/* Security Note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 p-4 bg-gold/5 rounded-xl border border-gold/10"
                        >
                            <div className="flex items-center gap-3">
                                <FiLock className="text-gold text-sm flex-shrink-0" />
                                <p className="text-gold/60 text-sm font-serif">
                                    We'll send you a secure link to reset your password and regain access to your style profile.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Trust Assurance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-6"
                >
                    <p className="text-gold/40 text-sm font-serif">
                        Your security and privacy are our top priority
                    </p>
                </motion.div>
            </div>

            {/* Bottom Wave Decoration */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
                <svg 
                    viewBox="0 0 1200 120" 
                    preserveAspectRatio="none" 
                    className="w-full h-20"
                >
                    <path 
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".25" 
                        className="fill-current text-gold/20"
                    />
                    <path 
                        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".5" 
                        className="fill-current text-gold/15"
                    />
                    <path 
                        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        className="fill-current text-gold/10"
                    />
                </svg>
            </div>
        </div>
    );
}
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('');
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Check your inbox!');
            toast.success('Password reset email sent');
        } catch (error) {
            toast.error(error.message);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 p-8 bg-white rounded-xl shadow-sm transition-all hover:shadow-md sm:my-12 sm:p-10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 sm:text-4xl">Reset Password</h2>
                <p className="text-purpleDark1">Enter your email to receive a reset link</p>
            </div>

            {message && (
                <div className={`mb-6 p-3 text-sm rounded-lg border flex items-center ${message.includes('sent') ?
                    'bg-purpleLighter1 text-purpleDark border-purpleLight' :
                    'bg-red-50 text-red-600 border-red-100'
                    }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Email address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 text-base border border-purpleDark rounded-lg focus:ring-2 focus:ring-purpleLighter focus:border-primary-500 transition"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-purpleDark hover:bg-purpleLight text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending....
                        </>
                    ) : 'Send Reset Link'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                    Remember your password?{' '}
                    <Link to="/login" className="font-medium text-purpleDark hover:text-primary-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
