// import React, { useState, useEffect } from "react";
// import TableCard from "../components/TableCard";
// import { useTheme } from "../context/ThemeContext";
// import { db } from "../firebase/firebaseConfig";
// import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
// import { motion } from "framer-motion";
// import { FaCheck, FaTimes } from "react-icons/fa";

// const AdminTables = () => {
//   const { theme } = useTheme();
//   const [tables, setTables] = useState([]);
//   const [modal, setModal] = useState({ show: false, type: "", tableId: null, floor: "" });
//   const floors = ["Upstairs", "Downstairs"];

//   const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-[#0f0f0f] text-white";
//   const tablesCollection = collection(db, "tables");

//   useEffect(() => {
//     const fetchTables = async () => {
//       const snapshot = await getDocs(tablesCollection);
//       const tablesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       const tablesWithNames = await Promise.all(tablesData.map(async (table) => {
//         if (table.reservedBy) {
//           const userDoc = await getDoc(doc(db, "users", table.reservedBy));
//           if (userDoc.exists()) {
//             return { ...table, userName: userDoc.data().name };
//           }
//         }
//         return { ...table, userName: null };
//       }));

//       setTables(tablesWithNames);
//     };
//     fetchTables();
//   }, [tablesCollection]);

//   const getNextTableNumber = (floor) => {
//     const floorTables = tables.filter(t => t.floor === floor);
//     const existingNumbers = floorTables.map(t => t.tableNumber);
//     for (let i = 1; i <= 8; i++) {
//       if (!existingNumbers.includes(i)) return i;
//     }
//     return 8;
//   };

//   const handleAddTable = async (floor) => {
//     const tableNumber = getNextTableNumber(floor);
//     const newTable = { floor, status: "available", image: "", tableNumber };
//     const docRef = await addDoc(tablesCollection, newTable);
//     setTables(prev => [...prev, { ...newTable, id: docRef.id }]);
//   };

//   const handleUpdateStatus = async (id, status) => {
//     await updateDoc(doc(db, "tables", id), { status });
//     setTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
//   };

//   const handleDelete = async (id) => {
//     await deleteDoc(doc(db, "tables", id));
//     setTables(prev => prev.filter(t => t.id !== id));
//   };

//   return (
//     <div className={`pt-16 min-h-screen flex flex-col items-center py-12 px-6 transition-colors duration-300 ${bgMain}`}>
//       <h1 className="text-4xl font-bold text-primary mb-8 text-center drop-shadow-lg">Admin Tables</h1>

//       {floors.map(floor => (
//         <div key={floor} className="w-full max-w-7xl mb-12">
//           {/* العنوان بلون برتقالي */}
//           <h2 className="text-2xl font-semibold mb-4" style={{ color: "#B45309" }}>{floor}</h2>

//           <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
//             <button
//               onClick={() => setModal({ show: true, type: "add", floor })}
//               className="px-6 py-2 rounded-xl font-semibold transition bg-[#B45309] text-white hover:bg-[#92400E] shadow-lg"
//             >
//               Add Table
//             </button>
//             <div className="px-4 py-2 rounded-xl bg-green-600 font-semibold shadow-md">
//               Available: {tables.filter(t => t.floor === floor && t.status === "available").length}
//             </div>
//             <div className="px-4 py-2 rounded-xl bg-red-600 font-semibold shadow-md">
//               Occupied: {tables.filter(t => t.floor === floor && t.status === "occupied").length}
//             </div>
//             <div className="px-4 py-2 rounded-xl bg-yellow-400 font-semibold shadow-md">
//               Pending: {tables.filter(t => t.floor === floor && t.status === "pending").length}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//             {tables
//               .filter(t => t.floor === floor)
//               .sort((a, b) => a.tableNumber - b.tableNumber)
//               .map(table => (
//                 <motion.div key={table.id} whileHover={{ scale: 1.05 }} className="transition-transform">
//                   <TableCard table={table} selected={null} />

//                   <div className="flex gap-2 justify-center mt-2 items-center flex-wrap">
//                     {table.status === "pending" ? (
//                       <>
//                         <button
//                           onClick={() => handleUpdateStatus(table.id, "occupied")}
//                           className="text-green-500 text-lg hover:scale-110 transition-transform px-2 py-1"
//                         >
//                           <FaCheck />
//                         </button>
//                         <button
//                           onClick={() => handleUpdateStatus(table.id, "available")}
//                           className="text-red-500 text-lg hover:scale-110 transition-transform px-2 py-1"
//                         >
//                           <FaTimes />
//                         </button>
//                       </>
//                     ) : (
//                       <select
//                         value={table.status}
//                         onChange={(e) => handleUpdateStatus(table.id, e.target.value)}
//                         className={`px-2 py-1 rounded-md font-semibold text-white shadow-md text-sm
//                           ${table.status === "available" ? "bg-green-500 hover:bg-green-600" : ""} 
//                           ${table.status === "occupied" ? "bg-red-500 hover:bg-red-600" : ""}`}
//                       >
//                         <option value="available">Available</option>
//                         <option value="occupied">Occupied</option>
//                       </select>
//                     )}

