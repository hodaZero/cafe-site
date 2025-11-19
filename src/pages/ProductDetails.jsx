import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useTheme } from "../context/ThemeContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const ref = doc(db, "products", id);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setProduct({ id: snapshot.id, ...snapshot.data() });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <p className={theme === "light" ? "text-gray-900" : "text-white text-center mt-10"}>
        Loading product...
      </p>
    );
  }

  if (!product) {
    return (
      <p className={theme === "light" ? "text-gray-900" : "text-white text-center mt-10"}>
        Product not found
      </p>
    );
  }

  // تحديد الألوان حسب التيم
  const bgMain = theme === "light" ? "bg-light-background text-light-text" : "bg-dark-background text-dark-text";
  const primary = theme === "light" ? "text-light-primary" : "text-dark-primary";
  const primaryHover = theme === "light" ? "hover:text-light-primaryHover" : "hover:text-dark-primaryHover";
  const borderColor = theme === "light" ? "border-light-primary" : "border-dark-primary";
  const buttonBg = theme === "light" ? "bg-light-primary hover:bg-light-primaryHover text-black" : "bg-dark-primary hover:bg-dark-primaryHover text-dark-text";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 relative transition-colors duration-300 ${bgMain}`}>
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-6 left-6 ${primary} ${primaryHover} transition-colors`}
      >
        <ArrowLeft size={28} />
      </button>

      <img
        src={product.image}
        alt={product.name}
        className={`w-48 h-48 rounded-full object-cover border ${borderColor} mb-6`}
      />
      <h2 className={`text-3xl font-semibold mb-2 ${theme === "light" ? "text-light-heading" : "text-dark-heading"}`}>
        {product.name}
      </h2>
      <p className={`${primary} text-lg mb-4`}>₹{product.price}.00</p>

      <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-300">
        <Clock size={18} />
        <span>{product.prepTime}</span>
      </div>

      <p className="max-w-lg text-center mb-6 text-gray-700 dark:text-gray-300">
        {product.description}
      </p>

      <button className={`px-6 py-2 rounded-full font-medium transition-colors ${buttonBg}`}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
