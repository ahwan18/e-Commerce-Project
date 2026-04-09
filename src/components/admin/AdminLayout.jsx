import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  QrCode,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Button';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/counters', label: 'Counters', icon: QrCode },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout = ({ title, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="hidden md:flex md:w-64 lg:w-72 bg-white border-r border-slate-200 p-4 flex-col">
          <div className="px-2 py-3 mb-4">
            <h1 className="text-xl font-semibold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-500">Toko Mainan</p>
          </div>
          <nav className="space-y-1" aria-label="Sidebar navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500">Kelola operasional counter dan pesanan</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-700">Admin</p>
                <p className="text-xs text-slate-500">{user?.email || '-'}</p>
              </div>
              <Button
                onClick={handleSignOut}
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
                aria-label="Keluar dari admin panel"
              >
                <LogOut size={16} />
                Keluar
              </Button>
            </div>
          </header>

          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};
