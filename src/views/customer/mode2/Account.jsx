import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Phone, Mail, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/Button';
import { Loading } from '../../../components/Loading';
import * as OrderController from '../../../controllers/orderController';
import { formatPrice } from '../../../utils/helpers';

export const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSearchOrders = async (e) => {
    e.preventDefault();
    if (!phoneSearch) return;

    setSearchLoading(true);
    try {
      const allOrders = await OrderController.fetchAllOrders();
      const userOrders = allOrders.filter(o => o.customer_phone === phoneSearch);
      setOrders(userOrders);
      if (userOrders.length === 0) {
        alert('No orders found for this phone number.');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      alert('Failed to load orders.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/catalog');
  };

  if (loading) return <Loading message="Loading account..." />;

  return (
    <main className="page-shell">
      <div className="page-container pb-24">
        <div className="max-w-4xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <User size={40} />
              </div>
              <div >
                <h1 className="text-3xl font-black text-slate-900">My Account</h1>
                <p className="text-slate-500 font-medium">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="danger"
              className="flex items-center gap-2"
            >
              <LogOut size={18} /> Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-indigo-600" /> Profile Info
                </h2>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Email</p>
                    <p className="text-slate-700 font-medium flex items-center gap-2">
                      <Mail size={14} /> {user?.email}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Status</p>
                    <p className="text-indigo-600 font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                      Verified Customer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Package size={20} className="text-indigo-600" /> My Orders
                  </h2>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Package size={32} />
                    </div>
                    <p className="text-slate-500 font-medium mb-6">
                      No orders found. Search for your orders using your phone number.
                    </p>

                    <form onSubmit={handleSearchOrders} className="flex gap-2 max-w-sm mx-auto">
                      <div className="relative flex-grow">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          placeholder="Enter phone number..."
                          value={phoneSearch}
                          onChange={(e) => setPhoneSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-500 font-medium transition-all"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={searchLoading}
                        className="px-6"
                      >
                        {searchLoading ? '...' : 'Find'}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 rounded-2xl border-2 border-slate-50 hover:border-indigo-200 transition-all bg-slate-50/50 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            order.status === 'paid' ? 'bg-green-100 text-green-600' :
                            order.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            <Package size={20} />
                          </div>
                          <div >
                            <p className="font-bold text-slate-900">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-black text-slate-900">{formatPrice(order.total_amount)}</p>
                            <p className={`text-xs font-bold uppercase ${
                              order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                            }`}>{order.status}</p>
                          </div>
                          <Button
                            onClick={() => navigate(`/shop/track/${order.id}`)}
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                          >
                            Details <ChevronRight size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 text-center">
                       <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setOrders([])}
                       >
                         Search other number
                       </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
