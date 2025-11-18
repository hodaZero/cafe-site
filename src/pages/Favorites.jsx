import React, { useState } from "react";
import ProductCard from "../components/ProductCard";

const Favorites = () => {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Cappuccino",
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
      price: 80,
      rating: "⭐4.8",
    },
    {
      id: 2,
      name: "Iced Latte",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
      price: 95,
      rating: "⭐4.7",
    },
    {
      id: 3,
      name: "Mocha",
      image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80",
      price: 100,
      rating: "⭐4.9",
    },
  ]);

  const handleFavoriteToggle = (product) => {
    setFavorites((prev) =>
      prev.filter((item) => item.id !== product.id)
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-8 pt-16 pb-12">
    
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Your Favorites
      </h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No favorites yet, Add some from the menu!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showCart={false}
              showHeartTop={true}
              heartColor="red-600"
              isFavorite={true}
              onToggleFavorite={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
