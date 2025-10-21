// server/models/CustomOrder.js
const { v4: uuidv4 } = require('uuid');

class CustomOrder {
    constructor(data) {
        this.id = data.id || `custom_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
        this.userId = data.userId;
        this.userEmail = data.userEmail;
        this.userName = data.userName || '';
        
        // Design Specifications
        this.designType = data.designType;
        this.occasion = data.occasion;
        this.styleDescription = data.styleDescription;
        
        // Fabric & Materials
        this.fabricType = data.fabricType;
        this.fabricColor = data.fabricColor;
        this.materialQuality = data.materialQuality || 'standard';
        
        // Measurements
        this.measurements = data.measurements || {
            bust: '',
            waist: '',
            hips: '',
            shoulderWidth: '',
            armLength: '',
            totalLength: ''
        };
        
        // Design Details
        this.designFeatures = data.designFeatures || [];
        this.embellishments = data.embellishments || [];
        this.specialRequests = data.specialRequests || '';
        
        // Timeline & Delivery
        this.eventDate = data.eventDate;
        this.requiredByDate = data.requiredByDate;
        this.shippingMethod = data.shippingMethod || 'standard';
        this.deliveryAddress = data.deliveryAddress || {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        };
        
        // Visual References
        this.inspirationImages = data.inspirationImages || [];
        this.referenceLinks = data.referenceLinks || [];
        
        // Pricing
        this.basePrice = data.basePrice || 0;
        this.fabricCost = data.fabricCost || 0;
        this.laborCost = data.laborCost || 0;
        this.shippingCost = data.shippingCost || 0;
        this.totalPrice = data.totalPrice || 0;
        this.finalPrice = data.finalPrice || 0;
        
        // Order Management
        this.status = data.status || 'consultation';
        this.priority = data.priority || 'normal';
        this.productionTime = data.productionTime || '2-3 weeks';
        
        // Timestamps
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    calculateRequiredByDate() {
        if (!this.eventDate) {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 21);
            return defaultDate.toISOString().split('T')[0];
        }
        
        const eventDate = new Date(this.eventDate);
        const requiredBy = new Date(eventDate);
        
        if (this.productionTime.includes('1-2')) {
            requiredBy.setDate(eventDate.getDate() - 10);
        } else if (this.productionTime.includes('2-3')) {
            requiredBy.setDate(eventDate.getDate() - 7);
        } else if (this.productionTime.includes('3-4')) {
            requiredBy.setDate(eventDate.getDate() - 5);
        } else {
            requiredBy.setDate(eventDate.getDate() - 7);
        }
        
        return requiredBy.toISOString().split('T')[0];
    }

    toFirestore() {
        // Calculate requiredByDate if not set
        if (!this.requiredByDate) {
            this.requiredByDate = this.calculateRequiredByDate();
        }

        // Create clean object without undefined values
        const firestoreData = {
            userId: this.userId,
            userEmail: this.userEmail,
            userName: this.userName,
            
            // Design Specifications
            designType: this.designType || '',
            occasion: this.occasion || '',
            styleDescription: this.styleDescription || '',
            
            // Fabric & Materials
            fabricType: this.fabricType || '',
            fabricColor: this.fabricColor || '',
            materialQuality: this.materialQuality || 'standard',
            
            // Measurements
            measurements: this.measurements || {},
            
            // Design Details
            designFeatures: this.designFeatures || [],
            embellishments: this.embellishments || [],
            specialRequests: this.specialRequests || '',
            
            // Timeline & Delivery
            eventDate: this.eventDate || '',
            requiredByDate: this.requiredByDate,
            shippingMethod: this.shippingMethod || 'standard',
            deliveryAddress: this.deliveryAddress || {},
            
            // Visual References
            inspirationImages: this.inspirationImages || [],
            referenceLinks: this.referenceLinks || [],
            
            // Pricing
            basePrice: this.basePrice || 0,
            fabricCost: this.fabricCost || 0,
            laborCost: this.laborCost || 0,
            shippingCost: this.shippingCost || 0,
            totalPrice: this.totalPrice || 0,
            finalPrice: this.finalPrice || 0,
            
            // Order Management
            status: this.status || 'consultation',
            priority: this.priority || 'normal',
            productionTime: this.productionTime || '2-3 weeks',
            
            // Timestamps
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };

        // Remove any undefined values
        Object.keys(firestoreData).forEach(key => {
            if (firestoreData[key] === undefined) {
                delete firestoreData[key];
            }
        });

        return firestoreData;
    }

    static fromFirestore(id, data) {
        return new CustomOrder({ id, ...data });
    }
}

module.exports = CustomOrder;
