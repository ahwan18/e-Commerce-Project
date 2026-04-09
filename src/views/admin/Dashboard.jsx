/**
 * Dashboard View (Admin)
 *
 * Main admin dashboard showing statistics and recent orders.
 *
 * NO business logic should be in this component - only UI.
 * All logic is handled through controllers.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  DollarSign,
  QrCode,
  Clock3,
} from 'lucide-react';
import { Loading } from '../../components/Loading';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import * as OrderController from '../../controllers/orderController';
import * as CounterController from '../../controllers/counterController';
import { StatusBadge } from '../../components/admin/StatusBadge';

export const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, orders, countersData] = await Promise.all([
        OrderController.fetchOrderStatistics(),
        OrderController.fetchRecentOrders(10),
        CounterController.fetchCounters(),
      ]);
      setStatistics(stats);
      setRecentOrders(orders);
      setCounters(countersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Memuat dashboard..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl" role="alert">
        {error}
      </div>
    );
  }

  const activeSessions = counters.filter((counter) => counter.is_locked).length;
  const totalCounters = counters.length;
  const lockedCounters = counters.filter((counter) => counter.is_locked);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1">
          Ringkasan Operasional
        </h2>
        <p className="text-slate-600">
          Fokus pada counter aktif, sesi berjalan, dan order terbaru.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-600 text-sm font-semibold">Total Pesanan</h3>
            <ShoppingCart size={18} className="text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{statistics.totalOrders}</p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-600 text-sm font-semibold">Total Penjualan</h3>
            <DollarSign size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">{formatPrice(statistics.totalSales)}</p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-600 text-sm font-semibold">Pending</h3>
            <Clock3 size={18} className="text-amber-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{statistics.pendingOrders}</p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-600 text-sm font-semibold">Sesi Aktif</h3>
            <QrCode size={18} className="text-orange-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{activeSessions}</p>
          <p className="text-xs text-slate-500 mt-1">dari {totalCounters} counter</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/admin/counters"
          className="surface-card p-5 hover:shadow-md transition-shadow"
        >
          <QrCode size={24} className="mb-3 text-orange-600" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Kelola Counter</h3>
          <p className="text-slate-600 text-sm">Atur QR counter, sesi aktif, dan status operasional.</p>
        </Link>

        <Link
          to="/admin/orders"
          className="surface-card p-5 hover:shadow-md transition-shadow"
        >
          <ShoppingCart size={24} className="mb-3 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Kelola Pesanan</h3>
          <p className="text-slate-600 text-sm">Pantau order berdasarkan counter dan sesi.</p>
        </Link>

        <Link
          to="/admin/products"
          className="surface-card p-5 hover:shadow-md transition-shadow"
        >
          <Package size={24} className="mb-3 text-emerald-600" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Kelola Produk</h3>
          <p className="text-slate-600 text-sm">Update katalog dan stok produk.</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="surface-card overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Counter Sedang Digunakan</h3>
          </div>
          <div className="p-5">
            {lockedCounters.length === 0 ? (
              <p className="text-sm text-slate-500">Tidak ada counter yang sedang dipakai.</p>
            ) : (
              <div className="space-y-3">
                {lockedCounters.map((counter) => (
                  <div key={counter.id} className="border border-slate-200 rounded-xl p-3">
                    <p className="text-sm font-semibold text-slate-900">{counter.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{counter.current_session_id}</p>
                    <div className="mt-2">
                      <StatusBadge tone="warning">In Use</StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="surface-card overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Pesanan Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Counter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Belum ada pesanan
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {order.counter?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
