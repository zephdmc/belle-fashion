// components/custom-order/CustomOrderForm.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createCustomOrder } from '../../services/customOrderService';
import { 
  FiUpload, FiX, FiCheck, FiArrowLeft, FiArrowRight, 
  FiImage, FiCalendar, FiInfo, FiScissors,
  FiDroplet, FiPackage, FiMapPin, FiMessageCircle,
   FiMail, FiPhone
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// Fashion Design Pricing Configuration
const PRICING = {
  basePrice: 25000,
  designTypes: {
    'dress': { multiplier: 1, baseTime: '2-3 weeks' },
    'gown': { multiplier: 2, baseTime: '3-4 weeks' },
    'suit': { multiplier: 1.8, baseTime: '2-3 weeks' },
    'blouse': { multiplier: 0.8, baseTime: '1-2 weeks' },
    'skirt': { multiplier: 0.6, baseTime: '1-2 weeks' },
    'pants': { multiplier: 0.7, baseTime: '1-2 weeks' },
    'jacket': { multiplier: 1.2, baseTime: '2-3 weeks' }
  },
  fabrics: {
    'cotton': 0,
    'linen': 3000,
    'silk': 8000,
    'satin': 5000,
    'velvet': 6000,
    'wool': 5500,
    'chiffon': 4000
  },
  materialQuality: {
    'standard': 1,
    'premium': 1.5,
    'luxury': 2.5
  },
  designFeatures: {
    'basic': 0,
    'embroidery': 5000,
    'beading': 8000,
    'lace': 4000,
    'sequins': 6000,
    'print': 2500
  },
  shipping: {
    'standard': 2000,
    'express': 4000,
    'overnight': 7000
  }
};

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95
  })
};

