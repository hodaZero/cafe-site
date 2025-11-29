// src/services/analytics/analyticsEngine.js
import { fetchOrders, fetchProducts } from "./dataFetcher";
import {
  calcTopSellingProducts,
  calcPeakHours,
  calcTotalSales,
  calcActiveUsers,
} from "./calculators";

export async function generateAnalytics() {
  const orders = await fetchOrders();
  const products = await fetchProducts();

  return {
    totalSales: calcTotalSales(orders),
    topSelling: calcTopSellingProducts(orders),
    peakHours: calcPeakHours(orders),
    activeUsers: calcActiveUsers(orders),
    products: products.length,
    orders: orders.length,
  };
}

