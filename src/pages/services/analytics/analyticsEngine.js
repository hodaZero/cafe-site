import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export const generateAnalytics = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const allOrders = [];

    for (const userDoc of usersSnapshot.docs) {
      const ordersSnapshot = await getDocs(
        collection(db, "users", userDoc.id, "orders")
      );
      ordersSnapshot.forEach(orderDoc =>
        allOrders.push({ userId: userDoc.id, ...orderDoc.data() })
      );
    }

    const allItems = allOrders.flatMap(order => 
      (order.items || []).map(item => ({
        name: item.name,
        quantity: item.quantity || 1,
        category: item.category || "Unknown",
        price: item.price || 0,
        orderType: order.orderType || "Takeaway",
        createdAt: order.createdAt || null,
        userId: order.userId
      }))
    );

    const topSellersMap = {};

    allItems.forEach(item => {
      if (!topSellersMap[item.name]) {
        topSellersMap[item.name] = {
          name: item.name,
          quantity: 0,
          category: item.category,
          totalRevenue: 0,
          uniqueUsers: new Set(),
          orderTypes: {},
          dates: []
        };
      }
      const record = topSellersMap[item.name];
      record.quantity += item.quantity;
      record.totalRevenue += item.quantity * item.price;
      record.uniqueUsers.add(item.userId);
      record.orderTypes[item.orderType] = (record.orderTypes[item.orderType] || 0) + item.quantity;
      if (item.createdAt) record.dates.push(item.createdAt);
    });

    const topSellers = Object.values(topSellersMap).map(item => ({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      totalRevenue: item.totalRevenue,
      uniqueUsers: item.uniqueUsers.size,
      orderTypes: item.orderTypes,
      dates: item.dates
    }));

    topSellers.sort((a, b) => b.quantity - a.quantity);

    await setDoc(doc(db, "topSeller", "global"), { array: topSellers });

    console.log("Top Seller Analytics updated!", topSellers);
    return topSellers;
  } catch (err) {
    console.error("Error generating analytics:", err);
    return [];
  }
};
