// src/firebase/auth.js

import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// تسجيل مستخدم جديد
export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // حفظ بيانات إضافية في Firestore
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    createdAt: new Date()
  });

  return user;
};

// تسجيل دخول مستخدم موجود
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// دالة لجلب بيانات المستخدم
export const getUserData = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};
