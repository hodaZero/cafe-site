import React, { useEffect, useState } from "react";
import OrderItem from "../components/OrderItem";
import { useTheme } from "../context/ThemeContext";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Orders() {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchOrders();
  }, []);

  const pageClass = theme === "dark" ? "bg-dark-background text-white" : "bg-white text-black";

  if (loading) return <div className={`pt-16 min-h-screen flex justify-center items-center ${pageClass}`}>Loading...</div>;
  if (!orders.length) return <div className={`pt-16 min-h-screen flex justify-center items-center ${pageClass}`}>No orders yet.</div>;

  return (
    <div className={`p-4 pt-16 min-h-screen transition-colors duration-300 ${pageClass}`}>
      {orders.map(order => <OrderItem key={order.id} order={order} />)}
    </div>
  );
}
