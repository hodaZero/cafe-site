import React, { useState, useEffect } from "react";
import TableCard from "../components/TableCard";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AdminTables = () => {
  const { theme } = useTheme();
  const { addNotification } = useNotifications();
  const { t } = useTranslation();
  const [tables, setTables] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    type: "",
    tableId: null,
    floor: "",
  });
  const [seatsInput, setSeatsInput] = useState(1);
  const floors = ["Upstairs", "Downstairs"];

  /* 🎨 COLORS ONLY */
  const bgMain =
    theme === "light"
      ? "bg-light-background text-light-text"
      : "bg-dark-background text-dark-text";

  const tablesCollection = collection(db, "tables");

  useEffect(() => {
    const fetchTables = async () => {
      const snapshot = await getDocs(tablesCollection);
      const tablesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const tablesWithNames = await Promise.all(
        tablesData.map(async (table) => {
          if (table.reservedBy) {
            const userDoc = await getDoc(doc(db, "users", table.reservedBy));
            if (userDoc.exists()) {
              return { ...table, userName: userDoc.data().name };
            }
          }
          return { ...table, userName: null };
        })
      );

      setTables(tablesWithNames);
    };
    fetchTables();
  }, [tablesCollection]);

  const getNextTableNumber = (floor) => {
    const floorTables = tables.filter((t) => t.floor === floor);
    const existingNumbers = floorTables.map((t) => t.tableNumber);
    for (let i = 1; i <= 8; i++) {
      if (!existingNumbers.includes(i)) return i;
    }
    return 8;
  };

  const handleAddTable = async (floor, seats) => {
    const tableNumber = getNextTableNumber(floor);
    const newTable = {
      floor,
      status: "available",
      image: "",
      tableNumber,
      seats,
    };
    const docRef = await addDoc(tablesCollection, newTable);
    setTables((prev) => [...prev, { ...newTable, id: docRef.id }]);
  };

  const handleUpdateStatus = async (id, status) => {
    const tableRef = doc(db, "tables", id);

    let updateData = { status };
    if (status === "available") updateData.reservedBy = null;

    await updateDoc(tableRef, updateData);

    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              reservedBy: status === "available" ? null : t.reservedBy,
              userName: status === "available" ? null : t.userName,
            }
          : t
      )
    );

    const table = tables.find((t) => t.id === id);

    if (table?.reservedBy && status === "available") {
      await addNotification({
        to: table.reservedBy,
        from: "admin",
        type: "table_status",
        title: t("adminTable.rejectedTitle", {
          number: table.tableNumber,
        }),
        body: `Your table ${table.tableNumber} reservation has been rejected by admin.`,
        relatedId: id,
      });
    }

    if (table?.reservedBy && status === "occupied") {
      await addNotification({
        to: table.reservedBy,
        from: "admin",
        type: "table_status",
        title: t("adminTable.approvedTitle", {
          number: table.tableNumber,
        }),
        body: `Your table ${table.tableNumber} has been approved by admin.`,
        relatedId: id,
      });
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tables", id));
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      className={`pt-16 min-h-screen flex flex-col items-center py-12 px-6 transition-colors duration-300 ${bgMain}`}
    >
     <h1
  className="text-4xl font-bold mb-12 text-center"
  style={{
    fontFamily: "'Playwrite CZ', cursive",
    letterSpacing: "1px",
  }}
>
  <span className={theme === "light" ? "text-light-primary" : "text-dark-primary"}>
    {t("adminTable.title")}
  </span>
</h1>


      {floors.map((floor) => (
        <div key={floor} className="w-full max-w-7xl mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-light-heading dark:text-dark-heading">
            {t(`userTables.${floor.toLowerCase()}`)}
          </h2>

          <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setModal({ show: true, type: "add", floor })}
              className="px-6 py-2 rounded-xl font-semibold bg-light-primary text-white hover:bg-light-primaryHover dark:bg-dark-primary dark:text-black dark:hover:bg-dark-primaryHover transition shadow-md"
            >
              {t("adminTable.addNewTableQuestion")}
            </button>

            <div className="px-4 py-2 rounded-xl bg-light-surface dark:bg-dark-surface shadow-sm font-medium">
              {t("adminTable.available")}:{" "}
              {tables.filter(
                (t) => t.floor === floor && t.status === "available"
              ).length}
            </div>

            <div className="px-4 py-2 rounded-xl bg-light-surface dark:bg-dark-surface shadow-sm font-medium">
              {t("adminTable.occupied")}:{" "}
              {tables.filter(
                (t) => t.floor === floor && t.status === "occupied"
              ).length}
            </div>

            <div className="px-4 py-2 rounded-xl bg-light-surface dark:bg-dark-surface shadow-sm font-medium">
              {t("adminTable.pending")}:{" "}
              {tables.filter(
                (t) => t.floor === floor && t.status === "pending"
              ).length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tables
              .filter((t) => t.floor === floor)
              .sort((a, b) => a.tableNumber - b.tableNumber)
              .map((table) => (
                <motion.div
                  key={table.id}
                  whileHover={{ scale: 1.05 }}
                  className="transition-transform"
                >
                  <TableCard table={table} selected={null} />

                  <div className="flex gap-2 justify-center mt-2 items-center flex-wrap">
                    {table.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(table.id, "occupied")
                          }
                          className="text-light-primary dark:text-dark-primary text-lg hover:scale-110 transition-transform"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(table.id, "available")
                          }
                          className="text-red-500 text-lg hover:scale-110 transition-transform"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <select
                        value={table.status}
                        onChange={(e) =>
                          handleUpdateStatus(table.id, e.target.value)
                        }
                        className="px-2 py-1 rounded-md bg-light-input dark:bg-dark-input border border-light-inputBorder dark:border-dark-inputBorder text-sm"
                      >
                        <option value="available">
                          {t("adminTable.setAvailable")}
                        </option>
                        <option value="occupied">
                          {t("adminTable.setOccupied")}
                        </option>
                      </select>
                    )}

                    <button
                      onClick={() =>
                        setModal({
                          show: true,
                          type: "delete",
                          tableId: table.id,
                        })
                      }
                      className="px-2 py-1 rounded-md bg-light-surface dark:bg-dark-surface border border-light-inputBorder dark:border-dark-inputBorder text-sm hover:bg-light-primary/20 dark:hover:bg-dark-primary/20"
                    >
                      {t("navbar.delete")}
                    </button>
                  </div>

                  {table.userName && (
                    <p className="text-center mt-1 text-xs font-semibold text-light-heading dark:text-dark-heading">
                      {t("adminTable.bookedBy")}: {table.userName}
                    </p>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      ))}

      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-light-surface dark:bg-dark-surface rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-light-heading dark:text-dark-heading">
              {modal.type === "add"
                ? t("adminTable.addNewTableQuestion")
                : t("adminTable.deleteTableQuestion")}
            </h2>

            {modal.type === "add" && (
              <div className="flex flex-col mb-4">
                <label className="text-sm mb-1">
                  {t("adminTable.numberOfSeats")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={seatsInput}
                  onChange={(e) =>
                    setSeatsInput(parseInt(e.target.value))
                  }
                  className="px-3 py-2 rounded-md bg-light-input dark:bg-dark-input border border-light-inputBorder dark:border-dark-inputBorder"
                />
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  if (modal.type === "add")
                    handleAddTable(modal.floor, seatsInput);
                  if (modal.type === "delete")
                    handleDelete(modal.tableId);
                  setModal({
                    show: false,
                    type: "",
                    tableId: null,
                    floor: "",
                  });
                  setSeatsInput(1);
                }}
                className="px-6 py-2 bg-light-primary text-white rounded-xl hover:bg-light-primaryHover dark:bg-dark-primary dark:text-black dark:hover:bg-dark-primaryHover"
              >
                {t("adminTable.confirm")}
              </button>

              <button
                onClick={() =>
                  setModal({
                    show: false,
                    type: "",
                    tableId: null,
                    floor: "",
                  })
                }
                className="px-6 py-2 bg-light-input border border-light-inputBorder rounded-xl hover:bg-light-primary/20 dark:bg-dark-input dark:border-dark-inputBorder dark:hover:bg-dark-primary/20"
              >
                {t("adminTable.close")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminTables;
