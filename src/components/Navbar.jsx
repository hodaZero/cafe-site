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
import { useNotifications } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  // ✅ Notifications with safe defaults
  const notificationsContext = useNotifications() || {};
  const {
    notifications = [],
    unreadCount = 0,
    markAsRead = () => {},
    deleteNotification = () => {},
    clearAll = () => {},
  } = notificationsContext;

  const favoritesCount = useSelector((state) => state.favorite?.favorites?.length || 0);
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);

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

  const headerClass = theme === "dark" 
    ? "bg-dark-background/90 text-white shadow-md" 
    : "bg-[#FFF8F1] text-black shadow";
  const linkClass = theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary";
  const buttonClass = theme === "dark"
    ? "bg-dark-primary text-dark-text hover:bg-dark-primaryHover"
    : "bg-light-primary text-white hover:bg-light-primaryHover";
  const iconClass = theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary";
  const avatarBorder = theme === "dark" ? "border-dark-primary" : "border-light-primary";

  const IconButton = ({ Icon, count, onClick, className = "", label = "" }) => (
    <button 
      onClick={onClick} 
      className={`relative flex flex-col items-center transition-colors duration-300 ${iconClass} ${className}`}
    >
      <div className="relative">
        <Icon size={24} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center bg-light-primary text-black dark:bg-dark-primary dark:text-dark-text text-xs">
            {count}
          </span>
        )}
      </div>
      {label && <span className="text-xs mt-1">{label}</span>}
    </button>
  );

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  const renderLinks = () => (
    <>
      <Link to="/" className={`transition-colors duration-300 px-3 py-2 ${linkClass}`} onClick={() => setOpen(false)}>
        {t("navbar.home")}
      </Link>
      <Link to="/menu" className={`transition-colors duration-300 px-3 py-2 ${linkClass}`} onClick={() => setOpen(false)}>
        {t("navbar.menu")}
      </Link>
      {isVerifiedUser && (
        <Link to="/orders" className={`transition-colors duration-300 px-3 py-2 ${linkClass}`} onClick={() => setOpen(false)}>
          {t("navbar.myOrders")}
        </Link>
      )}
      <Link to="/tables" className={`transition-colors duration-300 px-3 py-2 ${linkClass}`} onClick={() => setOpen(false)}>
        {t("navbar.tables")}
      </Link>
      {!isVerifiedUser ? (
        <Link
          to="/auth"
          onClick={() => setOpen(false)}
          className={`px-4 py-2 rounded-md transition mt-2 ${
            theme === "dark"
              ? "bg-dark-surface text-white hover:bg-dark-primary/20"
              : "bg-light-surface text-black hover:bg-light-primary/20"
          }`}
        >
          {t("navbar.login")}
        </Link>
      ) : (
        <button onClick={handleLogout} className={`px-4 py-2 rounded-md transition mt-2 ${buttonClass}`}>
          {t("navbar.logout")}
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
        <h3 className="font-semibold text-lg">{t("navbar.notifications")}</h3>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="text-sm text-red-500 hover:underline">
            {t("navbar.clearAll")}
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="text-center py-3 opacity-70">{t("navbar.noNotifications")}</p>
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
                  {t("navbar.delete")}
                </button>
              </div>
              <p className="text-sm opacity-90">{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ✅ دالة واحدة لرسم الأيقونات في شريط التنقل (للشاشات الكبيرة فقط)
  const renderDesktopIcons = () => (
    <div className="hidden md:flex items-center gap-4">
      {isVerifiedUser && (
        <>
          <IconButton 
            Icon={Heart} 
            count={favoritesCount} 
            onClick={() => navigate("/favorites")} 
          />
          <IconButton 
            Icon={ShoppingCart} 
            count={cartCount} 
            onClick={() => navigate("/cart")} 
          />
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
        </>
      )}
      <ThemeToggle />
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="px-2 py-1 rounded-md border hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {i18n.language === "en" ? "Ar" : "En"}
        </button>
      </div>
      {isVerifiedUser && (
        <button onClick={() => navigate("/profile")}>
          <img
            src={user.photoURL || "https://i.pravatar.cc/100"}
            alt={t("profile")}
            className={`h-8 w-8 rounded-full object-cover border-2 ${avatarBorder}`}
          />
        </button>
      )}
    </div>
  );

  // ✅ الأيقونات في القائمة المنسدلة للهواتف فقط
  const MobileMenuIcons = () => (
    isVerifiedUser && (
      <>
        {/* ✅ قسم الأيقونات السريعة */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t dark:border-gray-700">
          <IconButton 
            Icon={Heart} 
            count={favoritesCount} 
            onClick={() => {
              navigate("/favorites");
              setOpen(false);
            }}
            label={t("navbar.favorites")}
          />
          
          <IconButton 
            Icon={ShoppingCart} 
            count={cartCount} 
            onClick={() => {
              navigate("/cart");
              setOpen(false);
            }}
            label={t("navbar.cart")}
          />
          
          <button 
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="flex flex-col items-center gap-1"
          >
            <img
              src={user.photoURL || "https://i.pravatar.cc/100"}
              alt={t("profile")}
              className={`h-12 w-12 rounded-full object-cover border-2 ${avatarBorder}`}
            />
            <span className="text-xs mt-1">{t("navbar.profile")}</span>
          </button>
        </div>
        
        {/* ✅ قسم الإشعارات */}
        <div className="mt-3 border-t pt-3 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell size={20} />
              <h3 className="font-semibold">{t("navbar.notifications")}</h3>
              {unreadCount > 0 && (
                <span className="rounded-full w-5 h-5 flex items-center justify-center bg-light-primary text-black dark:bg-dark-primary dark:text-dark-text text-xs">
                  {unreadCount}
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button onClick={clearAll} className="text-sm text-red-500 hover:underline">
                {t("navbar.clearAll")}
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-center py-2 opacity-70">{t("navbar.noNotifications")}</p>
          ) : (
            <div className="max-h-40 overflow-y-auto pr-1">
              {notifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className={`p-2 mb-2 rounded cursor-pointer transition ${!n.read ? "bg-light-primary/20 dark:bg-dark-primary/20" : ""}`}
                  onClick={() => {
                    markAsRead(n.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">{n.title}</p>
                    <button
                      className="text-xs text-red-500 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                    >
                      {t("navbar.delete")}
                    </button>
                  </div>
                  <p className="text-xs opacity-90">{n.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )
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

        {/* ✅ الروابط للشاشات الكبيرة */}
        <nav className="hidden md:flex gap-4 items-center">{renderLinks()}</nav>
        
        {/* ✅ الأيقونات للشاشات الكبيرة فقط */}
        {renderDesktopIcons()}

        {/* ✅ زر القائمة للهواتف - بدون أي أيقونات أخرى */}
        <div className="md:hidden">
          <button 
            onClick={() => setOpen(!open)} 
            className="p-2 flex items-center gap-2"
          >
            <span className="text-sm font-medium">{open ? "Close" : "Menu"}</span>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ✅ القائمة المنسدلة للهواتف */}
      {open && (
        <div className={`md:hidden transition-colors duration-300 ${theme === "dark" ? "bg-dark-background text-white" : "bg-white text-black"}`}>
          <div className="flex flex-col gap-2 py-4 px-4">
            {/* ✅ الروابط */}
            {renderLinks()}
            
            {/* ✅ قسم الإعدادات */}
            <div className="mt-4 border-t pt-4 dark:border-gray-700">
              <p className="font-semibold mb-3">{t("navbar.settings")}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{t("navbar.theme")}:</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{t("navbar.language")}:</span>
                  <button
                    onClick={toggleLanguage}
                    className="px-3 py-1 rounded-md border hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    {i18n.language === "en" ? "العربية" : "English"}
                  </button>
                </div>
              </div>
            </div>
            
            {/* ✅ الأيقونات (تظهر مرة واحدة فقط هنا) */}
            <MobileMenuIcons />
            
            {/* ✅ معلومات المستخدم */}
            {isVerifiedUser && (
              <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL || "https://i.pravatar.cc/100"}
                    alt={t("profile")}
                    className={`h-12 w-12 rounded-full object-cover border-2 ${avatarBorder}`}
                  />
                  <div className="text-left">
                    <p className="font-semibold">{user.displayName || t("profile")}</p>
                    <p className="text-sm opacity-70">{user.email}</p>
                    <p className="text-xs mt-1 text-green-600 dark:text-green-400">
                      ✓ {t("navbar.verifiedAccount")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}