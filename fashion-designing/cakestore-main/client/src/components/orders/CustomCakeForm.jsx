// components/custom-order/CustomOrderForm.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, FiX, FiCheck, FiArrowLeft, FiArrowRight, 
  FiImage, FiCalendar, FiInfo, FiScissors, FiRuler,
  FiDroplet, FiPackage, FiMapPin
} from 'react-icons/fi';

// Fashion Design Pricing Configuration
const PRICING = {
  basePrice: 15000,
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
    'linen': 2000,
    'silk': 5000,
    'satin': 3000,
    'velvet': 4000,
    'wool': 3500,
    'chiffon': 2500
  },
  materialQuality: {
    'standard': 1,
    'premium': 1.5,
    'luxury': 2.5
  },
  designFeatures: {
    'basic': 0,
    'embroidery': 3000,
    'beading': 5000,
    'lace': 2500,
    'sequins': 4000,
    'print': 1500
  },
  shipping: {
    'standard': 1500,
    'express': 3000,
    'overnight': 5000
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

export default function CustomOrderForm({ onClose, onSubmit }) {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to place a custom design order');
      return;
    }
    
    const orderData = {
      ...formData,
      inspirationImages: uploadedImages.map(img => img.file),
      price: calculatePrice(),
      productionTime: getProductionTime(),
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName || ''
    };
    
    onSubmit(orderData);
  };

  const InputField = ({ label, name, type = 'text', required = false, children, ...props }) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center">
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
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          {...props}
        />
      )}
    </div>
  );

  const SelectField = ({ label, name, options, required = false, priceMap = {} }) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select 
        name={name} 
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
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
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
          <FiScissors className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Design Vision</h3>
        <p className="text-gray-600 text-xs">Tell us about your custom design</p>
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
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
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
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
          <FiDroplet className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Fabric & Materials</h3>
        <p className="text-gray-600 text-xs">Choose your materials and quality</p>
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
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Material Quality
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(PRICING.materialQuality).map(([quality, multiplier]) => (
            <button
              key={quality}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, materialQuality: quality }))}
              className={`p-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
                formData.materialQuality === quality
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
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
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Design Features
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRICING.designFeatures).map(([feature, price]) => (
            <button
              key={feature}
              type="button"
              onClick={() => handleFeatureToggle(feature)}
              className={`p-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
                formData.designFeatures.includes(feature)
                  ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
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
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
          <FiRuler className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Measurements</h3>
        <p className="text-gray-600 text-xs">Provide your measurements for perfect fit</p>
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
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
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
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
          <FiCalendar className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Timeline & Delivery</h3>
        <p className="text-gray-600 text-xs">When and where you need it</p>
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
        <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center">
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
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required={key !== 'zipCode'}
            />
          ))}
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Inspiration Images (Optional)
        </label>
        <div 
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : uploadedImages.length > 0
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
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
              <p className="text-green-600 text-xs">{uploadedImages.length} images uploaded</p>
            </div>
          ) : (
            <>
              <FiUpload className="mx-auto text-xl text-gray-400 mb-1" />
              <p className="text-gray-600 text-xs mb-0.5">
                <span className="text-blue-600 font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-gray-500">PNG, JPG up to 5MB each</p>
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
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <FiCheck className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Review Design</h3>
        <p className="text-gray-600 text-xs">Review your custom design details</p>
      </div>

      {/* Design Details */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-2 text-sm">Design Specifications</h4>
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
            <div key={label} className="bg-white rounded p-2">
              <span className="text-gray-600 text-xs">{label}:</span>
              <p className="font-semibold text-gray-800 text-xs">{value || 'Not specified'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Measurements */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
        <h4 className="font-bold text-purple-900 mb-2 text-sm">Measurements (cm)</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.measurements).map(([key, value]) => (
            <div key={key} className="bg-white rounded p-2 text-center">
              <span className="text-gray-600 text-xs block">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <p className="font-semibold text-gray-800 text-sm">{value || '-'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline & Delivery */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
        <h4 className="font-bold text-green-900 mb-2 text-sm">Timeline & Delivery</h4>
        <div className="space-y-2">
          {[
            ['Event Date', formData.eventDate],
            ['Shipping', formData.shippingMethod],
            ['Address', `${formData.deliveryAddress.street}, ${formData.deliveryAddress.city}`]
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded p-2">
              <span className="text-gray-600 text-xs">{label}:</span>
              <p className="font-semibold text-gray-800 text-xs">{value || 'Not specified'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
        <h4 className="font-bold text-orange-900 mb-2 text-sm">Price Estimate</h4>
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
            <div key={label} className="flex justify-between items-center py-1 border-b border-orange-100 last:border-b-0">
              <span className="text-gray-700 text-xs">{label}:</span>
              <span className="font-semibold text-gray-800 text-xs">
                {amount > 0 ? `+₦${amount.toLocaleString()}` : 'Included'}
              </span>
            </div>
          ))}
          <div className="border-t border-orange-200 pt-2 mt-1">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-orange-900">Total Estimate:</span>
              <span className="text-orange-900">₦{calculatePrice().toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-orange-700 mt-1">
              *Final price may vary after design consultation
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-4 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>
      <div 
        className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -translate-y-1/2 transition-all duration-500 -z-10"
        style={{ width: `${((step - 1) / 4) * 100}%` }}
      ></div>
      {[1, 2, 3, 4, 5].map((stepNumber) => (
        <div key={stepNumber} className="flex flex-col items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-xs ${
            step >= stepNumber 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent text-white scale-110 shadow'
              : 'bg-white border-gray-300 text-gray-400'
          }`}>
            {stepNumber}
          </div>
          <span className={`text-[10px] mt-1 font-medium ${
            step >= stepNumber ? 'text-blue-600' : 'text-gray-400'
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
          className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-hidden"
        >
          <div className="relative">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">Custom Fashion Design</h2>
                  <p className="text-blue-100 opacity-90 text-xs">5 simple steps</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                >
                  <FiX className="text-sm" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 pt-3">
              <StepIndicator />
            </div>

            {/* Content */}
            <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
              {!currentUser ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiInfo className="text-white text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Login Required</h3>
                  <p className="text-gray-600 text-xs mb-4">
                    Please log in to create a custom fashion design
                  </p>
                  <button 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-full font-semibold hover:shadow transition-all duration-200 transform hover:scale-105 text-sm"
                    onClick={() => window.location.href = '/login'}
                  >
                    Login to Continue
                  </button>
                </motion.div>
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

            {/* Footer Navigation */}
            {currentUser && (
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => navigateStep(step - 1)}
                    disabled={step === 1}
                    className="flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold text-xs"
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
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow transform hover:scale-105 transition-all duration-200 font-semibold text-xs"
                    >
                      Continue
                      <FiArrowRight className="ml-1" />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      onClick={handleSubmit}
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow transform hover:scale-105 transition-all duration-200 font-semibold text-xs"
                    >
                      Submit Design - ₦{calculatePrice().toLocaleString()}
                      <FiCheck className="ml-1" />
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