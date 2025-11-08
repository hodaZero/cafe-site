import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between">
      <div className="text-xl font-bold">Coffee Site</div>
      <nav className="space-x-4">
        <Link to="/" className="hover:text-yellow-400">Login</Link>
        <Link to="/register" className="hover:text-yellow-400">Register</Link>
      </nav>
    </header>
  );
}

export default Header;
