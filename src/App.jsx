import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProfilePage from "./pages/ProfilePage"; 
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import Menu from "./pages/Menu"; 
import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";
import UserTables from "./pages/UserTables";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AdminOrders from "./pages/AdminOrders";
import Favorites from "./pages/Favorites";

import AdminTables from "./pages/AdminTable";


function App() {

  return (
    <Router>
      <Navbar />
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
        


        <Route path="/adminTables" element={<AdminTables/>} />

      </Routes>
      <UserTables></UserTables>
      <Footer/>

    </Router>
  );
}


export default App;
