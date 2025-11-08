import React from "react";
import ProfileCard from "../components/ProfileCard";
import OrderItem from "../components/OrderItem";
import backgroundPic from "../assets/images/backgroundPic.jpg";

const ProfilePage = () => {
  const orders = [
    { id: 12345, items: "2x Cappuccino, 1x Croissant", status: "Processing" },
    { id: 12346, items: "1x Latte, 2x Donut", status: "Completed" },
    { id: 12347, items: "1x Espresso", status: "Cancelled" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center py-12 overflow-hidden">
   
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundPic})`,
          filter: "brightness(0.35)",
        }}
      ></div>

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center w-full">
        <ProfileCard
          name="Shimaa Mohamed"
          email="shimaa@example.com"
          avatar="https://i.pravatar.cc/100"
        />

        <div
          className="rounded-2xl p-6 w-full max-w-3xl mt-6 shadow-lg backdrop-blur-md"
          style={{
            backgroundColor: "rgba(107, 79, 63, 0.12)", 
            border: "1px solid rgba(255, 255, 255, 0.08)", 
          }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-[#F8F5F2]">
            My Orders
          </h3>

          <div className="space-y-3">
            {orders.map((order) => (
              <OrderItem
                key={order.id}
                id={order.id}
                items={order.items}
                status={order.status}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
