/**
 * Order Model
 *
 * Handles all database operations related to orders and order items.
 * This layer should ONLY contain data access logic - no business logic.
 *
 * DO NOT modify the structure of these functions.
 * Each function has a single responsibility: interact with the database.
 */

import { supabase } from '../services/supabaseClient';

/**
 * Fetch all orders with their items
 * @returns {Promise<Array>} Array of orders with items
 */
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      counter:counters (
        id,
        name
      ),
      order_items (
        id,
        quantity,
        price,
        product:products (
          id,
          name,
          image_url
        )
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Fetch a single order by ID
 * @param {string} id - Order ID
 * @returns {Promise<Object>} Order object with items
 */
export const getOrderById = async (id) => {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      counter:counters (
        id,
        name
      ),
      order_items (
        id,
        quantity,
        price,
        product:products (
          id,
          name,
          image_url
        )
      )
    `
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @param {string} orderData.customer_name - Customer name
 * @param {string} orderData.customer_phone - Customer phone
 * @param {number} orderData.total_amount - Total amount
 * @param {string} orderData.status - Order status
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Create order items
 * @param {Array} items - Array of order items
 * @returns {Promise<Array>} Created order items
 */
export const createOrderItems = async (items) => {
  const { data, error } = await supabase
    .from('order_items')
    .insert(items)
    .select();

  if (error) throw error;
  return data;
};

/**
 * Update order status
 * @param {string} id - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update order Midtrans transaction ID
 * @param {string} id - Order ID
 * @param {string} midtransTransactionId - Midtrans transaction ID
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderMidtransId = async (id, midtransTransactionId) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ midtrans_transaction_id: midtransTransactionId })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get order statistics
 * @returns {Promise<Object>} Order statistics
 */
export const getOrderStatistics = async () => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('total_amount, status');

  if (error) throw error;

  const totalOrders = orders.length;
  const totalSales = orders.reduce(
    (sum, order) => sum + parseFloat(order.total_amount),
    0
  );
  const paidOrders = orders.filter((o) => o.status === 'paid').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  return {
    totalOrders,
    totalSales,
    paidOrders,
    pendingOrders,
  };
};

/**
 * Get recent orders
 * @param {number} limit - Number of orders to fetch
 * @returns {Promise<Array>} Recent orders
 */
export const getRecentOrders = async (limit = 10) => {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      counter:counters (
        id,
        name
      ),
      order_items (
        quantity,
        product:products (
          name
        )
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};
