import React from "react";

const ProfileCard = ({ name, email, avatar }) => {
  return (
    <div
      className="shadow-lg rounded-2xl p-6 w-full max-w-3xl mb-10 backdrop-blur-md"
      style={{
        backgroundColor: "rgba(107, 79, 63, 0.12)", 
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={avatar || "https://i.pravatar.cc/100"}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border border-white/30"
          />
          <div>
            <h2 className="text-2xl font-bold text-[#F8F5F2]">{name}</h2>
            <p className="text-[#d3c8b9]">{email}</p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-lg bg-[#D3AD7F]/80 text-[#13131A] font-semibold hover:bg-[#D3AD7F]/90 transition">
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
