import React, { useState, useEffect } from "react";
import TableCard from "../components/TableCard";
import { useTheme } from "../context/ThemeContext";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const AdminTables = () => {
  const { theme } = useTheme();
  const [tables, setTables] = useState([]);
  const floors = ["Upstairs", "Downstairs"];

  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-dark text-white";
  const floorTitle = theme === "light" ? "text-gray-900" : "text-white";

  const tablesCollection = collection(db, "tables");

  useEffect(() => {
    const fetchTables = async () => {
      const snapshot = await getDocs(tablesCollection);
      setTables(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTables();
  }, [tablesCollection]);

  const getNextTableNumber = (floor) => {
    const floorTables = tables.filter(t => t.floor === floor);
    const existingNumbers = floorTables.map(t => t.tableNumber);
    for (let i = 1; i <= 8; i++) {
      if (!existingNumbers.includes(i)) return i;
    }
    return 8;
  };

  const handleAddTable = async (floor) => {
    const tableNumber = getNextTableNumber(floor);
    const newTable = { floor, status: "available", image: "", tableNumber };
    const docRef = await addDoc(tablesCollection, newTable);
    setTables(prev => [...prev, { ...newTable, id: docRef.id }]);
  };

  const handleUpdateStatus = async (id, status) => {
    await updateDoc(doc(db, "tables", id), { status });
    setTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tables", id));
    setTables(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className={`pt-16 min-h-screen flex flex-col items-center py-12 px-6 transition-colors duration-300 ${bgMain}`}>
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Admin Tables</h1>

      {floors.map(floor => (
        <div key={floor} className="w-full max-w-6xl mb-10">
          <h2 className={`text-2xl font-semibold mb-4 ${floorTitle}`}>{floor}</h2>

          <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
            <button
              onClick={() => handleAddTable(floor)}
              className="px-6 py-2 rounded-xl font-semibold transition bg-green-500 text-white hover:bg-green-600"
            >
              Add Table
            </button>
            <div className="px-4 py-2 rounded-xl bg-green-600 font-semibold">
              Available: {tables.filter(t => t.floor === floor && t.status === "available").length}
            </div>
            <div className="px-4 py-2 rounded-xl bg-red-600 font-semibold">
              Occupied: {tables.filter(t => t.floor === floor && t.status === "occupied").length}
            </div>
            <div className="px-4 py-2 rounded-xl bg-yellow-400 font-semibold">
              Pending: {tables.filter(t => t.floor === floor && t.status === "pending").length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tables
              .filter(t => t.floor === floor)
              .sort((a, b) => a.tableNumber - b.tableNumber)
              .map(table => (
                <div key={table.id}>
                  <TableCard table={table} selected={null} />

                  <div className="flex gap-2 justify-center mt-2 flex-wrap">
                    {table.status === "pending" ? (
                      <div className="flex gap-2 items-center">
                        <span className="px-2 py-1 rounded-md bg-yellow-400 text-black font-semibold">
                          Pending Approval
                        </span>
                        <button
                          onClick={() => handleUpdateStatus(table.id, "occupied")}
                          className="px-3 py-1 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600"
                        >
                          ✔ Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(table.id, "available")}
                          className="px-3 py-1 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600"
                        >
                          ✖ Reject
                        </button>
                      </div>
                    ) : (
                      <select
                        value={table.status}
                        onChange={(e) => handleUpdateStatus(table.id, e.target.value)}
                        className="px-3 py-1 rounded-md font-semibold bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="pending">Pending</option>
                      </select>
                    )}

                    <button
                      onClick={() => handleDelete(table.id)}
                      className="px-3 py-1 rounded-md font-semibold bg-gray-700 text-white hover:bg-gray-800"
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
