/**
 * Tracking Controller
 *
 * Handles business logic for order tracking.
 * Gets data from models and prepares it for views.
 *
 * Single Responsibility: Order tracking operations
 */

import * as OrderModel from '../models/orderModel';
import {
  ORDER_STATUSES,
  getOrderStatusIndex,
  getOrderStatusMeta,
  normalizeOrderStatus,
} from '../utils/orderStatus';

/**
 * Get order tracking information
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order with tracking status
 */
export const getOrderTracking = async (orderId) => {
  try {
    const order = await OrderModel.getOrderById(orderId);

    if (!order) {
      throw new Error('Order tidak ditemukan');
    }

    return {
      ...order,
      statusTimeline: getStatusTimeline(order.status, order.created_at, order.updated_at),
      estimatedTime: getEstimatedTime(order.status, order.created_at),
    };
  } catch (error) {
    throw new Error(`Gagal mengambil data pesanan: ${error.message}`);
  }
};

/**
 * Get status timeline based on order status
 * @param {string} status - Current order status
 * @param {string} createdAt - Order creation time
 * @param {string} updatedAt - Order last update time
 * @returns {Array} Status timeline array
 */
const getStatusTimeline = (status, createdAt, updatedAt) => {
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);

  const normalizedStatus = normalizeOrderStatus(status);
  const successPath = ORDER_STATUSES.filter((item) => item.value !== 'cancelled');

  const timeline = [];

  if (normalizedStatus === 'cancelled') {
    timeline.push({
      status: 'pending_payment',
      label: getOrderStatusMeta('pending_payment').label,
      desc: getOrderStatusMeta('pending_payment').description,
      completed: true,
      date: createdDate,
    });
    timeline.push({
      status: 'cancelled',
      label: getOrderStatusMeta('cancelled').label,
      desc: getOrderStatusMeta('cancelled').description,
      completed: true,
      date: updatedDate,
    });
  } else {
    const statusIndex = getOrderStatusIndex(normalizedStatus);

    successPath.forEach((step, i) => {
      const isCompleted = i <= statusIndex;
      let date = null;

      if (i === 0) date = createdDate;
      else if (i === statusIndex) date = updatedDate;

      timeline.push({
        status: step.value,
        label: step.label,
        desc: step.description,
        completed: isCompleted,
        date: date,
      });
    });
  }

  return timeline;
};

/**
 * Get estimated completion time based on order status
 * @param {string} status - Current order status
 * @param {string} createdAt - Order creation time
 * @returns {Object} Estimated time info
 */
const getEstimatedTime = (status, createdAt) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const hoursElapsed = (now - createdDate) / (1000 * 60 * 60);

  const normalizedStatus = normalizeOrderStatus(status);

  if (normalizedStatus === 'completed' || normalizedStatus === 'cancelled') {
    return {
      isEstimate: false,
      message: normalizedStatus === 'completed' ? 'Pesanan selesai' : 'Pesanan dibatalkan',
    };
  }

  let estimatedHours = 24;
  if (normalizedStatus === 'paid') {
    estimatedHours = 12;
  } else if (normalizedStatus === 'processing') {
    estimatedHours = 8;
  } else if (normalizedStatus === 'shipped') {
    estimatedHours = 4;
  }

  const remainingHours = Math.max(0, estimatedHours - hoursElapsed);
  const estimatedDate = new Date(createdDate.getTime() + estimatedHours * 60 * 60 * 1000);

  return {
    isEstimate: true,
    estimatedDate,
    remainingHours: Math.ceil(remainingHours),
    message: `Estimasi selesai dalam ${Math.ceil(remainingHours)} jam`,
  };
};

/**
 * Get user-friendly status label
 * @param {string} status - Status code
 * @returns {string} Status label
 */
export const getStatusDescription = (status) => {
  return getOrderStatusMeta(status).description;
};
