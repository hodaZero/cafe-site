import React from "react";
import { useTheme } from "../context/ThemeContext";

const statusStyles = (theme) => ({
  processing: theme === "light" 
    ? "bg-yellow-100/40 text-yellow-600" 
    : "bg-yellow-100/20 text-yellow-300",
  completed: theme === "light" 
    ? "bg-green-100/40 text-green-600" 
    : "bg-green-100/20 text-green-300",
  cancelled: theme === "light" 
    ? "bg-red-100/40 text-red-600" 
    : "bg-red-100/20 text-red-400",
});

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

const OrderItem = ({ order }) => {
  const { theme } = useTheme();
  const styleClass = statusStyles(theme)[order.status.toLowerCase()] || statusStyles(theme).processing;

  const firstItemName = order.items[0]?.name || "Cappuccino";
  const orderImage = defaultImages[firstItemName] || defaultImages["Cappuccino"];

  const bgClass = theme === "light"
    ? "bg-light-surface/70 border border-[#D1D5DB]/30"
    : "bg-dark-surface/70 border border-[#3F3F46]/30";

  const textPrimary = theme === "light" ? "text-light-text" : "text-dark-text";
  const textSecondary = theme === "light" ? "text-light-heading/80" : "text-dark-text/80";
  const borderColor = theme === "light" ? "border-[#D3AD7F]" : "border-[#D3AD7F]";

  const itemsText = order.items.map(item => `${item.quantity || 1}x ${item.name}`).join(", ");

  return (
    <div className={`flex justify-between items-center rounded-xl px-4 py-3 mb-3 shadow-md backdrop-blur-md ${bgClass}`}>
      <div className="flex items-center space-x-4">
        <img src={orderImage} alt={`Order ${order.id}`} className={`w-12 h-12 rounded-full object-cover border-2 ${borderColor}`} />
        <div>
          <p className={`font-semibold ${textPrimary}`}>Order #{order.id}</p>
          <p className={`text-sm ${textSecondary}`}>{itemsText}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styleClass}`}>
        {order.status}
      </span>
    </div>
  );
};

export default OrderItem;
