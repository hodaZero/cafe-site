import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import ProductCard from "../../components/ProductCard";
import ConfirmModal from "../../components/ConfirmModal";
import ProductForm from "../../components/ProductForm";

export default function ProductsDashboard() {
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
    rating: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false); // ✅ مودال الفورم

  const productsRef = collection(db, "products");

  const fetchProducts = async () => {
    const snap = await getDocs(productsRef);
    const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
      data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (filterPrice === "HighToLow") {
      data.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredProducts(data);
  }, [search, filterCategory, filterPrice, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      await updateDoc(doc(db, "products", editingId), form);
      setEditingId(null);
    } else {
      await addDoc(productsRef, form);
    }
    setForm({
      name: "",
      price: "",
      category: categories[0],
      image: "",
      prepTime: "",
      description: "",
      rating: 0
    });
    setShowFormModal(false);
    await fetchProducts();
    setLoading(false);
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name || "",
      price: p.price || "",
      category: p.category || categories[0],
      image: p.image || "",
      prepTime: p.prepTime || "",
      description: p.description || "",
      rating: p.rating || 0
    });
    setEditingId(p.id);
    setShowFormModal(true); // ✅ يفتح المودال في حالة التعديل
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await deleteDoc(doc(db, "products", selectedId));
    setShowModal(false);
    setSelectedId(null);
    await fetchProducts();
  };

  return (
    <div className="text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Products Management</h1>
        <button
          onClick={() => {
            setForm({
              name: "",
              price: "",
              category: categories[0],
              image: "",
              prepTime: "",
              description: "",
              rating: 0
            });
            setEditingId(null);
            setShowFormModal(true);
          }}
          className="bg-primary text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#7FBFD4] transition"
        >
          + Add Product
        </button>
      </div>

      {/* ✅ السيرش والفلاتر */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-dark border border-primary text-white w-full sm:w-1/3"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 rounded bg-dark border border-primary text-white"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className="p-2 rounded bg-dark border border-primary text-white"
        >
          <option value="All">Default</option>
          <option value="LowToHigh">Price: Low → High</option>
          <option value="HighToLow">Price: High → Low</option>
        </select>
      </div>

      {/* ✅ عرض المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div key={p.id} className="relative bg-dark rounded-lg overflow-hidden shadow-lg p-5">
            <ProductCard product={p} showCart={false} hideFavorite={true} />
            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="bg-[#7FBFD4] text-[#13131A] px-3 py-1 rounded hover:bg-[#6BAAC1] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedId(p.id);
                  setShowModal(true);
                }}
                className="bg-[#D97F7F] text-[#13131A] px-3 py-1 rounded hover:bg-[#C76B6B] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ مودال الحذف */}
      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete this product?"
          onCancel={() => setShowModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* ✅ مودال الفورم */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg relative w-[90%] max-w-2xl">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-3 right-4 text-white text-2xl hover:text-primary"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-center mb-4 text-primary">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
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
    </div>
  );
}
