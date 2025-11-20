import React, { useState } from "react";
import TableCard from "../components/TableCard";
import { useTheme } from "../context/ThemeContext";

const AdminTables = () => {
  const { theme } = useTheme();
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

  // Theme Colors
  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-dark text-white";
  const floorTitle = theme === "light" ? "text-gray-900" : "text-white";
  const buttonAccept = "bg-[#d3ad7f] text-black hover:bg-[#b38a5f]";
  const buttonReject = "bg-[#a67c52] text-white hover:bg-[#8b6642]";
  const buttonDelete = "bg-[#555] text-white hover:bg-[#777]";

  return (
    <div className={`pt-16 min-h-screen flex flex-col items-center py-12 px-6 transition-colors duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Admin Tables</h1>

      {floors.map((floor) => (
        <div key={floor} className="w-full max-w-6xl mb-10">
          <h2 className={`text-2xl font-semibold mb-4 ${floorTitle}`}>{floor}</h2>

          <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
            <button
              onClick={() => handleAddTable(floor)}
              className={`px-6 py-2 rounded-xl font-semibold transition ${buttonAccept}`}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tables
              .filter((table) => table.floor === floor)
              .map((table) => (
                <div key={table.id}>
                  <TableCard table={table} selected={selectedTable} />
                  <div className="flex gap-2 justify-center mt-2 flex-wrap">
                    <button
                      onClick={() => handleAccept(table.id)}
                      className={`px-3 py-1 rounded-md font-semibold transition ${buttonAccept}`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(table.id)}
                      className={`px-3 py-1 rounded-md font-semibold transition ${buttonReject}`}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className={`px-3 py-1 rounded-md font-semibold transition ${buttonDelete}`}
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
