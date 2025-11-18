import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/coffee_logo.png";
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from "react-router-dom";

// ⬅️ إضافة Redux
import { useSelector } from "react-redux";
// ⬅️ Firebase auth
import { auth } from "../firebase/firebaseConfig";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // ⬅️ عداد الفيفوريت من Redux
  const favoritesCount = useSelector((state) => state.favorite.favorites.length);

  const links = ["HOME", "About", "LOGIN", "REGISTER"];

  return (
    <header className={`fixed w-full z-50 transition-colors duration-300 ${theme === "dark" ? "bg-dark/90 shadow-md" : "bg-white shadow"}`}>
      <div className="container mx-auto px-4 py-3 flex items-center relative">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-8 w-8" />
          <span className={`font-bold ${theme === "dark" ? "text-primary" : "text-black"}`}>CoffeeSite</span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8">
          {links.map((l) => (
            <Link
              key={l}
              to={`/${l === "HOME" ? "" : l.toLowerCase()}`}
              className={`transition-colors duration-300 ${theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary"}`}
            >
              {l}
            </Link>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4 ml-auto">

          {/* ❤️ زر الفيفوريت */}
          <button 
            onClick={() => {
              if (!auth.currentUser) {
                navigate("/login"); // لو مش مسجل دخول
                return;
              }
              navigate("/favorites");
            }}
            className={`relative transition-colors duration-300 ${theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary"}`}
          >
            <Heart size={24} />
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          <button onClick={() => navigate('/profile')}>
            <img
              src="data:image/jpeg;base64,..." 
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border-2 border-primary"
            />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className={`md:hidden transition-colors duration-300 ${theme === "dark" ? "bg-dark text-white" : "bg-white text-black"}`}>
          {links.map((l) => (
            <Link
              key={l}
              to={`/${l === "HOME" ? "" : l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block py-2 px-4 transition-colors duration-300 hover:bg-primary/20"
            >
              {l}
            </Link>
          ))}

          <div className={`border-t my-2 ${theme === "dark" ? "border-primary/30" : "border-black/10"}`}></div>

          {/* Mobile Icons */}
          <div className="flex items-center justify-around py-2">

            {/* ❤️ زر الفيفوريت في الموبايل */}
            <button 
              onClick={() => {
                if (!auth.currentUser) {
                  setOpen(false);
                  navigate("/login");
                  return;
                }
                setOpen(false);
                navigate("/favorites");
              }}
              className={`relative transition-colors duration-300 ${theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary"}`}
            >
              <Heart size={24} />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            <ThemeToggle />

            <button onClick={() => navigate('/profile')}>
              <img
                src="data:image/jpeg;base64,..." 
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-primary"
              />
            </button>

          </div>
        </div>
      )}
    </header>
  );
}
