import React, { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useTheme } from "../context/ThemeContext";
import { uploadImage } from "../sevices/storage_sevices";
import { updateUser } from "../firebase/usersServices";
import { FaPen } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { theme } = useTheme();
  const STATIC_AVATAR = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
      } else setUser(null);
    });
    return () => unsubscribe();
  }, []);

 const handleImageChange = async (e) => {
  const fileInput = e.target.files?.[0]; // Use optional chaining
  if (!fileInput) return; // لو مفيش ملف مختار

  setUploading(true);
  try {
    const photoURL = await uploadImage("domi_cafe", fileInput);
    await updateProfile(auth.currentUser, { photoURL });
    await updateUser(auth.currentUser.uid, { photoURL });
    setUser((prev) => ({ ...prev, photoURL }));
    setLocalImage(null);
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
  }
};



  const handleSaveName = async () => {
    if (name !== user.displayName) {
      setUploading(true);
      try {
        await updateProfile(auth.currentUser, { displayName: name });
        await updateUser(auth.currentUser.uid, { name });
        setUser((prev) => ({ ...prev, displayName: name }));
        setEditingName(false);
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    } else setEditingName(false);
  };

  const cardBg = theme === "light"
    ? "bg-light-surface text-light-text"
    : "bg-dark-surface text-dark-text";

  const containerBg = theme === "light"
    ? "bg-light-background"
    : "bg-dark-background";

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className={`flex justify-center items-center min-h-screen p-6 ${containerBg}`}>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.25),0_10px_20px_rgba(0,0,0,0.15)] p-8 w-full max-w-md flex flex-col items-center gap-6 backdrop-blur-xl border ${cardBg}`}
      >
        
        {/* صورة المستخدم مع أيقونة القلم */}
        <motion.div className="relative group" whileHover={{ scale: 1.05 }}>
          <motion.img
            src={localImage || user.photoURL || STATIC_AVATAR}
            alt="User Avatar"
            className="w-36 h-36 rounded-full object-cover shadow-[0_0_20px_rgba(0,0,0,0.25)] transition-transform"
            whileHover={{ scale: 1.1, rotate: 2 }}
          />
          <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 bg-light-primary dark:bg-dark-primary p-3 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <FaPen className="text-black dark:text-white" />
          </label>
          <input
            id="profileImageInput"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleImageChange}
          />
        </motion.div>

        {/* الاسم editable */}
        <motion.div className="w-full text-center space-y-2">
          <p className="text-sm text-gray-400">Name:</p>
          {editingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              autoFocus
              className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary text-center font-semibold text-lg ${
                theme === "light"
                  ? "bg-light-input text-black border-light-inputBorder"
                  : "bg-dark-input text-white border-dark-inputBorder"
              }`}
            />
          ) : (
            <motion.div
              className="flex justify-center items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="font-semibold text-2xl">{user.displayName || "User"}</span>
              <button onClick={() => setEditingName(true)} className="text-light-primary dark:text-dark-primary hover:scale-110 transition-transform">
                <FaPen />
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* الايميل */}
        <motion.div className="w-full text-center space-y-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-sm text-gray-400">Email:</p>
          <span className="font-medium text-base">{user.email}</span>
        </motion.div>

      </motion.div>
    </div>
  );
}
