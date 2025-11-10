import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

const ProductCard = ({
  product,
  showCart = true,
  showHeartTop = false,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="relative bg-[#1a1a1a] text-white rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform"
    >
      {showHeartTop && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition ${
            isFavorite ? "bg-[#d3ad7f] text-white" : "bg-[#333] text-[#d3ad7f]"
          }`}
        >
          <Heart size={18} fill={isFavorite ? "#fff" : "none"} />
        </button>
      )}

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

     
      {!showHeartTop && (
        <div className="flex justify-center gap-4 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(product);
            }}
            className={`p-2 rounded-full transition ${
              isFavorite ? "bg-[#d3ad7f] text-white" : "bg-[#333] hover:bg-[#d3ad7f]"
            }`}
          >
            <Heart size={18} fill={isFavorite ? "#fff" : "none"} />
          </button>

          {showCart && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="bg-[#333] p-2 rounded-full hover:bg-[#d3ad7f] transition"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
