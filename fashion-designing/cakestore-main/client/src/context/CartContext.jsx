import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

// Maximum allowed price for a single fashion item (₦500,000)
const MAX_ALLOWED_PRICE = 500000;
// Maximum allowed quantity per product
const MAX_QUANTITY = 10; // Lower quantity for fashion items

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [selectedSizes, setSelectedSizes] = useState({});
    const [selectedColors, setSelectedColors] = useState({});

    useEffect(() => {
        // Filter out any items with unreasonable prices before calculating totals
        const validCartItems = cartItems.filter(item => {
            const price = Number(item.price) || 0;
            return price <= MAX_ALLOWED_PRICE;
        });

        // If we filtered out items, update the cart
        if (validCartItems.length !== cartItems.length) {
            console.warn('Removed items with unreasonable prices from cart');
            setCartItems(validCartItems);
            return; // Exit early, this effect will run again with filtered items
        }

        // Calculate totals with safety checks
        const newTotal = validCartItems.reduce((sum, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            
            // Safety check - skip if price is unreasonable
            if (price > MAX_ALLOWED_PRICE) {
                console.error('Invalid price detected in cart calculation:', {
                    item: item.name,
                    price: price
                });
                return sum;
            }
            
            return sum + (price * quantity);
        }, 0);
        
        const newCount = validCartItems.reduce((count, item) => {
            return count + (Number(item.quantity) || 0);
        }, 0);
        
        setCartTotal(newTotal);
        setCartCount(newCount);

        // Debug logging
        if (cartItems.length > 0) {
            console.log('Cart updated:', {
                items: validCartItems.length,
                total: newTotal,
                count: newCount,
                itemsDetail: validCartItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.selectedSize,
                    color: item.selectedColor,
                    itemTotal: item.price * item.quantity
                }))
            });
        }
    }, [cartItems]);

    const addToCart = (product, quantity = 1, options = {}) => {
        // Validate product data
        if (!product || !product.id) {
            console.error('Invalid product added to cart:', product);
            return;
        }

        const safeQuantity = Math.max(1, Math.min(MAX_QUANTITY, Number(quantity) || 1));
        const safePrice = Number(product.price) || 0;

        // **CRITICAL FIX: Validate price before adding to cart**
        if (safePrice > MAX_ALLOWED_PRICE) {
            console.error('Product price rejected - too high:', {
                product: product.name,
                price: safePrice,
                maxAllowed: MAX_ALLOWED_PRICE
            });
            alert(`Sorry, the price for "${product.name}" (₦${safePrice.toLocaleString()}) appears to be incorrect. Please contact support.`);
            return; // Don't add to cart
        }

        // Validate that price is reasonable (not zero or negative for paid products)
        if (safePrice <= 0) {
            console.error('Product price rejected - zero or negative:', {
                product: product.name,
                price: safePrice
            });
            alert(`Sorry, "${product.name}" cannot be added to cart due to pricing issues.`);
            return;
        }

        // For ready-to-wear items, validate size and color selection
        if (!product.isCustomizable) {
            if (!options.selectedSize && product.sizes && product.sizes.length > 0) {
                alert(`Please select a size for "${product.name}"`);
                return;
            }
            if (!options.selectedColor && product.colors && product.colors.length > 0) {
                alert(`Please select a color for "${product.name}"`);
                return;
            }
        }

        console.log('Adding to cart:', {
            product: product.name,
            price: safePrice,
            quantity: safeQuantity,
            size: options.selectedSize,
            color: options.selectedColor,
            isCustomizable: product.isCustomizable,
            calculatedTotal: safePrice * safeQuantity
        });

        setCartItems((prevItems) => {
            // For fashion items, we need to check if the exact same item (with same size/color) already exists
            const existingItemIndex = prevItems.findIndex((item) => {
                if (item.id !== product.id) return false;
                
                // For customizable items, treat each as unique
                if (product.isCustomizable) return true;
                
                // For ready-to-wear, check if size and color match
                return item.selectedSize === options.selectedSize && 
                       item.selectedColor === options.selectedColor;
            });

            if (existingItemIndex !== -1) {
                const existingItem = prevItems[existingItemIndex];
                const newQuantity = existingItem.quantity + safeQuantity;
                
                if (newQuantity > MAX_QUANTITY) {
                    alert(`Maximum quantity of ${MAX_QUANTITY} per item is allowed`);
                    return prevItems;
                }
                
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = { 
                    ...existingItem, 
                    quantity: newQuantity 
                };
                return updatedItems;
            }

            // Add new item to cart
            const newItem = { 
                ...product, 
                quantity: safeQuantity,
                price: safePrice, // Ensure price is a number
                selectedSize: options.selectedSize || '',
                selectedColor: options.selectedColor || '',
                addedAt: new Date().toISOString()
            };

            return [...prevItems, newItem];
        });

        // Store size and color selections for future reference
        if (options.selectedSize) {
            setSelectedSizes(prev => ({
                ...prev,
                [product.id]: options.selectedSize
            }));
        }
        if (options.selectedColor) {
            setSelectedColors(prev => ({
                ...prev,
                [product.id]: options.selectedColor
            }));
        }
    };

    const removeFromCart = (productId, size = '', color = '') => {
        setCartItems((prevItems) => {
            if (size && color) {
                // Remove specific variant (size/color combination)
                return prevItems.filter((item) => 
                    !(item.id === productId && 
                      item.selectedSize === size && 
                      item.selectedColor === color)
                );
            } else {
                // Remove all variants of this product
                return prevItems.filter((item) => item.id !== productId);
            }
        });
    };

    const updateQuantity = (productId, newQuantity, size = '', color = '') => {
        const safeQuantity = Math.max(0, Math.min(MAX_QUANTITY, Number(newQuantity) || 0));
        
        if (safeQuantity <= 0) {
            removeFromCart(productId, size, color);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === productId) {
                    if (size && color) {
                        // Update specific variant
                        if (item.selectedSize === size && item.selectedColor === color) {
                            return { ...item, quantity: safeQuantity };
                        }
                    } else {
                        // Update all variants (fallback)
                        return { ...item, quantity: safeQuantity };
                    }
                }
                return item;
            })
        );
    };

    const updateItemOptions = (productId, oldSize, oldColor, newOptions) => {
        setCartItems((prevItems) => {
            const itemIndex = prevItems.findIndex(item => 
                item.id === productId && 
                item.selectedSize === oldSize && 
                item.selectedColor === oldColor
            );

            if (itemIndex === -1) return prevItems;

            const updatedItems = [...prevItems];
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                ...newOptions,
                updatedAt: new Date().toISOString()
            };

            return updatedItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        setSelectedSizes({});
        setSelectedColors({});
    };

    // Remove items with unreasonable prices
    const removeProblematicItems = () => {
        setCartItems(prevItems => 
            prevItems.filter(item => {
                const price = Number(item.price) || 0;
                const isValid = price <= MAX_ALLOWED_PRICE && price > 0;
                if (!isValid) {
                    console.warn('Removing problematic item:', {
                        name: item.name,
                        price: item.price
                    });
                }
                return isValid;
            })
        );
    };

    // Get cart item by ID and options
    const getCartItem = (productId, size = '', color = '') => {
        return cartItems.find(item => {
            if (item.id !== productId) return false;
            if (size && color) {
                return item.selectedSize === size && item.selectedColor === color;
            }
            return true;
        });
    };

    // Get all variants of a product in cart
    const getProductVariants = (productId) => {
        return cartItems.filter(item => item.id === productId);
    };

    // Check if cart has any problematic items
    const hasProblematicItems = () => {
        return cartItems.some(item => {
            const price = Number(item.price) || 0;
            return price > MAX_ALLOWED_PRICE || price <= 0;
        });
    };

    // Check if a specific product variant is in cart
    const isInCart = (productId, size = '', color = '') => {
        return cartItems.some(item => {
            if (item.id !== productId) return false;
            if (size && color) {
                return item.selectedSize === size && item.selectedColor === color;
            }
            return true;
        });
    };

    // Get cart summary for checkout
    const getCartSummary = () => {
        const summary = {
            totalItems: cartCount,
            totalAmount: cartTotal,
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.selectedSize,
                color: item.selectedColor,
                isCustomizable: item.isCustomizable,
                image: item.images?.[0],
                itemTotal: item.price * item.quantity
            })),
            customizableItems: cartItems.filter(item => item.isCustomizable),
            readyToWearItems: cartItems.filter(item => !item.isCustomizable)
        };

        return summary;
    };

    // Calculate shipping estimate based on cart items
    const calculateShippingEstimate = () => {
        const baseShipping = 1500; // Base shipping cost
        const additionalPerItem = 500; // Additional cost per item
        
        if (cartItems.length === 0) return 0;
        
        return baseShipping + (additionalPerItem * (cartItems.length - 1));
    };

    // Check if cart contains customizable items that require special handling
    const hasCustomizableItems = () => {
        return cartItems.some(item => item.isCustomizable);
    };

    // Validate cart before checkout
    const validateCartForCheckout = () => {
        const errors = [];

        if (cartItems.length === 0) {
            errors.push('Cart is empty');
            return { isValid: false, errors };
        }

        // Check for items without required selections
        cartItems.forEach(item => {
            if (!item.isCustomizable) {
                if (item.sizes && item.sizes.length > 0 && !item.selectedSize) {
                    errors.push(`Please select a size for "${item.name}"`);
                }
                if (item.colors && item.colors.length > 0 && !item.selectedColor) {
                    errors.push(`Please select a color for "${item.name}"`);
                }
            }
        });

        // Check for problematic prices
        if (hasProblematicItems()) {
            errors.push('Some items have pricing issues. Please review your cart.');
        }

        return {
            isValid: errors.length === 0,
            errors,
            requiresCustomOrderConsultation: hasCustomizableItems()
        };
    };

    return (
        <CartContext.Provider
            value={{
                // State
                cartItems,
                cartTotal,
                cartCount,
                selectedSizes,
                selectedColors,

                // Basic cart operations
                addToCart,
                removeFromCart,
                updateQuantity,
                updateItemOptions,
                clearCart,

                // Getters and validators
                getCartItem,
                getProductVariants,
                isInCart,
                getCartSummary,
                removeProblematicItems,
                hasProblematicItems,
                hasCustomizableItems,

                // Utilities
                calculateShippingEstimate,
                validateCartForCheckout
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}