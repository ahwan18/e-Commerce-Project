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
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Button } from './Button';

export const Navbar = ({ variant = 'default' }) => {
  const { cartCount } = useCart();
  const { isAuthenticated, signOut } = useAuth();
  const { uiMode } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (uiMode !== 'mode2') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide if scrolling down and past 100px. Show if scrolling up.
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, uiMode]);

  const handleLogout = async () => {
    await signOut();
    navigate(isAdminRoute ? '/admin/login' : '/catalog');
  };

  const homeLink = isAdminRoute ? '/admin' : (uiMode === 'mode2' ? '/' : '/menu');

  const isLandingPage = location.pathname === '/';

  return (
    <div className={uiMode === 'mode2' && isLandingPage ? `fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'}` : 'sticky top-0 z-50'}>
      <nav className={`
        ${uiMode === 'mode2'
          ? isLandingPage 
            ? "bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/50 rounded-full max-w-5xl mx-auto pointer-events-auto transition-all"
            : "bg-white border-b border-slate-100"
          : "bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"}
        ${uiMode === 'mode2' && isLandingPage ? 'px-4 py-2' : ''}
      `} aria-label="Navigasi utama">
        <div className={`container mx-auto ${uiMode === 'mode2' && isLandingPage ? 'px-2' : 'px-4'}`}>
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link
              to={homeLink}
              className={`flex items-center gap-2 ${uiMode === 'mode2' && !isAdminRoute ? 'text-indigo-900 group' : 'text-white'}`}
            >
              <div className={uiMode === 'mode2' ? 'bg-indigo-100 p-2 rounded-full text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-transform' : ''}>
                 <Store size={uiMode === 'mode2' ? 24 : 32} />
              </div>
              <div>
                <h1 className={`font-bold ${uiMode === 'mode2' ? 'text-xl tracking-tight' : 'text-2xl'}`}>Toko Mainan</h1>
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
                <div className="flex items-center gap-2 sm:gap-4">
                  {uiMode === 'mode2' && (
                    <>
                      {isAuthenticated ? (
                        <div className="flex items-center gap-1 sm:gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                          <Link
                            to="/account"
                            className="text-slate-600 hover:text-indigo-600 font-bold text-sm transition-colors flex items-center gap-1.5"
                          >
                            <User size={16} />
                            <span className="hidden sm:inline">Account</span>
                          </Link>
                          <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>
                          <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-red-500 font-bold text-sm transition-colors flex items-center gap-1"
                            aria-label="Logout"
                          >
                            <LogOut size={16} />
                          </button>
                        </div>
                      ) : (
                        <Link
                          to="/login"
                          className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-1.5"
                        >
                          <User size={16} />
                          <span className="hidden sm:inline">Sign In</span>
                        </Link>
                      )}
                    </>
                  )}

                  <Link to="/shop/cart">
                    <button
                      className={`relative p-2.5 rounded-full transition-transform hover:scale-110 active:scale-95 shadow-sm min-h-11 min-w-11 flex items-center justify-center ${
                        uiMode === 'mode2' 
                          ? 'bg-[#FCD34D] text-[#78350F] shadow-[0_4px_0_0_#D97706] hover:shadow-none hover:translate-y-1' 
                          : 'bg-white text-blue-700 hover:bg-blue-50'
                      }`}
                      aria-label="Buka keranjang"
                    >
                      <ShoppingCart size={20} />
                      {cartCount > 0 && (
                        <span className={`absolute -top-2 -right-2 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ${uiMode === 'mode2' ? 'bg-pink-500 shadow-md animate-bounce' : 'bg-red-500'}`}>
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
    </div>
  );
};
