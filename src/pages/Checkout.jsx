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

  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-[#0f0f0f] text-white";
  const bgCard = theme === "light" ? "bg-white text-gray-900" : "bg-[#1a1a1a] text-white";
  const textPrimary = theme === "light" ? "text-primary" : "text-amber-500";
  const inputBg = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-[#2a2a2a] text-white placeholder-gray-400";

  return (
    <div className={`min-h-screen py-12 px-4 flex justify-center transition-colors duration-300 ${bgMain}`}>
      <div className="w-full max-w-7xl flex gap-8">
        {/* Shipping Details */}
        <div className="flex-[2] flex flex-col gap-6">
          <h1 className={`text-4xl font-bold mb-4 ${textPrimary}`}>Checkout</h1>
          <h2 className={`text-3xl font-bold mb-4 ${textPrimary}`}>Enter Shipping Details</h2>

          {[
            { icon: <FaUser />, placeholder: "Full Name", type: "text" },
            { icon: <FaEnvelope />, placeholder: "Email", type: "email" },
            { icon: <FaPhone />, placeholder: "Phone Number", type: "tel" },
            { icon: <FaMapMarkerAlt />, placeholder: "Shipping Address", type: "text" },
          ].map((field, idx) => (
            <div key={idx} className={`flex items-center gap-3 p-4 rounded-xl shadow-md ${bgCard}`}>
              {React.cloneElement(field.icon, { className: textPrimary })}
              <input
                type={field.type}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none ${inputBg}`}
              />
            </div>
          ))}

          <div className={`flex items-center gap-3 p-4 rounded-xl shadow-md ${bgCard}`}>
            <FaCreditCard className={textPrimary} />
            <select className={`w-full px-3 py-2 rounded-lg focus:outline-none ${inputBg}`}>
              <option value="">Payment Method</option>
              <option value="cash">Cash <FaMoneyBillAlt className="inline ml-1" /></option>
              <option value="card">Card</option>
              <option value="vodafone">Vodafone Cash</option>
            </select>
          </div>
        </div>

        {/* Your Order */}
        <div className="flex-[1] rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
          <h2 className={`text-3xl font-bold text-center ${textPrimary}`}>Your Order</h2>
          {items.map(item => (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl shadow-md ${bgCard}`}>
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <span className="font-semibold">{item.name}</span>
              </div>
              <span className={`font-bold ${textPrimary}`}>{item.price} EGP</span>
            </div>
          ))}
          <div className={`flex justify-between font-bold text-lg mt-4 ${textPrimary}`}>
            <span>Total</span>
            <span>{total} EGP</span>
          </div>

          <button className="mt-4 w-full bg-amber-500 text-black font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all shadow-lg">
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
