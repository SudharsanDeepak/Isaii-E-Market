import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import CartPage from './pages/consumer/CartPage';
import CheckoutPage from './pages/consumer/CheckoutPage';
import OrdersPage from './pages/consumer/OrdersPage';
import OrderDetailPage from './pages/consumer/OrderDetailPage';
import ProfilePage from './pages/consumer/ProfilePage';

import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerAddProductPage from './pages/seller/SellerAddProductPage';
import SellerEditProductPage from './pages/seller/SellerEditProductPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerInventoryPage from './pages/seller/SellerInventoryPage';
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#050505] text-[#F8FAFC]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['consumer']}>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerProductsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products/add"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerAddProductPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products/edit/:id"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerEditProductPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/orders"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/inventory"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerInventoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerAnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
