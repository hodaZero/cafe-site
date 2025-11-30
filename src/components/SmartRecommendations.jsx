import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import ProductCard from "./ProductCard";

export default function SmartRecommendations() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const docSnap = await getDoc(doc(db, "analytics_cache", "top_selling"));
      const topIds = docSnap.exists() ? docSnap.data().products : [];

      if(topIds.length === 0) return;

      const productsRef = collection(db, "products");
      const q = query(productsRef, where("id", "in", topIds));
      const snap = await getDocs(q);
      const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      setItems(products);
    };

    fetchRecommendations();
  }, []);

  if(!items.length) return <p className="text-center mt-4">No recommendations for you.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10">
      {items.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
