import React, { useState, useEffect, useMemo } from "react";
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
  FileText,
  DollarSign
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
  serverTimestamp
} from "firebase/firestore";
import { useNotifications } from "../context/NotificationContext";

export default function AdminOrders() {
  const { theme } = useTheme();
  const { addNotification } = useNotifications();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // عدد الأوردرات لكل صفحة

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
          items: data.items || [],
          total: data.total || 0,
          status: data.status || "pending",
          orderType: data.orderType || "takeAway",
          tableNumber: data.tableNumber || "N/A",
          createdAt: data.createdAt,
          category: data.category || "All"
        });
      });
    }

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

    await addNotification({
      to: order.userId,
      from: "admin",
      type: "order_status",
      title:
        newStatus === "completed"
          ? "Your order is completed"
          : "Your order has been rejected",
      body:
        newStatus === "completed"
          ? `Your order #${order.id} has been completed successfully.`
          : `Your order #${order.id} was rejected.`,
      relatedId: order.id,
      timestamp: serverTimestamp(),
    });
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

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        (category === "All" || order.category === category) &&
        (statusFilter === "All" || order.status === statusFilter) &&
        (order.customerName.toLowerCase().includes(search.toLowerCase()) ||
          order.items.some((it) =>
            it.name.toLowerCase().includes(search.toLowerCase())
          ))
    );
  }, [orders, search, statusFilter, category]);

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className={`pt-16 min-h-screen p-6 font-sans ${theme === "dark" ? "bg-dark-background text-white" : "bg-light-background text-black"}`}>

      {/* Top Summary Cards */}
      <div className="mb-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 rounded-2xl p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl text-white flex flex-col justify-center hover:scale-105 transform transition">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={24} />
            <p className="text-sm font-semibold">Total Orders</p>
          </div>
          <p className="text-4xl font-bold">{totalOrders}</p>
        </div>
        <div className="flex-1 rounded-2xl p-6 bg-gradient-to-r from-green-400 to-teal-500 shadow-xl text-white flex flex-col justify-center hover:scale-105 transform transition">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={24} />
            <p className="text-sm font-semibold">Total Revenue</p>
          </div>
          <p className="text-4xl font-bold">{totalRevenue} EGP</p>
        </div>
      </div>

      {/* Header Search & Filters */}
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <div className="flex items-center gap-3 w-full md:w-2/3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-light-text dark:text-dark-text opacity-60"
              size={16}
            />
            <input
              className="w-full pl-10 pr-3 py-2 rounded-md text-sm focus:outline-none bg-light-input dark:bg-dark-input border border-light-inputBorder dark:border-dark-inputBorder text-light-text dark:text-dark-text"
              placeholder="Search by customer or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mt-2 md:mt-0">
            {[{ name: "All", icon: <LayoutGrid size={16} /> },
              { name: "Dessert", icon: <CakeSlice size={16} /> },
              { name: "Drink", icon: <Coffee size={16} /> }
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition
                  ${category === cat.name
                    ? "bg-light-primary text-white dark:bg-dark-primary"
                    : "bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-inputBorder dark:border-dark-inputBorder"
                  }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}

            <select
              className="ml-2 px-2 py-2 text-xs rounded-md bg-light-input dark:bg-dark-input border border-light-inputBorder dark:border-dark-inputBorder text-light-text dark:text-dark-text"
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-light-inputBorder dark:bg-dark-inputBorder text-light-text dark:text-dark-text">
            <User size={16} />
          </div>
          <p className="text-sm opacity-70">Admin Panel</p>
          <Bell className="opacity-60" size={18} />
        </div>
      </div>

      {/* Clear Completed Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowClearModal(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
        >
          <Trash2 size={16} />
          Clear Completed/Rejected
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => {
          const isOpen = activeTab === order.id;

          return (
            <div
              key={order.id}
              className={`rounded-xl p-4 shadow-lg border bg-light-surface dark:bg-dark-surface border-light-inputBorder dark:border-dark-inputBorder transition-all duration-300`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="pr-3 flex-1">
                  <p className="text-sm font-semibold text-light-text dark:text-dark-text truncate">
                    {order.customerName}
                  </p>
                  <p className="text-xs mt-1 font-medium text-light-text dark:text-dark-text">
                    <span className="text-[10px] uppercase tracking-wide text-light-primary dark:text-dark-primary">
                      {order.customerEmail ? "CUSTOMER" : "GUEST"}
                    </span>{" "}
                    •{" "}
                    <span className="opacity-70">
                      {order.createdAt?.toDate().toLocaleString()}
                    </span>
                  </p>
                  <p className="text-xs mt-2 font-semibold">
                    Table:{" "}
                    <span className="text-light-primary dark:text-dark-primary">
                      {order.tableNumber ? `Table ${order.tableNumber}` : "Take Away"}
                    </span>
                  </p>
                  <p className="text-xs mt-1 opacity-70">
                    Status: <span className="font-semibold">{order.status}</span>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-light-primary dark:bg-dark-primary text-white">
                    {getInitial(order.customerName)}
                  </div>
                  <button
                    onClick={() => { setOrderToDelete(order); setShowModal(true); }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Details + Status */}
              <div className="flex items-center justify-between gap-3 mt-2">
                <button
                  onClick={() => setActiveTab(isOpen ? null : order.id)}
                  className={`flex-1 py-2 px-3 rounded-md font-semibold transition
                    ${isOpen
                      ? "bg-light-primary/20 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary"
                      : "bg-light-surface dark:bg-dark-surface border border-light-inputBorder dark:border-dark-inputBorder text-light-primary dark:text-dark-primary"}
                    hover:bg-light-primary/30 hover:dark:bg-dark-primary/30`}
                >
                  {isOpen ? "Hide Details" : "Details"}
                </button>

                <div className="ml-2 flex items-center gap-2">
                  {order.status === "pending" ? (
                    <>
                      <button onClick={() => handleStatusChange(order, "completed")} className="p-2 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20">
                        <CheckCircle size={18} className="text-green-600"/>
                      </button>
                      <button onClick={() => handleStatusChange(order, "rejected")} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                        <XCircle size={18} className="text-red-600"/>
                      </button>
                    </>
                  ) : order.status === "completed" ? (
                    <span className="text-green-600 font-semibold">Completed</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Rejected</span>
                  )}
                </div>
              </div>

              {/* Animated Details */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pt-3 transition-all">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 mb-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover border border-light-inputBorder dark:border-dark-inputBorder"/>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-sm font-semibold">{item.price * item.quantity} EGP</p>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1 opacity-70">
                          <p>Qty: {item.quantity}</p>
                          <p>{item.price} EGP × {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <hr className="border-light-inputBorder dark:border-dark-inputBorder my-2"/>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold">Total</p>
                    <p className="text-sm font-bold text-light-primary dark:text-dark-primary">{order.total} EGP</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleStatusChange(order, "completed")} className="px-3 py-1 rounded-md text-sm bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        Mark Completed
                      </button>
                      <button onClick={() => handleStatusChange(order, "rejected")} className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        Reject
                      </button>
                    </div>
                    <button onClick={() => { setOrderToDelete(order); setShowModal(true); }} className="px-3 py-1 rounded-md text-sm bg-light-input dark:bg-dark-input border border-light-inputBorder dark:border-dark-inputBorder">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {filtered.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Delete Modal */}
      {showModal && orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowModal(false); setOrderToDelete(null); }} />
          <div className="relative z-60 max-w-md w-full p-6 rounded-2xl shadow-2xl bg-light-surface dark:bg-dark-surface border-t-4 border-light-primary dark:border-dark-primary">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center text-white font-bold bg-light-primary dark:bg-dark-primary">!</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Delete Order</h3>
                <p className="text-sm opacity-70">Are you sure you want to delete the order for <span className="font-semibold">{orderToDelete.customerName}</span>? This action cannot be undone.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setShowModal(false); setOrderToDelete(null); }} className="px-4 py-2 rounded-md bg-light-input dark:bg-dark-input border border-light-inputBorder dark:border-dark-inputBorder">Cancel</button>
              <button onClick={handleDeleteOrder} className="px-4 py-2 rounded-md bg-red-600 text-white">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Finished Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowClearModal(false)} />
          <div className="relative z-60 max-w-md w-full p-6 rounded-2xl shadow-2xl bg-light-surface dark:bg-dark-surface border-t-4 border-red-600">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">Clear Completed/Rejected Orders</h3>
            <p className="text-sm opacity-70 mb-4">Are you sure you want to delete all completed and rejected orders? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowClearModal(false)} className="px-4 py-2 rounded-md bg-light-input dark:bg-dark-input border border-light-inputBorder dark:border-dark-inputBorder">Cancel</button>
              <button onClick={handleClearFinished} className="px-4 py-2 rounded-md bg-red-600 text-white">Clear</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
