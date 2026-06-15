/**
 * Order Controller
 *
 * Handles business logic for order processing.
 * Coordinates between cart, payment, and order creation.
 *
 * You CAN modify these functions to add new order processing logic,
 * but maintain the single responsibility principle.
 */

import * as OrderModel from '../models/orderModel';
import * as ProductModel from '../models/productModel';
import { processPayment } from '../services/paymentService';
import { supabase } from '../services/supabaseClient';
import { ORDER_STATUS_VALUES } from '../utils/orderStatus';

/**
 * Generate a human-readable order number
 * Pattern: TOY-YYYYMM-XXXXX (e.g., TOY-202606-A7B2C)
 */
const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TOY-${year}${month}-${randomStr}`;
};

/**
 * Create a new order from cart
 * @param {Object} orderData - Order information
 * @param {string} orderData.customer_name - Customer name
 * @param {string} orderData.customer_phone - Customer phone
 * @param {Array} orderData.items - Cart items
 * @param {number} orderData.total_amount - Total amount
 * @param {string} orderData.counter_id - Counter ID
 * @param {string} orderData.session_id - Session ID
 * @returns {Promise<Object>} Created order with payment result
 */
export const createOrder = async (orderData) => {
  try {
    if (!orderData.customer_name || !orderData.customer_phone) {
      throw new Error('Customer name and phone are required');
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Fetch the currently authenticated user to link the order
    const { data: { user } } = await supabase.auth.getUser();

    // Generate the human-readable order number
    const orderNumber = generateOrderNumber();

    const order = await OrderModel.createOrder({
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      total_amount: orderData.total_amount,
      status: 'pending_payment',
      counter_id: orderData.counter_id,
      session_id: orderData.session_id,
      user_id: user?.id || null, // Link to user if logged in, else null (Guest)
      order_number: orderNumber,
      shipping_address: orderData.shipping_address || null,
      shipping_city: orderData.shipping_city || null,
      shipping_postal_code: orderData.shipping_postal_code || null,
      shipping_method: orderData.shipping_method || null,
      shipping_cost: orderData.shipping_cost || 0,
    });

    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderModel.createOrderItems(orderItems);

    for (const item of orderData.items) {
      await ProductModel.updateProductStock(item.id, -item.quantity);
    }

    try {
      const paymentResult = await processPayment({
        orderId: order.id,
        amount: orderData.total_amount,
        customerName: orderData.customer_name,
        customerPhone: orderData.customer_phone,
      });

      if (paymentResult.midtransTransactionId) {
        await OrderModel.updateOrderMidtransId(order.id, paymentResult.midtransTransactionId);
      }

      if (paymentResult.success) {
        await OrderModel.updateOrderStatus(order.id, 'paid');
      }

      return {
        order,
        payment: paymentResult,
      };
    } catch (paymentError) {
      console.error('Payment error:', paymentError);
      return {
        order,
        payment: {
          success: false,
          message: 'Payment failed. Order created but not paid.',
          error: paymentError?.message || paymentError,
        },
      };
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get all orders (Admin only)
 * @returns {Promise<Array>} All orders
 */
export const fetchAllOrders = async () => {
  try {
    const orders = await OrderModel.getAllOrders();
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to load orders');
  }
};

/**
 * Get order details by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const fetchOrderDetails = async (orderId) => {
  try {
    const order = await OrderModel.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

/**
 * Update order status (Admin only)
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export const updateStatus = async (orderId, status) => {
  try {
    if (!ORDER_STATUS_VALUES.includes(status)) {
      throw new Error('Invalid order status');
    }

    const updatedOrder = await OrderModel.updateOrderStatus(orderId, status);
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Get order statistics for dashboard (Admin only)
 * @returns {Promise<Object>} Order statistics
 */
export const fetchOrderStatistics = async () => {
  try {
    const stats = await OrderModel.getOrderStatistics();
    return stats;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw new Error('Failed to load statistics');
  }
};

/**
 * Get recent orders for dashboard (Admin only)
 * @param {number} limit - Number of orders to fetch
 * @returns {Promise<Array>} Recent orders
 */
export const fetchRecentOrders = async (limit = 10) => {
  try {
    const orders = await OrderModel.getRecentOrders(limit);
    return orders;
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw new Error('Failed to load recent orders');
  }
};

/**
 * Fetch all orders for a specific authenticated user
 * @param {string} userId - The Supabase user ID
 * @returns {Promise<Array>} User's order history
 */
export const fetchUserOrders = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required to fetch orders');
    const orders = await OrderModel.getOrdersByUserId(userId);
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to load your orders');
  }
};
