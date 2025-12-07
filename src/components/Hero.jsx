import heroImg from '../assets/images/hero.png';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Hero({ theme, t }) { 
  const { theme: currentTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-cover bg-center relative transition-colors duration-300"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div
        className={`absolute inset-0 transition-colors duration-300 
          ${theme === "dark" ? "bg-dark-background/60" : "bg-black/40"}`}
      ></div>

      <div className="relative z-10 text-center px-4">
        <h1
          className={`text-4xl md:text-6xl font-extrabold mb-4 
            ${theme === "dark" ? "text-dark-text" : "text-white"}`}
        >
          {t("hero.title")}
        </h1>

        <p
          className={`text-lg md:text-2xl mb-6 
            ${theme === "dark" ? "text-dark-text/80" : "text-white/90"}`}
        >
          {t("hero.subtitle")}
        </p>

        <button
          onClick={() => navigate('/menu')}
          className="px-8 py-3 rounded-full font-semibold transition duration-300 text-white"
          style={{ backgroundColor: '#B45309' }}
        >
          {t("hero.button")}
        </button>
      </div>
    </section>
  );
}
