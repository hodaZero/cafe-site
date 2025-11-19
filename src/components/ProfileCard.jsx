import React from "react";
import { useTheme } from "../context/ThemeContext";

const ProfileCard = ({ name, email, avatar }) => {
  const { theme } = useTheme();

  const bgColor = theme === "light" ? "bg-light-surface/80 border-light-inputBorder/30" : "bg-dark-surface/80 border-dark-inputBorder/30";
  const nameColor = theme === "light" ? "text-light-primary" : "text-dark-primary";
  const emailColor = theme === "light" ? "text-light-text" : "text-dark-text";
  const borderColor = theme === "light" ? "border-light-inputBorder/30" : "border-dark-inputBorder/30";
  const btnBg = theme === "light" ? "bg-light-primary/80" : "bg-dark-primary/80";
  const btnText = theme === "light" ? "text-light-text" : "text-dark-text";
  const btnHover = theme === "light" ? "hover:bg-light-primary/90" : "hover:bg-dark-primary/90";

  return (
    <div
      className={`shadow-lg rounded-2xl p-6 w-full max-w-3xl mb-10 backdrop-blur-md ${bgColor} border`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={avatar || "https://i.pravatar.cc/100"}
            alt="profile"
            className={`w-20 h-20 rounded-full object-cover border ${borderColor}`}
          />
          <div>
            <h2 className={`text-2xl font-bold ${nameColor}`}>{name}</h2>
            <p className={`text-sm ${emailColor}`}>{email}</p>
          </div>
        </div>
        <button className={`px-4 py-2 rounded-lg font-semibold ${btnBg} ${btnText} ${btnHover} transition`}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
