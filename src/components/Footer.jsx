import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const footerLinks = ["Home","About","Menu","Products","Service","Contact","Blogs"];

  const bg = theme === "light" ? "bg-light-surface" : "bg-dark-surface";
  const text = theme === "light" ? "text-light-text" : "text-dark-text";
  const hoverText = theme === "light" ? "hover:text-light-primaryHover" : "hover:text-dark-primaryHover";

  return (
    <footer className={`py-8 px-6 transition-colors duration-300 ${bg} ${text}`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <ul className="flex flex-wrap justify-center md:justify-start space-x-4 mb-4 md:mb-0">
          {footerLinks.map((link, idx) => (
            <li key={idx}>
              <a href="#" className={`transition-colors duration-300 ${hoverText}`}>{link}</a>
            </li>
          ))}
        </ul>
        <p className="text-center md:text-right">
          Created By Vijay | All Rights Reserved © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
