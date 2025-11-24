
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
    setLocalImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      let photoURL = user.photoURL;

      if (localImage) {
        const fileInput = document.getElementById("profileImageInput").files[0];
        if (fileInput) {
          photoURL = await uploadImage("domi_cafe", fileInput);
          await updateProfile(auth.currentUser, { photoURL });
        }
      }

      if (name !== user.displayName) await updateProfile(auth.currentUser, { displayName: name });
      if (email !== user.email) await updateEmail(auth.currentUser, email);

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

  const cardBg = theme === "light" ? "bg-light-surface text-light-text" : "bg-dark-surface text-dark-text";
  const btnStyle = theme === "light"
    ? "bg-light-primary hover:bg-light-primaryHover text-black"
    : "bg-dark-primary hover:bg-dark-primaryHover text-white";

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className={`flex justify-center items-center min-h-screen p-6 ${theme === "light" ? "bg-light-background" : "bg-dark-background"}`}>
      <div className={`rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6 ${cardBg}`}>
        <img
          src={user.photoURL || STATIC_AVATAR}
          alt="User Avatar"
          className="w-28 h-28 rounded-full object-cover shadow-md"
        />

        <div className="w-full space-y-2 text-center">
          <p><span className="font-semibold">Name: </span>{user.displayName || "User"}</p>
          <p><span className="font-semibold">Email: </span>{user.email}</p>
        </div>

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

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`rounded-xl p-6 w-full max-w-md flex flex-col gap-4 ${theme === "light" ? "bg-light-surface text-light-text" : "bg-dark-surface text-dark-text"}`}>
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
              className={`w-full p-2 border rounded ${theme === "light" ? "bg-light-input text-light-text border-light-inputBorder" : "bg-dark-input text-dark-text border-dark-inputBorder"}`}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full p-2 border rounded ${theme === "light" ? "bg-light-input text-light-text border-light-inputBorder" : "bg-dark-input text-dark-text border-dark-inputBorder"}`}
            />

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setModalOpen(false)}
                className={`px-4 py-2 rounded-lg ${theme === "light" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"}`}
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
