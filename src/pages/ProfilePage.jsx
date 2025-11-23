
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile, updateEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { uploadImage } from "../sevices/storage_sevices";
import { updateUser } from "../firebase/usersServices"; 

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setLocalImage(preview);
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      let photoURL = user.photoURL;

      // رفع الصورة لو تم اختيار صورة جديدة
      if (localImage) {
        const fileInput = document.getElementById("profileImageInput").files[0];
        if (fileInput) {
          photoURL = await uploadImage("domi_cafe", fileInput);
          await updateProfile(auth.currentUser, { photoURL });
        }
      }

      // تحديث الاسم
      if (name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // تحديث الايميل
      if (email !== user.email) {
        await updateEmail(auth.currentUser, email);
      }

      // تحديث Firestore
      await updateUser(auth.currentUser.uid, { name, email, photoURL });

      setUser({ ...auth.currentUser, displayName: name, email, photoURL });
      setLocalImage(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const cardBg = theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white";
  const btnStyle =
    theme === "light"
      ? "bg-light-primary hover:bg-light-primaryHover text-black"
      : "bg-dark-primary hover:bg-dark-primaryHover text-white";

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className={`rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6 ${cardBg}`}>
        
        {/* صورة المستخدم */}
        <img
          src={user.photoURL || STATIC_AVATAR}
          alt="User Avatar"
          className="w-28 h-28 rounded-full object-cover shadow-md"
        />

        {/* بيانات المستخدم */}
        <div className="w-full space-y-2 text-center">
          <p><span className="font-semibold">Name: </span>{user.displayName || "User"}</p>
          <p><span className="font-semibold">Email: </span>{user.email}</p>
        </div>

        {/* زر Edit */}
        <button
          onClick={() => setModalOpen(true)}
          className={`mt-2 px-6 py-2 rounded-lg font-semibold transition ${btnStyle}`}
        >
          Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className={`mt-2 px-6 py-2 rounded-lg font-semibold transition ${btnStyle}`}
        >
          Logout
        </button>
      </div>

      {/* Modal لتعديل البيانات */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md flex flex-col gap-4`}>
            <h2 className="text-xl font-semibold text-center">Edit Profile</h2>

            <div className="flex flex-col items-center gap-4">
              <img
                src={localImage || user.photoURL || STATIC_AVATAR}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
              <label className="cursor-pointer bg-dark-primary text-white px-4 py-2 rounded-lg hover:bg-dark-primaryHover transition">
                Choose New Photo
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className={`px-4 py-2 rounded-lg font-semibold transition ${btnStyle}`}
              >
                {uploading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
