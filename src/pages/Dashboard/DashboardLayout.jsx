import Sidebar from "../../components/Sidebar";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardLayout({ children }) {
  const { theme } = useTheme();

  const bgMain = theme === "light"
    ? "bg-light-background text-light-text"
    : "bg-dark-background text-dark-text";

  const sidebarBg = theme === "light" ? "bg-light-surface" : "bg-dark-surface";

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${bgMain}`}>
      <div className={`w-64 fixed top-0 left-0 h-screen shadow-lg overflow-y-auto transition-colors duration-300 ${sidebarBg}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
