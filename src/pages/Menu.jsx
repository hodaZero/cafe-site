import React from "react";
import ProductList from "../components/ProductList";
import SmartRecommendations from "../components/SmartRecommendations";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const Menu = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

 const bgMain = theme === "light" ? "bg-[#FFF8F1] text-gray-900" : "bg-[#1C1C1E] text-white";
  const titleColor = theme === "light" ? "text-[#D97706]" : "text-[#F59E0B]";

  return (
    <div className={`pt-16 min-h-screen px-6 md:px-16 text-center transition-colors duration-300 ${bgMain}`}>
      <h1
  className="text-3xl md:text-4xl font-bold pt-10 mb-12 text-center"
  style={{
    fontFamily: "'Playwrite CZ', cursive",
    letterSpacing: "1px",
  }}
>
  <span className={theme === "light" ? "text-black" : "text-white"}>
    {t("menuPage.ourMenu").split(" ")[0]}
  </span>{" "}
  <span className={theme === "light" ? "text-light-primary" : "text-dark-primary"}>
    {t("menuPage.ourMenu").split(" ").slice(1).join(" ")}
  </span>
</h1>


      {/* Smart Recommendations */}
      <div className="mt-8">
        <SmartRecommendations />
      </div>

      {/* Product List */}
      <div className="mt-12">
        <ProductList theme={theme} className="flex flex-wrap justify-center gap-6" />
      </div>
    </div>
  );
};

export default Menu;
