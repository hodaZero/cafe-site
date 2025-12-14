import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { fetchFavorites } from "../redux/favoriteSlice";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const favorites = useSelector((state) => state.favorite.favorites || []);
  const loading = useSelector((state) => state.favorite.loading);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const bgMain =
    theme === "light"
      ? "bg-light-background text-light-text"
      : "bg-dark-background text-dark-text";

  return (
    <div
      className={`min-h-screen px-8 pt-24 pb-12 transition-colors duration-300 ${bgMain}`}
    >
<h1
  className="text-3xl md:text-4xl font-bold mb-12 text-center"
  style={{
    fontFamily: "'Playwrite CZ', cursive",
    letterSpacing: "1px",
  }}
>
  <span className={theme === "light" ? "text-black" : "text-white"}>
    Your
  </span>{" "}
  <span className={theme === "light" ? "text-light-primary" : "text-dark-primary"}>
    Favorites
  </span>
</h1>

      {loading ? (
        <p className="text-center text-light-heading/60 dark:text-dark-heading/60 text-lg">
          {t("favorites.loading")}
        </p>
      ) : favorites.length === 0 ? (
        <p className="text-center text-light-heading/60 dark:text-dark-heading/60 text-lg">
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