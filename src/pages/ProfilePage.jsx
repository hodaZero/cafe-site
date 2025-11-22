// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const cardBg = theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white";
  const btnStyle = theme === "light"
    ? "bg-light-primary hover:bg-light-primaryHover text-black"
    : "bg-dark-primary hover:bg-dark-primaryHover text-white";

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className={`rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6 ${cardBg}`}>
        <img
          src={user.photoURL || "https://i.pravatar.cc/150?img=12"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover"
        />

        <div className="w-full space-y-2">
          <p><span className="font-semibold">Name: </span>{user.displayName || "User"}</p>
          <p><span className="font-semibold">Email: </span>{user.email}</p>
          <p><span className="font-semibold">Role: </span>User</p>
        </div>

        <button
          onClick={handleLogout}
          className={`mt-4 px-6 py-2 rounded-lg font-semibold transition ${btnStyle}`}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
