// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
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

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {isAdminRoute ? (
        <DashboardLayout>
          <Routes>
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<ProductsDashboard />} />
            <Route path="/admin/tables" element={<AdminTables />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </Routes>
        </DashboardLayout>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/tables" element={<UserTables />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<h1 className="text-center mt-20 text-2xl">404 - Page Not Found</h1>} />
        </Routes>
      )}

      {!isAdminRoute && <Footer />}
    </>
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
