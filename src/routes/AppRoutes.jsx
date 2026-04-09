/**
 * Application Routes
 *
 * Defines all routes for the application.
 * Separates customer routes from admin routes.
 *
 * You CAN add new routes here as needed.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CounterGate } from '../components/CounterGate';
import { AdminLayout } from '../components/admin/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { Catalog } from '../views/customer/Catalog';
import { ProductDetail } from '../views/customer/ProductDetail';
import { Cart } from '../views/customer/Cart';
import { Checkout } from '../views/customer/Checkout';
import { OrderTracking } from '../views/customer/OrderTracking';
import { OrderStatus } from '../views/customer/OrderStatus';

import { Login } from '../views/admin/Login';
import { Dashboard } from '../views/admin/Dashboard';
import { ManageProducts } from '../views/admin/ManageProducts';
import { ManageCategories } from '../views/admin/ManageCategories';
import { Orders } from '../views/admin/Orders';
import { ManageCounters } from '../views/admin/ManageCounters';
import { Settings } from '../views/admin/Settings';

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route
          path="/menu"
          element={
            <>
              <Navbar />
              <Catalog />
            </>
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
        <Route
          path="/order-status"
          element={
            <CounterGate>
              <OrderStatus />
            </CounterGate>
          }
        />
        <Route path="/shop" element={<Navigate to="/menu" replace />} />

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

        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </>
  );
};
