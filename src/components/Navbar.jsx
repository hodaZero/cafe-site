import { useState, useEffect } from "react";
import { Menu, X, Heart, ShoppingCart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/coffee_logo.png";
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { logoutUser } from "../firebase/auth";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  const favoritesCount = useSelector((state) => state.favorite.favorites?.length || 0);
  const cartCount = useSelector((state) => state.cart.items?.length || 0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const isVerifiedUser = user && user.emailVerified;   // ⭐ أهم تعديل

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const headerClass = theme === "dark" ? "bg-dark-background/90 text-white shadow-md" : "bg-white text-black shadow";
  const linkClass = theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary";
  const buttonClass = theme === "dark"
    ? "bg-dark-primary text-dark-text hover:bg-dark-primaryHover"
    : "bg-light-primary text-white hover:bg-light-primaryHover";
  const iconClass = theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary";
  const avatarBorder = theme === "dark" ? "border-dark-primary" : "border-light-primary";

  const IconButton = ({ Icon, count, onClick }) => (
    <button onClick={onClick} className={`relative transition-colors duration-300 ${iconClass}`}>
      <Icon size={24} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center bg-light-primary text-black dark:bg-dark-primary dark:text-dark-text text-xs">
          {count}
        </span>
      )}
    </button>
  );

  const renderLinks = () => (
    <>
      <Link to="/" className={`transition-colors duration-300 px-3 py-1 ${linkClass}`} onClick={() => setOpen(false)}>
        HOME
      </Link>

      <Link to="/menu" className={`transition-colors duration-300 px-3 py-1 ${linkClass}`} onClick={() => setOpen(false)}>
        MENU
      </Link>

      {isVerifiedUser && (
        <Link to="/orders" className={`transition-colors duration-300 px-3 py-1 ${linkClass}`} onClick={() => setOpen(false)}>
          My Orders
        </Link>
      )}

      <Link to="/tables" className={`transition-colors duration-300 px-3 py-1 ${linkClass}`} onClick={() => setOpen(false)}>
        Tables
      </Link>

      {!isVerifiedUser ? (
        <Link
          to="/login"
          onClick={() => setOpen(false)}
          className={`px-4 py-1 rounded-md transition ${
            theme === "dark"
              ? "bg-dark-surface text-white hover:bg-dark-primary/20"
              : "bg-light-surface text-black hover:bg-light-primary/20"
          }`}
        >
          Login
        </Link>
      ) : (
        <button onClick={handleLogout} className={`px-4 py-1 rounded-md transition ${buttonClass}`}>
          Logout
        </button>
      )}
    </>
  );

  const renderIcons = () => (
    <>
      {isVerifiedUser && (
        <IconButton Icon={Heart} count={favoritesCount} onClick={() => navigate("/favorites")} />
      )}

      {isVerifiedUser && (
        <IconButton Icon={ShoppingCart} count={cartCount} onClick={() => navigate("/cart")} />
      )}

      <ThemeToggle />

      {isVerifiedUser && (
        <button onClick={() => navigate("/profile")}>
          <img
            src={user.photoURL || "https://i.pravatar.cc/100"}
            alt="Profile"
            className={`h-8 w-8 rounded-full object-cover border-2 ${avatarBorder}`}
          />
        </button>
      )}
    </>
  );

  return (
    <header className={`fixed w-full z-50 transition-colors duration-300 ${headerClass}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <motion.img
            src={logo}
            alt="logo"
            className="h-12 w-12 rounded-xl shadow-md"
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.1, rotate: 3 }}
          />
          <motion.span
            className="text-3xl font-bold"
            style={{ fontFamily: "'Playwrite CZ', cursive", letterSpacing: "1px" }}
            initial={{ x: -15, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span className="text-light-primary"> D</motion.span>
            omi <motion.span className="text-light-primary">C</motion.span>afe
          </motion.span>
        </Link>

        <nav className="hidden md:flex gap-4 items-center">
          {renderLinks()}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {renderIcons()}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className={`md:hidden transition-colors duration-300 ${
          theme === "dark" ? "bg-dark-background text-white" : "bg-white text-black"
        }`}>
          <div className="flex flex-col gap-2 py-2 px-4">
            {renderLinks()}
            <div className="flex items-center gap-4 mt-2">
              {renderIcons()}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
