import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user, role } = useAuth(); // 👈 خدنا role
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 🔔 Listen to notifications
  useEffect(() => {
    if (!user || !role) return;

    let q;

    // ✅ ADMIN → يشوف إشعارات الأدمن بس
    if (role === "admin") {
      q = query(
        collection(db, "notifications"),
        where("to", "==", "admin")
      );
    }

    // ✅ USER → يشوف إشعاراته هو بس
    if (role === "user") {
      q = query(
        collection(db, "notifications"),
        where("to", "==", user.uid)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(notifData);
      setUnreadCount(notifData.filter((n) => !n.read).length);
    });

    return () => unsubscribe();
  }, [user, role]);

  // ➕ Add notification
  const addNotification = async (notif) => {
    try {
      await addDoc(collection(db, "notifications"), {
        ...notif,
        read: false,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Error adding notification:", err);
    }
  };

  // ✅ Mark as read
  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // ❌ Delete notification
  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // 🧹 Clear all (حسب الدور)
  const clearAll = async () => {
    try {
      const filtered =
        role === "admin"
          ? notifications.filter((n) => n.to === "admin")
          : notifications.filter((n) => n.to === user.uid);

      for (const n of filtered) {
        await deleteDoc(doc(db, "notifications", n.id));
      }
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};