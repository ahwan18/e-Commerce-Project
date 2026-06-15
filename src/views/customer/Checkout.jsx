/**
 * Checkout View (Customer)
 *
 * Checkout page where customers enter their information and complete the order.
 *
 * UI for collecting checkout details and submitting orders.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, MapPin, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/Button';
import { useCart } from '../../context/CartContext';
import { useCounter } from '../../context/CounterContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, validatePhone } from '../../utils/helpers';
import * as OrderController from '../../controllers/orderController';
import { SULSEL_CITIES } from '../../data/shippingData';
import { useCartStockValidation } from '../../hooks/useCartStockValidation';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, validateCart } = useCart();
  const { counterId, sessionId, counterName, releaseSession } = useCounter();
  const { uiMode } = useSettings();
  const { user } = useAuth();
  
  const isMode2 = uiMode === 'mode2';

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    address: '',
    city: '',
    postal_code: '',
  });
  
  const [shippingMethod, setShippingMethod] = useState('kurir_toko');
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedCityData, setSelectedCityData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const { validateCurrentStock } = useCartStockValidation(cart, validateCart);

  useEffect(() => {
    if (isMode2 && user) {
      setFormData(prev => ({
        ...prev,
        customer_name: prev.customer_name || user.user_metadata?.full_name || '',
      }));
    }
  }, [isMode2, user]);

  useEffect(() => {
    if (isMode2 && formData.city) {
      const city = SULSEL_CITIES.find(c => c.name === formData.city);
      setSelectedCityData(city || null);
      
      if (city) {
        if (city.distance > 50) {
          setShippingMethod('ekspedisi');
        } else {
          setShippingMethod('kurir_toko');
        }
      }
    } else {
      setSelectedCityData(null);
      setShippingCost(0);
    }
  }, [formData.city, isMode2]);

  useEffect(() => {
    if (!selectedCityData) {
      setShippingCost(0);
      return;
    }
    
    if (shippingMethod === 'kurir_toko') {
      const cost = Math.max(1, Math.ceil(selectedCityData.distance / 5)) * 10000;
      setShippingCost(cost);
    } else if (shippingMethod === 'ekspedisi') {
      setShippingCost(25000); // Flat rate for faraway regencies
    }
  }, [shippingMethod, selectedCityData]);

  const finalTotal = cartTotal + (isMode2 ? shippingCost : 0);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Keranjang kosong');
      return;
    }

    const validation = await validateCurrentStock();
    if (!validation.valid) {
      const hasOutOfStockItem = validation.errors?.some((item) => item.type === 'out_of_stock');
      setError(
        hasOutOfStockItem
          ? 'Ada produk yang stoknya habis. Hapus produk tersebut dari keranjang sebelum checkout.'
          : validation.errors?.[0]?.message || 'Stok produk berubah. Periksa keranjang sebelum checkout.'
      );
      navigate('/shop/cart');
      return;
    }

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
    
    if (isMode2 && (!formData.address.trim() || !formData.city.trim())) {
      setError('Alamat pengiriman lengkap harus diisi');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // In Mode 2, counterId and sessionId might be undefined.
      // We pass them anyway; the backend should handle nulls for online orders if configured properly.
      const orderData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        items: cart,
        total_amount: finalTotal,
        counter_id: counterId || null,
        session_id: sessionId || null,
        shipping_address: isMode2 ? formData.address : null,
        shipping_city: isMode2 ? formData.city : null,
        shipping_postal_code: isMode2 ? formData.postal_code : null,
        shipping_method: isMode2 ? shippingMethod : null,
        shipping_cost: isMode2 ? shippingCost : 0,
      };

      const result = await OrderController.createOrder(orderData);

      if (result.payment.success) {
        setOrderId(result.order.id);
        setSuccess(true);
        clearCart();
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
      <main className={`page-shell ${isMode2 ? 'bg-[#FDF8F5]' : ''}`}>
        <div className="page-container">
          <div className={`max-w-2xl mx-auto text-center py-16 ${isMode2 ? 'bg-white rounded-[3rem] shadow-xl border-2 border-slate-100 p-12' : ''}`}>
            <CheckCircle size={100} className="mx-auto text-emerald-500 mb-6" />
            <h1 className={`text-4xl mb-4 ${isMode2 ? 'font-black text-slate-900' : 'font-bold text-gray-800'}`}>
              Pembayaran Berhasil!
            </h1>
            <p className={`text-lg mb-4 ${isMode2 ? 'font-medium text-slate-500' : 'text-gray-600'}`}>
              Terima kasih. Pesananmu sedang kami proses.
            </p>
            {orderId && (
              <div className={`p-4 rounded-2xl inline-block mb-8 ${isMode2 ? 'bg-indigo-50 border-2 border-indigo-100' : ''}`}>
                <p className={`text-lg ${isMode2 ? 'font-medium text-indigo-900' : 'text-gray-600'}`}>
                  ID Pesanan: <span className="font-black text-indigo-600">{orderId.substring(0, 8).toUpperCase()}</span>
                </p>
              </div>
            )}
            <div>
              <Button
                onClick={() => navigate(isMode2 ? `/shop/track/${orderId}` : `/shop/track/${orderId}?counter_id=${counterId}`)}
                variant="primary"
                size="lg"
                aria-label="Lacak pesanan"
                className={isMode2 ? 'w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] font-bold rounded-xl shadow-[0_4px_0_0_#3730A3] hover:translate-y-1 hover:shadow-none' : ''}
              >
                Lacak Pesanan
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`page-shell ${isMode2 ? 'bg-[#FDF8F5]' : ''}`}>
      <div className="page-container pb-28">
        <Button
          onClick={() => navigate('/shop/cart')}
          variant="secondary"
          size="sm"
          className={`mb-6 flex items-center gap-2 ${isMode2 ? 'bg-white border-2 border-slate-100 hover:border-slate-200 shadow-sm text-slate-700 font-bold' : ''}`}
          aria-label="Kembali ke keranjang"
        >
          <ArrowLeft size={18} />
          Kembali
        </Button>

        <h1 className={`text-3xl sm:text-4xl mb-6 ${isMode2 ? 'font-black text-slate-900' : 'font-semibold text-slate-900'}`}>
          Secure Checkout 🔒
        </h1>
        {counterName && !isMode2 && (
          <p className="text-blue-800 font-medium mb-4">Counter aktif: {counterName}</p>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-4 rounded-2xl mb-8 flex items-center gap-3 font-bold" role="alert">
            <AlertCircle size={24} className="text-red-500" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          <section className="lg:col-span-3 space-y-6">
            
            {/* Contact Info */}
            <div className={`p-6 sm:p-8 ${isMode2 ? 'bg-white rounded-[2rem] shadow-sm border-2 border-slate-100' : 'surface-card'}`}>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <ShieldCheck className={isMode2 ? "text-indigo-600" : "text-gray-500"} /> Informasi Kontak
              </h2>

              <div className="space-y-5">
                {isMode2 && user && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 text-slate-500 rounded-xl font-medium cursor-not-allowed"
                    />
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="customer_name" className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-indigo-500 transition-colors outline-none font-medium"
                      placeholder="Masukkan nama"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="customer_phone" className="block text-sm font-bold text-slate-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      id="customer_phone"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-indigo-500 transition-colors outline-none font-medium"
                      placeholder="08xxxxxxxxxx"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mode 2 Only: Shipping Info */}
            {isMode2 && (
              <div className="bg-white rounded-[2rem] shadow-sm border-2 border-slate-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin className="text-pink-500" /> Alamat Pengiriman
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Lengkap</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-pink-500 transition-colors outline-none font-medium resize-none"
                      placeholder="Nama jalan, nomor rumah, RT/RW..."
                      required
                    ></textarea>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Kota/Kabupaten (Sulsel)</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-pink-500 transition-colors outline-none font-medium text-slate-700"
                        required
                      >
                        <option value="" disabled>Pilih Kota/Kabupaten</option>
                        {SULSEL_CITIES.map(city => (
                          <option key={city.name} value={city.name}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Kode Pos</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-pink-500 transition-colors outline-none font-medium"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2 Only: Shipping Method */}
            {isMode2 && (
              <div className="bg-white rounded-[2rem] shadow-sm border-2 border-slate-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Truck className="text-emerald-500" /> Metode Pengiriman
                </h2>
                {selectedCityData ? (
                  <div className="space-y-4">
                    <label className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${shippingMethod === 'kurir_toko' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input type="radio" name="shipping" value="kurir_toko" checked={shippingMethod === 'kurir_toko'} onChange={() => setShippingMethod('kurir_toko')} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                          <div>
                            <p className="font-bold text-slate-900">Kurir Toko (Diantar Langsung)</p>
                            <p className="text-sm text-slate-600 font-medium mt-1">
                              Estimasi Jarak: {selectedCityData.distance} km
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Tarif: Rp 10.000 / 5 km dari Jl. Dongi, Sidrap.
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 ml-4">{formatPrice(Math.max(1, Math.ceil(selectedCityData.distance / 5)) * 10000)}</span>
                      </div>
                    </label>

                    {selectedCityData.distance > 50 && (
                       <label className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${shippingMethod === 'ekspedisi' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input type="radio" name="shipping" value="ekspedisi" checked={shippingMethod === 'ekspedisi'} onChange={() => setShippingMethod('ekspedisi')} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                            <div>
                              <p className="font-bold text-slate-900">Ekspedisi Reguler (JNE/J&T)</p>
                              <p className="text-sm text-slate-600 font-medium mt-1">
                                Tujuan: {selectedCityData.name} (2-3 Hari)
                              </p>
                              <p className="text-xs text-green-600 font-bold mt-0.5">
                                Lebih hemat untuk jarak jauh!
                              </p>
                            </div>
                          </div>
                          <span className="font-black text-slate-900 ml-4">{formatPrice(25000)}</span>
                        </div>
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center">
                    <p className="text-slate-500 font-medium text-sm">Silakan pilih Kota/Kabupaten pada alamat pengiriman terlebih dahulu untuk melihat tarif pengiriman.</p>
                  </div>
                )}
              </div>
            )}
            
          </section>

          <aside className="lg:col-span-2">
            <div className={`p-6 sm:p-8 sticky top-24 ${isMode2 ? 'bg-[#1E1B4B] text-white rounded-[2rem] shadow-2xl overflow-hidden relative' : 'surface-card'}`}>
              {isMode2 && (
                <>
                  <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                  <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                </>
              )}
              
              <div className="relative z-10">
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isMode2 ? 'text-white border-b-2 border-indigo-800 pb-4' : 'text-slate-900'}`}>
                  <CreditCard className={isMode2 ? 'text-yellow-300' : 'text-gray-500'} /> Ringkasan Pesanan
                </h2>

                <div className={`space-y-4 mb-6 ${isMode2 ? 'text-indigo-100' : 'text-gray-600'}`}>
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                      <span className="truncate pr-4 flex-1">
                        {item.quantity}x {item.name}
                      </span>
                      <span className={`whitespace-nowrap font-bold ${isMode2 ? 'text-white' : 'text-slate-800'}`}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`pt-6 mb-8 space-y-3 ${isMode2 ? 'border-t-2 border-dashed border-indigo-800' : 'border-t-2 border-slate-200'}`}>
                  <div className="flex justify-between items-center text-sm">
                    <span className={isMode2 ? 'text-indigo-200 font-bold' : 'font-semibold text-gray-700'}>Subtotal Item</span>
                    <span className={`font-bold ${isMode2 ? 'text-white' : 'text-gray-800'}`}>{formatPrice(cartTotal)}</span>
                  </div>
                  {isMode2 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-indigo-200 font-bold">Biaya Pengiriman</span>
                      <span className="font-bold text-white">{formatPrice(shippingCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3">
                    <span className={`text-xl ${isMode2 ? 'font-bold text-indigo-200' : 'font-bold text-gray-800'}`}>Total Bayar:</span>
                    <span className={`text-3xl ${isMode2 ? 'font-black text-[#FCD34D]' : 'font-bold text-blue-600'}`}>
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  variant="success"
                  size="xl"
                  className={`w-full ${isMode2 ? 'bg-[#FCD34D] text-[#78350F] hover:bg-[#FBBF24] font-black rounded-xl shadow-[0_4px_0_0_#D97706] hover:translate-y-1 hover:shadow-none transition-all' : ''}`}
                  disabled={loading}
                  aria-label="Bayar sekarang"
                >
                  {loading ? 'Memproses...' : (isMode2 ? 'Pay Securely Now' : 'Bayar Sekarang')}
                </Button>
                
                {isMode2 && (
                  <p className="text-center text-indigo-300 text-xs mt-4 font-medium flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> Pembayaran aman dienkripsi oleh Midtrans
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200 backdrop-blur z-40 lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <Button
            type="button"
            onClick={handleSubmit}
            variant="success"
            size="lg"
            className={`w-full ${isMode2 ? 'bg-[#10B981] font-bold rounded-xl' : ''}`}
            disabled={loading}
          >
            {loading ? 'Memproses...' : `Bayar ${formatPrice(finalTotal)}`}
          </Button>
        </div>
      </div>
    </main>
  );
};
