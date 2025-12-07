import React, { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useTheme } from "../../context/ThemeContext";
import { uploadImage } from "../../sevices/storage_sevices";
import { updateUser } from "../../firebase/usersServices"; 
import { FaPen } from "react-icons/fa";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");

  const { theme } = useTheme();
  const STATIC_AVATAR = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "Admin");
      } else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = async () => {
     const fileInput = document.getElementById("profileImageInput").files[0];
     if (!fileInput) return;
 
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
  
  const cardBg = theme === "light" ? "bg-light-surface/90 text-light-text" : "bg-dark-surface/90 text-dark-text";
  const borderColor = theme === "light" ? "border-light-inputBorder/30" : "border-dark-inputBorder/30";

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className={`flex justify-center items-center min-h-screen p-6 ${theme === "light" ? "bg-light-background" : "bg-dark-background"}`}>
      <div className={`rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center gap-6 backdrop-blur-md ${cardBg} border`}>
        <div className="relative group">
          <img
            src={localImage || user.photoURL || STATIC_AVATAR}
            alt="Admin Avatar"
            className={`w-28 h-28 rounded-full object-cover border ${borderColor} transition-transform transform group-hover:scale-105`}
          />
          <label htmlFor="adminImageInput" className="absolute bottom-0 right-0 bg-light-primary dark:bg-dark-primary p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <FaPen className="text-black dark:text-white" />
          </label>
          <input
            id="adminImageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="w-full space-y-2 text-center">
          {editingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              autoFocus
              className={`px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary ${
                theme === "light"
                  ? "bg-light-input text-light-text border-light-inputBorder"
                  : "bg-dark-input text-dark-text border-dark-inputBorder"
              }`}
            />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className={`text-2xl font-bold ${theme === "light" ? "text-light-primary" : "text-dark-primary"}`}>
                {user.displayName || "Admin"}
              </h2>
              <button onClick={() => setEditingName(true)} className="text-light-primary dark:text-dark-primary hover:scale-110 transition-transform">
                <FaPen />
              </button>
            </div>
          )}
          <p className={`text-sm ${theme === "light" ? "text-light-text" : "text-dark-text"}`}>{user.email}</p>
        </div>
      </div>
    </div>
  );
}
