// src/pages/Orders.jsx

import React, { useEffect, useState, useMemo } from "react";
import OrderItem from "../components/OrderItem";
import { useTheme } from "../context/ThemeContext";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import Pagination from "../components/Pagination";
import { generateAnalytics } from "./services/analytics/analyticsEngine";

export default function Orders() {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // جلب الأوردرات من Firestore
  const fetchOrders = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const ordersRef = collection(db, "users", user.uid, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const userOrders = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setOrders(userOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // دالة لإضافة أوردر وتحديث التوصيات
  const handlePlaceOrder = async (orderData) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // 1️⃣ إضافة الأوردر
      await addDoc(collection(db, "users", user.uid, "orders"), orderData);

      // 2️⃣ تحديث Top Selling تلقائياً
      await generateAnalytics();

      // 3️⃣ إعادة جلب الأوردرات
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return orders.slice(start, end);
  }, [orders, currentPage]);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const bg = theme === "light"
    ? "bg-gray-100 text-gray-900"
    : "bg-[#0f0f0f] text-white";

  const cardBg = theme === "light"
    ? "bg-white text-gray-900"
    : "bg-[#1a1a1a] text-white";

  const primaryColor = "text-[#D3AD7F]";

  if (loading)
    return (
      <div className={`pt-16 min-h-screen flex justify-center items-center ${bg}`}>
        Loading...
      </div>
    );

  if (!orders.length)
    return (
      <div className={`pt-16 min-h-screen flex justify-center items-center ${bg}`}>
        No orders yet.
      </div>
    );

  return (
    <div className={`pt-20 min-h-screen px-6 transition-all duration-300 ${bg}`}>
      <h1 className={`text-4xl font-bold mb-10 text-center ${primaryColor}`}>
        MY ORDERS
      </h1>

      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {paginatedOrders.map(order => (
          <div
            key={order.id}
            className={`rounded-2xl p-6 shadow-xl border border-gray-300/20 ${cardBg}`}
          >
            <OrderItem order={order} />

            <div className="mt-4 border-t pt-4 opacity-80 text-sm">
              <p>
                <span className="font-semibold">Total Salary:</span>{" "}
                <span className={primaryColor}>{order.total} EGP</span>
              </p>

              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    order.status === "completed"
                      ? "text-green-500 font-semibold"
                      : order.status === "rejected"
                      ? "text-red-500 font-semibold"
                      : "text-yellow-500 font-semibold"
                  }
                >
                  {order.status}
                </span>
              </p>

              <p className="mt-1 text-xs opacity-60">
                {order.createdAt?.toDate().toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
