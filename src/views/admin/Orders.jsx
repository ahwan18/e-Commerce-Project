/**
 * Orders View (Admin)
 *
 * View all orders and manage order status.
 *
 * NO business logic should be in this component - only UI.
 * All logic is handled through controllers.
 */

import { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Loading } from '../../components/Loading';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import { ORDER_STATUSES, getOrderStatusMeta, normalizeOrderStatus } from '../../utils/orderStatus';
import * as OrderController from '../../controllers/orderController';

const getDisplayOrderNumber = (order) =>
  order.order_number || `ORDER-${order.id.substring(0, 8).toUpperCase()}`;

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderController.fetchAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await OrderController.updateStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      alert('Gagal mengubah status: ' + err.message);
    }
  };

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const fromTime = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const toTime = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null;

    return orders.filter((order) => {
      const createdTime = new Date(order.created_at).getTime();
      const orderNumber = getDisplayOrderNumber(order);
      const productNames = order.order_items
        ?.map((item) => item.product?.name)
        .filter(Boolean)
        .join(' ') || '';
      const searchableText = [
        orderNumber,
        order.id,
        order.customer_name,
        order.customer_phone,
        order.shipping_city,
        order.shipping_address,
        order.counter?.name,
        productNames,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesStatus =
        statusFilter === 'all' || normalizeOrderStatus(order.status) === statusFilter;
      const matchesType =
        orderTypeFilter === 'all' ||
        (orderTypeFilter === 'delivery' && order.shipping_address) ||
        (orderTypeFilter === 'counter' && !order.shipping_address);
      const matchesDateFrom = !fromTime || createdTime >= fromTime;
      const matchesDateTo = !toTime || createdTime <= toTime;

      return matchesSearch && matchesStatus && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [dateFrom, dateTo, orderTypeFilter, orders, searchTerm, statusFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setOrderTypeFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const showShippingColumn = orderTypeFilter !== 'counter';
  const showCounterColumn = orderTypeFilter !== 'delivery';
  const visibleColumnCount = 7 + Number(showShippingColumn) + Number(showCounterColumn);

  if (loading) {
    return <Loading message="Memuat pesanan..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl" role="alert">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="surface-card p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-blue-600" />
                Filter Pesanan
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Menampilkan {filteredOrders.length} dari {orders.length} pesanan
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <X size={16} />
              Reset Filter
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="md:col-span-2 xl:col-span-2">
              <span className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                Cari
              </span>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari no. TOY, nama, telepon, kota, produk..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>
            </label>

            <label>
              <span className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                Status
              </span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                Tipe
              </span>
              <select
                value={orderTypeFilter}
                onChange={(event) => setOrderTypeFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="all">Semua Tipe</option>
                <option value="delivery">Pengiriman</option>
                <option value="counter">Counter / Pickup</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3 md:col-span-2 xl:col-span-1">
              <label>
                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                  Dari
                </span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                />
              </label>
              <label>
                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                  Sampai
                </span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    ID Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Pelanggan
                  </th>
                  {showShippingColumn && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Pengiriman
                    </th>
                  )}
                  {showCounterColumn && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Counter
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumnCount}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Tidak ada pesanan yang sesuai filter
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold font-mono text-gray-900">
                          {getDisplayOrderNumber(order)}
                        </div>
                        {!order.order_number && (
                          <div className="text-xs text-amber-600 font-semibold mt-1">
                            data lama
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer_phone}
                        </div>
                      </td>
                      {showShippingColumn && (
                        <td className="px-6 py-4 min-w-64">
                          {order.shipping_address ? (
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {order.shipping_city || '-'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.shipping_address}
                                {order.shipping_postal_code ? `, ${order.shipping_postal_code}` : ''}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {order.shipping_method || '-'} · Ongkir {formatPrice(order.shipping_cost || 0)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                      )}
                      {showCounterColumn && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.counter?.name || '-'}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {order.order_items?.length || 0} item
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getOrderStatusMeta(order.status).label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={normalizeOrderStatus(order.status)}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="text-sm border border-slate-300 rounded-lg px-3 py-2 min-h-11 bg-white font-semibold text-slate-700"
                          aria-label={`Ubah status pesanan ${order.id}`}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </div>
    </section>
  );
};
