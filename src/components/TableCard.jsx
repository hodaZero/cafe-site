import React from "react";
import { useTheme } from "../context/ThemeContext";

const TableCard = ({ table, selected }) => {
  const { theme } = useTheme();
  const isSelected = selected === table.id;

  const baseBg = theme === "light"
    ? "bg-light-surface"
    : "bg-dark-surface";
  const textColor = theme === "light"
    ? "text-light-text"
    : "text-dark-text";
  const shadowColor =
    table.status === "available"
      ? "shadow-[0_0_8px_1px_rgba(34,197,94,0.5)]"
      : table.status === "occupied"
      ? "shadow-[0_0_8px_1px_rgba(239,68,68,0.5)]"
      : table.status === "pending"
      ? "shadow-[0_0_8px_1px_rgba(245,158,11,0.5)]"
      : "";

  const hoverEffect = table.status === "available" ? "hover:scale-105" : "";
  const statusText =
    table.status === "available"
      ? "Available"
      : table.status === "pending"
      ? "Pending"
      : "Occupied";

  const statusTextColor =
    table.status === "available"
      ? "text-green-600"
      : table.status === "occupied"
      ? "text-red-600"
      : "text-yellow-600";

  return (
    <div
      className={`flex flex-col items-center p-3 rounded-2xl
        transition-transform transform duration-200 cursor-pointer border
        ${baseBg} ${shadowColor} ${hoverEffect}`}
    >
      <div className="flex justify-center mb-2">
        <img
          src={
            table.image ||
            "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80"
          }
          alt={`Table ${table.tableNumber || table.id}`}
          className="w-20 h-20 object-cover rounded-full"
        />
      </div>

      <h2 className={`text-lg font-semibold mb-1 text-center ${textColor}`}>
        Table {table.tableNumber || table.id}
      </h2>

      <p className={`text-sm font-bold ${statusTextColor} text-center`}>
        {statusText}
      </p>
      <p className={`text-xs font-medium text-center ${textColor} mt-1`}>
        Seats: {table.seats || 1}
      </p>
    </div>
  );
};

export default TableCard;
