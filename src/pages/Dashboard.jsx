import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { fetchOrders } from "./services/analytics/dataFetcher";
import { calcTopSellingProducts, calcTotalSales, calcActiveUsers, calcPeakHours } from "./services/analytics/calculators";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [activeUsers, setActiveUsers] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const ordersData = await fetchOrders();
      setOrders(ordersData);

      const topSellersDoc = await getDoc(doc(db, "topSeller", "global"));
      setTopSellers(topSellersDoc.exists() ? topSellersDoc.data().array : []);

      setTotalSales(calcTotalSales(ordersData));
      setActiveUsers(calcActiveUsers(ordersData));
      setPeakHours(calcPeakHours(ordersData));

      const insights = [
        `Total Sales: ${calcTotalSales(ordersData)} EGP`,
        `Top Product: ${topSellersDoc.exists() ? topSellersDoc.data().array[0]?.name : "-"}`,
        `Most Active User: ${calcActiveUsers(ordersData)[0]?.userId || "-"}`
      ];
      setAiInsights(insights);
    }
    fetchData();
  }, []);

  const bgMain = "bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text";
  const cardBg = "bg-light-surface dark:bg-dark-surface backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80";

  return (
    <div className={`min-h-screen p-10 ${bgMain}`}>
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
          {t("dashboard.title")}
        </h1>
        <p className="text-lg opacity-80 mt-2">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: t("dashboard.totalSales"), value: `${totalSales} EGP` },
          { label: t("dashboard.totalOrders"), value: orders.length },
          { label: t("dashboard.activeUsers"), value: activeUsers.length },
        ].map((item, i) => (
          <div
            key={i}
            className={`p-8 rounded-3xl shadow-xl ${cardBg} 
              hover:scale-[1.05] transition-all duration-300 
              border border-light-inputBorder dark:border-dark-inputBorder`}
          >
            <h3 className="text-xl font-semibold mb-2 tracking-wide">
              {item.label}
            </h3>
            <p className="text-4xl font-extrabold text-[#B45309] dark:text-[#B45309]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Top Selling Chart */}
      <div className={`p-8 rounded-3xl shadow-xl mb-12 ${cardBg} border border-light-inputBorder dark:border-dark-inputBorder`}>
        <h3 className="text-2xl font-semibold mb-6 tracking-wide">
          {t("dashboard.topSellingProducts")}
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topSellers.slice(0, 10)}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 14, fill: "#FACC15", fontWeight: 600 }} 
              stroke="#B45309" 
            />
            <YAxis />
            <Tooltip 
              cursor={{ fill: 'rgba(180, 83, 9, 0.1)' }}
            />
            <Bar
              dataKey="quantity"
              fill="#B45309"
              radius={[10, 10, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights */}
      <div className={`p-8 rounded-3xl shadow-xl ${cardBg} border border-light-inputBorder dark:border-dark-inputBorder`}>
        <h3 className="text-2xl font-semibold mb-4 tracking-wide">
          {t("dashboard.aiInsights")}
        </h3>
        <ul className="space-y-3">
          {aiInsights.map((insight, idx) => (
            <li
              key={idx}
              className="p-4 rounded-xl bg-light-surface dark:bg-dark-surface shadow-sm
                hover:shadow-lg hover:bg-light-background dark:hover:bg-dark-background
                transition-all duration-300 text-light-text dark:text-dark-text"
            >
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
