


import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardLayout({ children }) {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const bgMain =
    theme === "light"
      ? "bg-light-background text-light-text"
      : "bg-dark-background text-dark-text";

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${bgMain}`}>
      {/* Sidebar for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Sidebar
          isMobileTrigger={true}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 fixed top-0 left-0 h-screen shadow-lg z-20">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 p-6 h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
