import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProfilePage from "./pages/ProfilePage"; // استدعي البروفايل هنا

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProfilePage />} /> {/* خلى الصفحة الرئيسية بروفايل */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
