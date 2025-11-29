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
      sum +
      (Number(item.price) || 0) * (Number(item.quantity) || 0),
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

  // Theme classes
  const bgMain =
    theme === "light"
      ? "bg-gray-100 text-gray-900"
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

  const btnRemove =
    theme === "light"
      ? "bg-red-200 text-red-800 hover:bg-red-300"
      : "bg-red-600 text-white hover:bg-red-700";

  if (loading)
    return (
      <div
        className={`pt-16 min-h-screen flex justify-center items-center ${bgMain}`}
      >
        <p className="text-xl">Loading...</p>
      </div>
    );

  if (items.length === 0)
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center px-4 sm:px-12 ${bgMain}`}
      >
        <p className="text-2xl mb-4">Your cart is empty.</p>
      </div>
    );

  return (
    <div
      className={`pt-16 min-h-screen py-12 px-4 sm:px-12 transition-colors duration-300 ${bgMain}`}
    >
      <h1
        className={`text-4xl font-bold mb-12 text-center ${textPrimary}`}
      >
        Domi Café Cart
      </h1>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Items List */}
        <div className="flex-1 flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className={`flex gap-6 rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all ${bgCard}`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-400 mt-1">
                    {item.description || "Prep Time: 5 mins"}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                  <span
                    className={`${textPrimary} font-bold text-lg`}
                  >
                    {(Number(item.price) * Number(item.quantity)).toFixed(2)} EGP
                  </span>

                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded ${
                      theme === "light"
                        ? "bg-gray-200 text-black"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    <button
                      onClick={() =>
                        dispatch(decreaseQty(item.productId))
                      }
                      className="px-2"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(increaseQty(item.productId))
                      }
                      className="px-2"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.productId)}
                    className={`ml-4 px-4 py-1 rounded font-semibold transition ${btnRemove}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div
          className={`w-full lg:w-1/3 rounded-xl p-6 flex flex-col justify-between shadow-lg ${bgCard}`}
        >
          <div className="flex flex-col gap-2">
            <h2
              className={`text-2xl font-semibold mb-2 ${textPrimary}`}
            >
              Order Summary
            </h2>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} EGP</span>
            </div>

            <div className="flex justify-between">
              <span>Service (10%)</span>
              <span>{service.toFixed(2)} EGP</span>
            </div>

            <div
              className={`flex justify-between text-lg font-bold border-t border-gray-600 pt-3 ${textPrimary}`}
            >
              <span>Total</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
          </div>

          {/* Navigation button */}
      <button
  className={`mt-6 w-full font-semibold py-3 rounded-lg transition ${btnPrimary}`}
  onClick={() => {
    if (!items || items.length === 0) {
      alert("Your cart is empty! Please add items before checkout.");
      return;
    }
    navigate("/checkout", { state: { items, total } });
  }}
>
  Proceed to Checkout
</button>

        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-xl shadow-lg w-80 text-center bg-[#1a1a1a]">
            <p className="mb-4 text-white">
              Are you sure you want to remove this item?
            </p>

            <div className="flex justify-around">
              <button
                onClick={confirmRemove}
                className="bg-[#d3ad7f] text-black px-4 py-2 rounded hover:bg-[#c79b72] transition"
              >
                Yes
              </button>

              <button
                onClick={cancelRemove}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
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
