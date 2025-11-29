// src/services/analytics/calculators.js

// 1) Top selling products
export function calcTopSellingProducts(orders) {
  const counter = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!counter[item.productId]) counter[item.productId] = 0;
      counter[item.productId] += item.quantity;
    });
  });

  return Object.entries(counter)
    .map(([productId, qty]) => ({ productId, qty }))
    .sort((a, b) => b.qty - a.qty);
}

// 2) Peak Hours
export function calcPeakHours(orders) {
  const hours = Array(24).fill(0);

  orders.forEach((order) => {
    const hour = new Date(order.createdAt.seconds * 1000).getHours();
    hours[hour]++;
  });

  return hours.map((count, hour) => ({ hour, count }));
}

// 3) Total sales
export function calcTotalSales(orders) {
  return orders.reduce((sum, o) => sum + Number(o.total), 0);
}

// 4) Active users
export function calcActiveUsers(orders) {
  const userCount = {};

  orders.forEach((order) => {
    if (!userCount[order.userId]) userCount[order.userId] = 0;
    userCount[order.userId]++;
  });

  return Object.entries(userCount)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count);
}
