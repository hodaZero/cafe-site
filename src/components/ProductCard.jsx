import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoriteSlice";
import { toggleCartItem, removeFromCartFirebase } from "../redux/cartSlice";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebase/firebaseConfig";

const ProductCard = ({ product, showCart = true, showHeartTop = false, hideFavorite = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorite?.favorites || []);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const { theme } = useTheme();

  const productId = product.id || product.productId;

  const isFavorite = favorites.some((item) => item.productId === productId);
  const isInCart = cartItems.some((item) => item.productId === productId);

  const handleCardClick = () => navigate(`/product/${productId}`);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (!auth.currentUser) {
      navigate("/login"); 
      return;
    }
    dispatch(toggleFavorite({ ...product, productId }));
  };

  const handleToggleCart = (e) => {
    e.stopPropagation();
    if (!auth.currentUser) {
      navigate("/login"); 
      return;
    }

    if (isInCart) {
      // ➕ لو المنتج موجود في الكارت → نحذفه
      dispatch(removeFromCartFirebase(productId));
    } else {
      // ➕ لو المنتج مش موجود → نضيفه
      dispatch(toggleCartItem({ product: { ...product, productId }, quantity: 1 }));
    }
  };

  // Theme-based classes
  const cardBg = theme === "light" ? "bg-light-surface text-light-text" : "bg-dark-surface text-dark-text";
  const heartActive = theme === "light" ? "bg-light-primary text-white" : "bg-dark-primary text-white";
  const heartInactive = theme === "light" ? "bg-[#e5e5e5] text-light-primary" : "bg-[#1a1a1e] text-dark-primary";
  const cartActive = theme === "light" ? "bg-light-primary text-white" : "bg-dark-primary text-white";
  const cartInactive = theme === "light" ? "bg-[#e5e5e5] hover:bg-light-primary text-light-text" : "bg-[#1a1a1e] hover:bg-dark-primary text-dark-text";
  const priceColor = theme === "light" ? "text-light-primary" : "text-dark-primary";

  return (
    <div
      onClick={handleCardClick}
      className={`relative rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform ${cardBg}`}
    >
      {showHeartTop && !hideFavorite && (
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition ${isFavorite ? heartActive : heartInactive}`}
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

      <div className={`flex justify-center items-center gap-4 text-sm mb-2 ${priceColor}`}>
        <p>₹{product.price}.00</p>
        <span>{product.rating}</span>
      </div>

      {!showHeartTop && !hideFavorite && (
        <div className="flex justify-center gap-4 mt-3">
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition ${isFavorite ? heartActive : heartInactive}`}
          >
            <Heart size={18} fill={isFavorite ? "#fff" : "none"} />
          </button>

          {/* Cart Button */}
          {showCart && (
            <button
              onClick={handleToggleCart}
              className={`p-2 rounded-full transition ${isInCart ? cartActive : cartInactive}`}
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
