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

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} /> 
        <Route path="/product/:id" element={<ProductDetails />} /> 
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/userTables" element={<UserTables />} />
        <Route path="/adminTables" element={<AdminTables />} />

        <Route
          path="/admin/products"
          element={
            <DashboardLayout>
              <ProductsDashboard />
            </DashboardLayout>
          }
        />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Provider store={store}> {/* 🔹 Provider للـ Redux */}
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
