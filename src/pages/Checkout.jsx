// --- CHECKOUT PAGE (FINAL VERSION) ---
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { db, auth } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

const CheckoutPage = () => {
  const { theme } = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();

  const items = state?.items || [];
  const total = state?.total || 0;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone Number is required.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.payment) newErrors.payment = "Select a payment method.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    try {
      await addDoc(collection(db, "users", user.uid, "orders"), {
        userId: user.uid,
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        payment: form.payment,
        items,
        total,
        status: "pending",
        createdAt: new Date(),
      });

      // Empty Cart
      const cartSnapshot = await getDocs(
        collection(db, "users", user.uid, "cart")
      );
      const deletePromises = cartSnapshot.docs.map((d) =>
        deleteDoc(doc(db, "users", user.uid, "cart", d.id))
      );
      await Promise.all(deletePromises);

      setSuccess("Order placed successfully!");

      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (err) {
      console.error(err);
      setSuccess("Error placing order. Try again.");
    }
  };

  const bgMain =
    theme === "light"
      ? "bg-gray-100 text-gray-900"
      : "bg-[#0f0f0f] text-white";

  const bgCard =
    theme === "light"
      ? "bg-white text-gray-900 shadow-lg"
      : "bg-[#1a1a1a] text-white shadow-lg";

  const inputBg =
    theme === "light"
      ? "bg-gray-100 text-gray-900"
      : "bg-[#2a2a2a] text-white placeholder-gray-400";

  const buttonClass =
    theme === "dark"
      ? "bg-dark-primary text-dark-text hover:bg-dark-primaryHover"
      : "bg-light-primary text-white hover:bg-light-primaryHover";

  return (
    <div className={`pt-16 min-h-screen py-12 px-6 flex flex-col items-center ${bgMain}`}>
      <h1 className="text-4xl font-bold mb-10 text-dark-primary">Checkout</h1>

      <div className={`w-full max-w-6xl rounded-3xl p-10 flex flex-col gap-12 ${bgCard}`}>
        {/* Order Items */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-dark-primary">Your Order</h2>

          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-xl shadow-md ${bgCard}`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{item.name}</span>
                    <span className="font-bold opacity-80">{item.price} EGP</span>
                    <span className="text-sm opacity-70">
                      Qty: {item.quantity || 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-center opacity-70 text-lg">Your order is empty.</p>
            )}
          </div>
        </div>

        {/* Shipping */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold mb-2 text-dark-primary">
            Enter Shipping Details
          </h2>

          {/* Fields */}
          {[
            { icon: <FaUser />, name: "name", placeholder: "Full Name" },
            { icon: <FaEnvelope />, name: "email", placeholder: "Email" },
            { icon: <FaPhone />, name: "phone", placeholder: "Phone Number" },
            {
              icon: <FaMapMarkerAlt />,
              name: "address",
              placeholder: "Shipping Address",
            },
          ].map((f, i) => (
            <div key={i}>
              <div className={`flex items-center gap-3 p-4 rounded-xl shadow-md ${bgCard}`}>
                {f.icon}
                <input
                  name={f.name}
                  value={form[f.name]}
                  placeholder={f.placeholder}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none ${inputBg}`}
                />
              </div>
              {errors[f.name] && (
                <span className="text-red-500 text-sm ml-4">{errors[f.name]}</span>
              )}
            </div>
          ))}

          {/* Payment */}
          <div>
            <div className={`flex items-center gap-3 p-4 rounded-xl shadow-md ${bgCard}`}>
              <FaCreditCard />
              <select
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none ${inputBg}`}
              >
                <option value="">Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="vodafone">Vodafone Cash</option>
              </select>
            </div>

            {errors.payment && (
              <span className="text-red-500 text-sm ml-4">{errors.payment}</span>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className={`rounded-3xl p-6 shadow-xl flex flex-col gap-6 ${bgCard}`}>
          <h2 className="text-3xl font-bold text-center text-dark-primary">
            Order Summary
          </h2>

          {items.map((item) => (
            <div key={item.id} className="flex justify-between opacity-90">
              <span>{item.name}</span>
              <span>{item.price} EGP</span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg border-t pt-4 text-dark-primary">
            <span>Total</span>
            <span>{total} EGP</span>
          </div>

          {success && (
            <p className="text-green-500 text-center font-semibold">{success}</p>
          )}

          <button
            onClick={handlePlaceOrder}
            className={`mt-4 w-full font-bold py-4 rounded-2xl shadow-lg ${buttonClass}`}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
