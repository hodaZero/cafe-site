import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import backgroundPic from "../assets/images/backgroundPic.jpg";
import { auth } from "../firebase/firebaseConfig";
import { getUserData, logoutUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const data = await getUserData(auth.currentUser.uid);
        setUserData(data);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  if (!userData) return <p className="pt-16 text-light-text dark:text-dark-text text-center mt-20">Loading...</p>;

  const pageBg = theme === "light" ? "bg-light-background" : "bg-dark-background";
  const overlay = theme === "light" ? "bg-black/20" : "bg-black/40";
  const logoutBtn = theme === "light" 
    ? "bg-light-primary text-light-text hover:bg-light-primaryHover"
    : "bg-dark-primary text-dark-text hover:bg-dark-primaryHover";

  return (
    <div className={`pt-16 relative min-h-screen flex flex-col items-center py-12 overflow-hidden ${pageBg}`}>
    
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundPic})`,
          filter: theme === "light" ? "brightness(0.8)" : "brightness(0.35)",
        }}
      ></div>
      <div className={`absolute inset-0 backdrop-blur-sm ${overlay}`}></div>

      <div className="relative z-10 flex flex-col items-center w-full gap-6">
        <ProfileCard
          name={userData.name}
          email={userData.email}
          avatar={userData.avatar || "https://i.pravatar.cc/100"}
        />

        <div className="flex justify-center w-full">
          <button
            onClick={handleLogout}
            className={`px-6 py-2 font-semibold rounded-lg shadow-md transition ${logoutBtn}`}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
