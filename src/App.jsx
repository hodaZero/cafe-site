import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import Menu from "./pages/Menu"; 
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} /> 
        <Route path="/product/:id" element={<ProductDetails />} /> 
      </Routes>
      <CartPage />
      <CheckoutPage />
    </Router>
  );
}

export default App;
