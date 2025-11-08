import React from "react";

const CartPage = () => {
  const items = [
    { id: 1, name: "Caramel Latte", description: "Prep Time: 8 mins", price: 65, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80" },
    { id: 2, name: "Chocolate Cake Slice", description: "Prep Time: 5 mins", price: 45, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80" },
    { id: 3, name: "Cappuccino", description: "Prep Time: 7 mins", price: 60, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80" },
    { id: 4, name: "Cheesecake", description: "Prep Time: 6 mins", price: 55, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80" },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const service = subtotal * 0.1;
  const total = subtotal + service;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-12">
      <h1 className="text-4xl font-bold mb-12 text-center text-white">Domi Café Cart</h1>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">

     
        <div className="flex-1 flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 bg-dark rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all">
              <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-lg" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                  <p className="text-gray-300 mt-1">{item.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-primary font-bold text-lg">{item.price} EGP</span>
                  <div className="flex items-center gap-2 bg-white text-black px-3 py-1 rounded">
                    <button>-</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <button className="ml-4 bg-primary text-black px-4 py-1 rounded hover:bg-[#c79b72] transition">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

     
        <div className="w-full lg:w-1/3 bg-dark rounded-xl p-6 flex flex-col justify-between shadow-lg">
          
      
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-primary mb-2">Order Summary</h2>
            <div className="flex justify-between"><span>Subtotal</span><span>{subtotal} EGP</span></div>
            <div className="flex justify-between"><span>Service (10%)</span><span>{service.toFixed(1)} EGP</span></div>
            <div className="flex justify-between text-lg font-bold text-primary border-t border-gray-600 pt-3">
              <span>Total</span><span>{total.toFixed(1)} EGP</span>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-primary text-black font-semibold py-3 rounded-lg hover:bg-[#c79b72] transition">
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
