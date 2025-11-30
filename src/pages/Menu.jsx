import React from "react";
import ProductList from "../components/ProductList"; 
import SmartRecommendations from "../components/SmartRecommendations";
import { useTheme } from "../context/ThemeContext";

const Menu = () => {
  const { theme } = useTheme();

  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-black text-white";
  const titleColor = theme === "light" ? "text-light-primary" : "text-dark-primary";

  return (
    <div className={`pt-16 min-h-screen px-6 md:px-16 text-center transition-colors duration-300 ${bgMain}`}>
      <h1 className={`text-3xl md:text-4xl font-bold pt-10 ${theme === "light" ? "text-light-text" : "text-dark-text"}`}>
        OUR <span className={titleColor}>MENU</span>
      </h1>

      {/* ⭐ عنوان الريكومينديشن */}
      {/* <h2 className={`text-2xl font-semibold mt-10 mb-6 ${theme === "light" ? "text-light-text" : "text-dark-text"}`}>
        Recommended for you
      </h2> */}

      {/* ⭐ Smart Recommendations */}
      <SmartRecommendations />

      {/* باقي المنتجات */}
      <ProductList theme={theme} />
    </div>
  );
};

export default Menu;
