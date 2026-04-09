/**
 * OrderTracking View (Customer)
 *
 * Displays order status and tracking information.
 * Customers can track their orders using order ID without authentication.
 *
 * NO business logic should be in this component - only UI.
 * All logic is handled through controllers.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { formatPrice } from '../../utils/helpers';
import * as TrackingController from '../../controllers/trackingController';

export const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderId);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState(orderId || '');

  const loadOrder = async (id) => {
    if (!id.trim()) {
      setError('Masukkan ID pesanan');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const orderData = await TrackingController.getOrderTracking(id);
      setOrder(orderData);
    } catch (err) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadOrder(searchId);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      paid: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} />;
      case 'paid':
        return <Package size={20} />;
      case 'completed':
        return <CheckCircle size={20} />;
      case 'cancelled':
        return <AlertCircle size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/shop')}
          variant="secondary"
          size="sm"
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Kembali ke Toko
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Lacak Pesanan
            </h1>
            <p className="text-gray-600 mb-6">
              Masukkan ID pesanan Anda untuk melihat status dan estimasi waktu penyelesaian
            </p>

            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Masukkan ID pesanan (cth: 550e8400-e29b-41d4-a716-446655440000)"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Search size={18} />
                {loading ? 'Mencari...' : 'Cari'}
              </Button>
            </form>

            {error && (
              <div className="mt-6 bg-red-100 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl">
                <p className="font-semibold">Pesanan tidak ditemukan</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
          </div>

          {loading && !order && (
            <Loading message="Mencari pesanan Anda..." />
          )}

          {order && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Pesanan #{order.id.substring(0, 8).toUpperCase()}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className={`px-6 py-3 rounded-full border-2 font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status === 'pending' && 'Menunggu Pembayaran'}
                    {order.status === 'paid' && 'Sedang Diproses'}
                    {order.status === 'completed' && 'Selesai'}
                    {order.status === 'cancelled' && 'Dibatalkan'}
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {order.status === 'pending' && 'Pesanan Anda sedang menunggu pembayaran'}
                  {order.status === 'paid' && 'Pesanan Anda sedang diproses oleh tim kami'}
                  {order.status === 'completed' && 'Pesanan Anda telah selesai dan siap diambil'}
                  {order.status === 'cancelled' && 'Pesanan Anda telah dibatalkan'}
                </p>

                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Nama Pelanggan</p>
                    <p className="text-gray-900 font-bold mt-1">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Nomor Telepon</p>
                    <p className="text-gray-900 font-bold mt-1">{order.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Pesanan</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                  {order.estimatedTime && order.estimatedTime.isEstimate && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Estimasi Selesai</p>
                      <p className="text-lg font-bold text-orange-600 mt-1">
                        {order.estimatedTime.remainingHours} jam lagi
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Timeline Pesanan
                </h3>
                <div className="space-y-4">
                  {order.statusTimeline.map((step, index) => (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                            step.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          {step.completed ? '✓' : index + 1}
                        </div>
                        {index < order.statusTimeline.length - 1 && (
                          <div
                            className={`w-1 h-12 ${
                              step.completed ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="font-bold text-gray-900">{step.label}</p>
                        {step.date && (
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(step.date).toLocaleDateString('id-ID', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.order_items && order.order_items.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Detail Produk
                  </h3>
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                        {item.product.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity}x {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatPrice(item.quantity * item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!order && !loading && !error && (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg">
                Cari pesanan Anda menggunakan ID pesanan untuk melihat statusnya
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
