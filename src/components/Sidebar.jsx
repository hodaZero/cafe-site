import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/images/coffee_logo.png";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar({ isMobileTrigger, isOpen: isOpenProp, setIsOpen: setIsOpenProp }) {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const [isOpenLocal, setIsOpenLocal] = useState(false);

  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenLocal;
  const setIsOpen = isOpenProp !== undefined ? setIsOpenProp : setIsOpenLocal;

  const links = [
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Tables", path: "/admin/tables" },
    { name: "Settings", path: "/admin/settings" },
  ];

  const sidebarBg =
    theme === "light"
      ? "bg-light-surface border-light-inputBorder"
      : "bg-dark-surface border-dark-inputBorder";

  const linkText = theme === "light" ? "text-light-text" : "text-dark-text";
  const linkHover =
    theme === "light"
      ? "hover:bg-light-primary/20"
      : "hover:bg-dark-primary/20";

  const activeBg =
    theme === "light"
      ? "bg-light-primary text-black font-semibold"
      : "bg-dark-primary text-black font-semibold";

  return (
    <>
      {/* Mobile Sidebar Button */}
      {isMobileTrigger && (
        <button
          className="p-2 rounded-md border bg-white dark:bg-dark-surface shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`fixed top-0 left-0 h-full w-64 p-4 border-r ${sidebarBg} z-[9999]`}
          >
            <SidebarContent
              pathname={pathname}
              activeBg={activeBg}
              linkHover={linkHover}
              linkText={linkText}
              links={links}
              logo={logo}
              setIsOpen={setIsOpen}
            />
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col w-64 p-4 border-r ${sidebarBg} min-h-screen z-20`}
      >
        <SidebarContent
          pathname={pathname}
          activeBg={activeBg}
          linkHover={linkHover}
          linkText={linkText}
          links={links}
          logo={logo}
          setIsOpen={() => {}}
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
}) {
  return (
    <>
      <div className="text-center mb-6">
        <div className="flex items-center gap-2 justify-between mb-6">
          <img src={logo} alt="logo" className="h-8 w-8 rounded-xl shadow-md" />

          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playwrite CZ', cursive" }}
          >
            <span className="text-light-primary">D</span>omi{" "}
            <span className="text-light-primary">C</span>afe
          </span>

          <ThemeToggle />
        </div>

        <Link
          to="/admin/profile"
          className={`flex items-center gap-2 mb-6 px-2 py-1 rounded-lg ${
            pathname === "/admin/profile"
              ? activeBg
              : `${linkHover} ${linkText}`
          }`}
          onClick={() => setIsOpen(false)}
        >
          <FaUserCircle size={18} />
          <span className="font-medium text-sm">Profile</span>
        </Link>
      </div>

      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.path}>
            <Link
              to={l.path}
              className={`block py-2 px-3 rounded-lg ${
                pathname === l.path ? activeBg : `${linkHover} ${linkText}`
              }`}
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
