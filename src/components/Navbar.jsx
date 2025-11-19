import { useState, useEffect } from "react";
import { Menu, X, Heart, ShoppingCart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/coffee_logo.png";
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { logoutUser } from "../firebase/auth";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  const favoritesCount = useSelector((state) => state.favorite.favorites?.length || 0);
  const cartCount = useSelector((state) => state.cart.items?.length || 0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const links = ["HOME", "ABOUT", "My Orders"];

  const headerClass = theme === "dark" ? "bg-dark-background/90 text-white shadow-md" : "bg-white text-black shadow";
  const linkClass = theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary";
  const buttonClass = theme === "dark"
    ? "bg-dark-primary text-dark-text hover:bg-dark-primaryHover"
    : "bg-light-primary text-white hover:bg-light-primaryHover";
  const iconClass = theme === "dark" ? "text-white hover:text-primary" : "text-black hover:text-primary";
  const avatarBorder = theme === "dark" ? "border-dark-primary" : "border-light-primary";

  // Icon with badge helper
  const IconButton = ({ Icon, count, onClick }) => (
    <button onClick={onClick} className={`relative transition-colors duration-300 ${iconClass}`}>
      <Icon size={24} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center bg-light-primary text-black dark:bg-dark-primary dark:text-dark-text text-xs">
          {count}
        </span>
      )}
    </button>
  );

  // Navigation links + buttons
  const renderLinks = () => (
    <>
      {links.map((l) => (
        <Link
          key={l}
          to={`/${l === "HOME" ? "" : l.toLowerCase()}`}
          className={`transition-colors duration-300 px-3 py-1 ${linkClass}`}
          onClick={() => setOpen(false)}
        >
          {l}
        </Link>
      ))}

      {!user ? (
        <>
          <Link to="/login" onClick={() => setOpen(false)} className={`px-4 py-1 rounded-md transition ${theme === "dark" ? "bg-dark-surface text-white hover:bg-dark-primary/20" : "bg-light-surface text-black hover:bg-light-primary/20"}`}>
            Login
          </Link>
          <Link to="/register" onClick={() => setOpen(false)} className={`px-4 py-1 rounded-md transition ${theme === "dark" ? "bg-dark-surface text-white hover:bg-dark-primary/20" : "bg-light-surface text-black hover:bg-light-primary/20"}`}>
            Register
          </Link>
        </>
      ) : (
        <button onClick={handleLogout} className={`px-4 py-1 rounded-md transition ${buttonClass}`}>Logout</button>
      )}
    </>
  );

  // Icons section (used in desktop & mobile)
  const renderIcons = () => (
    <>
      <IconButton Icon={Heart} count={favoritesCount} onClick={() => user ? navigate("/favorites") : navigate("/login")} />
      <IconButton Icon={ShoppingCart} count={cartCount} onClick={() => navigate("/cart")} />
      {user && (
        <button onClick={() => navigate("/profile")}>
          <img src={user.photoURL || "https://i.pravatar.cc/100"} alt="Profile" className={`h-8 w-8 rounded-full object-cover border-2 ${avatarBorder}`} />
        </button>
      )}
      <ThemeToggle />
    </>
  );

  return (
    <header className={`fixed w-full z-50 transition-colors duration-300 ${headerClass}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-8 w-8" />
          <span className="font-bold">CoffeeSite</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 items-center">
          {renderLinks()}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4">
          {renderIcons()}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="p-2">{open ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className={`md:hidden transition-colors duration-300 ${theme === "dark" ? "bg-dark-background text-white" : "bg-white text-black"}`}>
          <div className="flex flex-col gap-2 py-2 px-4">
            {renderLinks()}
            <div className="flex items-center gap-4 mt-2">
              {renderIcons()}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
