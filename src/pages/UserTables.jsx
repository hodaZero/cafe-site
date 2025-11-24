import React, { useState, useEffect } from "react";
import TableCard from "../components/TableCard";
import { useTheme } from "../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTable } from "../redux/cartSlice";
import { db, auth } from "../firebase/firebaseConfig"; 
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";

const UserTables = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { selectedTable } = useSelector(state => state.cart);

  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tableToReserve, setTableToReserve] = useState(null);
  const floors = ["Upstairs", "Downstairs"];

  const bgMain = theme === "light" ? "bg-light-background text-light-text" : "bg-dark-background text-dark-text";

  useEffect(() => {
    const fetchTables = async () => {
      const snapshot = await getDocs(collection(db, "tables"));
      const tablesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      tablesData.sort((a, b) => a.tableNumber - b.tableNumber);
      setTables(tablesData);
    };
    fetchTables();
  }, []);

  const handleSelectTable = (table) => {
    if (table.status !== "available") return;
    setTableToReserve(table);
    setShowModal(true);
  };

  const handleReserveTable = async () => {
    if (!tableToReserve || !auth.currentUser) return;

    const tableRef = doc(db, "tables", tableToReserve.id);
    await updateDoc(tableRef, { 
      status: "pending", 
      reservedBy: auth.currentUser.uid,
      approved: false
    });

    setTables(prev => 
      prev.map(t => t.id === tableToReserve.id 
        ? { ...t, status: "pending", reservedBy: auth.currentUser.uid, approved: false } 
        : t)
    );

    dispatch(setSelectedTable({
      id: tableToReserve.id,
      tableNumber: tableToReserve.tableNumber
    }));

    setShowModal(false);
    setTableToReserve(null);
  };

  const countStatus = (floor, status) => tables.filter(t => t.floor === floor && t.status === status).length;

  return (
    <div className={`pt-16 min-h-screen flex flex-col items-center py-12 px-6 transition-colors duration-300 ${bgMain}`}>
      <h1 className={`text-4xl font-bold mb-8 text-center drop-shadow-lg`}>
        Select Your Table
      </h1>

      {floors.map(floor => (
        <div key={floor} className="w-full max-w-6xl mb-12">
          {/* عنوان الـ Floor باللون البرتقالي */}
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "#B45309" }}>
            {floor}
          </h2>

          {/* Filter / Summary */}
          <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 font-semibold shadow-md text-black">
              Available: {countStatus(floor, "available")}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 font-semibold shadow-md text-black">
              Occupied: {countStatus(floor, "occupied")}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 font-semibold shadow-md text-black">
              Pending: {countStatus(floor, "pending")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tables
              .filter(t => t.floor === floor)
              .sort((a, b) => a.tableNumber - b.tableNumber)
              .map(table => (
                <motion.div
                  key={table.id}
                  whileHover={{ scale: table.status === "available" ? 1.05 : 1 }}
                  className="transition-transform relative cursor-pointer"
                  onClick={() => handleSelectTable(table)}
                >
                  <TableCard table={table} selected={selectedTable?.id} />

                  {/* الرسالة البسيطة تحت الكارد: فقط Pending */}
                  {table.status === "pending" && (
                    <p className="text-center mt-2 text-sm font-semibold" style={{ color: "#B45309" }}>
                      {!table.approved ? "Pending Approval" : "Admin Approved"}
                    </p>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      ))}

      {/* Reserve Modal */}
      {showModal && tableToReserve && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-6"
          >
            <h2 className="text-2xl font-bold text-center">Reserve Table</h2>
            <p className="mb-6">Do you want to reserve Table {tableToReserve.tableNumber}?</p>
            <div className="flex gap-4">
              <button
                onClick={handleReserveTable}
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 shadow-md"
              >
                Reserve
              </button>
              <button
                onClick={() => setShowModal(false)}
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

export default UserTables;
