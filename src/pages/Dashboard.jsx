import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { calcTopSellingProducts, calcTotalSales, calcActiveUsers, calcPeakHours } from "./services/analytics/calculators";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [orders, setOrders] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [activeUsers, setActiveUsers] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const allOrders = [];

      for (const userDoc of usersSnapshot.docs) {
        const ordersSnap = await getDocs(collection(db, "users", userDoc.id, "orders"));
        ordersSnap.forEach(orderDoc => {
          allOrders.push({
            id: orderDoc.id,
            userId: userDoc.id,
            ...orderDoc.data()
          });
        });
      }

      setOrders(allOrders);

      // حسابات بنفس طريقة AdminOrders
      const top = calcTopSellingProducts(allOrders);
      setTopSellers(top);
      setTotalSales(calcTotalSales(allOrders));
      const users = calcActiveUsers(allOrders);
      setActiveUsers(users);
      setPeakHours(calcPeakHours(allOrders));

      const insights = [
        `Total Sales: ${calcTotalSales(allOrders)} EGP`,
        `Top Product: ${top[0]?.name || "-"}`,
        `Most Active User: ${users[0]?.userId || "-"}`
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
        <h1 className="text-5xl font-extrabold" style={{ fontFamily: "'Playwrite CZ', cursive" }}>
          <span className={theme === "light" ? "text-black" : "text-white"}>
            {t("dashboard.title").split(" ")[0]}
          </span>{" "}
          <span className={theme === "light" ? "text-light-primary" : "text-dark-primary"}>
            {t("dashboard.title").split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="text-lg opacity-80 mt-2">{t("dashboard.subtitle")}</p>
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
            className={`p-8 rounded-3xl shadow-xl ${cardBg} hover:scale-[1.05] transition-all duration-300 border border-light-inputBorder dark:border-dark-inputBorder`}
          >
            <h3 className="text-xl font-semibold mb-2 tracking-wide">{item.label}</h3>
            <p className={theme === "light" ? "text-light-primary text-4xl font-extrabold" : "text-dark-primary text-4xl font-extrabold"}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Top Selling Chart */}
      <div className={`p-8 rounded-3xl shadow-xl mb-12 ${cardBg} border border-light-inputBorder dark:border-dark-inputBorder`}>
        <h3 className="text-2xl font-semibold mb-6 tracking-wide">{t("dashboard.topSellingProducts")}</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topSellers.slice(0, 10)}>
            <XAxis dataKey="name" tick={{ fontSize: 14, fill: "#FACC15", fontWeight: 600 }} stroke="#B45309" />
            <YAxis />
            <Tooltip cursor={{ fill: theme === "light" ? 'rgba(217,119,6,0.1)' : 'rgba(217,119,6,0.1)' }}/>
            <Bar dataKey="quantity" fill="#D97706" radius={[10, 10, 0, 0]} animationDuration={1500}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights */}
      <div className={`p-8 rounded-3xl shadow-xl ${cardBg} border border-light-inputBorder dark:border-dark-inputBorder`}>
        <h3 className="text-2xl font-semibold mb-4 tracking-wide">{t("dashboard.aiInsights")}</h3>
        <ul className="space-y-3">
          {aiInsights.map((insight, idx) => (
            <li
              key={idx}
              className={`p-4 rounded-xl shadow-sm ${theme === "light" ? "bg-light-surface text-light-text hover:bg-light-background" : "bg-dark-surface text-dark-text hover:bg-dark-background"} hover:shadow-lg transition-all duration-300`}
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
