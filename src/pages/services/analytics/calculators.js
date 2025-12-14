// src/services/analytics/calculators.js
// حسابات بنفس طريقة AdminOrders

// 1) Top Selling Products
export function calcTopSellingProducts(orders) {
  const counter = {};

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      if (!counter[item.name]) {
        counter[item.name] = { 
          name: item.name,
          quantity: 0,
          totalRevenue: 0,
          users: new Set(),
        };
      }
      counter[item.name].quantity += item.quantity;
      counter[item.name].totalRevenue += item.quantity * (item.price || 0);
      if (order.userId) counter[item.name].users.add(order.userId);
    });
  });

  return Object.values(counter)
    .map(item => ({
      name: item.name,
      quantity: item.quantity,
      totalRevenue: item.totalRevenue,
      uniqueUsers: item.users.size
    }))
    .sort((a, b) => b.quantity - a.quantity);
}

// 2) Total Sales
export function calcTotalSales(orders) {
  return orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
}

// 3) Active Users
export function calcActiveUsers(orders) {
  const usersCount = {};

  orders.forEach(order => {
    if (!usersCount[order.userId]) usersCount[order.userId] = 0;
    usersCount[order.userId]++;
  });

  return Object.entries(usersCount)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count);
}

// 4) Peak Hours
export function calcPeakHours(orders) {
  const hours = Array(24).fill(0);

  orders.forEach(order => {
    if (order.createdAt?.toDate) {
      const hour = order.createdAt.toDate().getHours();
      hours[hour]++;
    }
  });

  return hours.map((count, hour) => ({ hour, count }));
}
