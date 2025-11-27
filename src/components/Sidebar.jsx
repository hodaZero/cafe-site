import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaUserCircle, FaBars, FaTimes, FaBox, FaClipboardList, FaChair, FaSignOutAlt } from "react-icons/fa";
import { Bell } from "lucide-react";
import logo from "../assets/images/coffee_logo.png";
import ThemeToggle from "./ThemeToggle";
import { useNotifications } from "../context/NotificationContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function Sidebar({ isMobileTrigger, isOpen: isOpenProp, setIsOpen: setIsOpenProp }) {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isOpenLocal, setIsOpenLocal] = useState(false);
  const { notifications, clearAll, deleteNotification, markAsRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenLocal;
  const setIsOpen = isOpenProp !== undefined ? setIsOpenProp : setIsOpenLocal;

  // 🔹 Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);                // تسجيل الخروج من Firebase
      navigate("/login", { replace: true }); // التوجيه مباشرة للصفحة بدون الرجوع
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const links = [
    { name: "Profile", path: "/admin/profile", icon: <FaUserCircle size={16} />, isButton: false },
    { name: "Notification", icon: <Bell size={16} />, isButton: true, onClick: () => setNotifOpen(prev => !prev) },
    { name: "Products", path: "/admin/products", icon: <FaBox size={16} />, isButton: false },
    { name: "Orders", path: "/admin/orders", icon: <FaClipboardList size={16} />, isButton: false },
    { name: "Tables", path: "/admin/tables", icon: <FaChair size={16} />, isButton: false },
    { name: "Logout", icon: <FaSignOutAlt size={16} />, isButton: true, onClick: handleLogout }, // ✅ Logout شغال
  ];

  const sidebarBg = theme === "light" ? "bg-light-surface border-light-inputBorder" : "bg-dark-surface border-dark-inputBorder";
  const linkText = theme === "light" ? "text-light-text" : "text-dark-text";
  const linkHover = theme === "light" ? "hover:bg-light-primary/20" : "hover:bg-dark-primary/20";
  const activeBg = theme === "light" ? "bg-light-primary text-black font-semibold" : "bg-dark-primary text-black font-semibold";

  // 🔹 Close notification popup if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification-popup") && !e.target.closest(".notification-button")) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const NotificationPopup = () => (
    <div
      className={`notification-popup absolute top-12 right-4 w-80 rounded-lg shadow-lg border p-3 z-[9999] ${
        theme === "dark" ? "bg-dark-surface text-white border-dark-primary" : "bg-white text-black border-light-primary"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
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
        <div className="max-h-60 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-2 mb-2 rounded cursor-pointer transition ${!n.read ? "bg-light-primary/20 dark:bg-dark-primary/20" : ""}`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="flex justify-between">
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

  return (
    <>
      {isMobileTrigger && (
        <button className="p-2 rounded-md border bg-white dark:bg-dark-surface shadow-lg" onClick={() => setIsOpen(true)}>
          <FaBars size={20} />
        </button>
      )}

      {isOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]" onClick={() => setIsOpen(false)} />
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
            />
            <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}

      <div className={`hidden md:flex flex-col w-64 p-4 border-r ${sidebarBg} min-h-screen relative z-20`}>
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
          navigate={navigate}
        />
      </div>
    </>
  );
}

function SidebarContent({ pathname, activeBg, linkHover, linkText, links, logo, notifOpen, setNotifOpen, NotificationPopup, setIsOpen, navigate }) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <img src={logo} alt="logo" className="h-8 w-8 rounded-xl shadow-md" />
        <span className="text-2xl font-bold" style={{ fontFamily: "'Playwrite CZ', cursive" }}>
          <span className="text-light-primary">D</span>omi <span className="text-light-primary">C</span>afe
        </span>
        <ThemeToggle />
      </div>

      <ul className="space-y-3">
        {links.map((item, index) => (
          <li key={index}>
            {item.isButton ? (
              <button
                className={`flex items-center gap-2 py-2 px-3 rounded-lg w-full transition-colors ${linkHover} ${linkText}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.name === "Notification") {
                    setNotifOpen(prev => !prev);
                  } else if (item.onClick) {
                    item.onClick(); // 🔹 Logout يشتغل مباشرة هنا
                  }
                }}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg w-full transition-colors ${
                  pathname === item.path ? activeBg : `${linkHover} ${linkText}`
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
                {item.name === "Notification" && notifOpen && <NotificationPopup />}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
