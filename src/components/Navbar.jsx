import { useState, useEffect } from "react";
import { Menu, X, Heart, ShoppingCart, Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/coffee_logo.png";
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { logoutUser } from "../firebase/auth";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

//Notification Context
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  const {
    notifications = [],
    unreadCount = 0,
    markAsRead = () => {},
    deleteNotification = () => {},
    clearAll = () => {},
  } = useNotifications() || {};

  const favoritesCount = useSelector((state) => state.favorite.favorites?.length || 0);
  const cartCount = useSelector((state) => state.cart.items?.length || 0);

  // ⭐ إغلاق Notification Popup عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification-popup") && !e.target.closest(".notification-button")) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const isVerifiedUser = user && user.emailVerified;

  const handleLogout = async () => {
    await logoutUser();
    navigate("/auth");
  };

  const headerClass = theme === "dark" ? "bg-dark-background/90 text-white shadow-md" : "bg-white text-black shadow";
  const linkClass = theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary";
  const buttonClass = theme === "dark"
    ? "bg-dark-primary text-dark-text hover:bg-dark-primaryHover"
    : "bg-light-primary text-white hover:bg-light-primaryHover";
  const iconClass = theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary";
  const avatarBorder = theme === "dark" ? "border-dark-primary" : "border-light-primary";

  const IconButton = ({ Icon, count, onClick, className = "" }) => (
    <button onClick={onClick} className={`relative flex items-center transition-colors duration-300 ${iconClass} ${className}`}>
      <Icon size={24} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center bg-light-primary text-black dark:bg-dark-primary dark:text-dark-text text-xs">
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
          to="/auth"
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

  const NotificationPopup = () => (
    <div
      className={`notification-popup absolute right-0 mt-3 w-80 rounded-lg shadow-lg border p-3 z-50 ${
        theme === "dark" ? "bg-dark-surface text-white border-dark-primary" : "bg-white text-black border-light-primary"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Notifications</h3>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="text-sm text-red-500 hover:underline">
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-center py-3 opacity-70">No notifications</p>
      ) : (
        <div className="max-h-60 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-2 mb-2 rounded cursor-pointer transition ${!n.read ? "bg-light-primary/20 dark:bg-dark-primary/20" : ""}`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="flex justify-between items-start">
                <p className="font-semibold">{n.title}</p>
                <button
                  className="text-xs text-red-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                >
                  Delete
                </button>
              </div>
              <p className="text-sm opacity-90">{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderIcons = () => (
    <div className="flex items-center gap-4">
      {isVerifiedUser && <IconButton Icon={Heart} count={favoritesCount} onClick={() => navigate("/favorites")} />}
      {isVerifiedUser && <IconButton Icon={ShoppingCart} count={cartCount} onClick={() => navigate("/cart")} />}
      {isVerifiedUser && (
        <div className="relative">
          <IconButton
            Icon={Bell}
            count={unreadCount}
            onClick={(e) => {
              e.stopPropagation();
              setNotifOpen((prev) => !prev);
            }}
            className="notification-button"
          />
          {notifOpen && <NotificationPopup />}
        </div>
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
    </div>
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

        <nav className="hidden md:flex gap-4 items-center">{renderLinks()}</nav>

        <div className="hidden md:flex items-center gap-4">{renderIcons()}</div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className={`md:hidden transition-colors duration-300 ${theme === "dark" ? "bg-dark-background text-white" : "bg-white text-black"}`}>
          <div className="flex flex-col gap-2 py-2 px-4">
            {renderLinks()}
            <div className="flex items-center gap-4 mt-2">{renderIcons()}</div>
          </div>
        </div>
      )}
    </header>
  );
}
