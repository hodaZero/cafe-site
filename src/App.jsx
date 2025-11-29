import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

// Pages
import AuthPage from "./pages/Auth/AuthPage";  
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import Menu from "./pages/Menu";
import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";
import UserTables from "./pages/UserTables";
import AdminOrders from "./pages/AdminOrders";
import Favorites from "./pages/Favorites";
import AdminTables from "./pages/AdminTable";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ProductsDashboard from "./pages/Dashboard/ProductsDashboard";
import Orders from "./pages/Orders";
import AdminProfile from "./pages/Dashboard/AdminProfile";
import ForgotPassword from "./pages/Auth/ForgotPssword";

// ⬅⬅⬅  إضافة صفحة الـ Test Analytics
import TestAnalytics from "./pages/TestAnalytics";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" />;
}

function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  return user && role === "admin" ? children : <Navigate to="/" />;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <NotificationProvider>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* صفحة موحدة للـ Login + Register */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Protected */}
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
              <Favorites />
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
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/tables"
          element={
            <PrivateRoute>
              <UserTables />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminOrders />
              </DashboardLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <DashboardLayout>
                <ProductsDashboard />
              </DashboardLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminTables />
              </DashboardLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminProfile />
              </DashboardLayout>
            </AdminRoute>
          }
        />

        {/* صفحة اختبار الأناليتكس */}
        <Route path="/test-analytics" element={<TestAnalytics />} />

        <Route path="*" element={<h1 className="text-center mt-20 text-2xl">404</h1>} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}
