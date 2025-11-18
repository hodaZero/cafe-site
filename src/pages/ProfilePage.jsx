import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import backgroundPic from "../assets/images/backgroundPic.jpg";
import { auth } from "../firebase/firebaseConfig";
import { getUserData, logoutUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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

  if (!userData) return <p className="text-white text-center mt-20">Loading...</p>;

  return (
    <div className="relative min-h-screen flex flex-col items-center py-12 overflow-hidden">
      {/* الخلفية */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundPic})`,
          filter: "brightness(0.35)",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center w-full gap-6">
        {/* البطاقة */}
        <ProfileCard
          name={userData.name}
          email={userData.email}
          avatar={userData.avatar || "https://i.pravatar.cc/100"}
        />

        {/* زرار Logout بجانب البطاقة بشكل أفقي */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
