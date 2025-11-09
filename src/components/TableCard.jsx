import React from "react";

const TableCard = ({ table, selected }) => {
  const isSelected = selected === table.id;

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-2xl shadow-lg transition-transform transform hover:scale-105
        ${
          isSelected
            ? "bg-[#5a3c1b] border-2 border-white cursor-pointer"
            : "bg-black border border-primary cursor-pointer" 
        }`}
    >
      <div className="flex justify-center mb-3">
        <img
          src={table.image || "https://images.unsplash.com/photo-1599423300746-b62533397364?w=400&q=80"}
          alt={`Table ${table.id}`}
          className="w-24 h-24 object-cover rounded-md"
        />
      </div>

      <h2 className="text-xl font-semibold text-white mb-1 text-center">
        Table {table.id}
      </h2>

      <p
        className={`text-lg font-medium ${
          isSelected ? "text-white" : "text-white"
        }`}
      >
        {isSelected ? "Selected" : table.status === "available" ? "Available" : "Occupied"}
      </p>
    </div>
  );
};

export default TableCard;
