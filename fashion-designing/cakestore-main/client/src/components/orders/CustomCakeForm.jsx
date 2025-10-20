// components/custom-order/CustomOrderForm.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createCustomOrder } from '../../services/customOrderService';
import { FaWhatsApp } from 'react-icons/fa';

import { 
  FiUpload, FiX, FiCheck, FiArrowLeft, FiArrowRight, 
  FiImage, FiCalendar, FiInfo, FiScissors,
  FiDroplet, FiPackage, FiMapPin, FiMessageCircle,
  FiMail, FiPhone
} from 'react-icons/fi';

// ... (keep all the existing PRICING configuration and stepVariants)

export default function CustomOrderForm({ onClose, onSubmit }) {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  
  const [formData, setFormData] = useState({
    // ... (keep all existing formData structure)
  });

  // ... (keep all existing helper functions: navigateStep, handleChange, handleFeatureToggle, etc.)

  const calculatePrice = () => {
    let price = PRICING.basePrice;
    
    // Design type multiplier
    if (formData.designType && PRICING.designTypes[formData.designType]) {
      price *= PRICING.designTypes[formData.designType].multiplier;
    }
    
    // Fabric cost
    if (formData.fabricType && PRICING.fabrics[formData.fabricType]) {
      price += PRICING.fabrics[formData.fabricType];
    }
    
    // Material quality multiplier
    if (formData.materialQuality && PRICING.materialQuality[formData.materialQuality]) {
      price *= PRICING.materialQuality[formData.materialQuality];
    }
    
    // Design features
    formData.designFeatures.forEach(feature => {
      if (PRICING.designFeatures[feature]) {
        price += PRICING.designFeatures[feature];
      }
    });
    
    // Shipping
    if (formData.shippingMethod && PRICING.shipping[formData.shippingMethod]) {
      price += PRICING.shipping[formData.shippingMethod];
    }
    
    return Math.round(price);
  };

  const getProductionTime = () => {
    if (formData.designType && PRICING.designTypes[formData.designType]) {
      return PRICING.designTypes[formData.designType].baseTime;
    }
    return '2-3 weeks';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to place a custom design order');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        ...formData,
        inspirationImages: uploadedImages.map(img => img.file),
        price: calculatePrice(),
        productionTime: getProductionTime(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || '',
        basePrice: PRICING.basePrice,
        fabricCost: formData.fabricType ? PRICING.fabrics[formData.fabricType] : 0,
        laborCost: 0, // Will be calculated during consultation
        shippingCost: formData.shippingMethod ? PRICING.shipping[formData.shippingMethod] : 0,
        totalPrice: calculatePrice(),
        finalPrice: calculatePrice(),
        status: 'consultation',
        priority: 'normal'
      };
      
      // Create the order directly
      const result = await createCustomOrder(orderData, currentUser);
      
      // Set success state
      setCreatedOrderId(result.id);
      setOrderCreated(true);
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(result);
      }
      
    } catch (error) {
      console.error('Error creating custom order:', error);
      alert('There was an error creating your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (keep all existing renderStep functions: renderStep1, renderStep2, etc.)

  const renderSuccessStep = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-6"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
        <FiCheck className="text-white text-2xl" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-3 font-serif">
        Order Created Successfully!
      </h3>
      
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-200">
        <p className="text-green-800 mb-4 font-serif">
          <strong>Order Reference:</strong> #{createdOrderId}
        </p>
        <p className="text-green-700 mb-2 font-serif">
          Your custom fashion design request has been received successfully.
        </p>
        <p className="text-green-600 text-sm font-serif">
          Estimated Price: <strong>₦{calculatePrice().toLocaleString()}</strong>
        </p>
      </div>

      <div className="bg-gradient-to-r from-gold/10 to-yellow-600/10 rounded-2xl p-6 mb-6 border border-gold/20">
        <h4 className="font-bold text-gray-800 mb-4 font-serif flex items-center justify-center gap-2">
          <FiMessageCircle className="text-gold" />
          Next Steps
        </h4>
        
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div>
              <p className="text-gray-700 font-medium font-serif">Design Consultation</p>
              <p className="text-gray-600 text-sm font-serif">
                Our customer representative will contact you within 24 hours to discuss your design in detail.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <div>
              <p className="text-gray-700 font-medium font-serif">Price Negotiation</p>
              <p className="text-gray-600 text-sm font-serif">
                Final pricing will be confirmed based on material availability and design complexity.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <div>
              <p className="text-gray-700 font-medium font-serif">Production Timeline</p>
              <p className="text-gray-600 text-sm font-serif">
                Estimated production time: <strong>{getProductionTime()}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
        <h4 className="font-bold text-gray-800 mb-4 font-serif flex items-center justify-center gap-2">
          <FaWhatsApp className="text-green-500" />
          Immediate Assistance
        </h4>
        
        <p className="text-gray-700 mb-4 font-serif">
          For immediate response or urgent inquiries, contact us directly:
        </p>
        
        <div className="space-y-3">
          <a
            href="https://wa.me/2349014727839"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <FaWhatsApp className="text-lg" />
            Chat on WhatsApp
          </a>
          
          <a
            href="tel:+2349014727839"
            className="flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <FiPhone className="text-lg" />
            Call Us Directly
          </a>
          
          <a
            href="mailto:bellebyokien@fashion.com"
            className="flex items-center justify-center gap-3 bg-gold hover:bg-yellow-600 text-black py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <FiMail className="text-lg" />
            Send Email
          </a>
        </div>
        
        <p className="text-gray-600 text-sm mt-4 font-serif">
          We're excited to bring your fashion vision to life!
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 font-serif"
        >
          Close Window
        </button>
      </div>
    </motion.div>
  );

  // ... (keep existing StepIndicator component)

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gold/20"
        >
          <div className="relative">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-black text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold font-serif">
                    {orderCreated ? 'Order Confirmed!' : 'Custom Fashion Design'}
                  </h2>
                  <p className="text-gold/80 text-xs font-serif">
                    {orderCreated ? 'Your design request is received' : '5 simple steps'}
                  </p>
                </div>
                {!orderCreated && (
                  <button 
                    onClick={onClose}
                    className="w-6 h-6 rounded-full bg-gold/20 hover:bg-gold/30 flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-gold/30"
                  >
                    <FiX className="text-sm text-gold" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar - Only show when not in success state */}
            {!orderCreated && (
              <div className="px-4 pt-3">
                <StepIndicator />
              </div>
            )}

            {/* Content */}
            <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
              {!currentUser ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  {/* ... (keep existing login required message) */}
                </motion.div>
              ) : orderCreated ? (
                renderSuccessStep()
              ) : (
                <form onSubmit={handleSubmit}>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && renderStep4()}
                  {step === 5 && renderStep5()}
                </form>
              )}
            </div>

            {/* Footer Navigation - Only show when not in success state */}
            {currentUser && !orderCreated && (
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => navigateStep(step - 1)}
                    disabled={step === 1}
                    className="flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gold hover:text-gold transition-all duration-200 font-semibold text-xs font-serif"
                  >
                    <FiArrowLeft className="mr-1" />
                    Back
                  </button>

                  {step < 5 ? (
                    <button 
                      type="button" 
                      onClick={() => navigateStep(step + 1)}
                      disabled={
                        (step === 1 && (!formData.designType || !formData.occasion || !formData.styleDescription)) ||
                        (step === 2 && (!formData.fabricType || !formData.fabricColor)) ||
                        (step === 3 && Object.values(formData.measurements).some(val => !val)) ||
                        (step === 4 && (!formData.eventDate || !formData.deliveryAddress.street))
                      }
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-yellow-600 text-black disabled:opacity-50 disabled:cursor-not-allowed hover:shadow transform hover:scale-105 transition-all duration-200 font-semibold text-xs border border-gold/30 font-serif"
                    >
                      Continue
                      <FiArrowRight className="ml-1" />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow transform hover:scale-105 transition-all duration-200 font-semibold text-xs border border-green-500/30 font-serif"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Order...
                        </>
                      ) : (
                        <>
                          Submit Design Request
                          <FiCheck className="ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
