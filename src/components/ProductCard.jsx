import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoriteSlice";
import { toggleCartItem } from "../redux/cartSlice";

const ProductCard = ({ product, showCart = true, showHeartTop = false, hideFavorite = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const favorites = useSelector((state) => state.favorite?.favorites || []);
  const cartItems = useSelector((state) => state.cart?.items || []);

  const isFavorite = favorites.some((item) => item.productId === product.id);
  const isInCart = cartItems.some((item) => item.productId === product.id);

  const handleCardClick = () => navigate(`/product/${product.id}`);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(product));
  };

  const handleToggleCart = (e) => {
    e.stopPropagation();
    dispatch(toggleCartItem({ product, quantity: 1 }));
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-[#1a1a1a] text-white rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform"
    >
      {showHeartTop && !hideFavorite && (
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition ${
            isFavorite ? "bg-[#d3ad7f] text-white" : "bg-[#333] text-[#d3ad7f]"
          }`}
        >
          <Heart size={18} fill={isFavorite ? "#fff" : "none"} />
        </button>
      )}

      <div className="flex justify-center mb-4">
        <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-full" />
      </div>

      <h3 className="text-lg font-semibold text-center">{product.name}</h3>

      <div className="flex justify-center items-center gap-4 text-[#d3ad7f] text-sm mb-2">
        <p>₹{product.price}.00</p>
        <span>{product.rating}</span>
      </div>

      {!showHeartTop && !hideFavorite && (
        <div className="flex justify-center gap-4 mt-3">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition ${
              isFavorite ? "bg-[#d3ad7f] text-white" : "bg-[#333] hover:bg-[#d3ad7f]"
            }`}
          >
            <Heart size={18} fill={isFavorite ? "#fff" : "none"} />
          </button>

          {showCart && (
            <button
              onClick={handleToggleCart}
              className={`p-2 rounded-full transition ${
                isInCart ? "bg-[#d3ad7f] text-white" : "bg-[#333] hover:bg-[#d3ad7f]"
              }`}
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
