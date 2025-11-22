// src/pages/Dashboard/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig"; 
import { FaEdit, FaSignOutAlt } from "react-icons/fa";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "Admin");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (user) {
      await updateProfile(user, { displayName });
      setUser({ ...user, displayName });
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  if (!user) return <p className="text-white p-6 text-center mt-20">Not logged in</p>;

  return (
    <div className="flex justify-center items-center min-h-screen relative bg-black">
      {/* الخلفية مع Overlay أغمق */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://via.placeholder.com/800x600)`,
          filter: "brightness(0.3)", // أخف / أقوى الخلفية
        }}
      ></div>
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative flex bg-white shadow-2xl rounded-xl w-full max-w-xl overflow-hidden z-10">
        {/* صورة الادمن */}
        <div className="flex-shrink-0">
          <img
            src={user.photoURL || "https://via.placeholder.com/150"}
            alt="Admin"
            className="w-32 h-32 object-cover rounded-l-xl"
          />
        </div>

        <div className="p-6 flex-1 relative">
          {!isEditing && (
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
              >
                <FaEdit /> Edit
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-1 text-sm"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4 text-black">Admin Profile</h2>

          <div className="space-y-3 text-black">
            <div>
              <label className="block text-sm font-medium mb-1">Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              ) : (
                <p className="text-lg font-medium">{user.displayName || "Admin"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <p className="text-lg font-medium">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role:</label>
              <p className="text-lg font-medium">Admin</p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
