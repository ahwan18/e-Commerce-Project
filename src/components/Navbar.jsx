/**
 * Navbar Component
 *
 * Main navigation bar for the application.
 * Different views for customer and admin.
 *
 * You CAN modify the design and add new navigation items.
 */

import { ShoppingCart, Store, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export const Navbar = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm sticky top-0 z-50" aria-label="Navigasi utama">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to={isAdminRoute ? '/admin' : '/menu'}
            className="flex items-center gap-2 text-white"
          >
            <Store size={32} />
            <div>
              <h1 className="text-2xl font-bold">Toko Mainan</h1>
              <p className="text-xs text-blue-100">Jalan Dongi</p>
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
              <Link to="/shop/cart">
                <button
                  className="relative bg-white text-blue-700 p-3 rounded-full hover:bg-blue-50 transition-colors shadow-sm min-h-11 min-w-11"
                  aria-label="Buka keranjang"
                >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
