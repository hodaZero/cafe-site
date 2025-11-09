import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const footerLinks = ["Home","About","Menu","Products","Service","Contact","Blogs"];

  return (
    <footer className={`py-8 px-6 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-800 text-white"}`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <ul className="flex flex-wrap justify-center md:justify-start space-x-4 mb-4 md:mb-0">
          {footerLinks.map((link, idx) => (
            <li key={idx}>
              <a href="#" className={`hover:text-amber-400 transition-colors duration-300`}>{link}</a>
            </li>
          ))}
        </ul>
        <p className="text-center md:text-right">Created By Vijay | All Rights Reserved © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
