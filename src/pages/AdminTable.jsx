import React, { useState, useEffect } from "react";
import TableCard from "../components/TableCard";
import { useTheme } from "../context/ThemeContext";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";

const AdminTables = () => {
  const { theme } = useTheme();
  const [tables, setTables] = useState([]);
  const [modal, setModal] = useState({ show: false, type: "", tableId: null, floor: "" });
  const floors = ["Upstairs", "Downstairs"];

  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-[#0f0f0f] text-white";
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
      <h1 className="text-4xl font-bold text-primary mb-8 text-center drop-shadow-lg">Admin Tables</h1>

      {floors.map(floor => (
        <div key={floor} className="w-full max-w-7xl mb-12">
          <h2 className={`text-2xl font-semibold mb-4 ${floorTitle}`}>{floor}</h2>

          <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
            <button
              onClick={() => setModal({ show: true, type: "add", floor })}
              className="px-6 py-2 rounded-xl font-semibold transition bg-green-500 text-white hover:bg-green-600 shadow-lg"
            >
              Add Table
            </button>
            <div className="px-4 py-2 rounded-xl bg-green-600 font-semibold shadow-md">
              Available: {tables.filter(t => t.floor === floor && t.status === "available").length}
            </div>
            <div className="px-4 py-2 rounded-xl bg-red-600 font-semibold shadow-md">
              Occupied: {tables.filter(t => t.floor === floor && t.status === "occupied").length}
            </div>
            <div className="px-4 py-2 rounded-xl bg-yellow-400 font-semibold shadow-md">
              Pending: {tables.filter(t => t.floor === floor && t.status === "pending").length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tables
              .filter(t => t.floor === floor)
              .sort((a, b) => a.tableNumber - b.tableNumber)
              .map(table => (
                <motion.div key={table.id} whileHover={{ scale: 1.05 }} className="transition-transform">
                  <TableCard table={table} selected={null} />

                  <div className="flex gap-2 justify-center mt-2 flex-wrap">
                    {table.status === "pending" ? (
                      <div className="flex gap-2 items-center">
                        <span className="px-2 py-1 rounded-md bg-yellow-400 text-black font-semibold shadow-md">
                          Pending Approval
                        </span>
                        <button
                          onClick={() => handleUpdateStatus(table.id, "occupied")}
                          className="px-3 py-1 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 shadow-md"
                        >
                          ✔ Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(table.id, "available")}
                          className="px-3 py-1 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 shadow-md"
                        >
                          ✖ Reject
                        </button>
                      </div>
                    ) : (
                      <select
                        value={table.status}
                        onChange={(e) => handleUpdateStatus(table.id, e.target.value)}
                        className="px-3 py-1 rounded-md font-semibold bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="pending">Pending</option>
                      </select>
                    )}

                    <button
                      onClick={() => setModal({ show: true, type: "delete", tableId: table.id })}
                      className="px-3 py-1 rounded-md font-semibold bg-gray-700 text-white hover:bg-gray-800 shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}

      {/* Confirmation Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-white dark:bg-[#151515] text-black dark:text-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-6`}
          >
            <h2 className="text-2xl font-bold text-center">
              {modal.type === "add" ? "Add new table?" : "Are you sure you want to delete this table?"}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (modal.type === "add") handleAddTable(modal.floor);
                  if (modal.type === "delete") handleDelete(modal.tableId);
                  setModal({ show: false, type: "", tableId: null, floor: "" });
                }}
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 shadow-md"
              >
                Confirm
              </button>
              <button
                onClick={() => setModal({ show: false, type: "", tableId: null, floor: "" })}
                className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 shadow-md"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminTables;
