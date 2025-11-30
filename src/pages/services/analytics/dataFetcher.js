// src/services/analytics/dataFetcher.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

// Get all orders from all users
export async function fetchOrders() {
  const usersSnap = await getDocs(collection(db, "users"));
  const allOrders = [];

  for (let userDoc of usersSnap.docs) {
    const ordersSnap = await getDocs(collection(db, "users", userDoc.id, "orders"));
    ordersSnap.forEach(orderDoc =>
      allOrders.push({ userId: userDoc.id, id: orderDoc.id, ...orderDoc.data() })
    );
  }

  return allOrders;
}

// Get all products
export async function fetchProducts() {
  const ref = collection(db, "products");
  const snap = await getDocs(ref);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
