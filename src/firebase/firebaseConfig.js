// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC9BXGasT4XsNZTuAB7pk0TiX3i80zmmkw",
  authDomain: "domicafe-42e28.firebaseapp.com",
  projectId: "domicafe-42e28",
  storageBucket: "domicafe-42e28.firebasestorage.app",
  messagingSenderId: "244752715172",
  appId: "1:244752715172:web:56be1b9b5e0fb8463cc531",
  measurementId: "G-EW790LGTB7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
