// src/components/SmartRecommendations.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "./ProductCard";
const getSimilarProducts = (allProducts, userProductIds) => {
  const similar = [];
  const userProducts = allProducts.filter(p => userProductIds.includes(p.id));

  userProducts.forEach(up => {
    const sameCategory = allProducts.filter(
      p => p.category === up.category && !userProductIds.includes(p.id)
    );
    similar.push(...sameCategory);
  });

  const unique = Array.from(new Set(similar.map(p => p.id))).map(
    id => similar.find(p => p.id === id)
  );
  return unique;
};

const getTopSellingProducts = (allProducts, orders, limit = 6) => {
  const counter = {};

  orders.forEach(order => {
    (order.items || []).forEach(item => {
      if (!counter[item.id]) counter[item.id] = 0;
      counter[item.id] += item.quantity || 1;
    });
  });

  const topIds = Object.entries(counter)
    .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
    .slice(0, limit)
    .map(([id]) => id);

  return allProducts.filter(p => topIds.includes(p.id));
};

export default function SmartRecommendations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const allProductsSnap = await getDocs(collection(db, "products"));
        const allProducts = allProductsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const ordersSnap = await getDocs(collection(db, "orders"));
        const allOrders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const user = auth.currentUser;
        let recommendedProducts = [];

        if (user) {
          const userOrders = allOrders.filter(o => o.userId === user.uid);
          const userProductIds = userOrders.flatMap(o => (o.items || []).map(i => i.id));

          if (userProductIds.length > 0) {
            const similar = getSimilarProducts(allProducts, userProductIds);
            recommendedProducts = similar.length > 0
              ? similar
              : allProducts.filter(p => userProductIds.includes(p.id));
          }
        }

        if (recommendedProducts.length === 0) {
          recommendedProducts = getTopSellingProducts(allProducts, allOrders);

          if (recommendedProducts.length === 0) {
            recommendedProducts = allProducts.slice(0, 6);
          }
        }

        setItems(recommendedProducts);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading recommendations...</p>;
  if (!items.length) return <p className="text-center mt-4">No recommendations for you.</p>;

  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-4 text-left px-2">Recommended for you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
