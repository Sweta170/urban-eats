import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import LandingPage from "./pages/LandingPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

import Layout from "./components/layout/Layout";
import { ThemeProvider } from "./context/ThemeContext";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RestaurantDashboardPage from "./pages/RestaurantDashboardPage";
import FoodDetailsPage from "./pages/FoodDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import NotFoundPage from "./pages/NotFoundPage";
import { getAccessToken, getUserRole } from "./utils/auth";

function isAuthenticated() {
  return !!getAccessToken();
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  return isAuthenticated() && getUserRole() === 'admin' ? children : <Navigate to="/" />;
}

function RestaurantRoute({ children }) {
  return isAuthenticated() && getUserRole() === 'restaurant' ? children : <Navigate to="/" />;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route
              path="/menu"
              element={
                <PrivateRoute>
                  <MenuPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/restaurant-dashboard"
              element={
                <RestaurantRoute>
                  <RestaurantDashboardPage />
                </RestaurantRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/food/:id"
              element={
                <PrivateRoute>
                  <FoodDetailsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <PrivateRoute>
                  <OrderSuccessPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/order-tracking/:id"
              element={
                <PrivateRoute>
                  <OrderTrackingPage />
                </PrivateRoute>
              }
            />
            <Route path="/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider >
  );
}

export default App;