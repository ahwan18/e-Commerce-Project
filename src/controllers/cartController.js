/**
 * Cart Controller
 *
 * Handles business logic for shopping cart operations.
 * Cart data is stored in local storage for unauthenticated users.
 *
 * You CAN modify these functions to add new cart features,
 * but maintain the single responsibility principle.
 */

const CART_STORAGE_KEY = 'toy_store_cart';

const resolveStorageKey = (scopeKey) => scopeKey || CART_STORAGE_KEY;

/**
 * Get cart from local storage
 * @returns {Array} Cart items
 */
export const getCart = (scopeKey) => {
  try {
    const cartData = localStorage.getItem(resolveStorageKey(scopeKey));
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

/**
 * Save cart to local storage
 * @param {Array} cart - Cart items
 */
const saveCart = (cart, scopeKey) => {
  try {
    localStorage.setItem(resolveStorageKey(scopeKey), JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

/**
 * Add item to cart
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity to add
 * @returns {Array} Updated cart
 */
export const addToCart = (product, quantity = 1, scopeKey) => {
  try {
    const cart = getCart(scopeKey);
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity,
        stock: product.stock,
      });
    }

    saveCart(cart, scopeKey);
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw new Error('Failed to add item to cart');
  }
};

/**
 * Remove item from cart
 * @param {string} productId - Product ID to remove
 * @returns {Array} Updated cart
 */
export const removeFromCart = (productId, scopeKey) => {
  try {
    const cart = getCart(scopeKey);
    const updatedCart = cart.filter((item) => item.id !== productId);
    saveCart(updatedCart, scopeKey);
    return updatedCart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw new Error('Failed to remove item from cart');
  }
};

/**
 * Update item quantity in cart
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Array} Updated cart
 */
export const updateCartItemQuantity = (productId, quantity, scopeKey) => {
  try {
    if (quantity <= 0) {
      return removeFromCart(productId, scopeKey);
    }

    const cart = getCart(scopeKey);
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex > -1) {
      cart[itemIndex].quantity = quantity;
      saveCart(cart, scopeKey);
    }

    return cart;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    throw new Error('Failed to update quantity');
  }
};

/**
 * Clear entire cart
 * @returns {Array} Empty cart
 */
export const clearCart = (scopeKey) => {
  try {
    saveCart([], scopeKey);
    return [];
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw new Error('Failed to clear cart');
  }
};

/**
 * Calculate cart total
 * @returns {number} Total amount
 */
export const calculateCartTotal = (scopeKey) => {
  try {
    const cart = getCart(scopeKey);
    return cart.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
};

/**
 * Get cart item count
 * @returns {number} Total number of items in cart
 */
export const getCartItemCount = (scopeKey) => {
  try {
    const cart = getCart(scopeKey);
    return cart.reduce((count, item) => count + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
};

/**
 * Validate cart items against current product stock
 * @param {Array} products - Current product list from database
 * @returns {Object} Validation result
 */
export const validateCart = (products, scopeKey) => {
  try {
    const cart = getCart(scopeKey);
    const errors = [];
    const updatedCart = [];

    cart.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);

      if (!product) {
        errors.push({
          productId: cartItem.id,
          message: `${cartItem.name} is no longer available`,
        });
      } else if (product.stock < cartItem.quantity) {
        errors.push({
          productId: cartItem.id,
          message: `${cartItem.name} only has ${product.stock} items in stock`,
        });
        updatedCart.push({
          ...cartItem,
          quantity: product.stock,
          stock: product.stock,
        });
      } else {
        updatedCart.push({
          ...cartItem,
          stock: product.stock,
        });
      }
    });

    if (errors.length > 0) {
      saveCart(updatedCart, scopeKey);
      return {
        valid: false,
        errors,
        cart: updatedCart,
      };
    }

    return {
      valid: true,
      errors: [],
      cart: updatedCart,
    };
  } catch (error) {
    console.error('Error validating cart:', error);
    return {
      valid: false,
      errors: [{ message: 'Failed to validate cart' }],
      cart: getCart(scopeKey),
    };
  }
};
