import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { fetchFavorites } from "../redux/favoriteSlice";

const Favorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorite.favorites);
  const loading = useSelector((state) => state.favorite.loading);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-8 pt-16 pb-12">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Your Favorites</h1>

      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading...</p>
      ) : favorites.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No favorites yet, Add some from the menu!
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
