import { useState  } from "react";
import { Menu, X, Heart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/coffee_logo.png";
import { useTheme } from '../context/ThemeContext';
import { Link } from "react-router-dom";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { theme } = useTheme();
  const links = ["HOME", "About", "LOGIN", "REGISTER"];

  return (
   <header className={`fixed w-full z-50 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900/90 shadow-md" : "bg-white shadow"}`}>
  <div className="container mx-auto px-4 py-3 flex items-center relative">
    {/* Logo */}
    <a href="#home" className="flex items-center gap-2">
      <img src={logo} alt="logo" className="h-8 w-8" />
      <span className={`font-bold ${theme === "dark" ? "text-amber-300" : "text-amber-800"}`}>CoffeeSite</span>
    </a>

    {/* Center Links */}
    <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8">
      {links.map((l) => (
        <a
          key={l}
          href={`/${l.toLowerCase()}`}
          className={`hover:text-amber-700 transition-colors duration-300 ${theme === "dark" ? "text-gray-300 hover:text-amber-300" : "text-gray-700"}`}
        >
          {l}
        </a>
      ))}
    </nav>

    {/* Icons + Avatar on Right */}
    <div className="hidden md:flex items-center gap-4 ml-auto">
      <button 
        onClick={() => setFavoritesCount(favoritesCount + 1)} 
        className="relative text-gray-700 dark:text-gray-300 hover:text-amber-500 transition-colors duration-300"
      >
        <Heart size={24} color={theme === "dark" ? "#D1D5DB" : "#374151"} />
        {favoritesCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
      </button>
      <ThemeToggle />
      <img src="data:image/jpeg;base64,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" alt="Profile" className="h-8 w-8 rounded-full object-cover border-2 border-amber-600" />
    </div>

    {/* Mobile Menu Button */}
    <div className="md:hidden flex items-center gap-2 ml-auto">
      <ThemeToggle />
      <button onClick={() => setOpen(!open)} className="p-2">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </div>

  {/* Mobile Menu Dropdown */}
  {open && (
    <div className={`md:hidden transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-t border-gray-200"}`}>
      {links.map((l) => (
        <a
          key={l}
          href={`/${l.toLowerCase()}`}
          onClick={() => setOpen(false)}
          className={`block py-2 px-4 transition-colors duration-300 ${theme === "dark" ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-amber-50"}`}
        >
          {l}
        </a>
      ))}

      <div className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"} my-2`}></div>

      <div className="flex items-center justify-around py-2">
        <button 
          onClick={() => setFavoritesCount(favoritesCount + 1)} 
          className="relative text-gray-700 dark:text-gray-300 hover:text-amber-500 transition-colors duration-300"
        >
          <Heart size={24} color={theme === "dark" ? "#D1D5DB" : "#374151"} />
          {favoritesCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>
        <ThemeToggle />
        <img src="data:image/jpeg;base64,..." alt="Profile" className="h-8 w-8 rounded-full object-cover border-2 border-amber-600" />
      </div>
    </div>
  )}
</header>

  );
}
