// src/pages/ProductsDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import ProductCard from "../../components/ProductCard";
import ConfirmModal from "../../components/ConfirmModal";
import ProductForm from "../../components/ProductForm";
import { useTheme } from "../../context/ThemeContext";
import Pagination from "../../components/Pagination";
import AIChatWindow from "../../components/AIChat/AIChatWindow";

export default function ProductsDashboard() {
  const { theme } = useTheme();
  const categories = ["Drinks", "Cake", "Desserts"];

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: categories[0],
    image: "",
    prepTime: "",
    description: "",
    rating: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const productsRef = collection(db, "products");

  const fetchProducts = async () => {
    const snap = await getDocs(productsRef);
    const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    arr.sort((a, b) => b.createdAt - a.createdAt);
    setProducts(arr);
    setFilteredProducts(arr);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let data = [...products];

    if (search.trim()) {
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory !== "All") {
      data = data.filter((p) => p.category === filterCategory);
    }

    if (filterPrice === "LowToHigh") {
      data.sort((a, b) => +a.price - +b.price);
    } else if (filterPrice === "HighToLow") {
      data.sort((a, b) => +b.price - +a.price);
    }

    setFilteredProducts(data);
    setCurrentPage(1);
  }, [search, filterCategory, filterPrice, products]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSubmit = async (data) => {
    setLoading(true);
    if (editingId) {
      await updateDoc(doc(db, "products", editingId), data);
    } else {
      await addDoc(productsRef, { ...data, createdAt: Date.now() });
    }
    setShowFormModal(false);
    setEditingId(null);
    await fetchProducts();
    setLoading(false);
  };

  const handleEdit = (p) => {
    setForm({ ...p });
    setEditingId(p.id);
    setShowFormModal(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await deleteDoc(doc(db, "products", selectedId));
    setShowModal(false);
    setSelectedId(null);
    await fetchProducts();
  };

  /* ================= THEME ================= */

  const bgMain =
    theme === "light"
      ? "bg-light-background text-light-text"
      : "bg-dark-background text-dark-text";

  const inputStyle =
    theme === "light"
      ? "bg-light-input border-light-inputBorder focus:ring-2 focus:ring-light-primary"
      : "bg-dark-input border-dark-inputBorder focus:ring-dark-primary";

  const cardStyle =
    theme === "light"
      ? "bg-light-surface border border-light-inputBorder shadow-sm hover:shadow-md"
      : "bg-dark-surface border border-white/10";

  const primaryBtn =
    theme === "light"
      ? "bg-light-primary hover:bg-light-primaryHover text-white"
      : "bg-dark-primary hover:bg-dark-primaryHover text-white";

  return (
    <div className={`pt-16 min-h-screen px-6 pb-20 ${bgMain}`}>
      {/* ===== Header ===== */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-bold text-light-heading dark:text-dark-heading">
          Products
        </h1>

        <button
          onClick={() => {
            setForm({
              name: "",
              price: "",
              category: categories[0],
              image: "",
              prepTime: "",
              description: "",
              rating: 0,
            });
            setEditingId(null);
            setShowFormModal(true);
          }}
          className={`px-8 py-3 rounded-xl font-semibold transition ${primaryBtn}`}
        >
          + Add Product
        </button>
      </div>

      {/* ===== Filters (NO CARD – SAME BACKGROUND) ===== */}
      <div className="mb-10 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`px-4 py-3 rounded-xl border w-full md:w-1/2 lg:w-1/3 focus:outline-none transition ${inputStyle}`}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`px-4 py-3 rounded-xl border transition ${inputStyle}`}
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className={`px-4 py-3 rounded-xl border transition ${inputStyle}`}
        >
          <option value="All">Default</option>
          <option value="LowToHigh">Price: Low → High</option>
          <option value="HighToLow">Price: High → Low</option>
        </select>
      </div>

      {/* ===== Products Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedProducts.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl overflow-hidden transition ${cardStyle}`}
          >
            <ProductCard product={p} adminView />

            <div className="flex gap-3 p-4">
              <button
                onClick={() => handleEdit(p)}
                className={`flex-1 py-2 rounded-lg font-semibold ${primaryBtn}`}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedId(p.id);
                  setShowModal(true);
                }}
                className="flex-1 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete this product?"
          onCancel={() => setShowModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="p-6 rounded-2xl w-[90%] max-w-2xl bg-light-surface dark:bg-dark-surface">
            <ProductForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              categories={categories}
              loading={loading}
            />
          </div>
        </div>
      )}

      <AIChatWindow />
    </div>
  );
}
