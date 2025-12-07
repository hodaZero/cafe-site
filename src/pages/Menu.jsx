import React from "react";
import ProductList from "../components/ProductList";
import SmartRecommendations from "../components/SmartRecommendations";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const Menu = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-black text-white";
  const titleColor = theme === "light" ? "text-light-primary" : "text-dark-primary";

  return (
    <div className={`pt-16 min-h-screen px-6 md:px-16 text-center transition-colors duration-300 ${bgMain}`}>
      <h1 className={`text-3xl md:text-4xl font-bold pt-10 ${theme === "light" ? "text-light-text" : "text-dark-text"}`}>
        {t("menuPage.ourMenu").split(" ")[0]} <span className={titleColor}>{t("menuPage.ourMenu").split(" ")[1]}</span>
      </h1>

      {/* Smart Recommendations */}
      <SmartRecommendations />
      <ProductList theme={theme} />
    </div>
  );
};

export default Menu;
