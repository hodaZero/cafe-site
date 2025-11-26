import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { Bell } from "lucide-react";
import logo from "../assets/images/coffee_logo.png";
import ThemeToggle from "./ThemeToggle";
import { useNotifications } from "../context/NotificationContext";

export default function Sidebar({ isMobileTrigger, isOpen: isOpenProp, setIsOpen: setIsOpenProp }) {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const [isOpenLocal, setIsOpenLocal] = useState(false);
  const { notifications, unreadCount, clearAll, deleteNotification, markAsRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenLocal;
  const setIsOpen = isOpenProp !== undefined ? setIsOpenProp : setIsOpenLocal;

  const links = [
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Tables", path: "/admin/tables" },
    { name: "Settings", path: "/admin/settings" },
  ];

  const sidebarBg = theme === "light" ? "bg-light-surface border-light-inputBorder" : "bg-dark-surface border-dark-inputBorder";
  const linkText = theme === "light" ? "text-light-text" : "text-dark-text";
  const linkHover = theme === "light" ? "hover:bg-light-primary/20" : "hover:bg-dark-primary/20";
  const activeBg = theme === "light" ? "bg-light-primary text-black font-semibold" : "bg-dark-primary text-black font-semibold";

  // Close notification popup if click outside
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
              setIsOpen={setIsOpen}
              notifOpen={notifOpen}
              setNotifOpen={setNotifOpen}
              NotificationPopup={NotificationPopup}
              unreadCount={unreadCount}
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
          setIsOpen={() => {}}
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
  setIsOpen,
  notifOpen,
  setNotifOpen,
  NotificationPopup,
  unreadCount,
}) {
  return (
    <>
      <div className="text-center mb-6">
        <div className="flex items-center gap-2 justify-between mb-6">
          <img src={logo} alt="logo" className="h-8 w-8 rounded-xl shadow-md" />
          <span className="text-2xl font-bold" style={{ fontFamily: "'Playwrite CZ', cursive" }}>
            <span className="text-light-primary">D</span>omi <span className="text-light-primary">C</span>afe
          </span>
          <ThemeToggle />
        </div>

        {/* Profile */}
        <Link
          to="/admin/profile"
          className={`flex items-center gap-2 mb-2 px-2 py-1 rounded-lg w-full ${pathname === "/admin/profile" ? activeBg : `${linkHover} ${linkText}`}`}
          onClick={() => setIsOpen(false)}
        >
          <FaUserCircle size={18} />
          <span className="font-medium text-sm">Profile</span>
        </Link>

        {/* Notification under Profile, full width like Profile */}
        <button
          className={`notification-button flex items-center gap-2 mb-6 px-2 py-1 rounded-lg w-full ${linkHover} ${linkText}`}
          onClick={(e) => {
            e.stopPropagation();
            setNotifOpen((prev) => !prev);
          }}
        >
          <Bell size={18} />
          <span className="font-medium text-sm">Notification</span>
          {unreadCount > 0 && (
            <span className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs bg-light-primary dark:bg-dark-primary text-black dark:text-dark-text">
              {unreadCount}
            </span>
          )}
        </button>
        {notifOpen && <NotificationPopup />}
      </div>

      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.path}>
            <Link
              to={l.path}
              className={`block py-2 px-3 rounded-lg ${pathname === l.path ? activeBg : `${linkHover} ${linkText}`}`}
              onClick={() => setIsOpen(false)}
            >
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
