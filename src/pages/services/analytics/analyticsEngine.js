// src/pages/services/analytics/analyticsEngine.js
import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export const generateAnalytics = async () => {
  try {
    // 1️⃣ جيب كل اليوزرز
    const usersSnapshot = await getDocs(collection(db, "users"));
    const allOrders = [];

    // 2️⃣ جيب كل الأوردرات لكل يوزر
    for (const userDoc of usersSnapshot.docs) {
      const ordersSnapshot = await getDocs(
        collection(db, "users", userDoc.id, "orders")
      );
      ordersSnapshot.forEach(orderDoc => allOrders.push(orderDoc.data()));
    }

    // 3️⃣ لم كل الـ items
    const allItems = allOrders.flatMap(order => order.items || []);

    // 4️⃣ جمع نفس الأصناف مع بعض
    const topSellers = allItems.reduce((acc, item) => {
      const existing = acc.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        acc.push({ ...item, quantity: item.quantity || 1 });
      }
      return acc;
    }, []);

    // 5️⃣ تحديث collection topSeller في Firestore
    await setDoc(doc(db, "topSeller", "global"), { array: topSellers });

    console.log("Top Seller Analytics updated!", topSellers);
  } catch (err) {
    console.error("Error generating analytics:", err);
  }
};
