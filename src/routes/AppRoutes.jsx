/**
 * Application Routes
 *
 * Defines all routes for the application.
 * Separates customer routes from admin routes.
 *
 * You CAN add new routes here as needed.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

import { Navbar } from '../components/Navbar';
import { CounterGate } from '../components/CounterGate';
import { AdminLayout } from '../components/admin/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Mode 1 (Counter) Views
import { Catalog } from '../views/customer/Catalog';
import { ProductDetail } from '../views/customer/ProductDetail';
import { Cart } from '../views/customer/Cart';
import { Checkout } from '../views/customer/Checkout';
import { OrderTracking } from '../views/customer/OrderTracking';

// Mode 2 (Standard E-commerce) Views
import { LandingPage as Mode2Landing } from '../views/customer/mode2/LandingPage';
import { Catalog as Mode2Catalog } from '../views/customer/mode2/Catalog';
import { CustomerLogin as Mode2Login } from '../views/customer/mode2/CustomerLogin';
import { CustomerRegister as Mode2Register } from '../views/customer/mode2/CustomerRegister';
import { Account as Mode2Account } from '../views/customer/mode2/Account';
import { CustomerProtectedRoute } from './CustomerProtectedRoute';

// Admin Views
import { Login } from '../views/admin/Login';
import { Dashboard } from '../views/admin/Dashboard';
import { ManageProducts } from '../views/admin/ManageProducts';
import { ManageCategories } from '../views/admin/ManageCategories';
import { Orders } from '../views/admin/Orders';
import { ManageCounters } from '../views/admin/ManageCounters';
import { Settings } from '../views/admin/Settings';

export const AppRoutes = () => {
  const { uiMode, isLoading } = useSettings();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading Application...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={uiMode === 'mode2' ? <><Navbar /><Mode2Landing /></> : <Navigate to="/menu" replace />} />

        {/* =========================================
            MODE 1: COUNTER / QR FLOW ROUTES 
            ========================================= */}
        {uiMode === 'mode1' && (
          <>
            <Route
              path="/menu"
              element={
                <CounterGate>
                  <>
                    <Navbar />
                    <Catalog />
                  </>
                </CounterGate>
              }
            />
            <Route
              path="/shop/product/:id"
              element={
                <CounterGate>
                  <>
                    <Navbar />
                    <ProductDetail />
                  </>
                </CounterGate>
              }
            />
            <Route
              path="/shop/cart"
              element={
                <CounterGate>
                  <>
                    <Navbar />
                    <Cart />
                  </>
                </CounterGate>
              }
            />
            <Route
              path="/shop/checkout"
              element={
                <CounterGate>
                  <>
                    <Navbar />
                    <Checkout />
                  </>
                </CounterGate>
              }
            />
            <Route
              path="/shop/track/:orderId"
              element={
                <CounterGate>
                  <>
                    <Navbar />
                    <OrderTracking />
                  </>
                </CounterGate>
              }
            />
            <Route
              path="/shop/track"
              element={
                <CounterGate>
                  <>
                    <Navbar />
                    <OrderTracking />
                  </>
                </CounterGate>
              }
            />
            <Route path="/shop" element={<Navigate to="/menu" replace />} />
          </>
        )}

        {/* =========================================
            MODE 2: STANDARD E-COMMERCE ROUTES 
            ========================================= */}
        {uiMode === 'mode2' && (
          <>
            <Route path="/catalog" element={<><Navbar /><Mode2Catalog /></>} />
            <Route path="/shop/product/:id" element={<><Navbar /><ProductDetail /></>} />
            <Route path="/login" element={<Mode2Login />} />
            <Route path="/register" element={<Mode2Register />} />
            
            {/* Customer Protected Routes */}
            <Route path="/shop/cart" element={
              <CustomerProtectedRoute>
                <Navbar /><Cart />
              </CustomerProtectedRoute>
            } />
            <Route path="/shop/checkout" element={
              <CustomerProtectedRoute>
                <Navbar /><Checkout />
              </CustomerProtectedRoute>
            } />
            <Route path="/shop/track/:orderId" element={
              <CustomerProtectedRoute>
                <Navbar /><OrderTracking />
              </CustomerProtectedRoute>
            } />
            <Route path="/shop/track" element={
              <CustomerProtectedRoute>
                <Navbar /><OrderTracking />
              </CustomerProtectedRoute>
            } />
            <Route path="/account" element={
              <CustomerProtectedRoute>
                <Navbar /><Mode2Account />
              </CustomerProtectedRoute>
            } />

            <Route path="/menu" element={<Navigate to="/catalog" replace />} />
            <Route path="/shop" element={<Navigate to="/catalog" replace />} />
          </>
        )}

        {/* =========================================
            ADMIN ROUTES (Always available)
            ========================================= */}
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout title="Dashboard">
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminLayout title="Products">
                <ManageProducts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <AdminLayout title="Categories">
                <ManageCategories />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminLayout title="Orders">
                <Orders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/counters"
          element={
            <ProtectedRoute>
              <AdminLayout title="Counters">
                <ManageCounters />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminLayout title="Settings">
                <Settings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={uiMode === 'mode2' ? "/" : "/menu"} replace />} />
      </Routes>
    </>
  );
};
