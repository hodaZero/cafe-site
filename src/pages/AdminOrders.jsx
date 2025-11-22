// --- ADMIN ORDERS (FINAL VERSION) WITH TOTAL SALARY + CORRECT QTY ---
import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  User,
  Coffee,
  CakeSlice,
  LayoutGrid,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

export default function AdminOrders() {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState(null);

  // Delete Order Modal
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Clear Completed/Rejected Modal
  const [showClearModal, setShowClearModal] = useState(false);

  const fetchOrders = async () => {
    let allOrders = [];

    const usersRef = collection(db, "users");
    const usersSnap = await getDocs(usersRef);

    for (let userDoc of usersSnap.docs) {
      const userId = userDoc.id;

      const ordersRef = collection(db, "users", userId, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));
      const ordersSnap = await getDocs(q);

      ordersSnap.forEach((ord) => {
        const data = ord.data();

        allOrders.push({
          id: ord.id,
          userId,
          customerName: data.customerName || "Unknown User",
          customerEmail: data.email || "",
          ...data,
        });
      });
    }

    // sort newest first
    allOrders.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

    setOrders(allOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (order, newStatus) => {
    const ref = doc(db, "users", order.userId, "orders", order.id);
    await updateDoc(ref, { status: newStatus });

    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
    );
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    const ref = doc(db, "users", orderToDelete.userId, "orders", orderToDelete.id);
    await deleteDoc(ref);

    setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
    setOrderToDelete(null);
    setShowModal(false);
  };

  const handleClearFinished = async () => {
    const finishedOrders = orders.filter(
      (order) => order.status === "completed" || order.status === "rejected"
    );

    for (let order of finishedOrders) {
      const ref = doc(db, "users", order.userId, "orders", order.id);
      await deleteDoc(ref);
    }

    setOrders((prev) =>
      prev.filter(
        (order) => order.status !== "completed" && order.status !== "rejected"
      )
    );

    setShowClearModal(false);
  };

  const filtered = orders.filter(
    (order) =>
      (category === "All" || order.category === category) &&
      (statusFilter === "All" || order.status === statusFilter) &&
      order.items.some((it) =>
        it.name.toLowerCase().includes(search.toLowerCase())
      )
  );

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-dark-surface text-white";
  const inputBg =
    theme === "light" ? "bg-white text-black border-gray-300" : "bg-black text-white border-[#2c2c2c]";
  const tabActive = theme === "light" ? "bg-primary text-black" : "bg-[#D3AD7F] text-black";
  const tabInactive =
    theme === "light" ? "bg-white text-gray-600 hover:bg-gray-200" : "bg-dark-surface text-gray-400 hover:bg-[#222]";
  const cardBg = theme === "light" ? "bg-white border-gray-200" : "bg-black border-[#2a2a2a]";
  const cardText = theme === "light" ? "text-gray-900" : "text-white";
  const subText = theme === "light" ? "text-gray-500" : "text-gray-400";

  return (
    <div className={`pt-16 min-h-screen p-6 font-sans ${bgMain}`}>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <div className="flex items-center gap-3 w-full md:w-2/3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-2.5 ${subText}`} size={16} />
            <input
              className={`w-full pl-10 pr-3 py-2 rounded-md text-sm focus:outline-none ${inputBg}`}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category + Status Filters */}
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            {[ 
              { name: "All", icon: <LayoutGrid size={16} /> },
              { name: "Dessert", icon: <CakeSlice size={16} /> },
              { name: "Drink", icon: <Coffee size={16} /> },
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium ${
                  category === cat.name ? tabActive : tabInactive
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}

            {/* Status Filter */}
            <select
              className={`ml-2 px-2 py-2 text-xs rounded-md ${inputBg}`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              theme === "light" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"
            }`}
          >
            <User size={16} />
          </div>
          <p className="text-sm text-gray-300">Admin Panel</p>
          <Bell className="text-gray-400" size={18} />
        </div>
      </div>

      {/* Clear Completed/Rejected Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowClearModal(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
        >
          <Trash2 size={16} />
          Clear Completed/Rejected
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {orders.map((o) => (
          <button
            key={o.id}
            onClick={() => setActiveTab(activeTab === o.id ? null : o.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === o.id ? tabActive : tabInactive
            }`}
          >
            #{o.id}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered
          .filter((order) => !activeTab || order.id === activeTab)
          .map((order) => (
            <div
              key={order.id}
              className={`rounded-xl p-4 shadow-lg border hover:shadow-xl transition-all ${cardBg} relative`}
            >
              {/* Delete Icon */}
              <button
                onClick={() => {
                  setOrderToDelete(order);
                  setShowModal(true);
                }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>

              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className={`text-sm font-medium ${cardText}`}>
                    Order #{order.id}
                  </p>
                  <p className={`text-xs ${subText}`}>
                    {order.createdAt?.toDate().toLocaleString()}
                  </p>

                  <p className={`text-xs mt-1 font-semibold ${cardText}`}>
                    Customer:{" "}
                    <span className="text-primary">{order.customerName}</span>
                  </p>

                  {order.customerEmail && (
                    <p className={`text-xs ${subText}`}>{order.customerEmail}</p>
                  )}
                </div>

                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-black font-bold">
                  {getInitial(order.customerName)}
                </div>
              </div>

              {/* Items */}
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col w-full">
                    <p className={`text-sm font-semibold ${cardText}`}>
                      {item.name}
                    </p>

                    {/* FIXED QUANTITY */}
                    <p className={`text-xs ${subText}`}>Qty: {item.quantity}</p>

                    {/* PRICE × QUANTITY */}
                    <p className={`text-xs ${subText}`}>
                      {item.price} EGP × {item.quantity} ={" "}
                      <span className="font-semibold">
                        {item.price * item.quantity} EGP
                      </span>
                    </p>
                  </div>
                </div>
              ))}

              <hr
                className={`border ${
                  theme === "light" ? "border-gray-300" : "border-gray-600"
                } mb-2`}
              />

              {/* TOTAL SALARY DISPLAY */}
              <p className={`text-sm font-bold mb-2 ${cardText}`}>
                Total Salary: <span className="text-primary">{order.total} EGP</span>
              </p>

              {/* Status */}
              <div className="flex justify-between items-center">
                <div className={`text-xs ${subText}`}>
                  Status:{" "}
                  <span className="font-semibold capitalize">{order.status}</span>
                </div>

                <div className="flex gap-2">
                  {order.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(order, "completed")}
                        className="text-green-500"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(order, "rejected")}
                        className="text-red-500"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  ) : order.status === "completed" ? (
                    <span className="text-green-500 font-semibold">Completed</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Rejected</span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Delete Single Order Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-black p-6 rounded-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Are you sure you want to delete this order?
            </h3>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Completed/Rejected Modal */}
      {showClearModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-black p-6 rounded-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Delete ALL completed & rejected orders?
            </h3>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleClearFinished}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
