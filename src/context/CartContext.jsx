/**
 * Cart Context
 *
 * Provides cart state management across the application.
 * Uses React Context API to avoid prop drilling.
 *
 * You CAN add new cart-related state and functions here,
 * but keep the context focused on cart management only.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import * as CartController from '../controllers/cartController';
import { useCounter } from './CounterContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { counterId, sessionId } = useCounter();
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const cartScopeKey =
    counterId && sessionId ? `toy_store_cart_${counterId}_${sessionId}` : null;

  useEffect(() => {
    loadCart();
  }, [cartScopeKey]);

  useEffect(() => {
    updateCartStats();
  }, [cart]);

  const loadCart = () => {
    const cartData = CartController.getCart(cartScopeKey);
    setCart(cartData);
  };

  const updateCartStats = () => {
    const count = CartController.getCartItemCount(cartScopeKey);
    const total = CartController.calculateCartTotal(cartScopeKey);
    setCartCount(count);
    setCartTotal(total);
  };

  const addItem = (product, quantity = 1) => {
    try {
      const updatedCart = CartController.addToCart(product, quantity, cartScopeKey);
      setCart(updatedCart);
      return true;
    } catch (error) {
      console.error('Failed to add item:', error);
      return false;
    }
  };

  const removeItem = (productId) => {
    try {
      const updatedCart = CartController.removeFromCart(productId, cartScopeKey);
      setCart(updatedCart);
      return true;
    } catch (error) {
      console.error('Failed to remove item:', error);
      return false;
    }
  };

  const updateQuantity = (productId, quantity) => {
    try {
      const updatedCart = CartController.updateCartItemQuantity(
        productId,
        quantity,
        cartScopeKey
      );
      setCart(updatedCart);
      return true;
    } catch (error) {
      console.error('Failed to update quantity:', error);
      return false;
    }
  };

  const clearCart = () => {
    try {
      const emptyCart = CartController.clearCart(cartScopeKey);
      setCart(emptyCart);
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return false;
    }
  };

  const validateCart = (products) => {
    try {
      const validation = CartController.validateCart(products, cartScopeKey);
      if (!validation.valid) {
        setCart(validation.cart);
      }
      return validation;
    } catch (error) {
      console.error('Failed to validate cart:', error);
      return { valid: false, errors: [{ message: 'Validation failed' }] };
    }
  };

  const value = {
    cart,
    cartCount,
    cartTotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    validateCart,
    refreshCart: loadCart,
    cartScopeKey,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
