import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Phone, Mail, LogOut, ChevronRight, Search, MapPin, Heart, ShieldCheck, Gift } from 'lucide-react';
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
  
  // We keep phone search as a fallback since the legacy system used phone numbers
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchInitialOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all orders (in a real app, this should be a backend query filtered by user_id)
      const allOrders = await OrderController.fetchAllOrders();
      
      // Try to find orders matching the user's email first (if your checkout saves email)
      // Since current checkout only saves Name and Phone, we might not find any by email.
      // But we set up the state so they can search by phone.
      setOrders([]); 
    } catch (err) {
      console.error('Error fetching initial orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialOrders();
  }, [fetchInitialOrders]);

  const handleSearchOrders = async (e) => {
    e.preventDefault();
    if (!phoneSearch) return;

    setSearchLoading(true);
    setHasSearched(true);
    try {
      const allOrders = await OrderController.fetchAllOrders();
      // Filter by the phone number they provided
      const userOrders = allOrders.filter(o => o.customer_phone === phoneSearch);
      setOrders(userOrders);
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
              <div>
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
                    <div>
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

              {/* Dummy Address Book for UI Completeness */}
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
                    <Package size={28} className="text-indigo-600" /> Order History
                  </h2>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 px-4 max-w-lg mx-auto">
                    <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-indigo-300 shadow-inner rotate-3">
                      <Search size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-3">Find Your Past Orders</h3>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                      To keep your data secure, our system requires the exact phone number used during checkout to retrieve your order history.
                    </p>

                    <form onSubmit={handleSearchOrders} className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-grow">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                        <input
                          type="text"
                          placeholder="e.g. 081234567890"
                          value={phoneSearch}
                          onChange={(e) => setPhoneSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-slate-700"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={searchLoading || !phoneSearch}
                        className="py-4 px-8 bg-[#4F46E5] hover:bg-[#4338CA] shadow-[0_4px_0_0_#3730A3] hover:shadow-none hover:translate-y-1 transition-all rounded-xl font-black text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {searchLoading ? 'Searching...' : 'Link Orders'}
                      </Button>
                    </form>
                    
                    {hasSearched && orders.length === 0 && !searchLoading && (
                      <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl font-bold border-2 border-red-100 inline-flex items-center gap-2">
                        <AlertCircle size={20} /> No orders found for {phoneSearch}. 
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Found {orders.length} order(s) for {phoneSearch}
                      </p>
                      <button 
                        onClick={() => { setOrders([]); setPhoneSearch(''); setHasSearched(false); }}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg"
                      >
                        Change Number
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-5 sm:p-6 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-300 hover:shadow-lg transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between group gap-6"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm ${
                              order.status === 'paid' ? 'bg-emerald-100 text-emerald-600' :
                              order.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                              'bg-amber-100 text-amber-600'
                            }`}>
                              <Package size={28} />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-xl tracking-tight mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                              <p className="text-sm font-bold text-slate-400">
                                {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} • {order.items?.length || 0} Items
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t-2 sm:border-t-0 border-slate-50 pt-4 sm:pt-0">
                            <div className="text-left sm:text-right">
                              <p className="font-black text-slate-900 text-2xl mb-1">{formatPrice(order.total_amount)}</p>
                              <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest ${
                                order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                                order.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <Button
                              onClick={() => navigate(`/shop/track/${order.id}`)}
                              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-[0_4px_0_0_#334155] hover:shadow-none hover:translate-y-1 transition-all px-5 py-3 flex items-center gap-2 font-bold h-fit"
                            >
                              Track <ChevronRight size={18} />
                            </Button>
                          </div>
                        </div>
                      ))}
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
