import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, increaseQty, decreaseQty, removeFromCartFirebase } from "../redux/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);

  const [confirmDelete, setConfirmDelete] = useState(null); 

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  const service = subtotal * 0.1;
  const total = subtotal + service;

  const handleRemove = (productId) => {
    setConfirmDelete(productId);
  };

  const confirmRemove = () => {
    if (confirmDelete) {
      dispatch(removeFromCartFirebase(confirmDelete));
      setConfirmDelete(null);
    }
  };

  const cancelRemove = () => {
    setConfirmDelete(null);
  };

  if (loading) 
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p className="text-xl">Loading...</p>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4 sm:px-12">
        <p className="text-2xl mb-4">Your cart is empty.</p>
       
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-12">
      <h1 className="text-4xl font-bold mb-12 text-center">Domi Café Cart</h1>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Items */}
        <div className="flex-1 flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-6 bg-dark rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all"
            >
              <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-lg" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-300 mt-1">Prep Time: 5 mins</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-[#d3ad7f] font-bold text-lg">
                    {(Number(item.price) * Number(item.quantity)).toFixed(2)} EGP
                  </span>

                  <div className="flex items-center gap-2 bg-white text-black px-3 py-1 rounded">
                    <button onClick={() => dispatch(decreaseQty(item.productId))} className="px-2">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => dispatch(increaseQty(item.productId))} className="px-2">+</button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="ml-4 bg-[#d3ad7f] text-black px-4 py-1 rounded hover:bg-[#c79b72] transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3 bg-dark rounded-xl p-6 flex flex-col justify-between shadow-lg">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-[#d3ad7f] mb-2">Order Summary</h2>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Service (10%)</span>
              <span>{service.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#d3ad7f] border-t border-gray-600 pt-3">
              <span>Total</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
          </div>

          <button className="mt-6 w-full bg-[#d3ad7f] text-black font-semibold py-3 rounded-lg hover:bg-[#c79b72] transition">
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg w-80 text-center">
            <p className="mb-4 text-white">Are you sure you want to remove this item?</p>
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
