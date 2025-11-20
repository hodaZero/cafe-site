import React from "react";
import OrderItem from "../components/OrderItem";
import { useTheme } from "../context/ThemeContext";

export default function Orders() {
  const { theme } = useTheme();

  const pageClass =
    theme === "dark"
      ? "bg-dark-background text-white"
      : "bg-white text-black";

  return (
    <div className={`p-4 pt-16 min-h-screen transition-colors duration-300 ${pageClass}`}>
      <OrderItem
        id={12345}
        items="2x Cappuccino, 1x Croissant"
        status="Processing"
      />
    </div>
  );
}
