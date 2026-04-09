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

/**
 * Debug utility
 * Set to true to enable verbose logging
 */
const DEBUG = true;
function debugLog(...args) {
  if (DEBUG) {
    console.log('[OrderController DEBUG]:', ...args);
  }
}

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
    debugLog('createOrder called with:', orderData);
    if (!orderData.customer_name || !orderData.customer_phone) {
      debugLog('Missing customer name or phone');
      throw new Error('Customer name and phone are required');
    }

    if (!orderData.items || orderData.items.length === 0) {
      debugLog('Cart is empty');
      throw new Error('Cart is empty');
    }

    if (!orderData.counter_id || !orderData.session_id) {
      debugLog('Missing counter/session context');
      throw new Error('Counter session is required');
    }

    const order = await OrderModel.createOrder({
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      total_amount: orderData.total_amount,
      status: 'pending',
      counter_id: orderData.counter_id,
      session_id: orderData.session_id,
    });
    debugLog('Order created:', order);

    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderModel.createOrderItems(orderItems);
    debugLog('Order items created:', orderItems);

    for (const item of orderData.items) {
      await ProductModel.updateProductStock(item.id, -item.quantity);
      debugLog('Updated product stock for:', item.id, 'by', -item.quantity);
    }

    try {
      debugLog('Calling processPayment...');
      const paymentResult = await processPayment({
        orderId: order.id,
        amount: orderData.total_amount,
        customerName: orderData.customer_name,
        customerPhone: orderData.customer_phone,
      });
      debugLog('Payment result:', paymentResult);

      if (paymentResult.midtransTransactionId) {
        await OrderModel.updateOrderMidtransId(order.id, paymentResult.midtransTransactionId);
        debugLog('Updated order with Midtrans transaction ID:', paymentResult.midtransTransactionId);
      }

      if (paymentResult.success) {
        await OrderModel.updateOrderStatus(order.id, 'paid');
        debugLog('Order status updated to paid');
      }

      return {
        order,
        payment: paymentResult,
      };
    } catch (paymentError) {
      debugLog('Payment error:', paymentError);
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
    debugLog('Error creating order:', error);
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
    const validStatuses = ['pending', 'paid', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
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
