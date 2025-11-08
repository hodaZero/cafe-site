import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaMoneyBillAlt } from "react-icons/fa";

const CheckoutPage = () => {
  const items = [
    { id: 1, name: "Caramel Latte", price: 65, image: "https://images.unsplash.com/photo-1600271886369-6f7f6b7c8d3e?w=600&q=80" },
    { id: 2, name: "Chocolate Cake Slice", price: 45, image: "https://images.unsplash.com/photo-1605475128023-9a6e72bbfbae?w=600&q=80" },
    { id: 3, name: "Cappuccino", price: 60, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80" },
    { id: 4, name: "Cheesecake", price: 55, image: "https://images.unsplash.com/photo-1601972599720-b6f64f42ecb1?w=600&q=80" },
  ];

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-black py-12 px-4 flex flex-col items-center">

    
      <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

    
      <div className="w-full max-w-5xl bg-dark rounded-3xl p-8 shadow-2xl flex flex-col gap-8">

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Your Order</h2>
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-black p-4 rounded-xl">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <span className="text-white font-semibold">{item.name}</span>
              </div>
              <span className="text-primary font-bold">{item.price} EGP</span>
            </div>
          ))}
        </div>

     
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Enter Shipping Details</h2>

       
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-black p-4 rounded-xl">
            <FaUser className="text-primary" />
            <input type="text" placeholder="Full Name" className="w-full bg-transparent text-white placeholder-white focus:outline-none" />
          </div>
          <div className="flex items-center gap-3 bg-black p-4 rounded-xl">
            <FaEnvelope className="text-primary" />
            <input type="email" placeholder="Email" className="w-full bg-transparent text-white placeholder-white focus:outline-none" />
          </div>
          <div className="flex items-center gap-3 bg-black p-4 rounded-xl">
            <FaPhone className="text-primary" />
            <input type="tel" placeholder="Phone Number" className="w-full bg-transparent text-white placeholder-white focus:outline-none" />
          </div>
          <div className="flex items-center gap-3 bg-black p-4 rounded-xl">
            <FaMapMarkerAlt className="text-primary" />
            <input type="text" placeholder="Shipping Address" className="w-full bg-transparent text-white placeholder-white focus:outline-none" />
          </div>
          <div className="flex items-center gap-3 bg-black p-4 rounded-xl">
            <FaCreditCard className="text-primary" />
            <select className="w-full bg-transparent text-white focus:outline-none">
              <option className="text-black" value="">Payment Method</option>
              <option className="text-black" value="cash">Cash <FaMoneyBillAlt className="inline ml-1" /></option>
              <option className="text-black" value="card">Card</option>
            </select>
          </div>

       
          <div className="flex justify-between text-white font-bold text-lg mt-4">
            <span>Total</span>
            <span className="text-primary">{total} EGP</span>
          </div>


          <button className="mt-4 w-full bg-primary text-black font-bold py-4 rounded-2xl hover:bg-[#c79b72] transition-all shadow-lg">
            Confirm Payment
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
