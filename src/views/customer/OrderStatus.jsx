import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import * as OrderController from '../../controllers/orderController';

export const OrderStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [orderId, setOrderId] = useState(null);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(null);

  // Get order_id and status from query params or state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const order_id = params.get('order_id');
    setOrderId(order_id);
    if (!order_id) {
      setError('Order ID not found.');
      setStatus('failed');
      return;
    }
    // Fetch order status from backend
    OrderController.fetchOrderStatus(order_id)
      .then((data) => {
        setStatus(data.status); // 'paid', 'pending', 'failed'
        setTotal(data.total);
      })
      .catch(() => {
        setError('Failed to fetch order status.');
        setStatus('failed');
      });
  }, [location.search]);

  const handleFinish = () => {
    navigate('/menu');
    // Optionally: clear session/counter here
  };

  if (status === 'loading') return <Loading />;

  return (
    <main className="page-shell flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="max-w-md w-full p-6 rounded-lg shadow-lg bg-gray-50 text-center">
        <h1 className="text-2xl font-bold mb-2">Order Status</h1>
        {status === 'paid' && (
          <>
            <div className="text-green-600 text-xl font-semibold mb-2">Payment Successful</div>
            <div className="mb-4">Your order is being processed.</div>
          </>
        )}
        {status === 'pending' && (
          <>
            <div className="text-yellow-600 text-xl font-semibold mb-2">Payment Pending</div>
            <div className="mb-4">Please complete your payment.</div>
          </>
        )}
        {status === 'failed' && (
          <>
            <div className="text-red-600 text-xl font-semibold mb-2">Payment Failed</div>
            <div className="mb-4">There was a problem with your payment.</div>
          </>
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-2">Order ID: <span className="font-mono">{orderId}</span></div>
        <div className="mb-6">Total: <span className="font-bold">{total ? `Rp${total}` : '-'}</span></div>
        <Button onClick={handleFinish} variant="primary" size="lg">Finish</Button>
      </div>
    </main>
  );
};
