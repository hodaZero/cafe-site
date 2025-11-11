// src/pages/Dashboard/DashboardLayout.jsx
import React from "react";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-dark text-white min-h-screen">
    
      <div className="w-64 fixed top-0 left-0 h-screen bg-[#1a1a1a] shadow-lg overflow-y-auto">
        <Sidebar />
      </div>


      <div className="flex-1 ml-64 p-6 h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
