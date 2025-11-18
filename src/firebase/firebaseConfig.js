import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // جديد

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADuDp22Yd6kZOdtbG4Vm2UeRG2vfsadPk",
  authDomain: "coffee-site-iti.firebaseapp.com",
  projectId: "coffee-site-iti",
  storageBucket: "coffee-site-iti.appspot.com",
  messagingSenderId: "330809796631",
  appId: "1:330809796631:web:a4f0db5ffc334ff16ad452",
  measurementId: "G-6QMBCFKMJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);
export const auth = getAuth(app); // جديد

export { app, analytics };
