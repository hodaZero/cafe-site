// src/services/analytics/dataFetcher.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

// Get all orders
export async function fetchOrders() {
  const ref = collection(db, "orders");
  const snap = await getDocs(ref);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get all products
export async function fetchProducts() {
  const ref = collection(db, "products");
  const snap = await getDocs(ref);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
