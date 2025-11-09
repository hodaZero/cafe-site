// src/pages/Favorites.jsx
import React from "react";
import { Heart, ShoppingCart } from "lucide-react";

const favoriteProducts = [
  {
    id: 1,
    name: "Cappuccino",
    price: 12,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1606813908543-c7ad551fcb52?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Latte",
    price: 10,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1588776814546-6a0d8f3727c8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Cheesecake",
    price: 8,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1599785209707-1c8c37d88da6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Espresso",
    price: 6,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1603133872872-7f0a76fdf1f8?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Favorites() {
  return (
    <div className="min-h-screen bg-dark text-white p-6">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">
        Your Favorites
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#1a1a1a] text-white rounded-xl p-5 cursor-default hover:scale-105 transition-transform"
          >
            <div className="flex justify-center mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>

            <h3 className="text-lg font-semibold text-center">{product.name}</h3>

            <div className="flex justify-center items-center gap-4 text-[#d3ad7f] text-sm mb-2">
              <p>₹{product.price}.00</p>
              <span>{product.rating}</span>
            </div>

            <div className="flex justify-center gap-4 mt-3">
              <button className="bg-[#333] p-2 rounded-full hover:bg-[#d3ad7f] transition">
                <Heart size={18} />
              </button>
              <button className="bg-[#333] p-2 rounded-full hover:bg-[#d3ad7f] transition">
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
