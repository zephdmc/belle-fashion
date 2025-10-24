import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiShoppingBag, 
  FiClock, 
  FiDollarSign,
  FiCalendar,
  FiArrowRight,
  FiStar,
  FiShare2,
  FiScissors,
  FiTruck
} from 'react-icons/fi';
import { FaWhatsapp, FaRegCopy, FaTshirt } from 'react-icons/fa';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);

const OrderConfirmation = ({ order }) => {
  const [copied, setCopied] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Track conversion in analytics
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: order.data.id,
        value: order.data.totalPrice,
        currency: 'NGN',
        items: order.data.items.map(item => ({
          item_id: item.productId,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      }
    });

    // Trigger celebration animation
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, [order]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.data.orderNumber || order.data.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Bellebeau Aesthetics Order',
        text: `I just placed an order with Bellebeau Aesthetics! Order #${order.data.orderNumber || order.data.id}`,
        url: window.location.href,
      });
    }
  };

  const getOrderType = () => {
    if (order.data.orderType === 'custom') return 'Custom Design';
    if (order.data.orderType === 'mixed') return 'Mixed Order';
    return 'Ready-to-Wear';
  };

  const getEstimatedDelivery = () => {
    if (order.data.orderType === 'custom') return '2-3 weeks (Custom Production)';
    if (order.data.shippingMethod === 'express') return '2-3 business days';
    if (order.data.shippingMethod === 'overnight') return 'Next business day';
    return '5-7 business days';
  };

  const getNextSteps = () => {
    if (order.data.orderType === 'custom') {
      return [
        {
          step: 1,
          title: 'Design Consultation',
          description: 'Our designer will contact you within 24 hours to discuss your custom design',
          color: 'gold'
        },
        {
          step: 2,
          title: 'Measurement & Fitting',
          description: 'Schedule your measurement session for perfect tailoring',
          color: 'gold'
        },
        {
          step: 3,
          title: 'Production',
          description: 'Crafting your unique piece with premium materials',
          color: 'gold'
        },
        {
          step: 4,
          title: 'Delivery',
          description: 'Careful packaging and shipping of your custom creation',
          color: 'gold'
        }
      ];
    }

    return [
      {
        step: 1,
        title: 'Order Processing',
        description: 'We\'ll prepare your items within 24 hours',
        color: 'gold'
      },
      {
        step: 2,
        title: 'Quality Check',
        description: 'Each item undergoes thorough quality inspection',
        color: 'gold'
      },
      {
        step: 3,
        title: 'Shipping',
        description: 'Track your package with real-time updates',
        color: 'gold'
      },
      {
        step: 4,
        title: 'Delivery',
        description: 'Receive your fashion items with care',
        color: 'gold'
      }
    ];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const confettiVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        ease: "easeOut"
      }
    }
  };

  const colorClasses = {
    gold: 'bg-gold'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Celebration Confetti */}
        <AnimatePresence>
          {showAnimation && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={confettiVariants}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: '#D4AF37', // Gold color
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-black to-gray-900 px-6 py-8 text-center relative overflow-hidden border-b border-gold/30">
            <div className="absolute inset-0 bg-gold/10 backdrop-blur-sm"></div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                delay: 0.5 
              }}
              className="relative z-10 w-20 h-20 bg-gold/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold/30"
            >
              {order.data.orderType === 'custom' ? (
                <FiScissors className="text-gold text-3xl" />
              ) : (
                <FiCheck className="text-gold text-3xl" />
              )}
            </motion.div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-white">
                  Order Confirmed!
                </h1>
                <span className="bg-gold/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-gold/30">
                  {getOrderType()}
                </span>
              </div>
              
              <p className="text-gold/80 text-lg mb-4">
                {order.data.orderType === 'custom' 
                  ? "Your custom design journey begins now! We'll contact you shortly."
                  : "Thank you for your purchase! We're preparing your order with care."
                }
              </p>

              {/* Order ID with Copy */}
              <div className="flex items-center justify-center gap-3 bg-gold/10 backdrop-blur-sm rounded-xl p-3 border border-gold/20 max-w-xs mx-auto">
                <code className="text-white font-mono text-sm">
                  #{order.data.orderNumber || order.data.id}
                </code>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyOrderNumber}
                  className="text-white hover:text-gold transition-colors"
                >
                  {copied ? <FiCheck className="text-gold" /> : <FaRegCopy />}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            variants={itemVariants}
            className="p-6 md:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Order Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiShoppingBag className="text-gold" />
                  Order Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gold/5 rounded-xl border border-gold/20">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="text-xl font-bold text-gold">
                      ₦{order.data.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {order.data.paymentMethod?.replace('_', ' ') || 'Card'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-600">Estimated Delivery</span>
                    <span className="font-medium text-gray-800 text-sm text-right">
                      {getEstimatedDelivery()}
                    </span>
                  </div>

                  {order.data.shippingAddress && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-gray-600 mb-2">Shipping Address</p>
                      <p className="font-medium text-gray-800 text-sm">
                        {order.data.shippingAddress.street}, {order.data.shippingAddress.city}<br />
                        {order.data.shippingAddress.state}, {order.data.shippingAddress.country}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiClock className="text-gold" />
                  What's Next?
                </h3>
                
                <div className="space-y-4">
                  {getNextSteps().map((step) => (
                    <div key={step.step} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className={`w-8 h-8 ${colorClasses[step.color]} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <span className="text-black text-sm font-bold">{step.step}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{step.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            {(order.data.items && order.data.items.length > 0) && (
              <motion.div
                variants={itemVariants}
                className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTshirt className="text-gold" />
                  Your Items
                </h3>
                <div className="space-y-3">
                  {order.data.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-800">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {order.data.items.length > 3 && (
                    <p className="text-center text-gray-600 text-sm">
                      +{order.data.items.length - 3} more items
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MotionLink
                to={`/orders/${order.data.id}`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-black to-gray-900 text-white py-4 px-8 rounded-2xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center border border-gold/30"
              >
                View Order Details
                <FiArrowRight className="text-lg" />
              </MotionLink>
              
              {order.data.orderType === 'custom' ? (
                <MotionLink
                  to="/custom-order"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-gold/30 text-gold py-4 px-8 rounded-2xl font-semibold flex items-center gap-3 hover:bg-gold/5 transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  Create Another Design
                  <FiScissors className="text-lg" />
                </MotionLink>
              ) : (
                <MotionLink
                  to="/products"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-gold/30 text-gold py-4 px-8 rounded-2xl font-semibold flex items-center gap-3 hover:bg-gold/5 transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  Continue Shopping
                  <FiStar className="text-lg" />
                </MotionLink>
              )}
            </motion.div>

            {/* Share Section */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-6 border-t border-gray-200 text-center"
            >
              <p className="text-gray-600 mb-4">Love your fashion choices? Share the style!</p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareOrder}
                  className="bg-gold text-black p-3 rounded-xl hover:bg-yellow-600 transition-colors border border-gold/30"
                >
                  <FaWhatsapp className="text-xl" />
                </motion.button>
                
                {navigator.share && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareOrder}
                    className="bg-black text-gold p-3 rounded-xl hover:bg-gray-800 transition-colors border border-gold/30"
                  >
                    <FiShare2 className="text-xl" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Support Card */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Fashion Advice?</h3>
            <p className="text-gray-600 mb-4">
              Our style consultants are here to help with sizing, styling, or any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="mailto:support@bellebyokien.com" 
                className="text-gold hover:text-yellow-600 font-medium flex items-center gap-2"
              >
                <FiShare2 className="text-lg" />
                Email Style Support
              </a>
              <a 
                href="https://wa.me/+2349010873215" 
                className="text-gold hover:text-yellow-600 font-medium flex items-center gap-2"
              >
                <FaWhatsapp className="text-lg" />
                WhatsApp Consultation
              </a>
            </div>
          </div>
        </motion.div>

        {/* Track Order Card */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-gradient-to-r from-black to-gray-900 rounded-2xl p-6 text-white text-center border border-gold/30"
        >
          <FiTruck className="text-3xl mx-auto mb-3 text-gold" />
          <h3 className="text-xl font-bold mb-2">Track Your Order</h3>
          <p className="mb-4 text-gold/80">
            Get real-time updates on your order status and delivery timeline
          </p>
          <MotionLink
            to="/track-order"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gold text-black py-3 px-6 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-yellow-600 transition-colors border border-gold/30"
          >
            Track Order
            <FiArrowRight className="text-lg" />
          </MotionLink>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
