import React, { useState } from "react";
import TableCard from "../components/TableCard"; // استخدمنا الكارد بتاعك

const AdminTables = () => {
  const [tables, setTables] = useState([
    { id: 1, status: "available", floor: "Upstairs", image: "" },
    { id: 2, status: "occupied", floor: "Upstairs", image: "" },
    { id: 3, status: "available", floor: "Upstairs", image: "" },
    { id: 4, status: "occupied", floor: "Upstairs", image: "" },
    { id: 5, status: "available", floor: "Downstairs", image: "" },
    { id: 6, status: "occupied", floor: "Downstairs", image: "" },
    { id: 7, status: "available", floor: "Downstairs", image: "" },
    { id: 8, status: "occupied", floor: "Downstairs", image: "" },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);
  const floors = ["Upstairs", "Downstairs"];

  const handleAccept = (id) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "available" } : t))
    );
  };

  const handleReject = (id) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "occupied" } : t))
    );
  };

  const handleDelete = (id) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTable = (floor) => {
    const newId = tables.length + 1;
    setTables([...tables, { id: newId, status: "available", floor, image: "" }]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-6">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Admin Tables</h1>

      {floors.map((floor) => (
        <div key={floor} className="w-full max-w-6xl mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">{floor}</h2>

          <div className="flex justify-center items-center gap-6 mb-6">
            <button
              onClick={() => handleAddTable(floor)}
              className="px-6 py-2 rounded-xl bg-[#d3ad7f] text-black font-semibold hover:bg-[#b38a5f] transition"
            >
              Add Table
            </button>

            <div className="px-4 py-2 rounded-xl bg-green-600 font-semibold">
              Available: {tables.filter((t) => t.floor === floor && t.status === "available").length}
            </div>
            <div className="px-4 py-2 rounded-xl bg-red-600 font-semibold">
              Occupied: {tables.filter((t) => t.floor === floor && t.status === "occupied").length}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {tables
              .filter((table) => table.floor === floor)
              .map((table) => (
                <div key={table.id}>
                  <TableCard table={table} selected={selectedTable} />
                  <div className="flex gap-2 justify-center mt-2">
                    <button
                      onClick={() => handleAccept(table.id)}
                      className="px-3 py-1 rounded-md bg-[#d3ad7f] text-black font-semibold hover:bg-[#b38a5f] transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(table.id)}
                      className="px-3 py-1 rounded-md bg-[#a67c52] text-white font-semibold hover:bg-[#8b6642] transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className="px-3 py-1 rounded-md bg-[#555] text-white font-semibold hover:bg-[#777] transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminTables;
