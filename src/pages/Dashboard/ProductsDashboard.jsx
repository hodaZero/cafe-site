import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import ProductCard from "../../components/ProductCard";
import ConfirmModal from "../../components/ConfirmModal";
import ProductForm from "../../components/ProductForm";
import { useTheme } from "../../context/ThemeContext";

export default function ProductsDashboard() {
  const { theme } = useTheme();
  const categories = ["Drinks", "Cake", "Desserts"];

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState({ name:"", price:"", category:categories[0], image:"", prepTime:"", description:"", rating:0 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const productsRef = collection(db, "products");

  // جلب المنتجات وترتيب الأحدث أولاً
  const fetchProducts = async () => {
    const snap = await getDocs(productsRef);
    const arr = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    arr.sort((a,b)=>b.createdAt - a.createdAt);
    setProducts(arr);
    setFilteredProducts(arr);
  };

  useEffect(()=>{ fetchProducts(); }, []);

  useEffect(()=>{
    let data = [...products];
    if(search.trim()) data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if(filterCategory !== "All") data = data.filter(p => p.category === filterCategory);
    if(filterPrice==="LowToHigh") data.sort((a,b)=>parseFloat(a.price)-parseFloat(b.price));
    else if(filterPrice==="HighToLow") data.sort((a,b)=>parseFloat(b.price)-parseFloat(a.price));
    setFilteredProducts(data);
  }, [search, filterCategory, filterPrice, products]);

  const handleSubmit = async () => {
    setLoading(true);
    if(editingId) await updateDoc(doc(db, "products", editingId), form);
    else await addDoc(productsRef, {...form, createdAt:Date.now()});
    setForm({ name:"", price:"", category:categories[0], image:"", prepTime:"", description:"", rating:0 });
    setEditingId(null);
    setShowFormModal(false);
    await fetchProducts();
    setLoading(false);
  };

  const handleEdit = (p) => { setForm({...p}); setEditingId(p.id); setShowFormModal(true); };
  const handleDelete = async () => { 
    if(!selectedId) return; 
    await deleteDoc(doc(db, "products", selectedId)); 
    setShowModal(false); 
    setSelectedId(null); 
    await fetchProducts(); 
  };

  const bgMain = theme==="light" ? "bg-light-background text-light-text" : "bg-dark-background text-dark-text";
  const cardBg = theme==="light" ? "bg-light-surface" : "bg-dark-surface";
  const inputBg = theme==="light" ? "bg-light-input text-light-text border-light-inputBorder" : "bg-dark-input text-dark-text border-dark-inputBorder";
  const btnPrimary = theme==="light" ? "bg-light-primary text-black hover:bg-light-primaryHover" : "bg-dark-primary text-black hover:bg-dark-primaryHover";

  return (
    <div className={`pt-16 min-h-screen p-6 transition-colors duration-300 ${bgMain}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Products Management</h1>
        <button 
          onClick={()=>{setForm({name:"",price:"",category:categories[0],image:"",prepTime:"",description:"",rating:0}); setEditingId(null); setShowFormModal(true);}} 
          className={`px-6 py-2 rounded-lg font-semibold transition ${btnPrimary}`}
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <input type="text" placeholder="Search by name or category..." value={search} onChange={e=>setSearch(e.target.value)} className={`p-2 rounded w-full sm:w-1/3 transition-colors duration-300 ${inputBg}`}/>
        <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)} className={`p-2 rounded transition-colors duration-300 ${inputBg}`}>
          <option value="All">All Categories</option>
          {categories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterPrice} onChange={e=>setFilterPrice(e.target.value)} className={`p-2 rounded transition-colors duration-300 ${inputBg}`}>
          <option value="All">Default</option>
          <option value="LowToHigh">Price: Low → High</option>
          <option value="HighToLow">Price: High → Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map(p => (
          <div key={p.id} className={`relative rounded-2xl overflow-hidden shadow-lg transition-transform transform hover:scale-105 ${cardBg}`}>
            {/* الكارد نفسه */}
            <ProductCard product={p} />
            
            {/* أزرار Edit/Delete */}
            <div className="flex justify-center gap-3 mt-3 px-3 pb-3">
              <button onClick={()=>handleEdit(p)} className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md transition-all duration-200 transform hover:scale-105">Edit</button>
              <button onClick={()=>{setSelectedId(p.id); setShowModal(true);}} className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 shadow-md transition-all duration-200 transform hover:scale-105">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {showModal && <ConfirmModal message="Are you sure you want to delete this product?" onCancel={()=>setShowModal(false)} onConfirm={handleDelete}/>}

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 transition-colors duration-300" style={{backgroundColor: theme==="light"?"rgba(0,0,0,0.3)":"rgba(0,0,0,0.6)"}}>
          <div className={`p-6 rounded-2xl shadow-lg relative w-[90%] max-w-2xl transition-colors duration-300 ${cardBg}`}>
            <button onClick={()=>setShowFormModal(false)} className="absolute top-3 right-4 text-2xl hover:text-primary">&times;</button>
            <h2 className="text-2xl font-bold text-center mb-4 text-primary">{editingId ? "Edit Product" : "Add Product"}</h2>
            <ProductForm form={form} setForm={setForm} onSubmit={handleSubmit} categories={categories} loading={loading}/>
          </div>
        </div>
      )}
    </div>
  );
}
