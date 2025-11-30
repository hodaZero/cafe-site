import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import ProductCard from "./ProductCard";
import { auth } from "../firebase/firebaseConfig";

export default function SmartRecommendations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const allProductsSnap = await getDocs(collection(db, "products"));
        const allProducts = allProductsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const user = auth.currentUser;
        let recommendedIds = [];

        if (user) {
          // جلب المنتجات اللي المستخدم اشتراها
          const ordersSnap = await getDocs(collection(db, "orders"));
          const userOrders = ordersSnap.docs
            .map(d => d.data())
            .filter(o => o.userId === user.uid);

          if (userOrders.length > 0) {
            recommendedIds = userOrders.flatMap(o => o.products.map(p => p.id));
          }
        }

        if (recommendedIds.length === 0) {
          // لو مستخدم جديد، نجيب top selling
          const docSnap = await getDoc(doc(db, "analytics_cache", "top_selling"));
          recommendedIds = docSnap.exists() ? docSnap.data().products : [];
        }

        const products = allProducts.filter(p => recommendedIds.includes(p.id));
        setItems(products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading recommendations...</p>;
  if (!items.length) return null; // لو مفيش حاجة، متعرضش حاجة عشان المينيو مش يتشوه

  return (
    <div className="my-8 text-left">
      <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
