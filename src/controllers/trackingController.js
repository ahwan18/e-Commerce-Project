/**
 * Tracking Controller
 *
 * Handles business logic for order tracking.
 * Gets data from models and prepares it for views.
 *
 * Single Responsibility: Order tracking operations
 */

import * as OrderModel from '../models/orderModel';

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

  // Define the "Success Path"
  const successPath = [
    { id: 'pending', label: 'Pending', desc: 'Your order has been placed and is awaiting payment.' },
    { id: 'paid', label: 'Paid', desc: 'Payment confirmed! We are now processing your toys.' },
    { id: 'completed', label: 'Completed', desc: 'Your adventure is ready! Please collect your order.' },
  ];

  const timeline = [];

  if (status === 'cancelled') {
    // Cancelled Path: Pending -> Cancelled
    timeline.push({
      status: 'pending',
      label: 'Pending',
      completed: true,
      date: createdDate,
    });
    timeline.push({
      status: 'cancelled',
      label: 'Cancelled',
      completed: true,
      date: updatedDate,
    });
  } else {
    // Success Path: Only show steps up to current status
    const statusIndex = successPath.findIndex(s => s.id === status);

    successPath.forEach((step, i) => {
      const isCompleted = i <= statusIndex;
      let date = null;

      if (i === 0) date = createdDate;
      else if (i === statusIndex) date = updatedDate;

      timeline.push({
        status: step.id,
        label: step.label,
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

  if (status === 'completed' || status === 'cancelled') {
    return {
      isEstimate: false,
      message: status === 'completed' ? 'Pesanan selesai' : 'Pesanan dibatalkan',
    };
  }

  let estimatedHours = 24;
  if (status === 'paid') {
    estimatedHours = 12;
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
const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    paid: 'Paid',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

/**
 * Get status description
 * @param {string} status - Status code
 * @returns {string} Status description
 */
export const getStatusDescription = (status) => {
  const descriptions = {
    pending: 'Order is pending payment',
    paid: 'Order is being processed',
    completed: 'Order completed and ready for pickup',
    cancelled: 'Order has been cancelled',
  };
  return descriptions[status] || 'Unknown status';
};
