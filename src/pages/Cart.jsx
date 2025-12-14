import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  increaseQty,
  decreaseQty,
  removeFromCartFirebase,
} from "../redux/cartSlice";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { items, loading } = useSelector((state) => state.cart);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const service = subtotal * 0.1;
  const total = subtotal + service;

  const handleRemove = (productId) => setConfirmDelete(productId);
  const confirmRemove = () => {
    if (confirmDelete) {
      dispatch(removeFromCartFirebase(confirmDelete));
      setConfirmDelete(null);
    }
  };
  const cancelRemove = () => setConfirmDelete(null);

  const bgMain =
    theme === "light"
      ? "bg-[#FFF8F1] text-gray-900"
      : "bg-[#0f0f0f] text-white";
  const bgCard =
    theme === "light"
      ? "bg-white text-gray-900"
      : "bg-[#1a1a1a] text-white";
  const textPrimary =
    theme === "light" ? "text-light-primary" : "text-dark-primary";
  const btnPrimary =
    theme === "light"
      ? "bg-light-primary text-black hover:bg-light-primary/90"
      : "bg-amber-500 text-black hover:bg-amber-600";

  if (loading)
    return (
      <div className={`pt-16 min-h-screen flex justify-center items-center ${bgMain}`}>
        <p className="text-xl">Loading...</p>
      </div>
    );

  if (items.length === 0)
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center ${bgMain}`}>
        <p className="text-2xl mb-4">Your cart is empty.</p>
      </div>
    );

  return (
    <div className={`pt-24 min-h-screen px-4 sm:px-12 ${bgMain}`}>
      {/* Title */}
      <h1
        className={`text-4xl font-bold mb-12 text-center`}
        style={{
          fontFamily: "'Playwrite CZ', cursive",
          letterSpacing: "1px",
        }}
      >
        <span className={theme === "light" ? "text-black" : "text-white"}>Your</span>{" "}
        <span className={theme === "light" ? "text-light-primary" : "text-dark-primary"}>
          Cart
        </span>
      </h1>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Items */}
        <div className="flex-1 flex flex-col gap-6">
          {items.map((item) => {
            const stock = Number(item.stock) || 0;

            return (
              <div
                key={item.productId}
                className={`flex gap-6 rounded-2xl p-5 shadow-xl transition hover:shadow-2xl ${bgCard}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-xl"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <h2 className="text-xl font-semibold mb-1">{item.name}</h2>

                  <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                    <span className={`${textPrimary} font-bold text-lg`}>
                      {(item.price * item.quantity).toFixed(2)} EGP
                    </span>

                    {/* Quantity */}
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          item.quantity > 1 && dispatch(decreaseQty(item.productId))
                        }
                        disabled={item.quantity <= 1}
                        className={`px-3 py-1 bg-gray-200 hover:bg-gray-300 transition ${
                          item.quantity <= 1 && "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        -
                      </button>

                      <span className="px-5 py-1 text-center w-12">{item.quantity}</span>

                      <button
                        onClick={() =>
                          item.quantity < stock && dispatch(increaseQty(item.productId))
                        }
                        disabled={item.quantity >= stock}
                        className={`px-3 py-1 bg-gray-200 hover:bg-gray-300 transition ${
                          item.quantity >= stock && "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="p-2 rounded-full hover:bg-red-200 transition"
                      title="Remove Item"
                    >
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className={`w-full lg:w-1/3 rounded-2xl p-6 shadow-xl ${bgCard}`}>
          <h2 className={`text-2xl font-semibold mb-6 ${textPrimary}`}>Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)} EGP</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Service (10%)</span>
            <span>{service.toFixed(2)} EGP</span>
          </div>

          <div className={`flex justify-between text-lg font-bold mt-4 ${textPrimary}`}>
            <span>Total</span>
            <span>{total.toFixed(2)} EGP</span>
          </div>

          <button
            className={`mt-6 w-full font-semibold py-3 rounded-xl ${btnPrimary} transition hover:opacity-90`}
            onClick={() => navigate("/checkout", { state: { items, total } })}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-2xl w-80 text-center ${bgCard} shadow-2xl`}
          >
            <p className="mb-6 text-lg">
              Are you sure you want to remove this item?
            </p>
            <div className="flex justify-around gap-6">
              <button
                onClick={confirmRemove}
                className={`px-4 py-2 rounded-xl font-semibold ${btnPrimary}`}
              >
                Yes
              </button>
              <button
                onClick={cancelRemove}
                className="px-4 py-2 rounded-xl bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
