import React from "react";

const statusStyles = {
  processing: "bg-yellow-100/20 text-yellow-300",
  completed: "bg-green-100/20 text-green-300",
  cancelled: "bg-red-100/20 text-red-400",
};

// صور مناسبة للكافيه
const defaultImages = {
  Cappuccino:
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=50&h=50&fit=crop",
  Latte:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=50&h=50&fit=crop",
  Espresso:
    "https://images.unsplash.com/photo-1585238342029-2dfd6f5e0e99?w=50&h=50&fit=crop",
  Croissant:
    "https://images.unsplash.com/photo-1542838687-49f38c9f19d5?w=50&h=50&fit=crop",
  Donut:
    "https://images.unsplash.com/photo-1617196030786-5f2b9f9a2b0f?w=50&h=50&fit=crop",
};

const OrderItem = ({ id, items, status, image }) => {
  const styleClass =
    statusStyles[status.toLowerCase()] || statusStyles.processing;

  const firstItem = items.split(",")[0].trim().split(" ")[1];
  const orderImage =
    image || defaultImages[firstItem] || defaultImages["Cappuccino"];

  return (
    <div
      className="flex justify-between items-center rounded-xl px-4 py-3 mb-3 shadow-md backdrop-blur-md"
      style={{
        backgroundColor: "rgba(107, 79, 63, 0.25)", // بني شفاف
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      <div className="flex items-center space-x-4">
        <img
          src={orderImage}
          alt={`Order ${id}`}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#D3AD7F]"
        />

        <div>
          <p className="font-semibold text-[#F8F5F2]">Order #{id}</p>
          <p className="text-[#EADFCB] text-sm">{items}</p>
        </div>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${styleClass}`}
      >
        {status}
      </span>
    </div>
  );
};

export default OrderItem;
