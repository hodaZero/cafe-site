import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const productsRef = collection(db, "products");

export const addProduct = async (data) => {
  await addDoc(productsRef, data);
};

export const getProducts = async () => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateProduct = async (id, data) => {
  const ref = doc(db, "products", id);
  await updateDoc(ref, data);
};

export const deleteProduct = async (id) => {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
};