//                     <button
//                       onClick={() => setModal({ show: true, type: "delete", tableId: table.id })}
//                       className="px-2 py-1 rounded-md font-semibold bg-gray-700 text-white hover:bg-gray-800 shadow-md text-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>

//                   {/* اسم اليوزر تحت الأزرار */}
//                   {table.userName && (
//                     <p className="text-center mt-1 text-xs font-semibold text-[#B45309]">
//                       Booked by: {table.userName}
//                     </p>
//                   )}
//                 </motion.div>
//               ))}
//           </div>
//         </div>
//       ))}

//       {modal.show && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div 
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white dark:bg-[#151515] text-black dark:text-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-6"
//           >
//             <h2 className="text-2xl font-bold text-center">
//               {modal.type === "add" ? "Add new table?" : "Are you sure you want to delete this table?"}
//             </h2>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => {
//                   if (modal.type === "add") handleAddTable(modal.floor);
//                   if (modal.type === "delete") handleDelete(modal.tableId);
//                   setModal({ show: false, type: "", tableId: null, floor: "" });
//                 }}
//                 className="px-6 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 shadow-md"
//               >
//                 Confirm
//               </button>
//               <button
//                 onClick={() => setModal({ show: false, type: "", tableId: null, floor: "" })}
//                 className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 shadow-md"
//               >
//                 Cancel
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminTables;




































import React, { useState, useEffect } from "react";
import TableCard from "../components/TableCard";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext"; // ✅ استدعاء notifications
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

const AdminTables = () => {
  const { theme } = useTheme();
  const { addNotification } = useNotifications(); // ✅ استخراج دالة الإضافة
  const [tables, setTables] = useState([]);
  const [modal, setModal] = useState({ show: false, type: "", tableId: null, floor: "" });
  const floors = ["Upstairs", "Downstairs"];

  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-[#0f0f0f] text-white";
  const tablesCollection = collection(db, "tables");

  useEffect(() => {
    const fetchTables = async () => {
      const snapshot = await getDocs(tablesCollection);
      const tablesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const tablesWithNames = await Promise.all(tablesData.map(async (table) => {
        if (table.reservedBy) {
          const userDoc = await getDoc(doc(db, "users", table.reservedBy));
          if (userDoc.exists()) {
            return { ...table, userName: userDoc.data().name };
          }
        }
        return { ...table, userName: null };
      }));

      setTables(tablesWithNames);
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

  // ✅ تعديل handleUpdateStatus لإرسال إشعار
  const handleUpdateStatus = async (id, status) => {
    const tableRef = doc(db, "tables", id);
    await updateDoc(tableRef, { status });
    setTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));

    const table = tables.find(t => t.id === id);
    if (table?.reservedBy) {
      const message =
        status === "occupied"
          ? `Your table ${table.tableNumber} has been approved by admin.`
          : `Your table ${table.tableNumber} reservation has been rejected.`;

      await addNotification({
        to: table.reservedBy,
        from: "admin",
        type: "table_status",
        title: `Table ${table.tableNumber} ${status === "occupied" ? "Approved" : "Rejected"}`,
        body: message,
        relatedId: id
      });
    }
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
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "#B45309" }}>{floor}</h2>

          <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
            <button
              onClick={() => setModal({ show: true, type: "add", floor })}
              className="px-6 py-2 rounded-xl font-semibold transition bg-[#B45309] text-white hover:bg-[#92400E] shadow-lg"
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

                  <div className="flex gap-2 justify-center mt-2 items-center flex-wrap">
                    {table.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(table.id, "occupied")}
                          className="text-green-500 text-lg hover:scale-110 transition-transform px-2 py-1"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(table.id, "available")}
                          className="text-red-500 text-lg hover:scale-110 transition-transform px-2 py-1"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <select
                        value={table.status}
                        onChange={(e) => handleUpdateStatus(table.id, e.target.value)}
                        className={`px-2 py-1 rounded-md font-semibold text-white shadow-md text-sm
                          ${table.status === "available" ? "bg-green-500 hover:bg-green-600" : ""} 
                          ${table.status === "occupied" ? "bg-red-500 hover:bg-red-600" : ""}`}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                      </select>
                    )}

                    <button
                      onClick={() => setModal({ show: true, type: "delete", tableId: table.id })}
                      className="px-2 py-1 rounded-md font-semibold bg-gray-700 text-white hover:bg-gray-800 shadow-md text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  {table.userName && (
                    <p className="text-center mt-1 text-xs font-semibold text-[#B45309]">
                      Booked by: {table.userName}
                    </p>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      ))}

      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#151515] text-black dark:text-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-6"
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
