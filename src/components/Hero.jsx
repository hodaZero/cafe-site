import heroImg from '../assets/images/hero.png';
import { useTheme } from '../context/ThemeContext';

export default function Hero() {
  const { theme } = useTheme();

  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-cover bg-center relative transition-colors duration-300 "
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className={`absolute inset-0 transition-colors duration-300 ${theme === "dark" ? "bg-black/60" : "bg-black/40"}`}></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Savor The Perfect Cup</h1>
        <p className="text-lg md:text-xl mb-6">Freshly brewed coffee made just for you.</p>
        <button className="bg-amber-700 hover:bg-amber-800 px-6 py-3 rounded-full font-medium transition">
          Order Now
        </button>
      </div>
    </section>
  );
}
