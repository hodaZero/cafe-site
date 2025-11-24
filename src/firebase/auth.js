import { auth, db } from "./firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ----------------------
// REGISTER USER
// ----------------------
export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await sendEmailVerification(user);

  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    avatar: "",
    role: "user",  // كل مستخدم جديد role = user
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
    const error = new Error("Please verify your email before logging in.");
    error.user = user;
    throw error;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    return { ...user, ...userDoc.data() };  // هيرجع الـ role كمان
  }

  return user;
};

// ----------------------
// LOGIN WITH GOOGLE
// ----------------------
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName || "",
      email: user.email,
      avatar: user.photoURL || "",
      role: "user",
      createdAt: new Date(),
    });
    return { ...user, role: "user" };
  } else {
    return { ...user, ...userDoc.data() }; // هيرجع الـ role
  }
};

// ----------------------
// LOGOUT
// ----------------------
export const logoutUser = async () => {
  await signOut(auth);
};

// ----------------------
// RESEND VERIFICATION EMAIL
// ----------------------
export const resendVerificationEmail = async (user) => {
  if (user && !user.emailVerified) {
    await sendEmailVerification(user);
  }
};

// ----------------------
// RESET PASSWORD
// ----------------------
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
