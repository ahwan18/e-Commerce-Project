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
  const statuses = ['pending', 'paid', 'completed', 'cancelled'];
  const timeline = [];

  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);

  for (let i = 0; i < statuses.length; i++) {
    const currentStatus = statuses[i];
    let completed = false;
    let date = null;

    if (status === 'cancelled') {
      completed = currentStatus === 'pending';
      date = completed ? createdDate : null;
    } else {
      const statusIndex = statuses.indexOf(status);
      completed = i <= statusIndex;

      if (i === 0) {
        date = createdDate;
      } else if (i === statusIndex) {
        date = updatedDate;
      }
    }

    timeline.push({
      status: currentStatus,
      label: getStatusLabel(currentStatus),
      completed,
      date,
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
    pending: 'Menunggu Pembayaran',
    paid: 'Sedang Diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
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
    pending: 'Pesanan Anda sedang menunggu pembayaran',
    paid: 'Pesanan Anda sedang diproses oleh tim kami',
    completed: 'Pesanan Anda telah selesai dan siap diambil',
    cancelled: 'Pesanan Anda telah dibatalkan',
  };
  return descriptions[status] || 'Status tidak diketahui';
};
