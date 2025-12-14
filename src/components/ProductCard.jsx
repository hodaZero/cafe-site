import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoriteSlice";
import { toggleCartItem } from "../redux/cartSlice";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebase/firebaseConfig";

const ProductCard = ({ product, adminView = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  /* ================== Redux ================== */
  const favorites = useSelector((s) => s.favorite?.favorites || []);
  const cartItems = useSelector((s) => s.cart?.items || []);

  /* ================== Safe Values ================== */
  const productId = product?.id || product?.productId;
  const cartItem = cartItems.find((c) => c.productId === productId);
  const isFavorite = favorites.some((f) => f.productId === productId);
  const isInCart = !!cartItem;

  const initialStock = Number(product?.stock) || 0;
  const initialQuantity = cartItem ? cartItem.quantity : 1;

  /* ================== State ================== */
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity > initialStock ? initialStock : cartItem.quantity);
    }
  }, [cartItem, initialStock]);

  /* ✅ AFTER ALL HOOKS */
  if (!product) return null;

  /* ================== Handlers ================== */
  const goToDetails = () => {
    if (!adminView) navigate(`/product/${productId}`);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (!auth.currentUser) return navigate("/login");
    dispatch(toggleFavorite({ ...product, productId }));
  };

  const handleToggleCart = (e) => {
    e.stopPropagation();
    if (!auth.currentUser) return navigate("/login");
    if (initialStock <= 0) return;

    const finalQty = quantity > initialStock ? initialStock : quantity;

    dispatch(
      toggleCartItem({
        product: { ...product, productId },
        quantity: finalQty,
      })
    );
    setQuantity(finalQty);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (quantity < initialStock) {
      const newQty = quantity + 1;
      setQuantity(newQty);

      if (isInCart) {
        dispatch(
          toggleCartItem({
            product: { ...product, productId },
            quantity: newQty,
          })
        );
      }
    }
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);

      if (isInCart) {
        dispatch(
          toggleCartItem({
            product: { ...product, productId },
            quantity: newQty,
          })
        );
      }
    }
  };

  /* ================== Theme ================== */
  const bgColor = theme === "dark" ? "bg-[#1C1C1E]" : "bg-[#FFF8F1]";
  const textColor = theme === "dark" ? "text-[#EDEDED]" : "text-[#2C2C2C]";
  const primaryColor = "#D97706";
  const primaryHover = "#B45309";
  const iconBg = theme === "dark" ? "bg-[#2A2A2E]" : "bg-[#F3F3F3]";

  return (
    <div
      onClick={goToDetails}
      className={`${bgColor} rounded-xl shadow-md hover:shadow-lg transition p-4 cursor-pointer max-w-sm mx-auto`}
      style={{ borderRadius: "18px" }}
    >
      {/* IMAGE */}
      <div className="w-full h-48 overflow-hidden rounded-xl mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* PRICE + ICONS */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-xl font-bold" style={{ color: primaryColor }}>
          ${product.price}
        </p>

        {!adminView && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`${iconBg} p-2 rounded-full`}
            >
              <Heart
                size={18}
                fill={isFavorite ? primaryColor : "none"}
                color={primaryColor}
              />
            </button>

            <button
              onClick={handleToggleCart}
              className={`${iconBg} p-2 rounded-full`}
              disabled={initialStock <= 0}
            >
              <ShoppingCart
                size={18}
                color={isInCart ? primaryColor : "#9CA3AF"}
                fill={isInCart ? primaryColor : "none"}
              />
            </button>
          </div>
        )}
      </div>

      {/* NAME */}
      <p className={`${textColor} text-lg font-medium mb-1`}>
        {product.name}
      </p>

      {/* STOCK */}
      <p className="text-sm text-gray-500 mb-3">
        Available: {initialStock} pcs
      </p>

      {/* USER CONTROLS */}
      {!adminView && (
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={handleDecrease}
              className="px-3 py-1 bg-gray-200"
              disabled={quantity <= 1}
            >
              -
            </button>

            <span className="px-4 py-1 text-center w-12">{quantity}</span>

            <button
              onClick={handleIncrease}
              className="px-3 py-1 bg-gray-200"
              disabled={quantity >= initialStock || initialStock === 0}
            >
              +
            </button>
          </div>

          <button
            onClick={handleToggleCart}
            className="text-white px-5 py-2 rounded-lg flex items-center gap-2"
            style={{
              backgroundColor: initialStock > 0 ? primaryColor : "#9CA3AF",
              cursor: initialStock > 0 ? "pointer" : "not-allowed",
            }}
            onMouseEnter={(e) => {
              if (initialStock > 0) e.currentTarget.style.backgroundColor = primaryHover;
            }}
            onMouseLeave={(e) => {
              if (initialStock > 0) e.currentTarget.style.backgroundColor = primaryColor;
            }}
            disabled={initialStock <= 0}
          >
            {isInCart ? "Update Cart" : "Add to Cart"}
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
