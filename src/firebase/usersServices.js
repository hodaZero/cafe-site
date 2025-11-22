import { db } from "./firebaseConfig";
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

const usersRef = collection(db, "users");

export const addUser = async (data, uid) => {
  const ref = doc(db, "users", uid); // uid من Firebase Auth
  await setDoc(ref, data);
};

export const updateUser = async (uid, data) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, data);
};

export const getUsers = async () => {
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteUser = async (uid) => {
  const ref = doc(db, "users", uid);
  await deleteDoc(ref);
};
