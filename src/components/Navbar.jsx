import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/coffee_logo.png";
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { logoutUser } from "../firebase/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const links = ["HOME", "ABOUT"]; // روابط ثابتة

  return (
    <header className={`fixed w-full z-50 transition-colors duration-300 ${theme === "dark" ? "bg-dark/90 shadow-md" : "bg-white shadow"}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-8 w-8" />
          <span className={`font-bold ${theme === "dark" ? "text-primary" : "text-black"}`}>CoffeeSite</span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex gap-4 items-center">
          {links.map(l => (
            <Link
              key={l}
              to={`/${l === "HOME" ? "" : l.toLowerCase()}`}
              className={`transition-colors duration-300 ${theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary"} px-3 py-1`}
            >
              {l}
            </Link>
          ))}

          {!user && (
            <>
              <Link 
                to="/login" 
                className="px-4 py-1 bg-white text-black rounded-md hover:bg-gray-200 transition"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-1 bg-white text-black rounded-md hover:bg-gray-200 transition"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Icons + Avatar */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setFavoritesCount(favoritesCount + 1)} 
            className={`relative transition-colors duration-300 ${theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary"}`}
          >
            <Heart size={24} />
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          {user && (
            <button onClick={() => navigate('/profile')}>
              <img src={user.photoURL || "https://i.pravatar.cc/100"} alt="Profile" className="h-8 w-8 rounded-full object-cover border-2 border-primary" />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className={`md:hidden transition-colors duration-300 ${theme === "dark" ? "bg-dark text-white" : "bg-white text-black"}`}>
          {links.map(l => (
            <Link
              key={l}
              to={`/${l === "HOME" ? "" : l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block py-2 px-4 hover:bg-primary/20"
            >
              {l}
            </Link>
          ))}

          {!user && (
            <>
              <Link 
                to="/login" 
                onClick={() => setOpen(false)}
                className="block py-2 px-4 bg-white text-black rounded-md hover:bg-gray-200 transition"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setOpen(false)}
                className="block py-2 px-4 bg-white text-black rounded-md hover:bg-gray-200 transition"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={() => { handleLogout(); setOpen(false); }}
              className="block w-full text-left py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
