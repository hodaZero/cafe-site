import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaPen } from "react-icons/fa";

const ProfileCard = ({ name: initialName, email, avatar: initialAvatar, onSave }) => {
  const { theme } = useTheme();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(initialName);
  const [localAvatar, setLocalAvatar] = useState(initialAvatar);

  const bgColor = theme === "light" ? "bg-light-surface/80 border-light-inputBorder/30" : "bg-dark-surface/80 border-dark-inputBorder/30";
  const nameColor = theme === "light" ? "text-light-primary" : "text-dark-primary";
  const emailColor = theme === "light" ? "text-light-text" : "text-dark-text";
  const borderColor = theme === "light" ? "border-light-inputBorder/30" : "border-dark-inputBorder/30";
  const btnBg = theme === "light" ? "bg-light-primary/80" : "bg-dark-primary/80";
  const btnText = theme === "light" ? "text-light-text" : "text-dark-text";
  const btnHover = theme === "light" ? "hover:bg-light-primary/90" : "hover:bg-dark-primary/90";

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLocalAvatar(URL.createObjectURL(file));
    if (onSave) onSave({ name, avatar: file }); 
  };

  const handleSaveName = () => {
    setEditingName(false);
    if (onSave) onSave({ name, avatar: localAvatar });
  };

  return (
    <div
      className={`shadow-lg rounded-2xl p-6 w-full max-w-3xl mb-10 backdrop-blur-md ${bgColor} border`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <img
              src={localAvatar || "https://i.pravatar.cc/100"}
              alt="profile"
              className={`w-20 h-20 rounded-full object-cover border ${borderColor} transition-transform transform group-hover:scale-105`}
            />
            <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 bg-light-primary dark:bg-dark-primary p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <FaPen className="text-black dark:text-white" />
            </label>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div>
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
              <div className="flex items-center gap-2">
                <h2 className={`text-2xl font-bold ${nameColor}`}>{name}</h2>
                <button onClick={() => setEditingName(true)} className="text-light-primary dark:text-dark-primary hover:scale-110 transition-transform">
                  <FaPen />
                </button>
              </div>
            )}
            <p className={`text-sm ${emailColor}`}>{email}</p>
          </div>
        </div>

        <button
          onClick={() => setEditingName(true)}
          className={`px-4 py-2 rounded-lg font-semibold ${btnBg} ${btnText} ${btnHover} transition`}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