export default function CustomOrderForm({ onClose }) {
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
    // Design Specifications
    designType: '',
    occasion: '',
    styleDescription: '',
    
    // Fabric & Materials
    fabricType: '',
    fabricColor: '',
    materialQuality: 'standard',
    
    // Measurements
    measurements: {
      bust: '',
      waist: '',
      hips: '',
      shoulderWidth: '',
      armLength: '',
      totalLength: ''
    },
    
    // Design Details
    designFeatures: [],
    embellishments: [],
    specialRequests: '',
    
    // Timeline & Delivery
    eventDate: '',
    shippingMethod: 'standard',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    
    // Visual References
    inspirationImages: [],
    referenceLinks: []
  });

  const navigateStep = (newStep) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('measurements.')) {
      const measurementField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [measurementField]: value
        }
      }));
    } else if (name.startsWith('deliveryAddress.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      designFeatures: prev.designFeatures.includes(feature)
        ? prev.designFeatures.filter(f => f !== feature)
        : [...prev.designFeatures, feature]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleImageFiles(files);
  };

  const handleImageFiles = (files) => {
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select images smaller than 5MB');
        return false;
      }
      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages(prev => [...prev, {
          url: event.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    handleImageFiles(files);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

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
      const result = await createCustomOrder(orderData);
      
      // Set success state
      setCreatedOrderId(result.data?.id || result.id || 'N/A');
      setOrderCreated(true);
      
      // REMOVED: onSubmit callback that was causing navigation to shipping page
      
    } catch (error) {
      console.error('Error creating custom order:', error);
      alert('There was an error creating your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, name, type = 'text', required = false, children, ...props }) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center font-serif">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children || (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required={required}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 placeholder-gray-400 font-serif"
          {...props}
        />
      )}
    </div>
  );

  const SelectField = ({ label, name, options, required = false, priceMap = {} }) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center font-serif">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select 
        name={name} 
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 appearance-none cursor-pointer font-serif"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={key} className="py-1 text-xs">
            {key.charAt(0).toUpperCase() + key.slice(1)} 
            {priceMap[key] > 0 && ` (+₦${priceMap[key].toLocaleString()})`}
            {typeof value === 'object' && value.baseTime && ` (${value.baseTime})`}
          </option>
        ))}
      </select>
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      key="step1"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-gold/30">
          <FiScissors className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 font-serif">Design Vision</h3>
        <p className="text-gray-600 text-xs font-serif">Tell us about your custom design</p>
      </div>

      <SelectField 
        label="Design Type" 
        name="designType" 
        options={PRICING.designTypes}
        required
      />
      
      <SelectField 
        label="Occasion" 
        name="occasion" 
        options={{
          'wedding': 'Wedding',
          'party': 'Party/Celebration',
          'formal': 'Formal Event',
          'casual': 'Casual Wear',
          'corporate': 'Corporate',
          'traditional': 'Traditional',
          'other': 'Other'
        }}
        required
      />
      
      <InputField 
        label="Style Description" 
        name="styleDescription"
        placeholder="Describe the style, vibe, and any specific details..."
        required
      >
        <textarea 
          name="styleDescription" 
          value={formData.styleDescription}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 resize-none font-serif"
          placeholder="E.g., A-line dress with floral embroidery, off-shoulder neckline..."
        />
      </InputField>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-gold/30">
          <FiDroplet className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 font-serif">Fabric & Materials</h3>
        <p className="text-gray-600 text-xs font-serif">Choose your materials and quality</p>
      </div>

      <SelectField 
        label="Fabric Type" 
        name="fabricType" 
        options={PRICING.fabrics}
        priceMap={PRICING.fabrics}
        required
      />
      
      <InputField 
        label="Fabric Color" 
        name="fabricColor"
        placeholder="E.g., Navy Blue, Ivory, Emerald Green..."
        required
      />
      
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2 font-serif">
          Material Quality
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(PRICING.materialQuality).map(([quality, multiplier]) => (
            <button
              key={quality}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, materialQuality: quality }))}
              className={`p-2 rounded-lg border text-xs font-medium transition-all duration-200 font-serif ${
                formData.materialQuality === quality
                  ? 'border-gold bg-gold/10 text-gold shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gold/50'
              }`}
            >
              {quality.charAt(0).toUpperCase() + quality.slice(1)}
              <div className="text-[10px] text-gray-500 mt-0.5">
                {multiplier === 1 ? 'Standard' : multiplier === 1.5 ? 'Premium' : 'Luxury'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2 font-serif">
          Design Features
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRICING.designFeatures).map(([feature, price]) => (
            <button
              key={feature}
              type="button"
              onClick={() => handleFeatureToggle(feature)}
              className={`p-2 rounded-lg border text-xs font-medium transition-all duration-200 font-serif ${
                formData.designFeatures.includes(feature)
                  ? 'border-gold bg-gold/10 text-gold shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gold/50'
              }`}
            >
              {feature.charAt(0).toUpperCase() + feature.slice(1)}
              {price > 0 && (
                <div className="text-[10px] text-gray-500 mt-0.5">
                  +₦{price.toLocaleString()}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-gold/30">
          <FiDroplet className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 font-serif">Measurements</h3>
        <p className="text-gray-600 text-xs font-serif">Provide your measurements for perfect fit</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(formData.measurements).map(([key, value]) => (
          <InputField
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            name={`measurements.${key}`}
            type="number"
            placeholder="cm"
            value={value}
            onChange={handleChange}
            required
          />
        ))}
      </div>

      <InputField 
        label="Special Requests" 
        name="specialRequests"
      >
        <textarea 
          name="specialRequests" 
          value={formData.specialRequests}
          onChange={handleChange}
          rows="2"
          placeholder="Any specific fit preferences or special requirements..."
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 resize-none font-serif"
        />
      </InputField>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      key="step4"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-gold/30">
          <FiCalendar className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 font-serif">Timeline & Delivery</h3>
        <p className="text-gray-600 text-xs font-serif">When and where you need it</p>
      </div>

      <InputField 
        label="Event Date" 
        name="eventDate" 
        type="date"
        required
        min={new Date().toISOString().split('T')[0]}
      />
      
      <SelectField 
        label="Shipping Method" 
        name="shippingMethod" 
        options={PRICING.shipping}
        priceMap={PRICING.shipping}
        required
      />

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center font-serif">
          <FiMapPin className="mr-1" />
          Delivery Address
        </label>
        <div className="space-y-2">
          {Object.entries(formData.deliveryAddress).map(([key, value]) => (
            <input
              key={key}
              type="text"
              name={`deliveryAddress.${key}`}
              value={value}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 placeholder-gray-400 font-serif"
              required={key !== 'zipCode'}
            />
          ))}
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2 font-serif">
          Inspiration Images (Optional)
        </label>
        <div 
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer ${
            isDragging 
              ? 'border-gold bg-gold/10' 
              : uploadedImages.length > 0
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-gold hover:bg-gold/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadedImages.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img.url} alt="Inspiration" className="w-full h-16 object-cover rounded" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                    >
                      <FiX size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-green-600 text-xs font-serif">{uploadedImages.length} images uploaded</p>
            </div>
          ) : (
            <>
              <FiUpload className="mx-auto text-xl text-gray-400 mb-1" />
              <p className="text-gray-600 text-xs mb-0.5 font-serif">
                <span className="text-gold font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-gray-500 font-serif">PNG, JPG up to 5MB each</p>
            </>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            className="sr-only" 
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <InputField 
        label="Reference Links (Optional)" 
        name="referenceLinks"
        placeholder="Pinterest, Instagram, or website links..."
      />
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div
      key="step5"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-500/30">
          <FiCheck className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 font-serif">Review Design</h3>
        <p className="text-gray-600 text-xs font-serif">Review your custom design details</p>
      </div>

      {/* Design Details */}
      <div className="bg-gradient-to-r from-gold/10 to-yellow-600/10 p-3 rounded-lg border border-gold/20">
        <h4 className="font-bold text-gray-800 mb-2 text-sm font-serif">Design Specifications</h4>
        <div className="space-y-2">
          {[
            ['Design Type', formData.designType],
            ['Occasion', formData.occasion],
            ['Fabric', formData.fabricType],
            ['Color', formData.fabricColor],
            ['Quality', formData.materialQuality],
            ['Features', formData.designFeatures.join(', ') || 'None'],
            ['Production Time', getProductionTime()]
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded p-2 border border-gray-100">
              <span className="text-gray-600 text-xs font-serif">{label}:</span>
              <p className="font-semibold text-gray-800 text-xs font-serif">{value || 'Not specified'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Measurements */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-2 text-sm font-serif">Measurements (cm)</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.measurements).map(([key, value]) => (
            <div key={key} className="bg-white rounded p-2 text-center border border-gray-100">
              <span className="text-gray-600 text-xs block font-serif">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <p className="font-semibold text-gray-800 text-sm font-serif">{value || '-'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline & Delivery */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
        <h4 className="font-bold text-green-900 mb-2 text-sm font-serif">Timeline & Delivery</h4>
        <div className="space-y-2">
          {[
            ['Event Date', formData.eventDate],
            ['Shipping', formData.shippingMethod],
            ['Address', `${formData.deliveryAddress.street}, ${formData.deliveryAddress.city}`]
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded p-2 border border-green-100">
              <span className="text-gray-600 text-xs font-serif">{label}:</span>
              <p className="font-semibold text-gray-800 text-xs font-serif">{value || 'Not specified'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg border border-amber-100">
        <h4 className="font-bold text-amber-900 mb-2 text-sm font-serif">Price Estimate</h4>
        <div className="space-y-1">
          {[
            ['Base Price', PRICING.basePrice],
            ...(formData.designType ? [
              ['Design Type', (PRICING.basePrice * (PRICING.designTypes[formData.designType].multiplier - 1))]
            ] : []),
            ...(formData.fabricType ? [['Fabric', PRICING.fabrics[formData.fabricType]]] : []),
            ...(formData.materialQuality !== 'standard' ? [
              ['Quality', (PRICING.basePrice * (PRICING.materialQuality[formData.materialQuality] - 1))]
            ] : []),
            ...formData.designFeatures.map(feature => [
              `${feature.charAt(0).toUpperCase() + feature.slice(1)}`,
              PRICING.designFeatures[feature]
            ]),
            ...(formData.shippingMethod ? [['Shipping', PRICING.shipping[formData.shippingMethod]]] : [])
          ].map(([label, amount]) => (
            <div key={label} className="flex justify-between items-center py-1 border-b border-amber-100 last:border-b-0">
              <span className="text-gray-700 text-xs font-serif">{label}:</span>
              <span className="font-semibold text-gray-800 text-xs font-serif">
                {amount > 0 ? `+₦${amount.toLocaleString()}` : 'Included'}
              </span>
            </div>
          ))}
          <div className="border-t border-amber-200 pt-2 mt-1">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-amber-900 font-serif">Total Estimate:</span>
              <span className="text-amber-900 font-serif">₦{calculatePrice().toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-amber-700 mt-1 font-serif">
              *Final price may vary after design consultation
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

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
          <FaWhatsapp className="text-green-500" />
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
            <FaWhatsapp className="text-lg" />
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

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-4 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>
      <div 
        className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-gold to-yellow-600 -translate-y-1/2 transition-all duration-500 -z-10"
        style={{ width: `${((step - 1) / 4) * 100}%` }}
      ></div>
      {[1, 2, 3, 4, 5].map((stepNumber) => (
        <div key={stepNumber} className="flex flex-col items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-xs ${
            step >= stepNumber 
              ? 'bg-gradient-to-r from-gold to-yellow-600 border-transparent text-white scale-110 shadow'
              : 'bg-white border-gray-300 text-gray-400'
          }`}>
            {stepNumber}
          </div>
          <span className={`text-[10px] mt-1 font-medium font-serif ${
            step >= stepNumber ? 'text-gold' : 'text-gray-400'
          }`}>
            {['Vision', 'Materials', 'Measure', 'Delivery', 'Review'][stepNumber - 1]}
          </span>
        </div>
      ))}
    </div>
  );

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
                  <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/30">
                    <FiInfo className="text-white text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-serif">Login Required</h3>
                  <p className="text-gray-600 text-xs mb-4 font-serif">
                    Please log in to create a custom fashion design
                  </p>
                  <button 
                    className="bg-gradient-to-r from-gold to-yellow-600 text-black py-2 px-6 rounded-full font-semibold hover:shadow transition-all duration-200 transform hover:scale-105 text-sm border border-gold/30 font-serif"
                    onClick={() => window.location.href = '/login'}
                  >
                    Login to Continue
                  </button>
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
