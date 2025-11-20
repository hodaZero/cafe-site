import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaMoneyBillAlt } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const CheckoutPage = () => {
  const { theme } = useTheme();

  const items = [
    { id: 1, name: "Caramel Latte", price: 65, image: "https://images.unsplash.com/photo-1600271886369-6f7f6b7c8d3e?w=600&q=80" },
    { id: 2, name: "Chocolate Cake Slice", price: 45, image: "https://images.unsplash.com/photo-1605475128023-9a6e72bbfbae?w=600&q=80" },
    { id: 3, name: "Cappuccino", price: 60, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80" },
    { id: 4, name: "Cheesecake", price: 55, image: "https://images.unsplash.com/photo-1601972599720-b6f64f42ecb1?w=600&q=80" },
  ];

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900 " : "bg-[#0f0f0f] text-white";
  const bgCard = theme === "light" ? "bg-white text-gray-900 shadow shadow-gray-300" : "text-dark-primary text-dark-text bg-[#1a1a1a]";
  const textPrimary = theme === "light" ? "text-dark-primary" : "text-dark-primary";
  const inputBg = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-[#2a2a2a] text-white placeholder-gray-400";
const buttonClass =
    theme === "dark"
      ? "bg-dark-primary text-dark-text hover:bg-dark-primaryHover"
      : "bg-light-primary text-white hover:bg-light-primaryHover";

  return (
    <div className={`pt-16 min-h-screen py-12 px-4 flex flex-col items-center transition-colors duration-300 ${bgMain}`}>
      <h1 className={`text-4xl font-bold mb-8 ${textPrimary}`}>Checkout</h1>

      <div className={`w-full max-w-5xl rounded-3xl p-8 shadow-2xl flex flex-col gap-8 transition-colors duration-300 ${bgCard}`}>

        {/* Order Items */}
        <div className="flex flex-col gap-4">
          <h2 className={`text-2xl font-bold mb-4 text-center ${textPrimary}`}>Your Order</h2>
          {items.map(item => (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl shadow-md transition-colors duration-300 ${bgCard}`}>
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <span className="font-semibold">{item.name}</span>
              </div>
              <span className={`font-bold ${textPrimary}`}>{item.price} EGP</span>
            </div>
          ))}
        </div>

        {/* Shipping Details */}
        <h2 className={`text-3xl font-bold mb-4 text-center ${textPrimary}`}>Enter Shipping Details</h2>
        <div className="flex flex-col gap-4">
          {[
            { icon: <FaUser />, placeholder: "Full Name", type: "text" },
            { icon: <FaEnvelope />, placeholder: "Email", type: "email" },
            { icon: <FaPhone />, placeholder: "Phone Number", type: "tel" },
            { icon: <FaMapMarkerAlt />, placeholder: "Shipping Address", type: "text" },
          ].map((field, idx) => (
            <div key={idx} className={`flex items-center gap-3 p-4 rounded-xl shadow-md transition-colors duration-300 ${bgCard}`}>
              {React.cloneElement(field.icon, { className: textPrimary })}
              <input
                type={field.type}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none ${inputBg}`}
              />
            </div>
          ))}

          <div className={`flex items-center gap-3 p-4 rounded-xl shadow-md transition-colors duration-300 ${bgCard}`}>
            <FaCreditCard className={textPrimary} />
            <select className={`w-full px-3 py-2 rounded-lg focus:outline-none ${inputBg}`}>
              <option value="">Payment Method</option>
              <option value="cash">Cash <FaMoneyBillAlt className="inline ml-1" /></option>
              <option value="card">Card</option>
            </select>
          </div>

          {/* Total */}
          <div className={`flex justify-between font-bold text-lg mt-4 ${textPrimary}`}>
            <span>Total</span>
            <span>{total} EGP</span>
          </div>

          <button
      className={`mt-4 w-full font-bold py-4 rounded-2xl transition-all shadow-lg ${buttonClass}`}
    >
      Confirm Payment
    </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
