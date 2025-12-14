import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export const generateAnalytics = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const allOrders = [];

    // جمع كل الأوردرز من كل المستخدمين
    for (const userDoc of usersSnapshot.docs) {
      const ordersSnapshot = await getDocs(
        collection(db, "users", userDoc.id, "orders")
      );

      ordersSnapshot.forEach(orderDoc => {
        const data = orderDoc.data();
        allOrders.push({
          id: orderDoc.id,
          userId: userDoc.id,
          items: data.items || [],
          total: data.total || 0,
          status: data.status || "pending",
          orderType: data.orderType || "Takeaway",
          createdAt: data.createdAt || null,
          category: data.category || "Unknown",
        });
      });
    }

    // تحويل الأوردرز لعناصر فردية مع التأكد من القيم
    const allItems = allOrders.flatMap(order =>
      (order.items || []).map(item => ({
        name: item.name || "Unknown Item",
        quantity: item.quantity || 1,
        category: item.category || order.category || "Unknown",
        price: item.price || 0,
        orderType: order.orderType || "Takeaway",
        createdAt: order.createdAt || null,
        userId: order.userId,
      }))
    );

    // حسابات Top Sellers
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
          dates: [],
        };
      }

      const record = topSellersMap[item.name];
      record.quantity += item.quantity;
      record.totalRevenue += item.quantity * item.price;
      if (item.userId) record.uniqueUsers.add(item.userId);
      record.orderTypes[item.orderType] = (record.orderTypes[item.orderType] || 0) + item.quantity;

      if (item.createdAt) {
        const date = item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
        record.dates.push(date);
      }
    });

    const topSellers = Object.values(topSellersMap).map(item => ({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      totalRevenue: item.totalRevenue,
      uniqueUsers: item.uniqueUsers.size,
      orderTypes: item.orderTypes,
      dates: item.dates,
    }));

    // ترتيب حسب الكمية
    topSellers.sort((a, b) => b.quantity - a.quantity);

    // حفظ البيانات في Firestore
    await setDoc(doc(db, "topSeller", "global"), { array: topSellers });

    console.log("Top Seller Analytics updated!", topSellers);
    return topSellers;
  } catch (err) {
    console.error("Error generating analytics:", err);
    return [];
  }
};
