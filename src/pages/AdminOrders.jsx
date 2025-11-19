import React, { useState } from "react";
import {
  Search,
  Bell,
  User,
  Coffee,
  CakeSlice,
  LayoutGrid,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const initialOrders = [
  {
    id: 215,
    date: "22 May 2021, 12:21 PM",
    category: "Dessert",
    items: [
      {
        name: "Vanilla Cake",
        desc: "Soft vanilla cake with cream",
        price: 6.0,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=60",
      },
      {
        name: "Mocha",
        desc: "Hot coffee with chocolate",
        price: 4.0,
        qty: 2,
        image:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=60",
      },
    ],
    status: "pending",
    userInitial: "J",
    color: "bg-primary",
  },
  {
    id: 216,
    date: "23 May 2021, 11:10 AM",
    category: "Drink",
    items: [
      {
        name: "Latte",
        desc: "Smooth coffee with milk",
        price: 4.0,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=60",
      },
      {
        name: "Chocolate Muffin",
        desc: "Soft chocolate muffin",
        price: 3.5,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=60",
      },
    ],
    status: "pending",
    userInitial: "M",
    color: "bg-primary",
  },
  {
    id: 217,
    date: "24 May 2021, 09:45 AM",
    category: "Dessert",
    items: [
      {
        name: "Strawberry Cheesecake",
        desc: "Classic cheesecake with strawberry",
        price: 5.5,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1601050690290-4f5ec2e0f4de?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Iced Latte",
        desc: "Cold coffee with milk",
        price: 4.0,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=50&h=50&fit=crop",
      },
    ],
    status: "pending",
    userInitial: "A",
    color: "bg-primary",
  },
];

export default function AdminOrders() {
  const { theme } = useTheme();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [activeTab, setActiveTab] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filtered = orders.filter(
    (order) =>
      (category === "All" || order.category === category) &&
      order.items.some((it) =>
        it.name.toLowerCase().includes(search.toLowerCase())
      )
  );

  // Theme Colors
  const bgMain = theme === "light" ? "bg-gray-100 text-gray-900" : "bg-dark-surface text-white";
  const inputBg = theme === "light" ? "bg-white text-black border-gray-300" : "bg-black text-white border-[#2c2c2c]";
  const tabActive = theme === "light" ? "bg-primary text-black" : "bg-[#D3AD7F] text-black";
  const tabInactive = theme === "light" ? "bg-white text-gray-600 hover:bg-gray-200" : "bg-dark-surface text-gray-400 hover:bg-[#222]";
  const cardBg = theme === "light" ? "bg-white border-gray-200" : "bg-black border-[#2a2a2a]";
  const cardText = theme === "light" ? "text-gray-900" : "text-white";
  const subText = theme === "light" ? "text-gray-500" : "text-gray-400";

  return (
    <div className={`min-h-screen p-6 font-sans transition-colors duration-300 ${bgMain}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <div className="flex items-center gap-3 w-full md:w-2/3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-2.5 ${subText}`} size={16} />
            <input
              className={`w-full pl-10 pr-3 py-2 rounded-md text-sm focus:outline-none ${inputBg}`}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            {[
              { name: "All", icon: <LayoutGrid size={16} /> },
              { name: "Dessert", icon: <CakeSlice size={16} /> },
              { name: "Drink", icon: <Coffee size={16} /> },
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  category === cat.name ? tabActive : tabInactive
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${theme === "light" ? "bg-gray-300 text-black" : "bg-gray-700 text-white"}`}>
            <User size={16} />
          </div>
          <p className="text-sm text-gray-300">Admin1_resto</p>
          <Bell className="text-gray-400" size={18} />
        </div>
      </div>

      {/* Order Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {orders.map((o) => (
          <button
            key={o.id}
            onClick={() => setActiveTab(activeTab === o.id ? null : o.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === o.id ? tabActive : tabInactive
            }`}
          >
            #{o.id}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered
          .filter((order) => !activeTab || order.id === activeTab)
          .map((order) => (
            <div
              key={order.id}
              className={`rounded-xl p-4 shadow-lg border hover:shadow-xl transition-all ${cardBg}`}
            >
              {/* Top */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className={`text-sm font-medium ${cardText}`}>Order #{order.id}</p>
                  <p className={`text-xs ${subText}`}>{order.date}</p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${order.color}`}
                >
                  <span className="font-semibold">{order.userInitial}</span>
                </div>
              </div>

              {/* Middle */}
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col w-full">
                    <p className={`text-sm font-semibold ${cardText}`}>{item.name}</p>
                    <p className={`text-xs ${subText}`}>{item.desc}</p>
                    <div className={`flex justify-between text-xs mt-1 ${subText}`}>
                      <span>${item.price.toFixed(2)}</span>
                      <span>Qty: {item.qty}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom */}
              <hr className={`border ${theme === "light" ? "border-gray-300" : "border-gray-600"} mb-2`} />
              <div className="flex justify-between items-center">
                <div className={`flex items-center gap-4 text-xs ${subText}`}>
                  <span>
                    {order.items.length} {order.items.length > 1 ? "Items" : "Item"}
                  </span>
                  <span>
                    $
                    {order.items
                      .reduce((s, it) => s + it.price * it.qty, 0)
                      .toFixed(2)}
                  </span>
                </div>

                {/* Status Buttons */}
                <div className="flex gap-2">
                  {order.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(order.id, "completed")}
                        className="text-green-500"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, "rejected")}
                        className="text-red-500"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  ) : order.status === "completed" ? (
                    <button className="text-green-500 font-semibold">Completed</button>
                  ) : (
                    <button className="text-red-500 font-semibold">Rejected</button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
