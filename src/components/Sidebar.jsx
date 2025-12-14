import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaBox,
  FaClipboardList,
  FaChair,
  FaSignOutAlt,
} from "react-icons/fa";
import { Bell } from "lucide-react";
import logo from "../assets/images/coffee_logo.png";
import ThemeToggle from "./ThemeToggle";
import { useNotifications } from "../context/NotificationContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function Sidebar({
  isMobileTrigger,
  isOpen: isOpenProp,
  setIsOpen: setIsOpenProp,
}) {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpenLocal, setIsOpenLocal] = useState(false);
  const {
    notifications,
    clearAll,
    deleteNotification,
    markAsRead,
    unreadCount,
  } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenLocal;
  const setIsOpen = isOpenProp !== undefined ? setIsOpenProp : setIsOpenLocal;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth", { replace: true });
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const links = [
    {
      key: "dashboard",
      name: t("dashboard.menuDashboard"),
      path: "/admin/dashboard",
      icon: <FaClipboardList size={16} />,
      isButton: false,
    },
    {
      key: "notification",
      name: t("dashboard.notification"),
      icon: <Bell size={16} />,
      isButton: true,
      onClick: () => setNotifOpen((prev) => !prev),
    },
    {
      key: "products",
      name: t("dashboard.products"),
      path: "/admin/products",
      icon: <FaBox size={16} />,
      isButton: false,
    },
    {
      key: "orders",
      name: t("dashboard.orders"),
      path: "/admin/orders",
      icon: <FaClipboardList size={16} />,
      isButton: false,
    },
    {
      key: "tables",
      name: t("dashboard.tables"),
      path: "/admin/tables",
      icon: <FaChair size={16} />,
      isButton: false,
    },
    {
      key: "profile",
      name: t("dashboard.profile"),
      path: "/admin/profile",
      icon: <FaUserCircle size={16} />,
      isButton: false,
    },
    {
      key: "logout",
      name: t("dashboard.logout"),
      icon: <FaSignOutAlt size={16} />,
      isButton: true,
      onClick: handleLogout,
    },
  ];

  /* 🎨 COLORS ONLY */
  const sidebarBg =
    theme === "light"
      ? "bg-light-surface border-r border-light-inputBorder"
      : "bg-dark-surface border-r border-dark-inputBorder";

  const linkText =
    theme === "light" ? "text-light-text" : "text-dark-text";

  const linkHover =
    theme === "light"
      ? "hover:bg-light-primary/20"
      : "hover:bg-dark-primary/20";

  const activeBg =
    theme === "light"
      ? "bg-light-primary/15 text-light-heading font-semibold"
      : "bg-dark-primary/20 text-dark-heading font-semibold";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".notification-popup") &&
        !e.target.closest(".notification-button")
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const NotificationPopup = () => (
    <div
      className={`notification-popup absolute top-12 left-full ml-2 w-80 rounded-xl shadow-lg border p-4 z-[9999]
      ${
        theme === "dark"
          ? "bg-dark-surface text-dark-text border-dark-inputBorder"
          : "bg-light-surface text-light-text border-light-inputBorder"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-light-heading dark:text-dark-heading">
          {t("navbar.notifications")}
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:underline"
          >
            {t("navbar.clearAll")}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-center py-4 opacity-70">
          {t("navbar.noNotifications")}
        </p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-3 rounded-lg cursor-pointer transition
              ${
                !n.read
                  ? "bg-light-primary/15 dark:bg-dark-primary/20"
                  : ""
              }`}
            >
              <div className="flex justify-between">
                <p className="font-medium">{n.title}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  {t("navbar.delete")}
                </button>
              </div>
              <p className="text-sm opacity-80 mt-1">{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobileTrigger && (
        <button
          className="p-2 rounded-lg border bg-light-surface dark:bg-dark-surface shadow-md"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={18} />
        </button>
      )}

      {isOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
            onClick={() => setIsOpen(false)}
          />
          <div className={`fixed top-0 left-0 h-full w-64 p-4 border-r ${sidebarBg} z-[9999]`}>
            <SidebarContent
              pathname={pathname}
              activeBg={activeBg}
              linkHover={linkHover}
              linkText={linkText}
              links={links}
              logo={logo}
              notifOpen={notifOpen}
              setNotifOpen={setNotifOpen}
              NotificationPopup={NotificationPopup}
              setIsOpen={setIsOpen}
              navigate={navigate}
              unreadCount={unreadCount}
            />
            <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}

      <div
        className={`hidden md:flex flex-col w-64 p-4 min-h-screen ${sidebarBg}`}
      >
        <SidebarContent
          pathname={pathname}
          activeBg={activeBg}
          linkHover={linkHover}
          linkText={linkText}
          links={links}
          logo={logo}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          NotificationPopup={NotificationPopup}
          unreadCount={unreadCount}
        />
      </div>
    </>
  );
}

function SidebarContent({
  pathname,
  activeBg,
  linkHover,
  linkText,
  links,
  logo,
  notifOpen,
  setNotifOpen,
  NotificationPopup,
  unreadCount,
}) {
  const { t } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <img src={logo} alt="logo" className="h-8 w-8 rounded-xl shadow-sm" />

        <span
          className="text-xl font-bold text-light-heading dark:text-dark-heading"
          style={{ fontFamily: "'Playwrite CZ', cursive" }}
        >
          <span className="text-light-primary">D</span>omi{" "}
          <span className="text-light-primary">C</span>afe
        </span>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-md bg-light-primary text-white dark:bg-dark-primary dark:text-black text-sm"
          >
            {i18n.language === "en" ? "AR" : "EN"}
          </button>
        </div>
      </div>

      <ul className="space-y-2 relative">
        {links.map((item) => (
          <li key={item.key} className="relative">
            {item.isButton ? (
              <button
                className={`flex items-center gap-2 py-2 px-3 rounded-lg w-full transition-colors ${linkHover} ${linkText}`}
                onClick={() =>
                  item.key === "notification"
                    ? setNotifOpen((prev) => !prev)
                    : item.onClick()
                }
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>

                {item.key === "notification" && unreadCount > 0 && (
                  <span className="ml-auto w-5 h-5 text-xs flex items-center justify-center bg-light-primary text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg w-full transition-colors ${
                  pathname === item.path
                    ? activeBg
                    : `${linkHover} ${linkText}`
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            )}

            {item.key === "notification" && notifOpen && <NotificationPopup />}
          </li>
        ))}
      </ul>
    </>
  );
}
