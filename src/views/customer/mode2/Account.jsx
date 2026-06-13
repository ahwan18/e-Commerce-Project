import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Mail, LogOut, ChevronRight, ShieldCheck, Gift, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/Button';
import { Loading } from '../../../components/Loading';
import * as OrderController from '../../../controllers/orderController';
import { formatPrice } from '../../../utils/helpers';
import { getOrderStatusMeta } from '../../../utils/orderStatus';

export const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialOrders = useCallback(async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const userOrders = await OrderController.fetchUserOrders(user.id);
        setOrders(userOrders);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInitialOrders();
  }, [fetchInitialOrders]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  if (loading) return <Loading message="Loading your account..." />;

  return (
    <main className="page-shell bg-[#FDF8F5] min-h-screen pt-12 pb-24">
      {/* Decorative Header Background */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-900 to-indigo-800 z-0 rounded-b-[4rem] overflow-hidden hidden md:block">
        <div className="absolute top-[-20%] right-[-5%] w-96 h-96 bg-[#EC4899] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-72 h-72 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <div className="page-container relative z-10">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pt-8 md:pt-16">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-xl border-4 border-white/20 rotate-[-5deg]">
                <User size={48} className="drop-shadow-sm" />
              </div>
              <div >
                <h1 className="text-4xl font-black text-slate-900 md:text-white drop-shadow-md">My Dashboard</h1>
                <p className="text-slate-500 md:text-indigo-200 font-bold mt-1 tracking-wide">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="danger"
              className="flex items-center gap-2 shadow-lg bg-red-500 hover:bg-red-600 font-bold rounded-xl"
            >
              <LogOut size={18} /> Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Sidebar: Profile & Quick Links */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-slate-100">
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <User size={20} className="text-pink-500" /> Account Details
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center gap-1"><Mail size={12}/> Email Address</p>
                    <p className="text-slate-700 font-bold truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                    <div >
                      <p className="text-xs text-indigo-400 font-bold uppercase mb-1 flex items-center gap-1"><ShieldCheck size={12}/> Account Status</p>
                      <p className="text-indigo-700 font-black">Verified Member</p>
                    </div>
                    <span className="relative flex h-4 w-4 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 shadow-sm"></span>
                    </span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-xs text-emerald-500 font-bold uppercase mb-1 flex items-center gap-1"><Gift size={12}/> Toy Points</p>
                    <p className="text-emerald-700 font-black text-2xl">0 <span className="text-sm font-bold text-emerald-600">pts</span></p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">Buy toys to earn points!</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-slate-100 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <MapPin size={20} className="text-emerald-500" /> Address Book
                  </h2>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">Coming Soon</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Save your shipping addresses here for faster checkout in the future.</p>
              </div>
            </div>

            {/* Right Main Area: Orders Section */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-slate-100 min-h-[500px]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-50">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Package size={24} className="text-indigo-600" /> Order History
                  </h2>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <Package size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No orders yet!</h3>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto mb-8">
                      Looks like you haven't started your toy adventure. Let's find something amazing!
                    </p>
                    <Button
                      onClick={() => navigate('/catalog')}
                      variant="primary"
                      size="lg"
                      className="px-8 rounded-full shadow-lg"
                    >
                      Start Shopping 🚀
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const status = getOrderStatusMeta(order.status);
                      return (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl border-2 border-slate-50 hover:border-indigo-200 transition-all bg-slate-50/50 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${status.iconClass}`}>
                            <Package size={20} />
                          </div>
                          <div >
                            <p className="font-black text-slate-900">#{order.order_number || order.id.slice(0, 8)}</p>
                            <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-black text-slate-900">{formatPrice(order.total_amount)}</p>
                            <p className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-bold uppercase ${status.colorClass}`}>
                              {status.shortLabel}
                            </p>
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
                    );
                    })}
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
