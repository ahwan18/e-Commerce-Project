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
import { useSettings } from '../../context/SettingsContext';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeItem } = useCart();
  const { counterName } = useCounter();
  const { uiMode } = useSettings();

  const isMode2 = uiMode === 'mode2';
  const shopPath = isMode2 ? '/catalog' : '/shop';

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
      <main className={`page-shell ${isMode2 ? 'bg-[#FDF8F5]' : ''}`}>
        <div className="page-container">
          <Button
            onClick={() => navigate(shopPath)}
            variant={isMode2 ? "primary" : "secondary"}
            size="sm"
            className="mb-6 flex items-center gap-2 min-h-11 w-max"
            aria-label="Kembali ke katalog"
          >
            <ArrowLeft size={18} />
            {isMode2 ? 'Back to Catalog' : 'Kembali'}
          </Button>

          <div className={`text-center py-16 ${isMode2 ? 'bg-white rounded-3xl shadow-sm border-2 border-slate-100 p-12' : ''}`}>
            <ShoppingBag size={80} className={`mx-auto mb-4 ${isMode2 ? 'text-pink-300' : 'text-gray-300'}`} />
            <h2 className={`text-3xl font-bold mb-2 ${isMode2 ? 'text-slate-900 font-black' : 'text-gray-800'}`}>
              {isMode2 ? 'Your Cart is Empty!' : 'Keranjang Kosong'}
            </h2>
            <p className={`mb-8 text-lg ${isMode2 ? 'text-slate-500 font-medium' : 'text-gray-600'}`}>
              {isMode2 ? 'Looks like you haven\'t added any fun toys yet.' : 'Yuk pilih mainan favoritmu dulu.'}
            </p>
            <Button
              onClick={() => navigate(shopPath)}
              variant="primary"
              size="lg"
              aria-label="Mulai belanja"
              className={isMode2 ? 'bg-[#4F46E5] hover:bg-[#4338CA] shadow-[0_4px_0_0_#3730A3] hover:translate-y-1 hover:shadow-none' : ''}
            >
              {isMode2 ? 'Start Shopping' : 'Mulai Belanja'}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`page-shell ${isMode2 ? 'bg-[#FDF8F5]' : ''}`}>
      <div className="page-container pb-28">
        <Button
          onClick={() => navigate(shopPath)}
          variant={isMode2 ? "secondary" : "secondary"}
          size="sm"
          className="mb-6 flex items-center gap-2 w-max bg-white"
          aria-label="Lanjut belanja"
        >
          <ArrowLeft size={18} />
          {isMode2 ? 'Continue Shopping' : 'Lanjut Belanja'}
        </Button>

        <header className="mb-8">
          <h1 className={`text-3xl sm:text-4xl ${isMode2 ? 'font-black text-slate-900' : 'font-semibold text-slate-900'}`}>
            {isMode2 ? 'Your Shopping Cart 🛒' : 'Keranjang Belanja'}
          </h1>
          {counterName && !isMode2 && <p className="text-sm text-slate-600 mt-1">Counter aktif: {counterName}</p>}
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-6 transition-all ${isMode2 ? 'bg-white rounded-3xl shadow-sm border-2 border-slate-100' : 'surface-card hover:shadow-md transition-shadow'}`}
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/150x150?text=No+Image'}
                    alt={item.name}
                    className={`w-full sm:w-32 h-48 sm:h-32 object-cover flex-shrink-0 ${isMode2 ? 'rounded-2xl border-2 border-slate-50' : 'rounded-xl'}`}
                  />

                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className={`text-xl mb-2 ${isMode2 ? 'font-extrabold text-slate-900 line-clamp-2' : 'font-bold text-gray-800'}`}>
                      {item.name}
                    </h3>
                    <p className={`text-2xl mb-4 ${isMode2 ? 'font-black text-[#4F46E5]' : 'font-bold text-blue-600'}`}>
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className={`rounded-full p-2 transition-transform active:scale-95 w-10 h-10 sm:min-h-11 sm:min-w-11 flex items-center justify-center ${isMode2 ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-slate-100 hover:bg-slate-200'}`}
                          disabled={item.quantity <= 1}
                          aria-label={`Kurangi jumlah ${item.name}`}
                        >
                          <Minus size={18} />
                        </button>
                        <span className={`text-xl w-8 sm:w-10 text-center ${isMode2 ? 'font-black' : 'font-bold'}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className={`rounded-full p-2 transition-transform active:scale-95 w-10 h-10 sm:min-h-11 sm:min-w-11 flex items-center justify-center ${isMode2 ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-slate-100 hover:bg-slate-200'}`}
                          disabled={item.quantity >= item.stock}
                          aria-label={`Tambah jumlah ${item.name}`}
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className={`flex items-center gap-2 font-semibold transition-colors h-10 sm:min-h-11 px-3 rounded-xl ${isMode2 ? 'text-pink-500 hover:bg-pink-50' : 'text-red-600 hover:text-red-700'}`}
                        aria-label={`Hapus ${item.name} dari keranjang`}
                      >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">{isMode2 ? 'Remove' : 'Hapus'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <aside className={`p-6 sticky top-24 ${isMode2 ? 'bg-white rounded-3xl shadow-lg border-2 border-slate-100' : 'surface-card'}`}>
              <h2 className={`text-2xl mb-6 ${isMode2 ? 'font-black text-slate-900 border-b-2 border-slate-100 pb-4' : 'font-bold text-gray-800'}`}>
                {isMode2 ? 'Order Summary' : 'Ringkasan Belanja'}
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className={`flex justify-between ${isMode2 ? 'text-slate-600 font-medium' : 'text-gray-600'}`}>
                    <span className="truncate pr-4">
                      {item.name} <span className="text-slate-400">x{item.quantity}</span>
                    </span>
                    <span className="whitespace-nowrap font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className={`pt-6 mb-8 ${isMode2 ? 'border-t-2 border-dashed border-slate-200' : 'border-t-2 pt-4'}`}>
                <div className="flex justify-between items-end">
                  <span className={`text-xl ${isMode2 ? 'font-bold text-slate-500' : 'font-bold text-gray-800'}`}>Total:</span>
                  <span className={`text-3xl ${isMode2 ? 'font-black text-[#10B981]' : 'font-bold text-blue-600'}`}>
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                variant="success"
                size="lg"
                className={`w-full ${isMode2 ? 'bg-[#10B981] hover:bg-[#059669] shadow-[0_4px_0_0_#047857] hover:shadow-none hover:translate-y-1 rounded-xl text-lg font-bold' : ''}`}
                aria-label="Lanjut ke checkout"
              >
                {isMode2 ? 'Proceed to Checkout 🚀' : 'Checkout'}
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
