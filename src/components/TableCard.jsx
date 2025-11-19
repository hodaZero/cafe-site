import React from "react";
import { useTheme } from "../context/ThemeContext";

const TableCard = ({ table, selected }) => {
  const { theme } = useTheme();
  const isSelected = selected === table.id;

  const bg = isSelected
    ? theme === "light" ? "bg-light-primary border-2 border-black" : "bg-dark-primary border-2 border-white"
    : theme === "light" ? "bg-light-surface border border-light-inputBorder" : "bg-dark-surface border border-dark-inputBorder";

  const textColor = isSelected
    ? "text-black font-semibold"
    : theme === "light"
    ? "text-light-text"
    : "text-dark-text";

  const statusText = table.status === "available" ? "Available" : "Occupied";

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-2xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer ${bg}`}
    >
      <div className="flex justify-center mb-3">
        <img
          src={table.image || "https://images.unsplash.com/photo-1599423300746-b62533397364?w=400&q=80"}
          alt={`Table ${table.id}`}
          className="w-24 h-24 object-cover rounded-md"
        />
      </div>

      <h2 className={`text-xl font-semibold mb-1 text-center ${textColor}`}>
        Table {table.id}
      </h2>

      <p className={`text-lg font-medium ${textColor}`}>
        {isSelected ? "Selected" : statusText}
      </p>
    </div>
  );
};

export default TableCard;
