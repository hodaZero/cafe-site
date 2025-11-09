import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-[#1a1a1a] text-white rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform"
    >

      <div className="flex justify-center mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-32 h-32 object-cover rounded-full"
        />
      </div>

   
      <h3 className="text-lg font-semibold text-center">{product.name}</h3>

      
      <div className="flex justify-center items-center gap-4 text-[#d3ad7f] text-sm mb-2">
        <p>₹{product.price}.00</p>
        <span>{product.rating}</span>
      </div>

    
      <div className="flex justify-center gap-4 mt-3">
        <button
          onClick={(e) => e.stopPropagation()}
          className="bg-[#333] p-2 rounded-full hover:bg-[#d3ad7f] transition"
        >
          <Heart size={18} />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="bg-[#333] p-2 rounded-full hover:bg-[#d3ad7f] transition"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
