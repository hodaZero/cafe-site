import React, { useState } from "react";
import TableCard from "../components/TableCard";

const UserTables = () => {
  const [tables, setTables] = useState([
    { id: 1, status: "available", floor: "Upstairs", image: "https://images.unsplash.com/photo-1542372147193-a7aca54189cd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FmZSUyMHRhYmxlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" },
    { id: 2, status: "available", floor: "Upstairs", image: "https://images.unsplash.com/photo-1542372147193-a7aca54189cd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FmZSUyMHRhYmxlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" },
    { id: 3, status: "occupied", floor: "Upstairs", image: "https://images.unsplash.com/photo-1594000311835-6d564e5a46b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhZmUlMjB0YWJsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" },
    { id: 4, status: "occupied", floor: "Upstairs", image: "https://images.unsplash.com/photo-1594000311835-6d564e5a46b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhZmUlMjB0YWJsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" },
    { id: 5, status: "available", floor: "Downstairs", image: "https://images.unsplash.com/photo-1635829552279-93a1e69ec4a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhZmUlMjB0YWJsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" },
    { id: 6, status: "available", floor: "Downstairs", image: "https://images.unsplash.com/photo-1635829552279-93a1e69ec4a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhZmUlMjB0YWJsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" },
    { id: 7, status: "available", floor: "Downstairs", image: "https://images.unsplash.com/photo-1635829552279-93a1e69ec4a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhZmUlMjB0YWJsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" },
    { id: 8, status: "available", floor: "Downstairs", image: "https://images.unsplash.com/photo-1635829552279-93a1e69ec4a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhZmUlMjB0YWJsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);
  const floors = ["Upstairs", "Downstairs"];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-6">
      <h1 className="text-4xl font-bold text-primary mb-12 text-center">
        Select Your Table
      </h1>

      {floors.map((floor) => (
        <div key={floor} className="w-full max-w-6xl mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">{floor}</h2>
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
        <button className="mt-8 bg-[#5a3c1b] text-white px-8 py-3 rounded-xl hover:bg-[#7a5c3e] transition">
          Confirm Table {selectedTable}
        </button>
      )}
    </div>
  );
};

export default UserTables;



