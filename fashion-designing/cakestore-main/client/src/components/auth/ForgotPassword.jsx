import { useState } from 'react';
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
      {/* Background Image */}
    

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

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/40 backdrop-blur-sm border border-gold/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gold/20 to-yellow-600/20 px-6 py-5 border-b border-gold/20 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-xl flex items-center justify-center">
                <FiLock className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gold font-serif">Reset Password</h2>
              <p className="text-gold/70 text-sm font-serif">Recover your style profile access</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 text-sm rounded-xl border flex items-center ${
                  message.includes('sent')
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
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
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            </form>

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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-gold/40 text-sm font-serif">Your security and privacy are our top priority</p>
        </motion.div>
      </div>
    </div>
  );
}
