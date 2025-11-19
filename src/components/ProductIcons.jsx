import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ProductIcons = () => {
  const { theme } = useTheme();

  const iconColor = theme === "light" ? "text-light-primary" : "text-dark-primary";
  const iconHover = theme === "light" ? "hover:text-light-primaryHover" : "hover:text-dark-primaryHover";

  return (
    <>
      <button className={`${iconColor} ${iconHover} transition-colors`}>
        <Heart size={22} />
      </button>
      <button className={`${iconColor} ${iconHover} transition-colors`}>
        <ShoppingCart size={22} />
      </button>
    </>
  );
};

export default ProductIcons;
