import React, { useState, useEffect } from "react";
import TableCard from "../components/TableCard";
import { useTheme } from "../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTable } from "../redux/cartSlice";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useNotifications } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";

const UserTables = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedTable } = useSelector((state) => state.cart);
  const { addNotification } = useNotifications();

  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tableToReserve, setTableToReserve] = useState(null);

  const floors = ["Upstairs", "Downstairs"];

  /* 🎨 COLORS ONLY */
  const bgMain =
    theme === "light"
      ? "bg-light-background text-light-text"
      : "bg-dark-background text-dark-text";

  useEffect(() => {
    const fetchTables = async () => {
      const snapshot = await getDocs(collection(db, "tables"));
      const tablesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
      approved: false,
    });

    setTables((prev) =>
      prev.map((t) =>
        t.id === tableToReserve.id
          ? {
              ...t,
              status: "pending",
              reservedBy: auth.currentUser.uid,
              approved: false,
            }
          : t
      )
    );

    dispatch(
      setSelectedTable({
        id: tableToReserve.id,
        tableNumber: tableToReserve.tableNumber,
      })
    );

    await addNotification({
      to: "admin",
      from: auth.currentUser.uid,
      type: "table_request",
      title: t("userTables.newTableRequest"),
      body: t("userTables.userRequestedTable", {
        number: tableToReserve.tableNumber,
      }),
      relatedId: tableToReserve.id,
      timestamp: new Date(),
    });

    setShowModal(false);
    setTableToReserve(null);
  };

  const countStatus = (floor, status) =>
    tables.filter((t) => t.floor === floor && t.status === status).length;

  return (
    <div
      className={`pt-24 min-h-screen flex flex-col items-center py-12 px-6 transition-colors duration-300 ${bgMain}`}
    >
      <h1
  className="text-4xl font-bold mb-10 text-center"
  style={{
    fontFamily: "'Playwrite CZ', cursive",
    letterSpacing: "1px",
  }}
>
  <span className={theme === "light" ? "text-black" : "text-white"}>
    {t("userTables.selectYourTable").split(" ")[0]}
  </span>{" "}
  <span className={theme === "light" ? "text-light-primary" : "text-dark-primary"}>
    {t("userTables.selectYourTable").split(" ").slice(1).join(" ")}
  </span>
</h1>


      {floors.map((floor) => (
        <div key={floor} className="w-full max-w-6xl mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-light-heading dark:text-dark-heading">
            {t(`userTables.${floor.toLowerCase()}`)}
          </h2>

          <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
            <div className="px-4 py-2 rounded-xl bg-light-surface dark:bg-dark-surface shadow-sm font-medium">
              {t("userTables.available")}:{" "}
              {countStatus(floor, "available")}
            </div>

            <div className="px-4 py-2 rounded-xl bg-light-surface dark:bg-dark-surface shadow-sm font-medium">
              {t("userTables.occupied")}:{" "}
              {countStatus(floor, "occupied")}
            </div>

            <div className="px-4 py-2 rounded-xl bg-light-surface dark:bg-dark-surface shadow-sm font-medium">
              {t("userTables.pending")}:{" "}
              {countStatus(floor, "pending")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tables
              .filter((t) => t.floor === floor)
              .sort((a, b) => a.tableNumber - b.tableNumber)
              .map((table) => (
                <motion.div
                  key={table.id}
                  whileHover={{
                    scale: table.status === "available" ? 1.05 : 1,
                  }}
                  className="transition-transform relative cursor-pointer"
                  onClick={() => handleSelectTable(table)}
                >
                  <TableCard table={table} selected={selectedTable?.id} />

                  {table.status === "pending" && (
                    <p className="text-center mt-2 text-sm font-semibold text-light-primary dark:text-dark-primary">
                      {!table.approved
                        ? t("userTables.pendingApproval")
                        : t("userTables.adminApproved")}
                    </p>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && tableToReserve && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-6"
          >
            <h2 className="text-2xl font-bold text-light-heading dark:text-dark-heading">
              {t("userTables.reserveTable")}
            </h2>

            <p className="mb-6 text-center">
              {t("userTables.reserveTableConfirm", {
                number: tableToReserve.tableNumber,
              })}
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleReserveTable}
                className="px-6 py-2 bg-light-primary text-white rounded-xl hover:bg-light-primaryHover dark:bg-dark-primary dark:text-black dark:hover:bg-dark-primaryHover shadow-md"
              >
                {t("userTables.reserve")}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-light-input border border-light-inputBorder rounded-xl hover:bg-light-primary/20 dark:bg-dark-input dark:border-dark-inputBorder dark:hover:bg-dark-primary/20 shadow-md"
              >
                {t("userTables.cancel")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserTables;
