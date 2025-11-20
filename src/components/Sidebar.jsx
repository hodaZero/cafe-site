import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import logo from "../assets/images/coffee_logo.png";
import ThemeToggle from "./ThemeToggle";
export default function Sidebar() {
  const { pathname } = useLocation();
  const { theme } = useTheme();

  const links = [
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Tables", path: "/admin/tables" },  // ✔ تعديل
    // { name: "Users", path: "/admin/users" },    // ✔ تعديل
    { name: "Settings", path: "/admin/settings" }, // ✔ تعديل
  ];

  const sidebarBg = theme === "light" ? "bg-light-surface border-light-inputBorder" : "bg-dark-surface border-dark-inputBorder";
  const titleColor = theme === "light" ? "text-light-primary" : "text-dark-primary";
  const linkText = theme === "light" ? "text-light-text" : "text-dark-text";
  const linkHover = theme === "light" ? "hover:bg-light-primary/20" : "hover:bg-dark-primary/20";
  const activeBg = theme === "light" ? "bg-light-primary text-black font-semibold" : "bg-dark-primary text-black font-semibold";

  return (
    <div className={`w-64 ${sidebarBg} border-r p-4 min-h-screen`}>
      <div className="text-center mb-6">

        {/* Logo */}
        <div className="flex items-center gap-1">
  <motion.img
    src={logo}
    alt="logo"
    className="h-8 w-8 rounded-xl shadow-md"
    initial={{ scale: 0, rotate: -20, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    whileHover={{ scale: 1.1, rotate: 3 }}
  />

 <motion.span
  className="text-2xl font-bold"
  style={{ fontFamily: "'Playwrite CZ', cursive", letterSpacing: "1px"}}
  initial={{ x: -15, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
  whileHover={{ scale: 1.05 }}
>
 <motion.span className="text-light-primary"> D</motion.span>
  omi <motion.span className="text-light-primary">C</motion.span>afe
</motion.span>
<ThemeToggle />
</div>    
 
  </div>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.path}>
            <Link
              to={l.path}
              className={`block py-2 px-3 rounded-lg ${
                pathname === l.path ? activeBg : `${linkHover} ${linkText}`
              }`}
            >
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
