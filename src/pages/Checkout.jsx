// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from "react";
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
  query,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNotifications } from "../context/NotificationContext";
import { generateAnalytics } from "./services/analytics/analyticsEngine";

const CheckoutPage = () => {
  const { theme } = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedTable } = useSelector((state) => state.cart);
  const { addNotification } = useNotifications();

  const items = state?.items || [];
  const total = state?.total || 0;

  const [tableNumber, setTableNumber] = useState("");
  const [orderTypeLocal, setOrderTypeLocal] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Fetch table info if user has dine-in
  useEffect(() => {
    const fetchUserTable = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "tables"),
          where("reservedBy", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const tableDoc = snapshot.docs[0];
          setTableNumber(tableDoc.data().tableNumber);
          setOrderTypeLocal("dineIn");
        } else {
          setTableNumber("");
          setOrderTypeLocal("takeAway");
        }
      } catch (err) {
        console.error("Error fetching user table:", err);
      }
    };

    fetchUserTable();
  }, []);

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

  // ✅ Handle placing order & updating SmartRecommendations
  const handlePlaceOrder = async () => {
    if (!validate()) return;
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    try {
      // 1️⃣ Add order to Firestore
      await addDoc(collection(db, "users", user.uid, "orders"), {
        userId: user.uid,
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        payment: form.payment,
        items,
        total,
        orderType: orderTypeLocal,
        tableNumber: orderTypeLocal === "dineIn" ? tableNumber : "N/A",
        status: "pending",
        createdAt: new Date(),
      });

      // 2️⃣ Update SmartRecommendations automatically
      await generateAnalytics();
      

      // 3️⃣ Notify admin
      await addNotification({
        to: "admin",
        from: user.uid,
        type: "order",
        title: "New Order Received",
        body: `${form.name} placed a new order totaling ${total} EGP.`,
        relatedId: user.uid,
      });

      // 4️⃣ Clear cart
      const cartSnapshot = await getDocs(
        collection(db, "users", user.uid, "cart")
      );
      const deletePromises = cartSnapshot.docs.map((d) =>
        deleteDoc(doc(db, "users", user.uid, "cart", d.id))
      );
      await Promise.all(deletePromises);

      setSuccess("Order placed successfully!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      console.error(err);
      setSuccess("Error placing order. Try again.");
    }
  };

  const bgMain =
    theme === "light" ? "bg-gray-100 text-gray-900" : "bg-[#0f0f0f] text-white";
  const bgCard =
    theme === "light"
      ? "bg-white text-gray-900 shadow-xl"
      : "bg-[#151515] text-white shadow-lg border border-[#222]";
  const inputBg =
    theme === "light"
      ? "bg-gray-100 text-gray-900"
      : "bg-[#1f1f1f] text-white placeholder-gray-300";
  const buttonClass =
    theme === "dark"
      ? "bg-dark-primary hover:bg-dark-primaryHover text-dark-text"
      : "bg-light-primary hover:bg-light-primaryHover text-white";

  return (
    <div className={`pt-20 min-h-screen px-6 pb-16 ${bgMain}`}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold mb-12 text-center text-dark-primary tracking-wide drop-shadow-lg"
      >
        Checkout
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto`}
      >
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          className={`col-span-2 rounded-3xl p-8 flex flex-col gap-8 ${bgCard}`}
        >
          {/* Table Info */}
          <div className="flex justify-center mb-6">
            {orderTypeLocal === "dineIn" ? (
              <p className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold text-lg shadow-md">
                Table Number: {tableNumber}
              </p>
            ) : (
              <p className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow-md">
                Order Type: Take Away
              </p>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-dark-primary text-center lg:text-left">
              Your Order
            </h2>
            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center justify-between p-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform ${bgCard}`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-2xl shadow-md"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">{item.name}</span>
                      <span className="font-bold opacity-80">
                        {item.price} EGP
                      </span>
                      <span className="text-sm opacity-70">
                        Qty: {item.quantity || 1}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {items.length === 0 && (
                <p className="text-center opacity-70 text-lg">
                  Your cart is empty.
                </p>
              )}
            </div>
          </div>

          {/* Shipping Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-dark-primary text-center lg:text-left">
              Shipping Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <FaUser />, name: "name", placeholder: "Full Name" },
                { icon: <FaEnvelope />, name: "email", placeholder: "Email" },
                { icon: <FaPhone />, name: "phone", placeholder: "Phone Number" },
                { icon: <FaMapMarkerAlt />, name: "address", placeholder: "Address" },
              ].map((f, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
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
                  {errors[f.name] && <span className="text-red-500 text-sm ml-2">{errors[f.name]}</span>}
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
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
                {errors.payment && <span className="text-red-500 text-sm ml-2">{errors.payment}</span>}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          className={`col-span-1 rounded-3xl p-6 flex flex-col gap-6 sticky top-24 ${bgCard} h-fit`}
        >
          <h2 className="text-3xl font-bold text-center text-dark-primary">Order Summary</h2>
          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between opacity-90">
                <span>{item.name}</span>
                <span>{item.price} EGP</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-xl border-t pt-4 text-dark-primary">
            <span>Total</span>
            <span>{total} EGP</span>
          </div>
          {success && <p className="text-green-500 text-center font-semibold">{success}</p>}
          <button
            onClick={handlePlaceOrder}
            className={`mt-4 w-full font-bold py-4 rounded-2xl shadow-lg transition-all ${buttonClass}`}
          >
            Confirm Order
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
