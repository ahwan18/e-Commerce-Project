/**
 * Navbar Component
 *
 * Main navigation bar for the application.
 * Different views for customer and admin.
 *
 * You CAN modify the design and add new navigation items.
 */

import { ShoppingCart, Store, LogOut, LayoutDashboard, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Button } from './Button';

export const Navbar = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, signOut } = useAuth();
  const { uiMode } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = async () => {
    await signOut();
    navigate(isAdminRoute ? '/admin/login' : '/catalog');
  };

  const homeLink = isAdminRoute ? '/admin' : (uiMode === 'mode2' ? '/' : '/menu');

  return (
    <nav className={uiMode === 'mode2' ? "bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100" : "bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm sticky top-0 z-50"} aria-label="Navigasi utama">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to={homeLink}
            className={`flex items-center gap-2 ${uiMode === 'mode2' && !isAdminRoute ? 'text-indigo-900' : 'text-white'}`}
          >
            <Store size={32} className={uiMode === 'mode2' && !isAdminRoute ? 'text-indigo-600' : ''} />
            <div>
              <h1 className="text-2xl font-bold">Toko Mainan</h1>
              {uiMode === 'mode1' && <p className="text-xs text-blue-100">Jalan Dongi</p>}
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {isAdminRoute ? (
              <>
                {isAuthenticated && (
                  <>
                    <Link to="/admin">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <LayoutDashboard size={18} />
                        <span className="hidden sm:inline">Dashboard</span>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      <span className="hidden sm:inline">Keluar</span>
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                {uiMode === 'mode2' && (
                  <>
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors flex items-center gap-1 mr-2"
                      >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Logout</span>
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors flex items-center gap-1 mr-2"
                      >
                        <User size={18} />
                        <span className="hidden sm:inline">Sign In</span>
                      </Link>
                    )}
                  </>
                )}

                <Link to="/shop/cart">
                  <button
                    className={`relative p-2.5 rounded-full transition-colors shadow-sm min-h-11 min-w-11 flex items-center justify-center ${
                      uiMode === 'mode2' 
                        ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                        : 'bg-white text-blue-700 hover:bg-blue-50'
                    }`}
                    aria-label="Buka keranjang"
                  >
                    <ShoppingCart size={22} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
