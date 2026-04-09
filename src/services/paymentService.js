/**
 * Debug utility
 * Set to true to enable verbose logging
 */
const DEBUG = true;
function debugLog(...args) {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log('[PaymentService DEBUG]:', ...args);
  }
}

/**
 * MIDTRANS Payment Processing
 *
 * @param {Object} orderData - Order information
 * @param {string} orderData.orderId - Order ID
 * @param {number} orderData.amount - Total amount
 * @param {string} orderData.customerName - Customer name
 * @param {string} orderData.customerPhone - Customer phone
 * @returns {Promise<Object>} Payment result
 */
export const processPayment = async (orderData) => {
  try {
    debugLog('Starting payment process', orderData);
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL is not configured');
    }

    if (!supabaseAnonKey) {
      throw new Error('VITE_SUPABASE_ANON_KEY is not configured');
    }

    // Step 1: Call Edge Function to get snap token
    const response = await fetch(
      `${supabaseUrl}/functions/v1/create-midtrans-transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          order_id: orderData.orderId,
          gross_amount: orderData.amount,
          customer_details: {
            first_name: orderData.customerName,
            phone: orderData.customerPhone,
          },
        }),
      }
    );

    debugLog('Edge Function response status:', response.status);
    let result = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }
    debugLog('Edge Function response body:', result);

    if (!response.ok) {
      debugLog('Payment error response:', result);
      throw new Error(result.error || `Failed to create transaction (HTTP ${response.status})`);
    }

    if (!result?.snap_token) {
      debugLog('Missing snap_token from backend response:', result);
      throw new Error('Snap token was not generated');
    }

    if (!window.snap || typeof window.snap.pay !== 'function') {
      debugLog('window.snap is unavailable');
      throw new Error('Midtrans Snap is not loaded. Please refresh and try again.');
    }

    // Step 2: Open Midtrans Snap
    return new Promise((resolve, reject) => {
      window.snap.pay(result.snap_token, {
        onSuccess: function(paymentResult) {
          debugLog('Payment success:', paymentResult);
          resolve({
            success: true,
            transactionId: paymentResult.transaction_id,
            midtransTransactionId: result.transaction_id,
            data: paymentResult,
          });
        },
        onPending: function(paymentResult) {
          debugLog('Payment pending:', paymentResult);
          resolve({
            success: false,
            pending: true,
            transactionId: paymentResult.transaction_id,
            midtransTransactionId: result.transaction_id,
            message: 'Payment is pending',
            data: paymentResult,
          });
        },
        onError: function(error) {
          debugLog('Payment error:', error);
          reject(new Error(error?.message || 'Payment failed'));
        },
        onClose: function() {
          debugLog('Payment cancelled by user');
          reject(new Error('Payment cancelled by user'));
        },
      });
    });
  } catch (error) {
    debugLog('Payment error (outer catch):', error);
    // eslint-disable-next-line no-console
    console.error('Payment error:', error);
    throw error;
  }
};
