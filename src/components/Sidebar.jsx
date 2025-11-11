import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

   const links = [
  { name: "Products", path: "/admin/products" },  // ProductsDashboard
  { name: "Orders", path: "/admin/orders" },      // AdminOrders
  { name: "Table", path: "/adminTables" },        // AdminTable
  { name: "Users", path: "/userTables" },         // UserTables لو تحبي
  { name: "Settings", path: "/dashboard/settings" } // لو عندك صفحة إعدادات
];


  return (
    <div className="w-64 bg-dark border-r border-primary p-4 min-h-screen">
      <div className="text-center mb-6">
        <h2 className="text-primary text-2xl font-bold">Dashboard</h2>
      </div>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.path}>
            <Link
              to={l.path}
              className={`block py-2 px-3 rounded-lg ${
                pathname === l.path
                  ? "bg-primary text-black font-semibold"
                  : "hover:bg-primary/20 text-white"
              }`}
            >
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
