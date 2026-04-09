/**
 * Checkout View (Customer)
 *
 * Checkout page where customers enter their information and complete the order.
 *
 * NO business logic should be in this component - only UI.
 * All logic is handled through controllers.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { useCart } from '../../context/CartContext';
import { useCounter } from '../../context/CounterContext';
import { formatPrice, validatePhone } from '../../utils/helpers';
import * as OrderController from '../../controllers/orderController';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { counterId, sessionId, counterName, releaseSession, mode } = useCounter();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handlePlaceOrder = async () => {
    if (!formData.customer_name.trim()) {
      setError('Nama harus diisi');
      return;
    }

    if (!formData.customer_phone.trim()) {
      setError('Nomor telepon harus diisi');
      return;
    }

    if (!validatePhone(formData.customer_phone)) {
      setError('Nomor telepon tidak valid');
      return;
    }

    if (cart.length === 0) {
      setError('Keranjang kosong');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        items: cart,
        total_amount: cartTotal,
        counter_id: counterId,
        session_id: sessionId,
      };

      const result = await OrderController.createOrder(orderData);

      if (result.payment.success) {
        await releaseSession();
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate(`/menu?counter_id=${counterId}`);
        }, 3000);
      } else if (!result.payment.pending) {
        await releaseSession();
        setError(result.payment.message || 'Pembayaran gagal');
      } else {
        setError(result.payment.message || 'Pembayaran gagal');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handlePlaceOrder();
  };

  if (cart.length === 0 && !success) {
    navigate('/shop/cart');
    return null;
  }

  if (success) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <div className="max-w-2xl mx-auto text-center py-16">
            <CheckCircle size={100} className="mx-auto text-green-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Pesanan Berhasil!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Terima kasih. Pesananmu sedang kami proses.
            </p>
            <Button
              onClick={() => navigate(`/menu?counter_id=${counterId}`)}
              variant="primary"
              size="lg"
              aria-label="Kembali ke katalog"
            >
              Kembali ke Katalog
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (mode === 'browsing') {
    return (
      <main className="page-shell flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-md w-full p-6 rounded-lg shadow-lg bg-yellow-50 text-yellow-800 text-center">
          <h2 className="text-2xl font-bold mb-2">Preview Mode</h2>
          <p className="mb-4">Scan QR di meja untuk mulai checkout dan memesan.</p>
          <Button onClick={() => navigate('/menu')} variant="primary">Kembali ke Katalog</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-container pb-28">
        <Button
          onClick={() => navigate('/shop/cart')}
          variant="secondary"
          size="sm"
          className="mb-6 flex items-center gap-2"
          aria-label="Kembali ke keranjang"
        >
          <ArrowLeft size={18} />
          Kembali
        </Button>

        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-6">Checkout</h1>
        {counterName && (
          <p className="text-blue-800 font-medium mb-4">Counter aktif: {counterName}</p>
        )}
        <p className="text-sm text-slate-500 mb-4">Isi data singkat untuk menyelesaikan pesanan.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-2" role="alert">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              Informasi Pembeli
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="customer_name"
                  className="block text-lg font-semibold text-gray-700 mb-2"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-lg border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Masukkan nama"
                  required
                  aria-label="Nama pembeli"
                />
              </div>

              <div>
                <label
                  htmlFor="customer_phone"
                  className="block text-lg font-semibold text-gray-700 mb-2"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="customer_phone"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-lg border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="08xxxxxxxxxx"
                  required
                  aria-label="Nomor telepon pembeli"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Contoh: 081234567890
                </p>
              </div>

              <Button
                type="submit"
                variant="success"
                size="xl"
                className="w-full"
                disabled={loading}
                aria-label="Bayar sekarang"
              >
                {loading ? 'Memproses...' : 'Bayar Sekarang'}
              </Button>
            </form>
          </section>

          <aside className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b"
                >
                  <img
                    src={item.image_url || 'https://via.placeholder.com/80x80?text=No+Image'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-gray-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-gray-700">
                  Total Item:
                </span>
                <span className="text-xl font-bold text-gray-800">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} item
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-800">
                  Total Bayar:
                </span>
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200 backdrop-blur z-40 lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <Button
            type="button"
            onClick={handlePlaceOrder}
            variant="success"
            size="lg"
            className="w-full"
            disabled={loading}
            aria-label={`Bayar sekarang total ${formatPrice(cartTotal)}`}
          >
            {loading ? 'Memproses...' : `Bayar ${formatPrice(cartTotal)}`}
          </Button>
        </div>
      </div>
    </main>
  );
};
