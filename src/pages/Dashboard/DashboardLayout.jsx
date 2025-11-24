import Sidebar from "../../components/Sidebar";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ← state للموبايل

  const bgMain =
    theme === "light"
      ? "bg-light-background text-light-text"
      : "bg-dark-background text-dark-text";

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${bgMain}`}>
      {/* Mobile Sidebar Button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Sidebar
          isMobileTrigger={true}
          isOpen={isSidebarOpen}       // ← تمرير state
          setIsOpen={setIsSidebarOpen} // ← تمرير setter
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed top-0 left-0 h-screen shadow-lg z-20">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-6 h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
