import { auth, db } from "./firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ----------------------
// REGISTER USER WITH EMAIL VERIFICATION
// ----------------------
export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // إرسال رابط التحقق على الإيميل
  await sendEmailVerification(user);

  // تخزين المستخدم في Firestore + role = user
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    avatar: "",
    role: "user",
    createdAt: new Date(),
  });

  return user;
};

// ----------------------
// LOGIN USER + VERIFY EMAIL
// ----------------------
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (!user.emailVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  // قراءة بيانات Firestore
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    return { ...user, ...userDoc.data() }; 
  }

  return user;
};

// ----------------------
// LOGOUT
// ----------------------
export const logoutUser = async () => {
  await signOut(auth);
};

// ----------------------
// GET USER DATA
// ----------------------
export const getUserData = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// ----------------------
// UPDATE USER DATA
// ----------------------
export const updateUserData = async (uid, data) => {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, data, { merge: true });
};
