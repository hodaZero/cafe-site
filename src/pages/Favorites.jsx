import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { fetchFavorites } from "../redux/favoriteSlice";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const favorites = useSelector((state) => state.favorite.favorites || []);
  const loading = useSelector((state) => state.favorite.loading);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-[#0f0f0f] text-white";
  const textPrimary = theme === "light" ? "text-light-primary" : "text-dark-primary";

  return (
    <div className={`min-h-screen px-8 pt-16 pb-12 transition-colors duration-300 ${bgMain}`}>
      <h1 className={`text-3xl font-bold text-center mb-8 ${textPrimary}`}>Your Favorites</h1>

      {loading ? (
        <p className="text-center text-gray-400 text-lg">{t("favorites.loading")}</p>
      ) : favorites.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          {t("favorites.empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {favorites.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              showCart={false}
              showHeartTop={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
