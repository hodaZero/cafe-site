import heroImg from '../assets/images/hero.png';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
export default function Hero() {
  const { theme } = useTheme();
    const navigate = useNavigate();
  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-cover bg-center relative transition-colors duration-300"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 transition-colors duration-300 
        ${theme === "dark" ? "bg-dark-background/60" : "bg-black/40"}`}></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className={`text-4xl md:text-6xl font-bold mb-4 
          text-dark-text`}>
          Savor The Perfect Cup
        </h1>
        <p className={`text-lg md:text-xl mb-6 text-dark-text/80
         `}>
          Freshly brewed coffee made just for you.
        </p>

        <button
          onClick={() => navigate('/menu')}
          className={`px-6 py-3 rounded-full font-medium transition-colors duration-300
            ${theme === "dark" 
              ? "bg-dark-primary hover:bg-dark-primaryHover text-dark-text" 
              : "bg-light-primary hover:bg-light-primaryHover text-white"}`}
        >
          Order Now
        </button>
      </div>
    </section>
  );
}
