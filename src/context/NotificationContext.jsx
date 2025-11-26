// import React, { createContext, useContext, useState, useEffect } from "react";
// import { db } from "../firebase/firebaseConfig";
// import { 
//   collection, 
//   query, 
//   where, 
//   orderBy, 
//   onSnapshot, 
//   addDoc, 
//   updateDoc, 
//   deleteDoc, 
//   doc,
//   serverTimestamp
// } from "firebase/firestore";
// import { useAuth } from "./AuthContext";

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const { user, role } = useAuth();
//   const [notifications, setNotifications] = useState([]);

//   const isAdmin = role === "admin";

//   useEffect(() => {
//     if (!user && !isAdmin) return;

//     const targetId = isAdmin ? "admin" : user?.uid;
//     if (!targetId) return;

//     const q = query(
//       collection(db, "notifications"),
//       where("to", "==", targetId),
//       orderBy("timestamp", "desc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const notifs = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setNotifications(notifs);
//     });

//     return () => unsubscribe();
//   }, [user, isAdmin]);

//   const addNotification = async ({ to, from, type, title, body, relatedId }) => {
//     await addDoc(collection(db, "notifications"), {
//       to,
//       from: from || null,
//       type,
//       title,
//       body,
//       relatedId: relatedId || null,
//       read: false,
//       timestamp: serverTimestamp(),
//     });
//   };

//   const markAsRead = async (id) => {
//     const notifRef = doc(db, "notifications", id);
//     await updateDoc(notifRef, { read: true });
//   };

//   const deleteNotification = async (id) => {
//     const notifRef = doc(db, "notifications", id);
//     await deleteDoc(notifRef);
//   };

//   const clearAll = async () => {
//     const promises = notifications.map(n =>
//       deleteDoc(doc(db, "notifications", n.id))
//     );
//     await Promise.all(promises);
//   };

//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         addNotification,
//         markAsRead,
//         deleteNotification,
//         clearAll,
//         unreadCount,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);















import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const isAdmin = role === "admin";

  useEffect(() => {
    if (!user && !isAdmin) return;

    const targetId = isAdmin ? "admin" : user?.uid;
    if (!targetId) return;

    const q = query(
      collection(db, "notifications"),
      where("to", "==", targetId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const addNotification = async ({ to, from, type, title, body, relatedId }) => {
    await addDoc(collection(db, "notifications"), {
      to,
      from: from || null,
      type,
      title,
      body,
      relatedId: relatedId || null,
      read: false,
      timestamp: serverTimestamp(),
    });
  };

  const markAsRead = async (id) => {
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { read: true });
  };

  const deleteNotification = async (id) => {
    const notifRef = doc(db, "notifications", id);
    await deleteDoc(notifRef);
    // ✅ تحديث state محلي فورًا
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = async () => {
    const promises = notifications.map(n =>
      deleteDoc(doc(db, "notifications", n.id))
    );
    await Promise.all(promises);
    // ✅ مسح state محلي فورًا
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        deleteNotification,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
