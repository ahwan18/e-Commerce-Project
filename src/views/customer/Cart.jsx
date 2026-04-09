/**
 * Cart View (Customer)
 *
 * Shopping cart page where customers can review and modify their cart.
 *
 * NO business logic should be in this component - only UI.
 * All logic is handled through controllers and context.
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/Button';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import { useCounter } from '../../context/CounterContext';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeItem } = useCart();
  const { counterName } = useCounter();

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    navigate('/shop/checkout');
  };

  if (cart.length === 0) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <Button
            onClick={() => navigate('/shop')}
            variant="secondary"
            size="sm"
            className="mb-6 flex items-center gap-2 min-h-11"
            aria-label="Kembali ke katalog"
          >
            <ArrowLeft size={18} />
            Kembali
          </Button>

          <div className="text-center py-16">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Keranjang Kosong
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Yuk pilih mainan favoritmu dulu.
            </p>
            <Button
              onClick={() => navigate('/shop')}
              variant="primary"
              size="lg"
              aria-label="Mulai belanja"
            >
              Mulai Belanja
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-container pb-28">
        <Button
          onClick={() => navigate('/shop')}
          variant="secondary"
          size="sm"
          className="mb-6 flex items-center gap-2"
          aria-label="Lanjut belanja"
        >
          <ArrowLeft size={18} />
          Lanjut Belanja
        </Button>

        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Keranjang Belanja</h1>
          {counterName && <p className="text-sm text-slate-600 mt-1">Counter aktif: {counterName}</p>}
          <p className="text-sm text-slate-500 mt-1">Periksa ulang item sebelum lanjut pembayaran.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="surface-card p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/150x150?text=No+Image'}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors min-h-11 min-w-11"
                          disabled={item.quantity <= 1}
                          aria-label={`Kurangi jumlah ${item.name}`}
                        >
                          <Minus size={20} />
                        </button>
                        <span className="text-xl font-bold w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors min-h-11 min-w-11"
                          disabled={item.quantity >= item.stock}
                          aria-label={`Tambah jumlah ${item.name}`}
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-2 font-semibold transition-colors min-h-11"
                        aria-label={`Hapus ${item.name} dari keranjang`}
                      >
                        <Trash2 size={20} />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <aside className="surface-card p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Ringkasan Belanja
              </h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                variant="success"
                size="lg"
                className="w-full"
                aria-label="Lanjut ke checkout"
              >
                Checkout
              </Button>
            </aside>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200 backdrop-blur z-40 lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <Button
            onClick={handleCheckout}
            variant="success"
            size="lg"
            className="w-full"
            aria-label={`Checkout total ${formatPrice(cartTotal)}`}
          >
            Checkout - {formatPrice(cartTotal)}
          </Button>
        </div>
      </div>
    </main>
  );
};
