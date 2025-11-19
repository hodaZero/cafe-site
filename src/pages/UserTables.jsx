import React, { useState } from "react";
import TableCard from "../components/TableCard";
import { useTheme } from "../context/ThemeContext";

const UserTables = () => {
  const { theme } = useTheme();

  const [tables, setTables] = useState([
    { id: 1, status: "available", floor: "Upstairs", image: "https://images.unsplash.com/photo-1542372147193-a7aca54189cd?auto=format&fit=crop&w=600&q=80" },
    { id: 2, status: "available", floor: "Upstairs", image: "https://images.unsplash.com/photo-1542372147193-a7aca54189cd?auto=format&fit=crop&w=600&q=80" },
    { id: 3, status: "occupied", floor: "Upstairs", image: "https://images.unsplash.com/photo-1594000311835-6d564e5a46b3?auto=format&fit=crop&w=600&q=80" },
    { id: 4, status: "occupied", floor: "Upstairs", image: "https://images.unsplash.com/photo-1594000311835-6d564e5a46b3?auto=format&fit=crop&w=600&q=80" },
    { id: 5, status: "available", floor: "Downstairs", image: "https://images.unsplash.com/photo-1635829552279-93a1e69ec4a6?auto=format&fit=crop&w=600&q=80" },
    { id: 6, status: "available", floor: "Downstairs", image: "https://images.unsplash.com/photo-1635829552279-93a1e69ec4a6?auto=format&fit=crop&w=600&q=80" },
    { id: 7, status: "available", floor: "Downstairs", image: "https://images.unsplash.com/photo-1635829552279-93a1e69ec4a6?auto=format&fit=crop&w=600&q=80" },
    { id: 8, status: "available", floor: "Downstairs", image: "https://images.unsplash.com/photo-1635829552279-93a1e69ec4a6?auto=format&fit=crop&w=600&q=80" },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);
  const floors = ["Upstairs", "Downstairs"];

  const bgMain = theme === "light" ? "bg-light-background text-light-text" : "bg-dark-background text-dark-text";
  const headingColor = theme === "light" ? "text-light-heading" : "text-dark-heading";
  const primaryBtn = theme === "light" ? "bg-light-primary hover:bg-light-primaryHover text-black" : "bg-dark-primary hover:bg-dark-primaryHover text-dark-text";

  return (
    <div className={`min-h-screen flex flex-col items-center py-12 px-6 transition-colors duration-300 ${bgMain}`}>
      <h1 className={`text-4xl font-bold mb-12 text-center ${headingColor}`}>
        Select Your Table
      </h1>

      {floors.map((floor) => (
        <div key={floor} className="w-full max-w-6xl mb-10">
          <h2 className={`text-2xl font-semibold mb-4 ${headingColor}`}>{floor}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables
              .filter((table) => table.floor === floor)
              .map((table) => (
                <div
                  key={table.id}
                  onClick={() =>
                    table.status === "available" && setSelectedTable(table.id)
                  }
                >
                  <TableCard table={table} selected={selectedTable} />
                </div>
              ))}
          </div>
        </div>
      ))}

      {selectedTable && (
        <button className={`mt-8 px-8 py-3 rounded-xl transition-colors ${primaryBtn}`}>
          Confirm Table {selectedTable}
        </button>
      )}
    </div>
  );
};

export default UserTables;
