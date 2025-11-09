import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { products } from "../components/ProductList";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === parseInt(id));

  if (!product)
    return <p className="text-white text-center mt-10">Product not found</p>;

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-6 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-[#d3ad7f] hover:text-white"
      >
        <ArrowLeft size={28} />
      </button>

      <img
        src={product.image}
        alt={product.name}
        className="w-48 h-48 rounded-full object-cover border border-[#d3ad7f] mb-6"
      />
      <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>
      <p className="text-[#d3ad7f] text-lg mb-4">₹{product.price}.00</p>

      <div className="flex items-center gap-2 mb-4 text-gray-300">
        <Clock size={18} />
        <span>{product.prepTime}</span>
      </div>

      <p className="text-gray-300 max-w-lg text-center mb-6">
        {product.description}
      </p>

      <button className="bg-[#d3ad7f] text-black px-6 py-2 rounded-full font-medium hover:bg-white transition-colors">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
